
import React, { useState } from 'react';
import { User, Product, StoreSettings, Order } from '../types';
import { ProductCard } from './ProductCard';

interface CustomerDashboardProps {
  user: User;
  onUpdateUser: (updates: Partial<User>) => void;
  products: Product[];
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  settings: StoreSettings;
  orders: Order[];
}

type Section = 'home' | 'orders' | 'addresses' | 'payment' | 'bonuses' | 'wishlist' | 'reviews' | 'notifications' | 'settings' | 'security';

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ 
  user, onUpdateUser, products, wishlist, onToggleWishlist, onLogout, settings, onClose, orders = []
}) => {
  const [activeSection, setActiveSection] = useState<Section>('home');
  const [isDashboardMode, setIsDashboardMode] = useState(true);

  const menuItems = [
    { id: 'home', label: 'ГЛАВНАЯ', icon: '🏠' },
    { id: 'orders', label: 'МОИ ЗАКАЗЫ', icon: '📦' },
    { id: 'addresses', label: 'АДРЕСА ДОСТАВКИ', icon: '📍' },
    { id: 'payment', label: 'ОПЛАТА', icon: '💳' },
    { id: 'bonuses', label: 'БОНУСЫ', icon: '💰' },
    { id: 'wishlist', label: 'ИЗБРАННОЕ', icon: '❤️' },
    { id: 'reviews', label: 'ОТЗЫВЫ', icon: '⭐' },
    { id: 'notifications', label: 'УВЕДОМЛЕНИЯ', icon: '🔔', badge: 5 },
    { id: 'settings', label: 'НАСТРОЙКИ', icon: '⚙️' },
    { id: 'security', label: 'БЕЗОПАСНОСТЬ', icon: '🛡️' },
  ];

  const renderHome = () => (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Верхний ряд */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Мои заказы */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-50 flex flex-col justify-between min-h-[160px]">
          <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest mb-4">Мои заказы</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#5C5CFF] rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-blue-100">📦</div>
              <div>
                <p className="text-[15px] font-black text-slate-900 leading-tight">Заказ № 123456</p>
                <p className="text-[10px] font-bold text-slate-400 mt-1">19 апреля 2024</p>
              </div>
            </div>
            <button className="px-6 py-3 bg-[#5C5CFF] text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-blue-100 hover:scale-105 transition-transform">Отследить</button>
          </div>
        </div>

        {/* Бонусы */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-50 flex flex-col justify-between min-h-[160px]">
          <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Бонусы</p>
          <div className="flex items-baseline gap-3 mt-4">
             <span className="text-5xl font-black text-slate-900 tracking-tighter italic">{user?.loyaltyPoints?.toLocaleString() || '999999'}</span>
             <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Бонусных баллов</span>
          </div>
        </div>

        {/* Купоны */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-50 flex flex-col justify-between min-h-[160px]">
          <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Купоны и скидки</p>
          <div className="flex items-baseline gap-3 mt-4">
             <span className="text-5xl font-black text-slate-900 tracking-tighter italic">2</span>
             <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Активные купоны</span>
          </div>
        </div>
      </div>

      {/* Средний ряд */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Избранное */}
        <div className="lg:col-span-8 bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-50 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-8">
             <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">ИЗБРАННОЕ</h3>
             <button onClick={() => setActiveSection('wishlist')} className="text-[10px] font-black text-[#5C5CFF] uppercase tracking-widest hover:underline">ПЕРЕЙТИ</button>
          </div>
          <div className="flex flex-wrap md:flex-nowrap gap-10 items-center">
             <div className="flex -space-x-4">
                {(products || []).slice(0, 3).map((p, i) => (
                   <div key={i} className="w-24 h-24 rounded-3xl bg-slate-50 border-4 border-white shadow-md overflow-hidden flex items-center justify-center p-3">
                      <img src={p.image || undefined} className="max-h-full max-w-full object-contain mix-blend-multiply" alt="wish" />
                   </div>
                ))}
                {(wishlist || []).length === 0 && <div className="w-24 h-24 rounded-3xl bg-slate-50 border-4 border-white shadow-inner flex items-center justify-center text-3xl opacity-20">❤️</div>}
             </div>
             <div>
                <p className="text-3xl font-black text-slate-900 italic tracking-tighter leading-none">{(wishlist || []).length} <span className="text-sm uppercase ml-1 opacity-40">ТОВАРОВ</span></p>
             </div>
             <div className="h-px bg-slate-100 flex-grow mx-4 hidden md:block" />
             <div className="text-center">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">РЕКОМЕНДАЦИИ ДЛЯ ВАС</p>
                <div className="flex items-center gap-3">
                   <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-2xl shadow-inner">🎧</div>
                   <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">СМОТРЕТЬ ВСЕ</button>
                </div>
             </div>
          </div>
        </div>

        {/* Поддержка */}
        <div className="lg:col-span-4 bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-50 flex flex-col justify-between min-h-[240px]">
          <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter mb-8">ПОДДЕРЖКА</h3>
          <div className="flex items-center gap-5 mb-8">
             <span className="text-6xl font-black text-slate-900 tracking-tighter italic leading-none">1</span>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-tight">Ожидает<br/>ответа</p>
          </div>
          <button className="w-full py-5 bg-[#5C5CFF] text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:scale-105 transition-transform">Мои обращения</button>
        </div>
      </div>

      {/* Нижний ряд */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* История входов */}
        <div className="lg:col-span-7 bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-50 flex flex-col">
           <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter mb-8">ИСТОРИЯ ВХОДОВ</h3>
           <div className="space-y-4">
              <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-50">
                 <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-xl">💻</div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">10:15 СЕГОДНЯ</p>
                       <p className="text-[15px] font-black text-slate-800">Chrome / MacOS • 81.16.11.174</p>
                    </div>
                 </div>
                 <span className="px-4 py-1.5 bg-emerald-50 text-emerald-500 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100">ONLINE</span>
              </div>
              <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-50 opacity-60">
                 <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-xl">📱</div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">18:30 ВЧЕРА</p>
                       <p className="text-[15px] font-black text-slate-800">iPhone 15 Pro • 45.89.66.154</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Клубный статус */}
        <div className="lg:col-span-5 bg-[#1e2b6e] rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden text-white flex flex-col justify-between group min-h-[300px]">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full group-hover:scale-110 transition-transform duration-700" />
           <div className="relative z-10">
              <h3 className="text-2xl font-black italic tracking-tighter uppercase leading-none">GISI CLUB STATUS</h3>
              <p className="text-[11px] font-black text-white/40 uppercase tracking-[0.4em] mt-4">УРОВЕНЬ: {user?.loyaltyLevel?.toUpperCase() || 'PLATINUM'}</p>
           </div>
           <div className="relative z-10 pt-12">
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-2">БАЛАНС</p>
              <div className="flex items-center justify-between">
                 <p className="text-5xl font-black italic tracking-tighter">{user?.loyaltyPoints?.toLocaleString() || '999999'} <span className="text-2xl ml-2 opacity-60 uppercase not-italic font-bold tracking-widest">баллов</span></p>
                 <button className="px-8 py-3 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-[#1e2b6e] transition-all shadow-xl">Привилегии</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );

  const renderSectionFrame = (title: string, content: React.ReactNode) => (
    <div className="space-y-8 animate-fade-in">
       <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">{title}</h2>
       <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-50 min-h-[500px]">
          {content}
       </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[500] bg-[#F4F7F6] flex overflow-hidden animate-fade-in no-print">
      
      {/* SIDEBAR */}
      <aside className="w-[340px] bg-white flex flex-col shrink-0 border-r border-slate-100 shadow-[30px_0_60px_rgba(0,0,0,0.02)]">
        <div className="p-10 flex flex-col items-center text-center space-y-5">
           <div className="w-28 h-28 rounded-full border-4 border-slate-50 shadow-2xl overflow-hidden ring-4 ring-white relative z-10">
              <img src={user?.avatar || undefined} className="w-full h-full object-cover" alt="User" />
           </div>
           <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter leading-none uppercase italic">{user?.name}</h2>
              <p className="text-[11px] font-bold text-slate-300 mt-2 lowercase tracking-wider">{user?.email}</p>
           </div>
        </div>

        <nav className="flex-grow px-8 space-y-2 overflow-y-auto hide-scrollbar">
           {menuItems.map(item => (
              <button
                 key={item.id}
                 onClick={() => setActiveSection(item.id as Section)}
                 className={`w-full flex items-center justify-between px-6 py-4 rounded-[1.8rem] transition-all duration-300 ${
                    activeSection === item.id 
                    ? 'bg-indigo-50 text-[#5C5CFF] shadow-sm translate-x-2' 
                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50/50'
                 }`}
              >
                 <div className="flex items-center gap-5">
                    <span className="text-xl opacity-70">{item.icon}</span>
                    <span className="text-[12px] font-black uppercase tracking-widest">{item.label}</span>
                 </div>
                 {item.badge && <span className="w-6 h-6 bg-[#f91155] text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm">{item.badge}</span>}
              </button>
           ))}
        </nav>

        <div className="p-8">
           <button onClick={onLogout} className="w-full py-6 bg-[#fff0f3] text-[#f91155] rounded-[2rem] text-[12px] font-black uppercase tracking-[0.3em] transition-all hover:bg-[#f91155] hover:text-white shadow-sm flex items-center justify-center gap-4 group">
              <span className="group-hover:translate-x-[-4px] transition-transform">🚪</span> ВЫХОД
           </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-grow flex flex-col min-w-0">
         {/* HEADER */}
         <header className="h-24 bg-white/60 backdrop-blur-xl px-12 flex items-center justify-between shrink-0 border-b border-slate-100 z-50">
            <div className="flex items-center gap-10">
               <button onClick={onClose} className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-300 hover:text-[#5C5CFF] transition-all shadow-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
               </button>
               <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic leading-none select-none">GISI ADMIN</h1>
            </div>

            <div className="flex items-center gap-8">
               <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border border-slate-100">
                  <button onClick={() => setIsDashboardMode(true)} className={`px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isDashboardMode ? 'bg-[#5C5CFF] text-white shadow-lg' : 'text-slate-400 hover:text-slate-700'}`}>DASHBOARD</button>
                  <button onClick={() => setIsDashboardMode(false)} className={`px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isDashboardMode ? 'bg-[#5C5CFF] text-white shadow-lg' : 'text-slate-400 hover:text-slate-700'}`}>PROFILE</button>
               </div>
               
               <button className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-300 hover:text-[#5C5CFF] transition-all border border-slate-100 shadow-sm relative group">
                  <svg className="w-7 h-7 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                  <span className="absolute top-4 right-4 w-3 h-3 bg-[#f91155] rounded-full border-2 border-white shadow-sm" />
               </button>
            </div>
         </header>

         {/* VIEWPORT */}
         <div className="flex-grow overflow-y-auto p-12 md:p-16 hide-scrollbar">
            <div className="max-w-[1440px] mx-auto">
               {activeSection === 'home' && renderHome()}
               {activeSection === 'orders' && renderSectionFrame('МОИ ЗАКАЗЫ', (
                  <div className="space-y-6">
                     {orders.map(o => (
                        <div key={o.id} className="p-8 bg-slate-50/50 rounded-[2.5rem] flex items-center justify-between border border-slate-50 group hover:bg-white hover:shadow-xl transition-all">
                           <div className="flex items-center gap-6">
                              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm text-2xl">📦</div>
                              <div><p className="text-lg font-black text-slate-900 uppercase italic">#{o.orderNumber}</p><p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">{o.date}</p></div>
                           </div>
                           <div className="text-right">
                              <p className="text-2xl font-black text-slate-900 italic mb-2">{o.total.toLocaleString()} {settings?.currency || '֏'}</p>
                              <span className="px-5 py-2 bg-indigo-50 text-[#5C5CFF] rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">{o.status}</span>
                           </div>
                        </div>
                     ))}
                     {orders.length === 0 && <div className="text-center py-40 opacity-20"><div className="text-8xl mb-6">📦</div><p className="font-black uppercase tracking-[0.4em] text-lg">Список заказов пуст</p></div>}
                  </div>
               ))}
               {activeSection === 'addresses' && renderSectionFrame('АДРЕСА ДОСТАВКИ', (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="p-10 bg-white border-4 border-[#5C5CFF] rounded-[3rem] relative overflow-hidden shadow-2xl">
                        <div className="absolute top-6 right-6 w-8 h-8 bg-[#5C5CFF] text-white rounded-full flex items-center justify-center shadow-lg animate-bounce">✓</div>
                        <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em] mb-5">ОСНОВНОЙ АДРЕС</p>
                        <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-tight">Ереван, ул. Аршакуняц 12, кв. 45</h4>
                        <div className="mt-8 flex gap-4">
                           <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900">Изменить</button>
                           <button className="text-[10px] font-black text-rose-400 uppercase tracking-widest hover:text-rose-600">Удалить</button>
                        </div>
                     </div>
                     <button className="p-10 bg-slate-50/50 border-4 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center text-slate-300 hover:text-[#5C5CFF] hover:border-[#5C5CFF] hover:bg-white transition-all group">
                        <span className="text-6xl mb-4 group-hover:scale-125 transition-transform duration-500 font-light">+</span>
                        <p className="text-xs font-black uppercase tracking-[0.3em]">Добавить новый адрес</p>
                     </button>
                  </div>
               ))}
               {activeSection === 'payment' && renderSectionFrame('СПОСОБЫ ОПЛАТЫ', (
                  <div className="space-y-6">
                     <div className="p-10 bg-slate-50 border border-slate-100 rounded-[3rem] flex items-center justify-between group hover:bg-white transition-all">
                        <div className="flex items-center gap-6">
                           <div className="w-16 h-16 bg-white rounded-[1.5rem] shadow-sm flex items-center justify-center text-3xl">💳</div>
                           <div><p className="text-lg font-black text-slate-900 uppercase tracking-widest italic">VISA •••• 4242</p><p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest italic">Основная карта • Истекает 12/25</p></div>
                        </div>
                        <button className="px-8 py-3 bg-[#f91155]/10 text-[#f91155] rounded-xl text-[10px] font-black uppercase tracking-widest">Удалить</button>
                     </div>
                     <button className="w-full p-8 border-4 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center text-slate-300 hover:text-[#5C5CFF] hover:border-[#5C5CFF] transition-all group"><span className="text-4xl font-light mb-2">+</span><p className="text-xs font-black uppercase tracking-[0.3em]">Привязать новую карту</p></button>
                  </div>
               ))}
               {activeSection === 'bonuses' && renderSectionFrame('БОНУСНАЯ ПРОГРАММА', (
                  <div className="space-y-12">
                     <div className="bg-[#1e2b6e] rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
                        <div className="relative z-10 space-y-2"><p className="text-xs font-black uppercase tracking-widest opacity-40">Текущий баланс</p><h3 className="text-7xl font-black italic tracking-tighter">{user?.loyaltyPoints?.toLocaleString() || '0'} <span className="text-3xl opacity-60">AMD</span></h3></div>
                        <div className="mt-10 h-3 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5)]" style={{ width: '45%' }} /></div>
                        <p className="mt-4 text-[10px] font-black uppercase tracking-widest opacity-40">До следующего уровня (GOLD) осталось 15 400 баллов</p>
                     </div>
                     <div className="space-y-4"><h4 className="text-sm font-black uppercase tracking-widest ml-4">История транзакций</h4><div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 flex justify-between items-center"><p className="font-bold text-sm">Кэшбэк за заказ #123456</p><span className="font-black text-emerald-500">+ 1 450 AMD</span></div></div>
                  </div>
               ))}
               {activeSection === 'reviews' && renderSectionFrame('ОТЗЫВЫ И ВОПРОСЫ', (
                  <div className="space-y-10">
                     {(products || []).slice(0, 1).map(p => (
                        <div key={p.id} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
                           <div className="flex items-center gap-6"><img src={p.image || undefined} className="w-16 h-16 object-contain" /><div><h4 className="font-black text-slate-900 leading-tight">{p.name}</h4><p className="text-xs font-bold text-slate-400 mt-1">Оставлено: 14 мая 2024</p></div></div>
                           <div className="p-6 bg-slate-50 rounded-2xl italic font-bold text-sm text-slate-600">"Отличный товар, доставили вовремя!"</div>
                        </div>
                     ))}
                  </div>
               ))}
               {activeSection === 'settings' && renderSectionFrame('НАСТРОЙКИ ПРОФИЛЯ', (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Имя пользователя</label>
                       <input 
                         type="text" 
                         value={user?.name || ''} 
                         onChange={(e) => onUpdateUser({ name: e.target.value })}
                         className="w-full p-5 bg-slate-50 border rounded-3xl outline-none font-bold" 
                       />
                     </div>
                     <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">E-mail</label>
                       <input 
                         type="text" 
                         value={user?.email || ''} 
                         onChange={(e) => onUpdateUser({ email: e.target.value })}
                         className="w-full p-5 bg-slate-50 border rounded-3xl outline-none font-bold" 
                       />
                     </div>
                     <button className="px-10 py-5 bg-[#5C5CFF] text-white rounded-[1.8rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all">Сохранить изменения</button>
                  </div>
               ))}
               {activeSection === 'security' && renderSectionFrame('БЕЗОПАСНОСТЬ', (
                  <div className="space-y-12">
                     <div className="flex items-center justify-between p-10 bg-emerald-50 rounded-[3rem] border border-emerald-100">
                        <div><p className="font-black text-emerald-900">Двухфакторная аутентификация</p><p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mt-1 italic">Максимальная защита активна</p></div>
                        <div className="w-16 h-8 bg-emerald-500 rounded-full flex items-center justify-end px-1 shadow-inner shadow-emerald-600"><div className="w-6 h-6 bg-white rounded-full shadow-md" /></div>
                     </div>
                     <div className="space-y-6">
                        <h4 className="text-sm font-black uppercase tracking-widest ml-4">Лог входов</h4>
                        <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 flex justify-between items-center">
                           <div>
                              <p className="text-sm font-black">Chrome / MacOS • 81.16.11.174</p>
                              <p className="text-[10px] text-slate-400 uppercase mt-1">Сегодня, 10:15 • Ереван</p>
                           </div>
                           <span className="text-[9px] font-black text-emerald-500 uppercase bg-white px-2 py-1 rounded-lg border">ONLINE</span>
                        </div>
                     </div>
                  </div>
               ))}
               {activeSection === 'wishlist' && (
                  <div className="space-y-10 animate-fade-in pb-20">
                     <h2 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">ИЗБРАННОЕ</h2>
                     <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
                        {(products || []).filter(p => (wishlist || []).includes(p.id)).map(p => (
                           <ProductCard key={p.id} product={p} language={'ru'} currency={settings?.currency || '֏'} onAddToCart={()=>{}} onClick={()=>{}} isComparing={false} onToggleCompare={()=>{}} onAddReview={()=>{}} isWishlisted={true} onToggleWishlist={onToggleWishlist} />
                        ))}
                     </div>
                  </div>
               )}
            </div>
         </div>
      </main>
    </div>
  );
};
