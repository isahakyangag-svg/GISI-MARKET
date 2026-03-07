
import React from 'react';
import { StoreSettings } from '../types';

interface TemplateSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StoreSettings;
  onUpdate: (s: StoreSettings) => void;
}

export const TemplateSettingsModal: React.FC<TemplateSettingsModalProps> = ({ isOpen, onClose, settings, onUpdate }) => {
  if (!isOpen) return null;

  // Added children?: React.ReactNode to fix TypeScript JSX inference errors where it thinks props are missing
  const Section = ({ title, children }: { title: string, children?: React.ReactNode }) => (
    <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6">
      <h3 className="text-[15px] font-bold text-slate-800 mb-6 uppercase tracking-wider">{title}</h3>
      <div className="space-y-6">{children}</div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[7000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#f4f7f6] w-full max-w-[600px] h-[85vh] rounded-lg shadow-2xl flex flex-col overflow-hidden border border-slate-200 font-['Inter']">
        <header className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
          <h2 className="text-[18px] font-medium text-slate-800">Настройки шаблона</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round"/></svg></button>
        </header>

        <div className="flex-grow overflow-y-auto p-6 hide-scrollbar">
           <Section title="Цвета">
              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[12px] font-bold text-slate-500">Основной цвет</label>
                    <div className="flex gap-2">
                       <input type="color" value={settings.primaryColor} onChange={e => onUpdate({...settings, primaryColor: e.target.value})} className="w-10 h-10 rounded border-none cursor-pointer" />
                       <input type="text" value={settings.primaryColor} className="flex-grow px-3 border border-slate-200 rounded text-sm uppercase" readOnly />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[12px] font-bold text-slate-500">Акцентный цвет</label>
                    <div className="flex gap-2">
                       <input type="color" value={settings.accentColor} onChange={e => onUpdate({...settings, accentColor: e.target.value})} className="w-10 h-10 rounded border-none cursor-pointer" />
                       <input type="text" value={settings.accentColor} className="flex-grow px-3 border border-slate-200 rounded text-sm uppercase" readOnly />
                    </div>
                 </div>
              </div>
           </Section>

           <Section title="Типографика">
              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[12px] font-bold text-slate-500">Шрифт заголовков</label>
                    <select className="w-full p-2.5 border border-slate-200 rounded text-sm outline-none">
                       <option>Inter</option>
                       <option>Montserrat</option>
                       <option>Roboto</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[12px] font-bold text-slate-500">Размер текста</label>
                    <input type="range" className="w-full accent-blue-500" min="12" max="20" />
                 </div>
              </div>
           </Section>

           <Section title="Кнопки">
              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[12px] font-bold text-slate-500">Скругление углов (px)</label>
                    <input type="number" value={parseInt(settings.borderRadius)} onChange={e => onUpdate({...settings, borderRadius: e.target.value + 'px'})} className="w-full p-2.5 border border-slate-200 rounded text-sm" />
                 </div>
                 <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-500 rounded border-slate-300" />
                    <span className="text-[13px] text-slate-600">Эффект при наведении</span>
                 </div>
              </div>
           </Section>
        </div>

        <footer className="px-6 py-4 bg-white border-t border-slate-200 flex justify-end gap-2 shrink-0">
          <button onClick={onClose} className="px-6 py-2 bg-slate-100 text-slate-700 rounded text-[13px] font-medium hover:bg-slate-200">Закрыть</button>
          <button onClick={() => { alert('Применено!'); onClose(); }} className="px-8 py-2 bg-blue-500 text-white rounded text-[13px] font-bold hover:bg-blue-600 transition-all">Применить</button>
        </footer>
      </div>
    </div>
  );
};
