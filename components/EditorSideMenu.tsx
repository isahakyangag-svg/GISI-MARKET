
import React from 'react';

export type EditorPageId = 'home' | 'catalog' | 'product' | 'blog' | 'article' | 'compare' | 'wishlist' | 'search' | 'page' | 'cart' | 'account';

interface EditorSideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSiteData: () => void;
  onOpenTemplateSettings: () => void;
  onOpenPopups: () => void;
  onOpenBanners: () => void;
  onOpenFooter: () => void;
  onOpenBranding: () => void;
  onOpenTicker: () => void;
  onOpenBackground: () => void;
  onOpenProducts: () => void; // Новый обработчик
  activePage: EditorPageId;
  onPageSelect: (id: EditorPageId) => void;
}

export const EditorSideMenu: React.FC<EditorSideMenuProps> = ({ 
  isOpen, 
  onClose, 
  onOpenSiteData, 
  onOpenTemplateSettings, 
  onOpenPopups,
  onOpenBanners,
  onOpenFooter,
  onOpenBranding,
  onOpenTicker,
  onOpenBackground,
  onOpenProducts,
  activePage,
  onPageSelect
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[4000] bg-black/5" onClick={onClose} />
      <aside className="fixed top-0 left-0 bottom-0 w-[300px] bg-white z-[4001] shadow-2xl border-r border-slate-200 flex flex-col animate-in slide-in-from-left duration-300 font-['Inter']">
        
        <div className="h-[60px] border-b border-slate-100 flex items-center px-4 justify-between">
           <button onClick={onClose} className="p-2 text-slate-950 hover:bg-slate-50 rounded-md">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round"/></svg>
           </button>
           <div className="flex items-center gap-4 text-slate-300">
              <button className="hover:text-slate-400"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
              <button className="hover:text-slate-400"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 10H11a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
           </div>
           <div className="w-10" />
        </div>

        <div className="flex-grow overflow-y-auto py-4 hide-scrollbar">
           <div className="px-4 mb-6">
              <div className="flex items-center justify-between p-2 border border-slate-200 rounded-md cursor-pointer hover:border-blue-400 transition-colors">
                 <span className="text-[14px] text-slate-700">Base</span>
                 <div className="flex items-center gap-2">
                    <span className="bg-[#f1f3f4] text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200">Основной</span>
                    <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                 </div>
              </div>
           </div>

           <div className="space-y-1 mb-6">
              <button 
                onClick={onOpenBranding}
                className="w-full flex items-center gap-3 px-4 py-2 text-[14px] text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="2"/></svg>
                <span>Брендинг и Лого</span>
              </button>
              <button 
                onClick={onOpenBackground}
                className="w-full flex items-center gap-3 px-4 py-2 text-[14px] text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 5a1 1 0 011-1h14a1 1 0 011 1v12a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" strokeWidth="2"/><path d="M4 8h16M8 12h8" strokeWidth="2"/></svg>
                <span>Фон сайта</span>
              </button>
              <button 
                onClick={onOpenTicker}
                className="w-full flex items-center gap-3 px-4 py-2 text-[14px] text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span>Бегущая строка</span>
              </button>
              <button 
                onClick={onOpenSiteData}
                className="w-full flex items-center gap-3 px-4 py-2 text-[14px] text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 7v10c0 2 1.5 3 3.5 3h9c2 0 3.5-1 3.5-3V7c0-2-1.5-3-3.5-3h-9C5.5 4 4 5 4 7z" strokeWidth="2"/><path d="M8 8h8M8 12h8M8 16h5" strokeWidth="2"/></svg>
                <span>Данные сайта</span>
              </button>
              <button 
                onClick={onOpenTemplateSettings}
                className="w-full flex items-center gap-3 px-4 py-2 text-[14px] text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeWidth="2"/></svg>
                <span>Настройки шаблона</span>
              </button>
              <button 
                onClick={onOpenPopups}
                className="w-full flex items-center gap-3 px-4 py-2 text-[14px] text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" strokeWidth="2"/></svg>
                <span>Всплывающие окна</span>
              </button>
              <button 
                onClick={onOpenBanners}
                className="w-full flex items-center gap-3 px-4 py-2 text-[14px] text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="2"/></svg>
                <span>Баннеры</span>
              </button>
              <button 
                onClick={onOpenFooter}
                className="w-full flex items-center gap-3 px-4 py-2 text-[14px] text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 10h16M4 14h16M4 18h16" strokeWidth="2" strokeLinecap="round"/></svg>
                <span>Подвал сайта</span>
              </button>
              
              {/* НОВЫЙ ПУНКТ: ТОВАРЫ */}
              <button 
                onClick={onOpenProducts}
                className="w-full flex items-center gap-3 px-4 py-2 text-[14px] font-bold text-slate-900 bg-slate-50/50 hover:bg-blue-50 transition-all border-l-4 border-blue-500"
              >
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeWidth="2.5" strokeLinecap="round"/></svg>
                <span>Товары</span>
              </button>
           </div>

           <div className="h-px bg-slate-100 mx-4 mb-4" />
        </div>
      </aside>
    </>
  );
};
