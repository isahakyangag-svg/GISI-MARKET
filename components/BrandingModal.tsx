
import React, { useRef } from 'react';
import { StoreSettings } from '../types';

interface BrandingModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StoreSettings;
  onUpdate: (s: StoreSettings) => void;
}

export const BrandingModal: React.FC<BrandingModalProps> = ({ isOpen, onClose, settings, onUpdate }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        onUpdate({ ...settings, logoUrl: ev.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[7000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-fade-in" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-[500px] rounded-[2.5rem] shadow-2xl flex flex-col animate-zoom-in overflow-hidden border border-slate-100 font-['Inter']">
        
        <header className="px-10 py-6 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">Брендинг магазина</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Логотип и название</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-900 transition-all hover:rotate-90">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="3" strokeLinecap="round"/></svg>
          </button>
        </header>

        <div className="p-10 space-y-8 bg-slate-50/20">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Название магазина</label>
            <input 
              type="text" 
              value={settings.storeName} 
              onChange={e => onUpdate({...settings, storeName: e.target.value})}
              className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl text-[15px] font-black outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all shadow-sm"
              placeholder="Напр: GISI MARKET"
            />
          </div>

          <div className="space-y-4">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Логотип</label>
            <div className="flex flex-col items-center gap-6 p-10 bg-white border border-slate-100 rounded-[2.5rem] shadow-inner">
               <div className="w-32 h-32 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden relative group">
                  {settings.logoUrl ? (
                    <img src={settings.logoUrl} className="w-full h-full object-contain p-2" alt="Logo preview" />
                  ) : (
                    <span className="text-4xl">🖼️</span>
                  )}
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/40 text-white text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Заменить
                  </button>
               </div>
               <div className="flex flex-col items-center gap-2">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-colors"
                  >
                    Загрузить файл
                  </button>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
                  {settings.logoUrl && (
                    <button onClick={() => onUpdate({...settings, logoUrl: undefined})} className="text-[10px] text-rose-400 font-bold hover:underline">Удалить лого</button>
                  )}
               </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Режим отображения</label>
            <div className="flex bg-white rounded-2xl p-1 shadow-sm border border-slate-200">
               {(['text', 'logo', 'both'] as const).map((mode) => (
                 <button
                   key={mode}
                   onClick={() => onUpdate({...settings, headerDisplayMode: mode})}
                   className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${settings.headerDisplayMode === mode ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-700'}`}
                 >
                   {mode === 'text' ? 'Текст' : mode === 'logo' ? 'Логотип' : 'Вместе'}
                 </button>
               ))}
            </div>
          </div>

          {settings.logoUrl && (
            <div className="space-y-6 pt-4 border-t border-slate-100">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Ширина логотипа</label>
                  <span className="text-[10px] font-black text-slate-900">{settings.logoWidth || 150}px</span>
                </div>
                <input 
                  type="range" min="40" max="400" step="5"
                  value={settings.logoWidth || 150}
                  onChange={e => onUpdate({...settings, logoWidth: parseInt(e.target.value) || 0})}
                  className="w-full accent-indigo-600"
                />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Высота логотипа</label>
                  <span className="text-[10px] font-black text-slate-900">{settings.logoHeight || 40}px</span>
                </div>
                <input 
                  type="range" min="20" max="200" step="2"
                  value={settings.logoHeight || 40}
                  onChange={e => onUpdate({...settings, logoHeight: parseInt(e.target.value) || 0})}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>
          )}
        </div>

        <footer className="px-10 py-6 border-t border-slate-100 bg-white flex justify-end gap-4 shrink-0">
          <button onClick={onClose} className="px-12 py-3.5 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-100">Готово</button>
        </footer>

      </div>
    </div>
  );
};
