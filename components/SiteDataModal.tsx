
import React from 'react';
import { StoreSettings } from '../types';

interface SiteDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StoreSettings;
  onUpdate: (s: StoreSettings) => void;
}

const Card = ({ title, children, noPadding = false }: { title?: string, children?: React.ReactNode, noPadding?: boolean }) => (
  <div className="bg-white border border-slate-100 rounded-2xl shadow-sm mb-6 overflow-hidden">
    {title && (
      <div className="px-8 py-5 border-b border-slate-50">
        <h3 className="text-[15px] font-black text-slate-900 uppercase tracking-tight italic">{title}</h3>
      </div>
    )}
    <div className={noPadding ? '' : 'p-8'}>{children}</div>
  </div>
);

const Label = ({ children, hint }: { children?: React.ReactNode, hint?: string }) => (
  <label className="block text-[12px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
    {children}
    {hint && <span className="w-4 h-4 rounded-full border border-slate-200 text-slate-300 text-[10px] flex items-center justify-center cursor-help" title={hint}>?</span>}
  </label>
);

const CheckboxRow = ({ label, description, checked = false, onChange }: { label: string, description?: string, checked?: boolean, onChange?: (val: boolean) => void }) => (
  <div className="flex gap-4 py-1 group cursor-pointer" onClick={() => onChange?.(!checked)}>
    <div className="relative mt-1">
      <input type="checkbox" checked={checked} readOnly className="peer w-5 h-5 opacity-0 absolute inset-0 cursor-pointer z-10" />
      <div className={`w-5 h-5 rounded border-2 transition-all ${checked ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-200 peer-hover:border-indigo-400'}`} />
    </div>
    <div className="flex flex-col">
      <span className="text-[14px] font-bold text-slate-800">{label}</span>
      {description && <span className="text-[11px] text-slate-400 font-medium leading-tight mt-0.5">{description}</span>}
    </div>
  </div>
);

export const SiteDataModal: React.FC<SiteDataModalProps> = ({ isOpen, onClose, settings, onUpdate }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[7000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-[600px] h-[90vh] rounded-[2.5rem] shadow-2xl flex flex-col animate-zoom-in overflow-hidden border border-slate-100 font-['Inter']">
        
        {/* Header */}
        <header className="px-10 py-6 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">Данные сайта</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Настройки индексации и контактов</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-900 transition-all hover:rotate-90">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="3" strokeLinecap="round"/></svg>
          </button>
        </header>

        {/* Scrollable Content */}
        <div className="flex-grow overflow-y-auto p-6 hide-scrollbar space-y-2 bg-slate-50/20">
          
          <Card>
            <div className="space-y-6">
              <div>
                <Label>Адрес вашего магазина</Label>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[13px] text-slate-900 font-black truncate pr-4">myshop-dbm29.myinsales.ru</span>
                  <button className="text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:underline whitespace-nowrap">Изменить</button>
                </div>
              </div>
              <div className="space-y-2">
                <Label hint="Это название будет отображаться во вкладке браузера и в письмах">Название магазина</Label>
                <input 
                  type="text" 
                  value={settings.storeName} 
                  onChange={e => onUpdate({...settings, storeName: e.target.value})}
                  className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-[15px] font-bold outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all shadow-sm"
                />
              </div>
            </div>
          </Card>

          <Card title="Контент и продажи">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <input 
                    type="radio" 
                    checked={settings.contentType === 'products' || !settings.contentType} 
                    onChange={() => onUpdate({...settings, contentType: 'products'})}
                    className="w-5 h-5 text-indigo-600 focus:ring-indigo-500" 
                  />
                  <span className="text-[14px] font-black text-slate-800 uppercase tracking-tight">Каталог товаров</span>
                </div>
                
                <div className={`pl-10 space-y-5 border-l-2 border-indigo-100 transition-all ${(!settings.contentType || settings.contentType === 'products') ? 'opacity-100' : 'opacity-20 pointer-events-none'}`}>
                  <CheckboxRow label="Корзина" description="Покупатели могут добавлять товары в корзину" checked />
                  <div className="flex justify-between items-center pr-2">
                    <CheckboxRow label="Быстрый заказ" description="Покупка в 1 клик через форму" checked />
                    <button className="text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:underline">Настроить</button>
                  </div>
                  <CheckboxRow label="Внешние ссылки" description="Переход на карточку в маркетплейсе" />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-6 border-t border-slate-50">
                <input 
                  type="radio" 
                  checked={settings.contentType === 'services'} 
                  onChange={() => onUpdate({...settings, contentType: 'services'})}
                  className="w-5 h-5 text-indigo-600 focus:ring-indigo-500" 
                />
                <span className="text-[14px] font-black text-slate-800 uppercase tracking-tight">Услуги и сервисы</span>
              </div>
            </div>
          </Card>

          <Card title="Контакты">
            <div className="space-y-6">
              <div>
                <Label>Номер телефона</Label>
                <div className="flex bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-50 transition-all">
                  <div className="px-5 flex items-center gap-2 bg-slate-50 border-r border-slate-100 text-[14px] font-black text-slate-900">
                    <span>+374</span>
                  </div>
                  <input 
                    type="text" 
                    value={settings.footer.supportPhone.replace('+374 ', '')} 
                    onChange={e => onUpdate({...settings, footer: {...settings.footer, supportPhone: '+374 ' + e.target.value}})} 
                    className="flex-grow px-5 py-4 text-[15px] font-bold outline-none bg-white" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>E-mail для связи</Label>
                <input 
                  type="email" 
                  value={settings.adminEmail || ''} 
                  onChange={e => onUpdate({...settings, adminEmail: e.target.value})} 
                  className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-[15px] font-bold outline-none focus:border-indigo-400 shadow-sm transition-all" 
                />
              </div>
            </div>
          </Card>

          <Card title="Доступ к сайту">
            <div className="space-y-8">
              <div className="bg-indigo-50/50 border border-indigo-100 p-8 rounded-[2.2rem] flex items-start gap-5">
                <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shrink-0 text-white shadow-lg"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                <div className="space-y-4">
                  <p className="text-[13px] font-bold text-slate-800 leading-relaxed">Сайт защищен паролем. Для публичного доступа необходимо активировать тарифный план.</p>
                  <button className="px-6 py-3 bg-white border border-indigo-200 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm">Активировать</button>
                </div>
              </div>

              <div className="space-y-2">
                <Label hint="Этот пароль увидят посетители при входе">Пароль для входа</Label>
                <input 
                  type="text" 
                  value={settings.adminPassword || '05f6d4'} 
                  onChange={e => onUpdate({...settings, adminPassword: e.target.value})}
                  className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-[15px] font-black tracking-[0.5em] outline-none focus:border-indigo-400 shadow-sm transition-all"
                />
              </div>
            </div>
          </Card>

        </div>

        {/* Footer */}
        <footer className="px-10 py-6 bg-white border-t border-slate-100 flex justify-end gap-4 shrink-0">
          <button onClick={onClose} className="px-8 py-3.5 bg-slate-50 text-slate-400 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-100 hover:text-slate-900 transition-all border border-slate-100">Закрыть</button>
          <button onClick={() => { alert('Данные успешно обновлены!'); onClose(); }} className="px-12 py-3.5 bg-indigo-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:scale-105 active:scale-95 transition-all">Применить</button>
        </footer>

      </div>
    </div>
  );
};
