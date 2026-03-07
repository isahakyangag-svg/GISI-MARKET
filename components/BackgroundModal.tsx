
import React, { useRef } from 'react';
import { BackgroundSettings } from '../types';

interface BackgroundModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: BackgroundSettings;
  onUpdate: (s: BackgroundSettings) => void;
}

// Fix: Made children optional to resolve TypeScript JSX inference errors where it thinks props are missing
const Section = ({ title, children }: { title: string, children?: React.ReactNode }) => (
  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">{title}</h3>
    <div className="space-y-4">{children}</div>
  </div>
);

export const BackgroundModal: React.FC<BackgroundModalProps> = ({ isOpen, onClose, settings, onUpdate }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        onUpdate({ ...settings, imageUrl: ev.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[7000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-fade-in" onClick={onClose} />
      
      <div className="relative bg-[#F8FAFC] w-full max-w-[550px] h-[90vh] rounded-[3rem] shadow-2xl flex flex-col animate-zoom-in overflow-hidden border border-white font-['Inter']">
        
        <header className="px-10 py-7 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">Фон сайта</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Оформление пространства</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-900 transition-all hover:rotate-90">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="3" strokeLinecap="round"/></svg>
          </button>
        </header>

        <div className="flex-grow overflow-y-auto p-8 space-y-6 hide-scrollbar">
          
          <Section title="Изображение">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative aspect-video bg-slate-100 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer group overflow-hidden transition-all hover:border-[#82C12D]"
            >
               {settings.imageUrl ? (
                 <>
                   <img src={settings.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="Background preview" />
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-black uppercase tracking-widest">Заменить фото</div>
                 </>
               ) : (
                 <div className="text-center">
                    <span className="text-4xl mb-2 block">🖼️</span>
                    <p className="text-[11px] font-black text-indigo-500 uppercase tracking-widest">Загрузить фон</p>
                 </div>
               )}
               <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
            </div>
            {settings.imageUrl && (
              <button 
                onClick={(e) => { e.stopPropagation(); onUpdate({...settings, imageUrl: ''}); }}
                className="w-full py-3 bg-rose-50 text-rose-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 transition-colors"
              >
                Удалить изображение
              </button>
            )}
          </Section>

          <Section title="Поведение фона">
            <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100">
               {(['fixed', 'scroll'] as const).map(mode => (
                 <button 
                   key={mode}
                   onClick={() => onUpdate({...settings, behavior: mode})}
                   className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${settings.behavior === mode ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                   {mode === 'fixed' ? 'Зафиксирован' : 'Прокрутка'}
                 </button>
               ))}
            </div>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter text-center">Зафиксированный фон создает эффект глубины (Parallax)</p>
          </Section>

          <Section title="Визуальные эффекты">
            <div className="space-y-6">
               <div className="space-y-3">
                  <div className="flex justify-between items-center">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Затемнение</label>
                     <span className="text-[10px] font-black text-slate-900">{Math.round(settings.overlayOpacity * 100)}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="0.9" step="0.05"
                    value={settings.overlayOpacity}
                    onChange={e => onUpdate({...settings, overlayOpacity: parseFloat(e.target.value) || 0})}
                    className="w-full accent-[#82C12D]"
                  />
               </div>
               <div className="space-y-3">
                  <div className="flex justify-between items-center">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Размытие (Blur)</label>
                     <span className="text-[10px] font-black text-slate-900">{settings.blur}px</span>
                  </div>
                  <input 
                    type="range" min="0" max="20" step="1"
                    value={settings.blur}
                    onChange={e => onUpdate({...settings, blur: parseInt(e.target.value) || 0})}
                    className="w-full accent-indigo-500"
                  />
               </div>
            </div>
          </Section>

          <Section title="Цвет подложки">
             <div className="flex items-center gap-4 bg-white p-3 border border-slate-100 rounded-2xl">
                <input 
                  type="color" 
                  value={settings.color}
                  onChange={e => onUpdate({...settings, color: e.target.value})}
                  className="w-12 h-12 rounded-xl cursor-pointer border-none"
                />
                <input 
                  type="text" 
                  value={settings.color}
                  onChange={e => onUpdate({...settings, color: e.target.value})}
                  className="flex-grow text-sm font-black uppercase outline-none"
                />
             </div>
          </Section>

        </div>

        <footer className="px-10 py-6 bg-white border-t border-slate-100 flex justify-end shrink-0">
          <button onClick={onClose} className="px-14 py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl">Сохранить</button>
        </footer>

      </div>
    </div>
  );
};
