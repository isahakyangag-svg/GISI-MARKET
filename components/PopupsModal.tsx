
import React from 'react';
import { StoreSettings } from '../types';

interface PopupsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StoreSettings;
  onUpdate: (s: StoreSettings) => void;
}

interface PopupItemProps {
  id: string;
  name: string;
  active: boolean;
  type: string;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const PopupItem: React.FC<PopupItemProps> = ({ id, name, active, type, onToggle, onDelete }) => (
  <div className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between group hover:border-blue-200 transition-all">
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${active ? 'bg-blue-50 text-blue-500' : 'bg-slate-50 text-slate-300'}`}>
         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" strokeWidth="2"/></svg>
      </div>
      <div>
         <p className="text-[14px] font-bold text-slate-800">{name}</p>
         <p className="text-[11px] text-slate-400 uppercase font-bold tracking-widest">{type}</p>
      </div>
    </div>
    <div className="flex items-center gap-3">
       <button 
         onClick={() => onToggle(id)}
         className={`px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}
       >
          {active ? 'Активно' : 'Выключено'}
       </button>
       <button 
         onClick={() => onDelete(id)}
         className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
       >
         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
       </button>
    </div>
  </div>
);

export const PopupsModal: React.FC<PopupsModalProps> = ({ isOpen, onClose, settings, onUpdate }) => {
  if (!isOpen) return null;

  const popups = settings.popups || [
    { id: 'p1', name: 'Подписка на рассылку', active: true, type: 'Маркетинг' },
    { id: 'p2', name: 'Уведомление о куках', active: true, type: 'Системное' },
    { id: 'p3', name: 'Скидка при выходе', active: false, type: 'Удержание' }
  ];

  const togglePopup = (id: string) => {
    const newPopups = popups.map(p => p.id === id ? { ...p, active: !p.active } : p);
    onUpdate({ ...settings, popups: newPopups });
  };

  const deletePopup = (id: string) => {
    onUpdate({ ...settings, popups: popups.filter(p => p.id !== id) });
  };

  const addPopup = () => {
    const newPopup = {
      id: 'p' + Date.now(),
      name: 'Новое окно',
      active: true,
      type: 'Пользовательское'
    };
    onUpdate({ ...settings, popups: [...popups, newPopup] });
  };

  return (
    <div className="fixed inset-0 z-[7000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#f4f7f6] w-full max-w-[550px] rounded-lg shadow-2xl flex flex-col overflow-hidden border border-slate-200 font-['Inter']">
        <header className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
          <h2 className="text-[18px] font-medium text-slate-800">Всплывающие окна</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round"/></svg></button>
        </header>

        <div className="p-6 space-y-4">
           {popups.map(p => (
             <PopupItem 
               key={p.id} 
               id={p.id} 
               name={p.name} 
               active={p.active} 
               type={p.type} 
               onToggle={togglePopup}
               onDelete={deletePopup}
             />
           ))}
           
           <button 
             onClick={addPopup}
             className="w-full py-4 bg-white border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-blue-500 hover:border-blue-300 transition-all group"
           >
              <span className="text-2xl font-light group-hover:scale-110 transition-transform">+</span>
              <span className="text-[11px] font-black uppercase tracking-widest">Создать новое окно</span>
           </button>
        </div>

        <footer className="px-6 py-4 bg-white border-t border-slate-200 flex justify-end shrink-0">
          <button onClick={onClose} className="px-8 py-2 bg-blue-500 text-white rounded text-[13px] font-bold hover:bg-blue-600 transition-all">Закрыть</button>
        </footer>
      </div>
    </div>
  );
};
