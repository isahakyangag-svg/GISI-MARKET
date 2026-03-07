
import React, { useState, useRef } from 'react';
import { Banner, Product } from '../types';

interface BannersModalProps {
  isOpen: boolean;
  onClose: () => void;
  banners: Banner[];
  onUpdate: (banners: Banner[]) => void;
  products: Product[];
}

const Section = ({ title, children }: { title: string, children?: React.ReactNode }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-5 mb-4 shadow-sm">
    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">{title}</h4>
    <div className="space-y-4">{children}</div>
  </div>
);

export const BannersModal: React.FC<BannersModalProps> = ({ isOpen, onClose, banners, onUpdate, products }) => {
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleAdd = () => {
    const newBanner: Banner = {
      id: 'bn-' + Date.now(),
      title: 'Новый баннер',
      subtitle: 'Описание предложения',
      buttonText: 'Подробнее',
      status: 'active',
      order: (banners || []).length + 1,
      imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d1?w=1600',
      animationType: 'slide',
      contentAlignment: 'left'
    };
    setEditingBanner(newBanner);
  };

  const handleSave = () => {
    if (!editingBanner) return;
    const exists = (banners || []).find(b => b.id === editingBanner.id);
    if (exists) {
      onUpdate(banners.map(b => b.id === editingBanner.id ? editingBanner : b));
    } else {
      onUpdate([...banners, editingBanner]);
    }
    setEditingBanner(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (editingBanner) {
          setEditingBanner({ ...editingBanner, imageUrl: ev.target?.result as string, videoUrl: undefined });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[7000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-[950px] h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-100 font-['Inter']">
        <header className="px-8 py-5 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-[18px] font-black text-slate-900 tracking-tight uppercase italic">Управление баннерами</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Настройка главного слайдера</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-900 transition-all hover:rotate-90">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5" strokeLinecap="round"/></svg>
          </button>
        </header>

        <div className="flex-grow overflow-hidden flex bg-slate-50/30">
          {/* Список слева */}
          <div className="w-80 bg-white border-r border-slate-100 flex flex-col">
            <div className="p-5 border-b border-slate-50">
               <button onClick={handleAdd} className="w-full py-3 bg-[#82C12D] text-white rounded-xl text-[12px] font-black uppercase tracking-widest hover:bg-[#72AA25] transition-all shadow-lg shadow-emerald-100">+ Добавить</button>
            </div>
            <div className="flex-grow overflow-y-auto py-2 hide-scrollbar">
               {(banners || []).sort((a,b) => a.order - b.order).map(b => (
                 <div 
                   key={b.id} 
                   onClick={() => setEditingBanner(b)}
                   className={`px-6 py-4 border-l-4 cursor-pointer transition-all ${editingBanner?.id === b.id ? 'bg-indigo-50/50 border-indigo-500' : 'border-transparent hover:bg-slate-50'}`}
                 >
                    <div className="flex justify-between items-center">
                       <span className="text-[13px] font-bold text-slate-800 truncate pr-4">{b.title}</span>
                       <span className={`w-2 h-2 rounded-full ${b.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{b.videoUrl ? 'Видео-контент' : 'Изображение'}</p>
                 </div>
               ))}
            </div>
          </div>

          {/* Редактор справа */}
          <div className="flex-grow overflow-y-auto p-8 hide-scrollbar">
            {editingBanner ? (
              <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                <Section title="Контент баннера">
                  <div className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Заголовок</label>
                      <input 
                        type="text" 
                        value={editingBanner.title} 
                        onChange={e => setEditingBanner({...editingBanner, title: e.target.value})}
                        className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Подзаголовок</label>
                      <textarea 
                        value={editingBanner.subtitle} 
                        onChange={e => setEditingBanner({...editingBanner, subtitle: e.target.value})}
                        className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all h-28 resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Текст кнопки</label>
                        <input 
                          type="text" 
                          value={editingBanner.buttonText} 
                          onChange={e => setEditingBanner({...editingBanner, buttonText: e.target.value})}
                          className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-indigo-400"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Привязать товар</label>
                        <select 
                          value={editingBanner.productId || ''}
                          onChange={e => setEditingBanner({...editingBanner, productId: e.target.value || undefined})}
                          className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none appearance-none cursor-pointer focus:border-indigo-400"
                        >
                           <option value="">Не привязан</option>
                           {(products || []).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </Section>

                <Section title="Медиа-файлы">
                  <div className="space-y-5">
                    <div className="flex gap-6">
                       <div className="w-56 h-32 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-center overflow-hidden shadow-inner">
                          {editingBanner.videoUrl ? (
                            <div className="flex flex-col items-center gap-2">
                               <div className="w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-lg"><svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div>
                               <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">VIDEO ACTIVE</span>
                            </div>
                          ) : (
                            <img src={editingBanner.imageUrl} className="w-full h-full object-cover transition-transform hover:scale-110" alt="" />
                          )}
                       </div>
                       <div className="flex flex-col justify-center gap-3">
                          <button onClick={() => fileInputRef.current?.click()} className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">Загрузить фото</button>
                          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                          <button onClick={() => { const url = prompt('Введите URL видео (MP4 или YouTube):'); if(url) setEditingBanner({...editingBanner, videoUrl: url, imageUrl: undefined}); }} className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">Ссылка на видео</button>
                       </div>
                    </div>
                  </div>
                </Section>

                <Section title="Визуальные настройки">
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Анимация</label>
                      <select 
                        value={editingBanner.animationType}
                        onChange={e => setEditingBanner({...editingBanner, animationType: e.target.value as any})}
                        className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none"
                      >
                         <option value="slide">Слайд (сдвиг)</option>
                         <option value="fade">Фейд (плавность)</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Выравнивание</label>
                      <select 
                        value={editingBanner.contentAlignment}
                        onChange={e => setEditingBanner({...editingBanner, contentAlignment: e.target.value as any})}
                        className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none"
                      >
                         <option value="left">Слева</option>
                         <option value="center">По центру</option>
                         <option value="right">Справа</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                     <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-slate-700">Отображение</span>
                        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">Включить или выключить баннер на сайте</span>
                     </div>
                     <button 
                       onClick={() => setEditingBanner({...editingBanner, status: editingBanner.status === 'active' ? 'inactive' : 'active'})}
                       className={`relative w-14 h-7 rounded-full transition-all duration-300 ${editingBanner.status === 'active' ? 'bg-[#82C12D] shadow-lg shadow-emerald-100' : 'bg-slate-200'}`}
                     >
                        <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${editingBanner.status === 'active' ? 'translate-x-7' : ''}`} />
                     </button>
                  </div>
                </Section>

                <div className="flex justify-end gap-4 pt-10 pb-10">
                   <button onClick={() => setEditingBanner(null)} className="px-8 py-4 text-slate-400 font-black text-[11px] uppercase tracking-widest hover:text-slate-900">Отмена</button>
                   <button onClick={handleSave} className="px-12 py-4 bg-indigo-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">Сохранить</button>
                </div>

              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-20 text-center animate-in fade-in duration-700">
                 <div className="text-8xl mb-6">🖼️</div>
                 <h3 className="text-2xl font-black uppercase tracking-tighter italic">Выберите баннер</h3>
                 <p className="text-xs font-bold mt-2 max-w-xs uppercase tracking-widest">Для начала редактирования или создания контента</p>
              </div>
            )}
          </div>
        </div>

        <footer className="px-8 py-5 bg-white border-t border-slate-100 flex justify-end shrink-0">
          <button onClick={onClose} className="px-10 py-3 bg-slate-950 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all">Закрыть окно</button>
        </footer>
      </div>
    </div>
  );
};
