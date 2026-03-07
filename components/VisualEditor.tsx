
import React from 'react';

interface EditableSectionProps {
  id: string;
  title: string;
  isActive: boolean;
  onEdit: (id: string, title: string) => void;
  onAddWidget: () => void;
  onOpenReorder: () => void;
  children: React.ReactNode;
}

export const EditableSection: React.FC<EditableSectionProps> = ({ id, title, isActive, onEdit, onAddWidget, onOpenReorder, children }) => {
  if (!isActive) return <>{children}</>;

  return (
    <div className="relative group/editor border-2 border-transparent hover:border-[#337ab7] transition-all duration-200">
      {/* Плюс сверху */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-[80] opacity-0 group-hover/editor:opacity-100 transition-opacity">
        <button 
          onClick={(e) => { e.stopPropagation(); onAddWidget(); }}
          className="w-8 h-8 bg-[#337ab7] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform active:scale-90"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="3"/></svg>
        </button>
      </div>

      {/* Ярлык секции */}
      <div className="absolute top-0 left-0 z-[60] bg-[#337ab7] text-white px-3 py-1.5 text-[11px] font-bold rounded-br-lg shadow-md opacity-0 group-hover/editor:opacity-100 transition-opacity pointer-events-none">
        {title}
      </div>

      {/* Панель инструментов справа */}
      <div className="absolute top-4 right-4 z-[70] flex flex-col gap-3 items-end opacity-0 group-hover/editor:opacity-100 transition-opacity translate-x-2 group-hover/editor:translate-x-0">
        {/* Кнопка Редактировать */}
        <button 
          onClick={() => onEdit(id, title)}
          className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-slate-100 text-[#333] hover:bg-slate-50 transition-all group/edit"
        >
           <svg className="w-5 h-5 text-slate-400 group-hover/edit:text-[#337ab7] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" strokeWidth="2"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2"/></svg>
           <span className="text-[13px] font-medium">Редактировать</span>
        </button>

        {/* Набор иконок */}
        <div className="flex bg-white rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden divide-x divide-slate-100">
           <button title="Переместить" className="p-3 text-slate-400 hover:text-[#337ab7] hover:bg-slate-50 transition-all">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" strokeWidth="2"/></svg>
           </button>
           <button title="Стиль" className="p-3 text-slate-400 hover:text-purple-500 hover:bg-slate-50 transition-all relative">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" strokeWidth="2"/></svg>
             <span className="absolute bottom-1 right-1 bg-white text-[8px] font-bold px-1 rounded border border-slate-100">10</span>
           </button>
           <button 
             onClick={(e) => { e.stopPropagation(); onOpenReorder(); }}
             title="Переставить секции" 
             className="p-3 text-slate-400 hover:text-blue-500 hover:bg-slate-50 transition-all"
           >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
           </button>
           <button title="Удалить" className="p-3 text-slate-400 hover:text-red-500 hover:bg-slate-50 transition-all">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2"/></svg>
           </button>
           <button title="Ещё" className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" strokeWidth="3"/></svg>
           </button>
        </div>
      </div>

      {/* Контент секции */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Плюс снизу */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-[80] opacity-0 group-hover/editor:opacity-100 transition-opacity">
        <button 
          onClick={(e) => { e.stopPropagation(); onAddWidget(); }}
          className="w-8 h-8 bg-[#337ab7] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform active:scale-90"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="3"/></svg>
        </button>
      </div>

      {/* Затемнение фона при наведении */}
      <div className="absolute inset-0 bg-[#337ab7]/5 pointer-events-none opacity-0 group-hover/editor:opacity-100 transition-opacity z-0" />
    </div>
  );
};
