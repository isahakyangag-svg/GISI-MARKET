
import React, { useState, useRef } from 'react';
import { TickerSettings, TickerItem } from '../types';

interface TickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: TickerSettings;
  onUpdate: (s: TickerSettings) => void;
}

export const TickerModal: React.FC<TickerModalProps> = ({ isOpen, onClose, settings, onUpdate }) => {
  const [editingItemId, setEditingItemId] = useState<string | null>(settings.items?.[0]?.id || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleAddItem = () => {
    const newItem: TickerItem = {
      id: 'ti-' + Date.now(),
      text: 'НОВЫЙ ТЕКСТ',
      emoji: '🔥',
      color: '#82C12D',
      fontSize: 12,
      isVisible: true
    };
    onUpdate({ ...settings, items: [...(settings.items || []), newItem] });
    setEditingItemId(newItem.id);
  };

  const handleUpdateItem = (id: string, updates: Partial<TickerItem>) => {
    onUpdate({
      ...settings,
      items: (settings.items || []).map(it => it.id === id ? { ...it, ...updates } : it)
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingItemId) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        handleUpdateItem(editingItemId, { imageUrl: ev.target?.result as string, emoji: undefined });
      };
      reader.readAsDataURL(file);
    }
  };

  const activeItem = (settings.items || []).find(it => it.id === editingItemId);

  return (
    <div className="fixed inset-0 z-[7000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-fade-in" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-[900px] h-[80vh] rounded-[2.5rem] shadow-2xl flex flex-col animate-zoom-in overflow-hidden border border-slate-100 font-['Inter']">
        
        <header className="px-10 py-6 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">Бегущая строка</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Управление промо-лентой</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Активна</span>
               <button 
                 onClick={() => onUpdate({...settings, isActive: !settings.isActive})}
                 className={`relative w-12 h-6 rounded-full transition-all ${settings.isActive ? 'bg-[#82C12D]' : 'bg-slate-200'}`}
               >
                 <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.isActive ? 'translate-x-6' : ''}`} />
               </button>
            </div>
            <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-900 transition-all hover:rotate-90">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="3" strokeLinecap="round"/></svg>
            </button>
          </div>
        </header>

        <div className="flex-grow flex overflow-hidden bg-slate-50/20">
          {/* List Section */}
          <div className="w-72 border-r border-slate-100 bg-white flex flex-col">
            <div className="p-5 border-b border-slate-50">
               <button onClick={handleAddItem} className="w-full py-3 bg-[#82C12D] text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-[#72AA25] shadow-lg shadow-emerald-100">+ Добавить фразу</button>
            </div>
            <div className="flex-grow overflow-y-auto py-2 hide-scrollbar">
               {(settings.items || []).map(it => (
                 <div 
                   key={it.id} 
                   onClick={() => setEditingItemId(it.id)}
                   className={`px-6 py-4 border-l-4 cursor-pointer transition-all flex items-center justify-between ${editingItemId === it.id ? 'bg-indigo-50/50 border-indigo-500' : 'border-transparent hover:bg-slate-50'}`}
                 >
                    <div className="flex items-center gap-3 truncate">
                       <span className="text-lg shrink-0">{it.emoji || (it.imageUrl ? '🖼️' : '📝')}</span>
                       <span className="text-[12px] font-bold text-slate-700 truncate uppercase">{it.text}</span>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onUpdate({...settings, items: (settings.items || []).filter(x => x.id !== it.id)}); }}
                      className="text-slate-300 hover:text-rose-500 p-1"
                    >✕</button>
                 </div>
               ))}
            </div>
          </div>

          {/* Editor Section */}
          <div className="flex-grow p-10 overflow-y-auto hide-scrollbar">
            {activeItem ? (
              <div className="max-w-xl mx-auto space-y-8 animate-in slide-in-from-bottom-4">
                 <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Текст сообщения</label>
                    <input 
                      type="text" 
                      value={activeItem.text} 
                      onChange={e => handleUpdateItem(activeItem.id, { text: e.target.value })}
                      className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl text-[15px] font-black outline-none focus:border-indigo-400 transition-all shadow-sm uppercase"
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                       <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Иконка / Эмодзи</label>
                       <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={activeItem.emoji || ''} 
                            placeholder="Emoji"
                            onChange={e => handleUpdateItem(activeItem.id, { emoji: e.target.value, imageUrl: undefined })}
                            className="w-16 px-2 py-4 bg-white border border-slate-200 rounded-2xl text-xl text-center outline-none focus:border-indigo-400 transition-all shadow-sm"
                          />
                          <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="flex-grow py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                          >
                             {activeItem.imageUrl ? 'Заменить фото' : 'Загрузить фото'}
                          </button>
                          {activeItem.imageUrl && (
                            <button 
                              onClick={() => handleUpdateItem(activeItem.id, { imageUrl: undefined })}
                              className="p-4 bg-rose-50 border border-rose-100 text-rose-500 rounded-2xl hover:bg-rose-100 transition-all"
                              title="Удалить фото"
                            >
                              ✕
                            </button>
                          )}
                          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                       </div>
                       {activeItem.imageUrl && (
                         <div className="w-16 h-16 bg-slate-50 rounded-2xl border border-slate-100 p-2 flex items-center justify-center overflow-hidden">
                           <img src={activeItem.imageUrl} className="max-w-full max-h-full object-contain" alt="" />
                         </div>
                       )}
                    </div>
                    
                    <div className="space-y-4">
                       <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Цвет текста</label>
                       <div className="flex items-center gap-3 bg-white p-3 border border-slate-200 rounded-2xl shadow-sm">
                          <input 
                             type="color" 
                             value={activeItem.color || '#000000'}
                             onChange={e => handleUpdateItem(activeItem.id, { color: e.target.value })}
                             className="w-10 h-10 rounded-xl border-none cursor-pointer"
                          />
                          <input 
                             type="text" 
                             value={activeItem.color || ''}
                             onChange={e => handleUpdateItem(activeItem.id, { color: e.target.value })}
                             className="flex-grow text-sm font-black uppercase outline-none"
                          />
                       </div>
                    </div>
                 </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Размер шрифта (px)</label>
                       <div className="flex items-center gap-4 bg-white p-4 border border-slate-200 rounded-2xl shadow-sm">
                          <input 
                             type="range" 
                             min="8" max="32" 
                             value={activeItem.fontSize || 12}
                             onChange={e => handleUpdateItem(activeItem.id, { fontSize: parseInt(e.target.value) || 12 })}
                             className="flex-grow accent-[#82C12D]"
                          />
                          <span className="font-black text-sm text-slate-900 w-8">{activeItem.fontSize || 12}</span>
                       </div>
                    </div>
                    
                    <div className="space-y-4">
                       <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Фон ленты</label>
                       <div className="flex items-center gap-3 bg-white p-3 border border-slate-200 rounded-2xl shadow-sm">
                          <input 
                             type="color" 
                             value={settings.backgroundColor || '#0f172a'}
                             onChange={e => onUpdate({...settings, backgroundColor: e.target.value})}
                             className="w-10 h-10 rounded-xl border-none cursor-pointer"
                          />
                          <input 
                             type="text" 
                             value={settings.backgroundColor || '#0f172a'}
                             onChange={e => onUpdate({...settings, backgroundColor: e.target.value})}
                             className="flex-grow text-sm font-black uppercase outline-none"
                          />
                       </div>
                    </div>
                 </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Высота ленты (px)</label>
                       <div className="flex items-center gap-4 bg-white p-4 border border-slate-200 rounded-2xl shadow-sm">
                          <input 
                             type="range" 
                             min="24" max="120" 
                             value={settings.height || 48}
                             onChange={e => onUpdate({...settings, height: parseInt(e.target.value) || 48})}
                             className="flex-grow accent-[#82C12D]"
                          />
                          <span className="font-black text-sm text-slate-900 w-8">{settings.height || 48}</span>
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Скорость ленты</label>
                       <div className="flex items-center gap-4 bg-white p-4 border border-slate-200 rounded-2xl shadow-sm">
                          <input 
                             type="range" 
                             min="5" max="60" 
                             value={settings.speed}
                             onChange={e => onUpdate({...settings, speed: parseInt(e.target.value) || 20})}
                             className="flex-grow accent-indigo-500"
                          />
                          <span className="font-black text-sm text-slate-900 w-8">{settings.speed}s</span>
                       </div>
                    </div>
                 </div>

                 <div className="pt-10 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex flex-col">
                       <span className="text-[13px] font-bold text-slate-700 uppercase">Видимость</span>
                       <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">Скрыть этот фрагмент из ленты</span>
                    </div>
                    <button 
                      onClick={() => handleUpdateItem(activeItem.id, { isVisible: !activeItem.isVisible })}
                      className={`relative w-14 h-7 rounded-full transition-all duration-300 ${activeItem.isVisible ? 'bg-[#82C12D]' : 'bg-slate-200'}`}
                    >
                       <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${activeItem.isVisible ? 'translate-x-7' : ''}`} />
                    </button>
                 </div>

              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-20 text-center">
                 <div className="text-8xl mb-6">➰</div>
                 <h3 className="text-2xl font-black uppercase tracking-tighter italic">Лента настроек</h3>
                 <p className="text-xs font-bold mt-2 uppercase tracking-widest">Выберите фразу для редактирования дизайна</p>
              </div>
            )}
          </div>
        </div>

        <footer className="px-10 py-6 border-t border-slate-100 bg-white flex justify-end shrink-0">
          <button onClick={onClose} className="px-12 py-3.5 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl">Сохранить всё</button>
        </footer>

      </div>
    </div>
  );
};
