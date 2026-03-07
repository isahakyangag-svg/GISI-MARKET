
import React, { useState, useMemo } from 'react';

interface WidgetCategory {
  id: string;
  name: string;
  count: number;
}

interface WidgetItem {
  id: string;
  categoryId: string;
  name: string;
  code: string;
  previewType: 'line' | 'lineText' | 'empty';
}

interface WidgetLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: WidgetCategory[] = [
  { id: 'dividers', name: 'Разделители', count: 3 },
  { id: 'text', name: 'Текст', count: 7 },
  { id: 'reviews', name: 'Отзывы', count: 4 },
  { id: 'blog', name: 'Блог', count: 2 },
  { id: 'nav', name: 'Навигация', count: 3 },
  { id: 'cat', name: 'Категории и подкатегории', count: 5 },
  { id: 'forms', name: 'Формы', count: 3 },
  { id: 'advantages', name: 'Преимущества', count: 5 },
  { id: 'sliders', name: 'Слайдеры', count: 12 },
  { id: 'products', name: 'Товары из определенной категории', count: 19 },
  { id: 'banners', name: 'Баннеры', count: 16 },
  { id: 'viewed', name: 'Ранее просмотренные товары', count: 1 },
  { id: 'stories', name: 'Истории', count: 2 },
  { id: 'contacts', name: 'Контакты', count: 4 },
  { id: 'video', name: 'Видеоролики', count: 2 },
  { id: 'staff', name: 'Сотрудники', count: 3 },
  { id: 'main-product', name: 'Товар на Главной', count: 2 },
  { id: 'ticker', name: 'Бегущие строки', count: 1 },
  { id: 'galleries', name: 'Галереи', count: 1 },
];

const WIDGETS: WidgetItem[] = [
  { id: 'de1', categoryId: 'dividers', name: 'Разделитель линия', code: 'DE1', previewType: 'line' },
  { id: 'dt1', categoryId: 'dividers', name: 'Разделитель линия с текстом', code: 'DT1', previewType: 'lineText' },
  { id: 'de2', categoryId: 'dividers', name: 'Разделитель пустой', code: 'DE2', previewType: 'empty' },
];

export const WidgetLibraryModal: React.FC<WidgetLibraryModalProps> = ({ isOpen, onClose }) => {
  const [activeCategoryId, setActiveCategoryId] = useState('dividers');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = useMemo(() => {
    return CATEGORIES.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm]);

  const activeWidgets = useMemo(() => {
    return WIDGETS.filter(w => w.categoryId === activeCategoryId);
  }, [activeCategoryId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 md:p-10">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-[1200px] h-[90vh] rounded-lg shadow-2xl flex overflow-hidden animate-zoom-in border border-slate-200">
        
        {/* Sidebar */}
        <aside className="w-80 border-r border-slate-200 bg-[#f9fafb] flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-200">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Поиск виджетов" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-3 pr-10 py-2 border border-slate-200 rounded text-sm outline-none focus:border-blue-400 placeholder:text-slate-300"
              />
              <svg className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth="2.5"/></svg>
            </div>
          </div>
          
          <div className="flex-grow overflow-y-auto py-2">
            {filteredCategories.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setActiveCategoryId(cat.id)}
                className={`w-full flex items-center justify-between px-4 py-3 text-[13px] transition-all border-l-4 ${activeCategoryId === cat.id ? 'bg-[#ebf4ff] border-blue-500 text-blue-600 font-bold' : 'border-transparent text-slate-600 hover:bg-slate-100'}`}
              >
                <div className="flex items-center gap-3">
                   <div className={`w-1.5 h-1.5 rounded-full ${activeCategoryId === cat.id ? 'bg-blue-500' : 'bg-slate-300'}`} />
                   {cat.name}
                </div>
                <span className="text-[11px] opacity-60 font-bold">{cat.count}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-grow flex flex-col min-w-0 bg-[#f4f7f6]">
          {/* Header Close Button */}
          <div className="absolute top-4 right-4 z-10">
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-8 space-y-4">
            {activeWidgets.map(widget => (
              <div 
                key={widget.id} 
                className="bg-white border border-slate-200 rounded p-6 shadow-sm hover:border-blue-300 hover:shadow-md cursor-pointer transition-all group"
              >
                <div className="flex justify-between items-start mb-6">
                  <h4 className="text-[14px] font-bold text-slate-800">{widget.name}</h4>
                  <span className="text-[10px] font-bold text-slate-400">{widget.code}</span>
                </div>
                
                {/* Visual Placeholder for Widget Types */}
                <div className="flex items-center justify-center py-6">
                   {widget.previewType === 'line' && <div className="w-full h-px bg-slate-200" />}
                   {widget.previewType === 'lineText' && (
                     <div className="w-full flex items-center gap-3">
                        <div className="flex-grow h-px bg-slate-100" />
                        <span className="text-[10px] text-slate-300 uppercase tracking-widest font-black">Заголовок</span>
                        <div className="flex-grow h-px bg-slate-100" />
                     </div>
                   )}
                   {widget.previewType === 'empty' && <div className="h-10 border-2 border-dashed border-slate-100 rounded w-full flex items-center justify-center text-[10px] text-slate-300 uppercase font-black tracking-widest">Пустое пространство</div>}
                </div>
              </div>
            ))}

            <div className="flex justify-center pt-8">
              <button className="px-6 py-2.5 bg-white border border-slate-200 rounded text-[13px] font-medium text-slate-600 hover:bg-slate-50 shadow-sm transition-all">
                Хочу новый виджет
              </button>
            </div>
          </div>
        </main>

      </div>
    </div>
  );
};
