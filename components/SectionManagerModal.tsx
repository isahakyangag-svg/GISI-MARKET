
import React from 'react';

interface PageSection {
  id: string;
  title: string;
  type: string;
}

interface SectionManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  sections: PageSection[];
  onReorder: (newSections: PageSection[]) => void;
  onSave: () => void;
}

export const SectionManagerModal: React.FC<SectionManagerModalProps> = ({ 
  isOpen, onClose, sections, onReorder, onSave 
}) => {
  const [selectedId, setSelectedId] = React.useState<string | null>((sections || [])[0]?.id || null);

  if (!isOpen) return null;

  const moveUp = () => {
    if (!selectedId) return;
    const index = sections.findIndex(s => s.id === selectedId);
    if (index > 0) {
      const newSections = [...sections];
      [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
      onReorder(newSections);
    }
  };

  const moveDown = () => {
    if (!selectedId) return;
    const index = sections.findIndex(s => s.id === selectedId);
    if (index < sections.length - 1) {
      const newSections = [...sections];
      [newSections[index + 1], newSections[index]] = [newSections[index], newSections[index + 1]];
      onReorder(newSections);
    }
  };

  return (
    <div className="fixed inset-0 z-[6000] bg-[#f4f7f6] flex flex-col animate-fade-in">
      {/* Top Bar */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4">
           <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="3"/></svg>
           </button>
           <div className="flex gap-4">
              <button className="text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <button className="text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 10H11a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
           </div>
        </div>

        <div className="flex items-center gap-3">
           <button className="text-slate-400 p-2 hover:bg-slate-50 rounded-lg">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2"/></svg>
           </button>
           <button className="px-5 py-2 bg-white border border-slate-200 rounded text-[13px] font-medium text-slate-700 hover:bg-slate-50 shadow-sm transition-all">Предпросмотр</button>
           <button className="px-5 py-2 bg-white border border-slate-200 rounded text-[13px] font-medium text-slate-700 hover:bg-slate-50 shadow-sm transition-all">В админку</button>
           <button 
             onClick={onSave}
             className="px-8 py-2 bg-[#4a90e2] text-white rounded text-[13px] font-bold shadow-md hover:bg-[#357abd] transition-all"
           >
             Сохранить
           </button>
        </div>
      </header>

      <div className="flex-grow flex overflow-hidden">
        {/* Left Control Sidebar */}
        <aside className="w-16 bg-white border-r border-slate-200 flex flex-col items-center py-10 gap-6 shrink-0 z-10">
           <button onClick={moveUp} className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 hover:text-blue-500 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 15l7-7 7 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
           </button>
           <button onClick={onSave} className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 hover:text-emerald-500 hover:border-emerald-200 hover:bg-emerald-50 transition-all shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
           </button>
           <button onClick={moveDown} className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 hover:text-blue-500 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
           </button>
        </aside>

        {/* Main Sections Area */}
        <main className="flex-grow overflow-y-auto p-10 flex flex-col items-center bg-[#f4f7f6]">
           <div className="w-full max-w-4xl space-y-px shadow-2xl rounded-lg overflow-hidden border border-slate-200 bg-slate-200">
              {(sections || []).map((section) => (
                <div 
                  key={section.id}
                  onClick={() => setSelectedId(section.id)}
                  className={`relative p-8 transition-all cursor-pointer ${selectedId === section.id ? 'bg-[#ebf4ff] z-20 ring-2 ring-inset ring-blue-400' : 'bg-white hover:bg-slate-50'}`}
                >
                   <div className="flex flex-col items-center gap-6">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">{section.title}</span>
                      
                      {/* Placeholder Visuals to mimic screenshot */}
                      <div className="w-full h-32 bg-white rounded-md border border-slate-100 flex items-center justify-center overflow-hidden opacity-50">
                         {section.type === 'slider' && <div className="w-full h-full bg-slate-50 flex items-center justify-center text-4xl">🎞️</div>}
                         {section.type === 'catalog' && (
                           <div className="flex gap-4">
                             {[1,2,3].map(i => <div key={i} className="w-20 h-24 bg-slate-100 rounded border border-slate-200" />)}
                           </div>
                         )}
                         {section.type === 'stories' && (
                           <div className="flex gap-3">
                             {[1,2,3,4,5].map(i => <div key={i} className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200" />)}
                           </div>
                         )}
                         {!['slider', 'catalog', 'stories'].includes(section.type) && <div className="h-px bg-slate-100 w-full mx-10" />}
                      </div>
                   </div>

                   {selectedId === section.id && (
                     <div className="absolute top-1/2 -left-1 w-2 h-10 bg-blue-500 rounded-r -translate-y-1/2" />
                   )}
                </div>
              ))}
           </div>

           <div className="py-20 text-center opacity-30">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Конец страницы</p>
           </div>
        </main>
      </div>
    </div>
  );
};
