
import React, { useState } from 'react';
import { FooterSettings, FooterColumn, FooterItem, StoreSettings, ContentSection } from '../types';

interface FooterModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StoreSettings;
  onUpdate: (settings: StoreSettings) => void;
  onOpenContentEditor?: (pageId: string) => void;
}

// Added children?: React.ReactNode to fix TypeScript JSX inference errors where it thinks props are missing
const Section = ({ title, children }: { title: string, children?: React.ReactNode }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-6 mb-4">
    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{title}</h4>
    <div className="space-y-4">{children}</div>
  </div>
);

export const FooterModal: React.FC<FooterModalProps> = ({ isOpen, onClose, settings, onUpdate, onOpenContentEditor }) => {
  const [activeColId, setActiveColId] = useState<string | null>(settings.footer.columns?.[0]?.id || null);
  const [editingItem, setEditingItem] = useState<FooterItem | null>(null);

  if (!isOpen) return null;

  const handleAddColumn = () => {
    const newCol: FooterColumn = {
      id: 'col-' + Date.now(),
      title: 'Новый раздел',
      items: []
    };
    onUpdate({ ...settings, footer: { ...settings.footer, columns: [...(settings.footer.columns || []), newCol] } });
    setActiveColId(newCol.id);
  };

  const handleAddItem = (colId: string) => {
    const newItem: FooterItem = {
      id: 'item-' + Date.now(),
      label: 'Новый элемент',
      type: 'page',
      isVisible: true,
      style: { fontSize: 13, fontWeight: 'normal', italic: false, color: '#A0A0A0', textAlign: 'left' }
    };
    onUpdate({
      ...settings,
      footer: {
        ...settings.footer,
        columns: (settings.footer.columns || []).map(c => c.id === colId ? { ...c, items: [...(c.items || []), newItem] } : c)
      }
    });
    setEditingItem(newItem);
  };

  const updateItem = (item: FooterItem) => {
    onUpdate({
      ...settings,
      footer: {
        ...settings.footer,
        columns: (settings.footer.columns || []).map(c => ({
          ...c,
          items: (c.items || []).map(i => i.id === item.id ? item : i)
        }))
      }
    });
  };

  const handleCreatePage = (item: FooterItem) => {
    const newPage: ContentSection = {
      id: Date.now().toString(),
      title: item.label,
      slug: item.label.toLowerCase().replace(/\s+/g, '-'),
      isVisible: true,
      blocks: []
    };

    const updatedSettings: StoreSettings = {
      ...settings,
      contentSections: [...(settings.contentSections || []), newPage],
      footer: {
        ...settings.footer,
        columns: (settings.footer.columns || []).map(c => ({
          ...c,
          items: (c.items || []).map(i => i.id === item.id ? { ...i, type: 'page', linkedPageId: newPage.id, url: undefined } : i)
        }))
      }
    };

    onUpdate(updatedSettings);
    if (onOpenContentEditor) {
      onOpenContentEditor(newPage.id);
    }
  };

  return (
    <div className="fixed inset-0 z-[7000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-[1000px] h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-100 font-['Inter']">
        
        <header className="px-8 py-5 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">Настройка подвала</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">CMS управления нижней частью сайта</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-900 transition-all"><svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5" strokeLinecap="round"/></svg></button>
        </header>

        <div className="flex-grow flex overflow-hidden bg-slate-50/30">
          {/* Левая панель - Колонки */}
          <div className="w-72 bg-white border-r border-slate-100 flex flex-col shrink-0">
            <div className="p-5 border-b border-slate-50">
               <button onClick={handleAddColumn} className="w-full py-3 bg-[#82C12D] text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-[#72AA25] shadow-lg shadow-emerald-100">+ Добавить колонку</button>
            </div>
            <div className="flex-grow overflow-y-auto py-2 hide-scrollbar">
               {(settings.footer.columns || []).map(col => (
                 <div key={col.id} className={`group relative px-6 py-4 border-l-4 cursor-pointer transition-all ${activeColId === col.id ? 'bg-indigo-50/50 border-indigo-500' : 'border-transparent hover:bg-slate-50'}`} onClick={() => setActiveColId(col.id)}>
                    <input 
                      className="bg-transparent font-bold text-slate-800 text-[13px] outline-none w-full"
                      value={col.title}
                      onChange={e => onUpdate({ ...settings, footer: { ...settings.footer, columns: (settings.footer.columns || []).map(c => c.id === col.id ? { ...c, title: e.target.value } : c) } })}
                    />
                    <button onClick={(e) => { e.stopPropagation(); onUpdate({ ...settings, footer: { ...settings.footer, columns: (settings.footer.columns || []).filter(c => c.id !== col.id) } }); }} className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-2 text-rose-300 hover:text-rose-500">✕</button>
                 </div>
               ))}
            </div>
          </div>

          {/* Центральная панель - Элементы выбранной колонки */}
          <div className="flex-grow overflow-y-auto p-8 hide-scrollbar">
            {activeColId ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                 <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Элементы колонки</h3>
                    <button onClick={() => handleAddItem(activeColId)} className="text-[11px] font-black text-indigo-500 uppercase hover:underline">+ Добавить контент</button>
                 </div>

                 <div className="space-y-3">
                    {((settings.footer.columns || []).find(c => c.id === activeColId)?.items || []).map(item => (
                      <div key={item.id} className={`p-4 bg-white border rounded-2xl cursor-pointer transition-all flex items-center justify-between ${editingItem?.id === item.id ? 'border-indigo-400 ring-4 ring-indigo-50 shadow-sm' : 'border-slate-100 hover:border-slate-300'}`} onClick={() => setEditingItem(item)}>
                         <div className="flex items-center gap-3">
                            <span className="text-lg">{item.type === 'link' ? '🔗' : item.type === 'text' ? '📝' : item.type === 'image' ? '🖼️' : item.type === 'video' ? '🎬' : item.type === 'page' ? '📄' : '📁'}</span>
                            <span className="text-sm font-bold text-slate-700">{item.label}</span>
                         </div>
                         <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${item.isVisible ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                            <button onClick={(e) => { e.stopPropagation(); onUpdate({ ...settings, footer: { ...settings.footer, columns: (settings.footer.columns || []).map(c => c.id === activeColId ? { ...c, items: (c.items || []).filter(i => i.id !== item.id) } : c) } }); }} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">✕</button>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-20 text-center italic">
                 <div className="text-6xl mb-4">⚓</div>
                 <p className="text-sm font-black uppercase tracking-widest">Выберите или создайте колонку</p>
              </div>
            )}
          </div>

          {/* Правая панель - Редактор свойств элемента */}
          <div className="w-80 bg-white border-l border-slate-100 p-6 overflow-y-auto hide-scrollbar shrink-0">
            {editingItem ? (
              <div className="space-y-6 animate-in slide-in-from-right-4">
                 <Section title="Контент">
                    <div className="space-y-4">
                       <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Тип элемента</label>
                          <select value={editingItem.type} onChange={e => { const i = { ...editingItem, type: e.target.value as any }; setEditingItem(i); updateItem(i); }} className="w-full mt-1.5 p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none">
                             <option value="link">Ссылка</option>
                             <option value="page">Страница</option>
                             <option value="text">Текст</option>
                             <option value="image">Фото (URL)</option>
                             <option value="video">Видео (URL)</option>
                             <option value="file">Файл (PDF/World)</option>
                          </select>
                       </div>
                       <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Текст / Название</label>
                          <input value={editingItem.label} onChange={e => { const i = { ...editingItem, label: e.target.value }; setEditingItem(i); updateItem(i); }} className="w-full mt-1.5 p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none"/>
                       </div>
                       {editingItem.type === 'page' ? (
                         <div className="space-y-3">
                            {editingItem.linkedPageId ? (
                              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Привязано к странице:</p>
                                <p className="text-xs font-bold text-emerald-900">{(settings.contentSections || []).find(s => s.id === editingItem.linkedPageId)?.title || 'Страница не найдена'}</p>
                                <button onClick={() => onOpenContentEditor?.(editingItem.linkedPageId!)} className="mt-3 w-full py-2 bg-emerald-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all">Перейти к редактору</button>
                              </div>
                            ) : (
                              <button onClick={() => handleCreatePage(editingItem)} className="w-full py-4 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">Создать и редактировать страницу</button>
                            )}
                         </div>
                       ) : (
                         <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ссылка / URL</label>
                            <input placeholder="https://..." value={editingItem.url || ''} onChange={e => { const i = { ...editingItem, url: e.target.value }; setEditingItem(i); updateItem(i); }} className="w-full mt-1.5 p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none"/>
                         </div>
                       )}
                    </div>
                 </Section>

                 <Section title="Стиль и Дизайн">
                    <div className="space-y-4">
                       <div className="grid grid-cols-2 gap-3">
                          <div>
                             <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Размер (px)</label>
                             <input type="number" value={editingItem.style?.fontSize} onChange={e => { const i = { ...editingItem, style: { ...editingItem.style, fontSize: parseInt(e.target.value) || 0 } }; setEditingItem(i); updateItem(i); }} className="w-full mt-1 p-2 bg-slate-50 border border-slate-100 rounded-lg text-sm font-bold outline-none"/>
                          </div>
                          <div>
                             <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Цвет</label>
                             <input type="color" value={editingItem.style?.color} onChange={e => { const i = { ...editingItem, style: { ...editingItem.style, color: e.target.value } }; setEditingItem(i); updateItem(i); }} className="w-full mt-1 p-0.5 h-9 bg-slate-50 border border-slate-100 rounded-lg cursor-pointer"/>
                          </div>
                       </div>
                       <div className="flex gap-2">
                          <button onClick={() => { const i = { ...editingItem, style: { ...editingItem.style, fontWeight: editingItem.style?.fontWeight === 'bold' ? 'normal' : 'bold' } }; setEditingItem(i); updateItem(i); }} className={`flex-1 py-2 rounded-lg border text-xs font-black uppercase tracking-tighter transition-all ${editingItem.style?.fontWeight === 'bold' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>BOLD</button>
                          <button onClick={() => { const i = { ...editingItem, style: { ...editingItem.style, italic: !editingItem.style?.italic } }; setEditingItem(i); updateItem(i); }} className={`flex-1 py-2 rounded-lg border text-xs font-black italic transition-all ${editingItem.style?.italic ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>ITALIC</button>
                       </div>
                       <div>
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Выравнивание</label>
                          <div className="flex bg-slate-100 p-1 rounded-xl">
                             {(['left', 'center', 'right'] as const).map(align => (
                               <button key={align} onClick={() => { const i = { ...editingItem, style: { ...editingItem.style, textAlign: align } }; setEditingItem(i); updateItem(i); }} className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${editingItem.style?.textAlign === align ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>{align}</button>
                             ))}
                          </div>
                       </div>
                    </div>
                 </Section>
                 
                 <button onClick={() => { const i = { ...editingItem, isVisible: !editingItem.isVisible }; setEditingItem(i); updateItem(i); }} className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${editingItem.isVisible ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'}`}>
                    {editingItem.isVisible ? 'Скрыть с сайта' : 'Показать на сайте'}
                 </button>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-30 text-center animate-pulse">
                 <p className="text-[10px] font-black uppercase tracking-widest leading-loose">Кликните на элемент,<br/>чтобы настроить дизайн</p>
              </div>
            )}
          </div>
        </div>

        <footer className="px-8 py-5 border-t border-slate-100 bg-white flex justify-end shrink-0">
          <button onClick={onClose} className="px-10 py-3 bg-slate-950 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all">Применить и закрыть</button>
        </footer>
      </div>
    </div>
  );
};
