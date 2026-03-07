
import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, MessageSquare, ShoppingBag, Users, 
  Package, BarChart3, Settings, LifeBuoy, Bell, 
  FolderOpen, CreditCard, Puzzle, ShieldCheck, ScrollText,
  Search, Plus, MoreVertical, ChevronRight, LogOut,
  BellRing, User as UserIcon, HelpCircle, Globe, Palette,
  MessageCircle, Zap, Shield, Database, Mail, Send
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Cell, LineChart, Line
} from 'recharts';
import { Product, Order, StoreSettings, Category, User } from '../types';
import { ChatSettingsPage } from './ChatSettingsPage';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SkillPathAdminProps {
  products: Product[];
  onUpdateProducts: (p: Product[]) => void;
  categories: Category[];
  onUpdateCategories: (c: Category[]) => void;
  orders: Order[];
  onUpdateOrders: (o: Order[]) => void;
  settings: StoreSettings;
  onUpdateSettings: (s: StoreSettings) => void;
  onExit: () => void;
  currentUser: User;
}

export const SkillPathAdmin: React.FC<SkillPathAdminProps> = ({ 
  onExit, currentUser, settings, orders, products, onUpdateSettings,
  categories, onUpdateCategories, onUpdateProducts, onUpdateOrders
}) => {
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  const menuGroups = [
    {
      title: 'Панели',
      items: [
        { id: 'Dashboard', label: 'Админ', icon: LayoutDashboard },
        { id: 'School', label: 'Школьная панель', icon: Globe, badge: 'New' },
        { id: 'Teacher', label: 'Панель учителя', icon: UserIcon },
        { id: 'Student', label: 'Панель студента', icon: Users },
      ]
    },
    {
      title: 'Страницы',
      items: [
        { id: 'Chats', label: 'Чаты', icon: MessageSquare, badge: '5' },
        { id: 'Email', label: 'Почта', icon: Mail, badge: '12' },
        { id: 'Orders', label: 'Заказы', icon: ShoppingBag },
        { id: 'Customers', label: 'Клиенты', icon: Users },
        { id: 'Products', label: 'Товары', icon: Package },
        { id: 'Analytics', label: 'Аналитика', icon: BarChart3 },
      ]
    },
    {
      title: 'Управление',
      items: [
        { id: 'ChatSettings', label: 'Настройки чата', icon: MessageCircle },
        { id: 'Settings', label: 'Настройки', icon: Settings },
        { id: 'Support', label: 'Поддержка', icon: LifeBuoy },
        { id: 'Notifications', label: 'Уведомления', icon: Bell },
        { id: 'Integrations', label: 'Интеграции', icon: Puzzle },
        { id: 'Roles', label: 'Роли и права', icon: ShieldCheck },
        { id: 'Logs', label: 'Логи', icon: ScrollText },
      ]
    }
  ];

  const chartData = [
    { name: 'Янв', value: 65, value2: 45 },
    { name: 'Фев', value: 85, value2: 60 },
    { name: 'Мар', value: 75, value2: 80 },
    { name: 'Апр', value: 95, value2: 55 },
    { name: 'Май', value: 80, value2: 70 },
    { name: 'Июн', value: 90, value2: 65 },
    { name: 'Июл', value: 85, value2: 75 },
    { name: 'Авг', value: 70, value2: 85 },
    { name: 'Сен', value: 80, value2: 60 },
    { name: 'Окт', value: 95, value2: 75 },
    { name: 'Ноя', value: 85, value2: 90 },
    { name: 'Дек', value: 90, value2: 70 },
  ];

  const SidebarItem = ({ item }: { item: any, key?: string }) => {
    const isActive = activeMenu === item.id;
    const Icon = item.icon;
    
    return (
      <button 
        onClick={() => setActiveMenu(item.id)}
        className={cn(
          "w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-200 group",
          isActive 
            ? "bg-[#6C5DD3] text-white shadow-lg shadow-indigo-500/20" 
            : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
        )}
      >
        <div className="flex items-center gap-3">
          <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-900")} />
          <span className="text-[13px] font-semibold">{item.label}</span>
        </div>
        {item.badge && (
          <span className={cn(
            "text-[10px] px-2 py-0.5 rounded-full font-bold",
            item.id === 'Chats' ? "bg-rose-500 text-white" : "bg-emerald-500 text-white"
          )}>
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  const renderDashboard = () => (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#6C5DD3] to-[#8062D6] rounded-[2rem] p-8 text-white relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center overflow-hidden border border-white/20">
              <img src={currentUser.avatar || `https://i.pravatar.cc/150?u=${currentUser.id}`} className="w-full h-full object-cover" alt="" />
            </div>
            <div>
              <h2 className="text-3xl font-black italic tracking-tight">С возвращением, {currentUser.name?.split(' ')[0] || 'User'} 👋</h2>
              <p className="text-white/80 text-sm mt-1 font-medium">Вот ваш прогресс за эту неделю!</p>
              <div className="flex gap-4 mt-4">
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Активный магазин</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">4 Ожидающих заказа</span>
                </div>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-2 border border-white/10">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <p className="text-2xl font-black italic">{(orders || []).length}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Заказы</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-2 border border-white/10">
                <Package className="w-6 h-6" />
              </div>
              <p className="text-2xl font-black italic">{(products || []).length}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Товары</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-2 border border-white/10">
                <Users className="w-6 h-6" />
              </div>
              <p className="text-2xl font-black italic">2.8k</p>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Клиенты</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Всего продаж', value: `${(orders || []).reduce((a,b)=>a+b.total,0).toLocaleString()} ${settings?.currency || '֏'}`, color: 'bg-[#FF6AC2]', progress: 75 },
          { label: 'Кол-во заказов', value: (orders || []).length, color: 'bg-[#9B51E0]', progress: 60 },
          { label: 'Новые клиенты', value: '124', color: 'bg-[#56CCF2]', progress: 92 },
          { label: 'Средний чек', value: '12.5k', color: 'bg-[#27AE60]', progress: 65 },
        ].map((stat, i) => (
          <div key={i} className={cn("rounded-[2rem] p-6 text-white relative overflow-hidden", stat.color)}>
            <div className="relative z-10">
              <p className="text-[11px] font-bold uppercase tracking-widest opacity-80">{stat.label}</p>
              <h3 className="text-3xl font-black italic mt-2">{stat.value}</h3>
              <div className="mt-6 flex items-center justify-between">
                <div className="w-full bg-white/20 h-1.5 rounded-full mr-4">
                  <div className="bg-white h-full rounded-full" style={{ width: `${stat.progress}%` }} />
                </div>
                <span className="text-xs font-black">{stat.progress}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Chart */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-black italic uppercase tracking-tight">Аналитика продаж</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Ежемесячный обзор производительности</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-colors">Неделя</button>
            <button className="px-4 py-2 bg-[#6C5DD3] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20">Месяц</button>
          </div>
        </div>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6C5DD3" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6C5DD3" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} dy={10} />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} 
                tickFormatter={(value) => isNaN(value) ? '0' : String(value)}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ fontSize: '12px', fontWeight: 800 }}
              />
              <Area type="monotone" dataKey="value" stroke="#6C5DD3" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
              <Area type="monotone" dataKey="value2" stroke="#27AE60" strokeWidth={4} fill="transparent" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
          <h3 className="text-xl font-black italic uppercase tracking-tight mb-6">Последние заказы</h3>
          <div className="space-y-4">
            {(orders || []).slice(0, 5).map((order, i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-[#6C5DD3] font-black text-xs">
                    #{order.orderNumber}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900">Клиент #{order.customerId.substring(0, 5)}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900">{order.total.toLocaleString()} {settings?.currency || '֏'}</p>
                  <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md">Оплачено</span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-4 bg-slate-50 text-slate-500 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-100 transition-colors">Посмотреть все заказы</button>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
          <h3 className="text-xl font-black italic uppercase tracking-tight mb-6">Топ товаров</h3>
          <div className="space-y-4">
            {(products || []).slice(0, 5).map((product, i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden p-2">
                    <img src={product.image} className="w-full h-full object-contain" alt="" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900 truncate max-w-[150px]">{product.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{product.brand}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900">{product.price.toLocaleString()} {settings?.currency || '֏'}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{product.stock} в наличии</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-4 bg-slate-50 text-slate-500 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-100 transition-colors">Управление запасами</button>
        </div>
      </div>
    </div>
  );

  const renderPlaceholder = (title: string) => (
    <div className="p-20 text-center animate-in fade-in duration-500">
      <div className="w-24 h-24 bg-slate-100 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
        <Database className="w-10 h-10 text-slate-300" />
      </div>
      <h2 className="text-3xl font-black italic uppercase tracking-tight text-slate-900">{title}</h2>
      <p className="text-slate-400 font-bold uppercase tracking-widest mt-4 max-w-md mx-auto leading-relaxed">
        Этот раздел готов к интеграции данных. Подключите ваши API-эндпоинты, чтобы наполнить эту страницу.
      </p>
      <button className="mt-10 px-10 py-4 bg-[#6C5DD3] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20 hover:scale-105 transition-all">
        Подключить API
      </button>
    </div>
  );

  const renderOrdersPage = () => (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black italic uppercase tracking-tight">Управление заказами</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Управляйте и отслеживайте заказы клиентов</p>
        </div>
        <button className="px-6 py-3 bg-[#6C5DD3] text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Создать заказ
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID Заказа</th>
                <th className="py-6 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Клиент</th>
                <th className="py-6 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Дата</th>
                <th className="py-6 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Итого</th>
                <th className="py-6 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Статус</th>
                <th className="py-6 px-8 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {(orders || []).map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-6 px-8">
                    <span className="text-sm font-black text-[#6C5DD3]">#{order.orderNumber}</span>
                  </td>
                  <td className="py-6 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 uppercase">
                        {order.customerId.substring(0, 2)}
                      </div>
                      <span className="text-sm font-bold text-slate-700">Клиент #{order.customerId.substring(0, 8)}</span>
                    </div>
                  </td>
                  <td className="py-6 px-6">
                    <span className="text-xs font-bold text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </td>
                  <td className="py-6 px-6">
                    <span className="text-sm font-black text-slate-900">{order.total.toLocaleString()} {settings?.currency || '֏'}</span>
                  </td>
                  <td className="py-6 px-6">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-100">
                      Оплачено
                    </span>
                  </td>
                  <td className="py-6 px-8 text-right">
                    <button className="p-2 text-slate-400 hover:text-[#6C5DD3] transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderProductsPage = () => (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black italic uppercase tracking-tight">Каталог товаров</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Управляйте запасами вашего магазина</p>
        </div>
        <button className="px-6 py-3 bg-[#6C5DD3] text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Добавить товар
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {(products || []).map((product) => (
          <div key={product.id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 group hover:shadow-xl transition-all duration-300">
            <div className="aspect-square bg-slate-50 rounded-2xl mb-4 p-4 flex items-center justify-center relative overflow-hidden">
              <img src={product.image} className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500" alt="" />
              <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 bg-white rounded-lg shadow-md text-slate-400 hover:text-[#6C5DD3] transition-colors">
                  <Settings className="w-4 h-4" />
                </button>
                <button className="p-2 bg-white rounded-lg shadow-md text-slate-400 hover:text-rose-500 transition-colors">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h4 className="text-sm font-black text-slate-900 line-clamp-1">{product.name}</h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{product.brand}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-lg font-black text-[#6C5DD3]">{product.price.toLocaleString()} {settings?.currency || '֏'}</span>
              <span className={cn(
                "text-[9px] font-black uppercase px-2 py-0.5 rounded-md",
                product.stock > 0 ? "bg-emerald-50 text-emerald-500" : "bg-rose-50 text-rose-500"
              )}>
                {product.stock > 0 ? `${product.stock} В наличии` : 'Нет в наличии'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCustomersPage = () => (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black italic uppercase tracking-tight">База клиентов</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Просматривайте и управляйте вашей базой пользователей</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Клиент</th>
              <th className="py-6 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</th>
              <th className="py-6 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Заказы</th>
              <th className="py-6 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Всего потрачено</th>
              <th className="py-6 px-8 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Статус</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {[
              { name: 'Ivan Ivanov', email: 'ivan@mail.ru', orders: 12, spent: 145000, vip: true },
              { name: 'Maria Sidorova', email: 'masha_99@gmail.com', orders: 2, spent: 4500, vip: false },
              { name: 'Alexey Petrov', email: 'alex@yandex.ru', orders: 45, spent: 890000, vip: true }
            ].map((c, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                <td className="py-6 px-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-black text-slate-500">
                      {c.name[0]}
                    </div>
                    <span className="text-sm font-black text-slate-900">{c.name}</span>
                  </div>
                </td>
                <td className="py-6 px-6 text-sm font-medium text-slate-500">{c.email}</td>
                <td className="py-6 px-6 text-sm font-black text-[#6C5DD3]">{c.orders}</td>
                <td className="py-6 px-6 text-sm font-black text-slate-900">{c.spent.toLocaleString()} {settings?.currency || '֏'}</td>
                <td className="py-6 px-8 text-right">
                  <span className={cn(
                    "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                    c.vip ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-slate-50 text-slate-500 border-slate-100"
                  )}>
                    {c.vip ? 'VIP' : 'Обычный'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAnalyticsPage = () => (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black italic uppercase tracking-tight">Продвинутая аналитика</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Глубокое погружение в производительность вашего магазина</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
          <h3 className="text-lg font-black italic uppercase mb-6">Рост выручки</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} 
                  tickFormatter={(value) => isNaN(value) ? '0' : String(value)}
                />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="value" stroke="#6C5DD3" strokeWidth={4} dot={{ r: 6, fill: '#6C5DD3', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
          <h3 className="text-lg font-black italic uppercase mb-6">Воронка продаж</h3>
          <div className="space-y-6">
            {[
              { label: 'Просмотры', value: '45k', p: 100, color: 'bg-slate-200' },
              { label: 'Корзина', value: '8.4k', p: 70, color: 'bg-indigo-200' },
              { label: 'Оформление', value: '3.2k', p: 45, color: 'bg-[#6C5DD3]' },
              { label: 'Оплачено', value: '1.1k', p: 25, color: 'bg-emerald-400' },
            ].map((f, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                  <span>{f.label}</span>
                  <span>{f.value}</span>
                </div>
                <div className="h-8 bg-slate-50 rounded-xl overflow-hidden relative">
                  <div className={cn("absolute inset-y-0 left-0 transition-all duration-1000", f.color)} style={{ width: `${f.p}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettingsPage = () => (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 max-w-4xl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black italic uppercase tracking-tight">Системные настройки</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Настройте предпочтения вашего магазина</p>
        </div>
        <button className="px-10 py-4 bg-[#6C5DD3] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20">
          Сохранить изменения
        </button>
      </div>

      <div className="space-y-8">
        <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 space-y-8">
          <h3 className="text-lg font-black italic uppercase border-b border-slate-50 pb-6">Общая информация</h3>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Название магазина</label>
              <input 
                type="text" 
                value={settings.storeName}
                onChange={(e) => onUpdateSettings({ ...settings, storeName: e.target.value })}
                className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold text-slate-900 focus:ring-4 focus:ring-indigo-500/5" 
              />
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Валюта</label>
              <select 
                value={settings.currency}
                onChange={(e) => onUpdateSettings({ ...settings, currency: e.target.value })}
                className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/5 appearance-none cursor-pointer"
              >
                <option value="AMD">AMD (Драмы)</option>
                <option value="RUB">RUB (Рубли)</option>
                <option value="USD">USD (Доллары)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 space-y-8">
          <h3 className="text-lg font-black italic uppercase border-b border-slate-50 pb-6">Дизайн и брендинг</h3>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Основной цвет</label>
              <div className="flex gap-4">
                <input 
                  type="color" 
                  value={settings.primaryColor}
                  onChange={(e) => onUpdateSettings({ ...settings, primaryColor: e.target.value })}
                  className="w-16 h-16 rounded-2xl border-none p-0 cursor-pointer bg-transparent" 
                />
                <input 
                  type="text" 
                  value={settings.primaryColor}
                  onChange={(e) => onUpdateSettings({ ...settings, primaryColor: e.target.value })}
                  className="flex-grow bg-slate-50 border-none rounded-2xl p-5 text-sm font-black uppercase text-slate-900" 
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Скругление углов</label>
              <input 
                type="text" 
                value={settings.borderRadius}
                onChange={(e) => onUpdateSettings({ ...settings, borderRadius: e.target.value })}
                className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold text-slate-900" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderChatsPage = () => (
    <div className="p-8 h-[calc(100vh-160px)] flex gap-8 animate-in fade-in duration-500">
      <div className="w-96 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col overflow-hidden">
        <div className="p-8 border-b border-slate-50">
          <h3 className="text-lg font-black italic uppercase">Диалоги</h3>
        </div>
        <div className="flex-grow overflow-y-auto divide-y divide-slate-50">
          {['Артем Смирнов', 'Мария Петрова', 'Олег Кот'].map((u, i) => (
            <div key={i} className={cn(
              "p-6 flex items-center gap-4 hover:bg-slate-50 cursor-pointer transition-colors",
              i === 0 ? "bg-indigo-50/50 border-r-4 border-[#6C5DD3]" : ""
            )}>
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-xs font-black text-slate-400">
                {u[0]}
              </div>
              <div className="flex-grow min-w-0">
                <p className="text-sm font-black text-slate-900 truncate">{u}</p>
                <p className="text-[11px] text-slate-400 font-bold truncate mt-0.5">Здравствуйте, когда доставка?</p>
              </div>
              <span className="text-[9px] font-black text-slate-300 uppercase">10:45</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-grow bg-white rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
              <UserIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-900">Артем Смирнов</p>
              <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">В сети</p>
            </div>
          </div>
          <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-grow p-8 space-y-6 overflow-y-auto">
          <div className="flex justify-start">
            <div className="bg-slate-100 p-5 rounded-[2rem] rounded-tl-none max-w-md text-sm font-medium text-slate-700">
              Здравствуйте! У меня вопрос по заказу #1024.
            </div>
          </div>
          <div className="flex justify-end">
            <div className="bg-[#6C5DD3] text-white p-5 rounded-[2rem] rounded-tr-none max-w-md text-sm font-medium">
              Добрый день, Артем! Я администратор Gisi Market. Слушаю вас.
            </div>
          </div>
        </div>
        <div className="p-8 border-t border-slate-50 flex gap-4">
          <input 
            type="text" 
            placeholder="Введите сообщение..." 
            className="flex-grow bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/5 text-slate-900" 
          />
          <button className="w-14 h-14 bg-[#6C5DD3] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all">
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderEmailPage = () => (
    <div className="p-8 h-[calc(100vh-160px)] flex gap-8 animate-in fade-in duration-500">
      <div className="w-80 space-y-6">
        <button className="w-full py-4 bg-[#6C5DD3] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" />
          Написать
        </button>
        <div className="bg-white rounded-[2.5rem] p-6 space-y-2 border border-slate-100 shadow-sm">
          {[
            { label: 'Входящие', count: 12, active: true },
            { label: 'Отправленные', count: 0 },
            { label: 'Черновики', count: 2 },
            { label: 'Корзина', count: 0, color: 'text-rose-500' },
          ].map((item, i) => (
            <button key={i} className={cn(
              "w-full flex items-center justify-between p-4 rounded-xl text-sm font-bold transition-all",
              item.active ? "bg-indigo-50 text-[#6C5DD3]" : "text-slate-400 hover:bg-slate-50 hover:text-slate-600",
              item.color
            )}>
              <span>{item.label}</span>
              {item.count > 0 && <span className="text-[10px] font-black">{item.count}</span>}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-grow bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-lg font-black italic uppercase">Входящие</h3>
          <div className="flex gap-2">
            <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors"><Search className="w-5 h-5" /></button>
            <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors"><MoreVertical className="w-5 h-5" /></button>
          </div>
        </div>
        <div className="flex-grow overflow-y-auto divide-y divide-slate-50">
          {[
            { from: 'Apple Support', subject: 'Новая поставка iPhone 16 Pro Max', time: '10:45', read: false },
            { from: 'Тинькофф Банк', subject: 'Еженедельный отчет по эквайрингу', time: 'Вчера', read: true },
            { from: 'Гагик Исаакян', subject: 'Запрос на оптовую скидку', time: '2 дня назад', read: false }
          ].map((m, i) => (
            <div key={i} className={cn(
              "p-8 hover:bg-slate-50 cursor-pointer transition-colors flex items-center justify-between group",
              !m.read ? "bg-indigo-50/30" : ""
            )}>
              <div className="flex items-center gap-6">
                <div className={cn("w-3 h-3 rounded-full", !m.read ? "bg-[#6C5DD3]" : "bg-slate-200")} />
                <div>
                  <p className={cn("text-sm font-black", !m.read ? "text-slate-900" : "text-slate-500")}>{m.from}</p>
                  <p className="text-xs text-slate-400 font-medium mt-1">{m.subject}</p>
                </div>
              </div>
              <span className="text-[10px] font-black text-slate-300 uppercase">{m.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const [hasApiKey, setHasApiKey] = useState(false);

  React.useEffect(() => {
    const checkKey = async () => {
      // @ts-ignore
      if (window.aistudio?.hasSelectedApiKey) {
        // @ts-ignore
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(selected);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    // @ts-ignore
    if (window.aistudio?.openSelectKey) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
    }
  };

  const renderIntegrationsPage = () => (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black italic uppercase tracking-tight text-slate-900">Интеграции</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 space-y-6">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
            <Zap className="w-8 h-8 text-[#6C5DD3]" />
          </div>
          <h3 className="text-xl font-black italic uppercase">Gemini API (Платный ключ)</h3>
          <p className="text-slate-500 font-medium leading-relaxed">
            Подключите ваш платный API-ключ Google Cloud для использования продвинутых моделей ИИ, генерации видео (Veo) и высококачественных изображений.
          </p>
          
          <div className={cn(
            "p-6 rounded-2xl border flex items-center justify-between",
            hasApiKey ? "bg-emerald-50 border-emerald-100" : "bg-slate-50 border-slate-100"
          )}>
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-3 h-3 rounded-full animate-pulse",
                hasApiKey ? "bg-emerald-500" : "bg-amber-500"
              )} />
              <span className="text-sm font-bold uppercase tracking-widest">
                {hasApiKey ? "Ключ подключен" : "Ключ не выбран"}
              </span>
            </div>
            <button 
              onClick={handleSelectKey}
              className={cn(
                "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                hasApiKey 
                  ? "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50" 
                  : "bg-[#6C5DD3] text-white shadow-lg shadow-indigo-500/20 hover:scale-105"
              )}
            >
              {hasApiKey ? "Изменить ключ" : "Выбрать ключ"}
            </button>
          </div>

          <div className="pt-4 border-t border-slate-50">
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[10px] font-black text-[#6C5DD3] uppercase tracking-widest hover:underline"
            >
              Документация по биллингу →
            </a>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 space-y-6 opacity-50 grayscale pointer-events-none">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
            <CreditCard className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-black italic uppercase">Stripe</h3>
          <p className="text-slate-500 font-medium leading-relaxed">
            Принимайте платежи по всему миру с помощью интеграции Stripe. (Скоро)
          </p>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeMenu) {
      case 'Dashboard': return renderDashboard();
      case 'Chats': return renderChatsPage();
      case 'Email': return renderEmailPage();
      case 'Orders': return renderOrdersPage();
      case 'Customers': return renderCustomersPage();
      case 'Products': return renderProductsPage();
      case 'Analytics': return renderAnalyticsPage();
      case 'Integrations': return renderIntegrationsPage();
      case 'ChatSettings': return <ChatSettingsPage settings={settings} onUpdateSettings={onUpdateSettings} />;
      case 'Settings': return renderSettingsPage();
      default: return renderPlaceholder(activeMenu);
    }
  };

  return (
    <div className="fixed inset-0 flex bg-[#F0F3F8] z-[2000] font-['Inter'] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[280px] bg-white border-r border-slate-100 flex flex-col shrink-0">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#6C5DD3] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20">
            S
          </div>
          <h1 className="text-2xl font-black tracking-tighter italic">SkillPath</h1>
        </div>

        <div className="flex-grow overflow-y-auto px-4 py-4 space-y-8 hide-scrollbar">
          {menuGroups.map((group, i) => (
            <div key={i} className="space-y-2">
              <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">{group.title}</p>
              {group.items.map(item => <SidebarItem key={item.id} item={item} />)}
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-slate-100">
          <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl overflow-hidden">
              <img src={currentUser.avatar || `https://i.pravatar.cc/150?u=${currentUser.id}`} className="w-full h-full object-cover" alt="" />
            </div>
            <div className="flex-grow min-w-0">
              <p className="text-xs font-black text-slate-900 truncate">{currentUser.name}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">Админ</p>
            </div>
            <button onClick={onExit} className="text-slate-400 hover:text-rose-500 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center justify-between px-2">
            <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors" title="Настройки"><Settings className="w-4 h-4" /></button>
            <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors" title="Поддержка"><HelpCircle className="w-4 h-4" /></button>
            <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors" title="Сайт"><Globe className="w-4 h-4" /></button>
            <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors" title="Дизайн"><Palette className="w-4 h-4" /></button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-20 bg-white border-b border-slate-100 px-8 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-4 flex-grow max-w-xl">
            <div className="relative w-full">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Искать что угодно..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/5 outline-none text-slate-900 placeholder:text-slate-400" 
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-all relative">
                <BellRing className="w-5 h-5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
              </button>
              <button className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-all">
                <Mail className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-all">
                <Zap className="w-5 h-5" />
              </button>
            </div>
            <div className="h-8 w-px bg-slate-100" />
            <div className="flex items-center gap-4 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-900">{currentUser.name}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Админ-панель</p>
              </div>
              <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-slate-50 group-hover:border-[#6C5DD3] transition-all">
                <img src={currentUser.avatar || `https://i.pravatar.cc/150?u=${currentUser.id}`} className="w-full h-full object-cover" alt="" />
              </div>
            </div>
          </div>
        </header>

        {/* Viewport */}
        <div className="flex-grow overflow-y-auto hide-scrollbar">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};
