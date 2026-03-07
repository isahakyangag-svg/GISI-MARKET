
import React, { useState, useEffect } from 'react';
import { PromoCode, StoreSettings } from '../types';

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (promo: PromoCode) => void;
  settings: StoreSettings;
  editingPromo: PromoCode | null;
}

export const CouponModal: React.FC<CouponModalProps> = ({ isOpen, onClose, onSave, settings, editingPromo }) => {
  const [formData, setFormData] = useState<PromoCode>({
    id: '',
    code: '',
    discountValue: 0,
    type: 'percent',
    status: 'active',
    usedCount: 0,
    minOrderAmount: 0,
    usageLimit: 0,
    expiresAt: ''
  });

  useEffect(() => {
    if (editingPromo) {
      setFormData(editingPromo);
    } else {
      setFormData({
        id: 'promo-' + Date.now(),
        code: '',
        discountValue: 10,
        type: 'percent',
        status: 'active',
        usedCount: 0,
        minOrderAmount: 0,
        usageLimit: 100,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
    }
  }, [editingPromo, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2500] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl border border-white overflow-hidden flex flex-col animate-zoom-in font-['Inter']">
        <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-2xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">
              {editingPromo ? 'Изменить купон' : 'Новый купон'}
            </h3>
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mt-2">Маркетинг и лояльность</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-900 transition-all">
             <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="3" strokeLinecap="round"/></svg>
          </button>
        </div>

        <div className="p-10 space-y-6 overflow-y-auto max-h-[65vh] hide-scrollbar bg-slate-50/30">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">Промокод (Код активации)</label>
            <input 
              type="text" 
              value={formData.code} 
              onChange={e => setFormData({...formData, code: e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '')})}
              className="w-full p-5 bg-white border border-slate-200 rounded-[1.5rem] text-slate-900 font-black tracking-[0.2em] outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all shadow-sm"
              placeholder="SALE2025"
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">Тип</label>
              <select 
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value as any})}
                className="w-full p-5 bg-white border border-slate-200 rounded-[1.5rem] text-slate-900 font-bold outline-none appearance-none cursor-pointer shadow-sm"
              >
                <option value="percent">Процент (%)</option>
                <option value="fixed">Сумма ({settings.currency})</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">Размер скидки</label>
              <input 
                type="number" 
                value={formData.discountValue}
                onChange={e => setFormData({...formData, discountValue: parseFloat(e.target.value) || 0})}
                className="w-full p-5 bg-white border border-slate-200 rounded-[1.5rem] text-slate-900 font-black outline-none focus:border-indigo-400 shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">Мин. заказ</label>
              <input 
                type="number" 
                value={formData.minOrderAmount}
                onChange={e => setFormData({...formData, minOrderAmount: parseFloat(e.target.value) || 0})}
                className="w-full p-5 bg-white border border-slate-200 rounded-[1.5rem] text-slate-900 font-bold outline-none focus:border-indigo-400 shadow-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">Кол-во исп.</label>
              <input 
                type="number" 
                value={formData.usageLimit}
                onChange={e => setFormData({...formData, usageLimit: parseInt(e.target.value) || 0})}
                className="w-full p-5 bg-white border border-slate-200 rounded-[1.5rem] text-slate-900 font-bold outline-none focus:border-indigo-400 shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">Дата окончания</label>
            <input 
              type="date" 
              value={formData.expiresAt?.split('T')[0]}
              onChange={e => setFormData({...formData, expiresAt: e.target.value})}
              className="w-full p-5 bg-white border border-slate-200 rounded-[1.5rem] text-slate-900 font-bold outline-none focus:border-indigo-400 shadow-sm"
            />
          </div>

          <div className="pt-4 flex gap-4">
             <button 
                onClick={() => setFormData({...formData, status: 'active'})}
                className={`flex-grow p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${formData.status === 'active' ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-lg shadow-emerald-50' : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'}`}
             >
                <span className="text-[11px] font-black uppercase tracking-widest">Активен</span>
             </button>
             <button 
                onClick={() => setFormData({...formData, status: 'expired'})}
                className={`flex-grow p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${formData.status === 'expired' ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-lg shadow-rose-50' : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'}`}
             >
                <span className="text-[11px] font-black uppercase tracking-widest">Отключен</span>
             </button>
          </div>
        </div>

        <div className="px-10 py-8 border-t border-slate-100 bg-white flex justify-end gap-5 shrink-0">
          <button onClick={onClose} className="px-8 py-4 text-slate-400 hover:text-slate-900 text-[11px] font-black uppercase tracking-widest transition-colors">Отмена</button>
          <button 
            onClick={() => {
              if(!formData.code) return alert('Введите код купона');
              onSave(formData);
            }} 
            className="px-14 py-4 bg-indigo-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 hover:scale-105 active:scale-95 transition-all"
          >
            {editingPromo ? 'Обновить' : 'Создать'}
          </button>
        </div>
      </div>
    </div>
  );
};
