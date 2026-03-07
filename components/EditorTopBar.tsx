
import React from 'react';

interface EditorTopBarProps {
  onExitEditor: () => void;
  onGoToAdmin: () => void;
  onSave: () => void;
  onMenuClick: () => void;
  viewMode: 'desktop' | 'mobile';
  onViewModeChange: (mode: 'desktop' | 'mobile') => void;
}

export const EditorTopBar: React.FC<EditorTopBarProps> = ({ 
  onExitEditor, 
  onGoToAdmin, 
  onSave,
  onMenuClick,
  viewMode,
  onViewModeChange
}) => {
  return (
    <div className="h-[60px] bg-white border-b border-slate-200 flex items-center justify-between px-4 z-[3000] sticky top-0 shadow-sm font-['Inter']">
      {/* Левая часть: Меню и Undo/Redo */}
      <div className="flex items-center gap-6">
        <button 
          onClick={onMenuClick}
          className="w-10 h-10 flex items-center justify-center border border-blue-400 rounded-md text-blue-500 hover:bg-blue-50 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
        
        <div className="flex items-center gap-4 text-slate-300">
          <button className="hover:text-slate-400 transition-colors cursor-not-allowed">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button className="hover:text-slate-400 transition-colors cursor-not-allowed">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 10H11a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>

      {/* Центральная часть: Переключатель устройств */}
      <div className="flex bg-[#f1f3f4] p-1 rounded-lg border border-slate-100">
        <button 
          onClick={() => onViewModeChange('desktop')}
          className={`px-4 py-1.5 rounded-md transition-all ${viewMode === 'desktop' ? 'bg-white shadow-sm text-slate-800 border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth="1.5"/></svg>
        </button>
        <button 
          onClick={() => onViewModeChange('mobile')}
          className={`px-4 py-1.5 rounded-md transition-all ${viewMode === 'mobile' ? 'bg-white shadow-sm text-slate-800 border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" strokeWidth="1.5"/></svg>
        </button>
      </div>

      {/* Правая часть: Действия */}
      <div className="flex items-center gap-4">
        <button className="text-slate-400 hover:text-slate-600 p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2"/></svg>
        </button>
        
        <div className="flex items-center gap-2">
          <button className="px-5 py-2 bg-white border border-slate-200 rounded text-[13px] font-medium text-slate-700 hover:bg-slate-50 shadow-sm transition-all">
            Предпросмотр
          </button>
          <button 
            onClick={onGoToAdmin}
            className="px-5 py-2 bg-white border border-slate-200 rounded text-[13px] font-medium text-slate-700 hover:bg-slate-50 shadow-sm transition-all"
          >
            В админку
          </button>
          <button 
            onClick={onSave}
            className="px-8 py-2 bg-[#f1f3f4] text-slate-300 rounded text-[13px] font-bold cursor-not-allowed"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};
