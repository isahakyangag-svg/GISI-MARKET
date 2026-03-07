
import React, { useState, useRef } from 'react';
import { User, Order, Product, StoreSettings, Language } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User as UserIcon, 
  Package, 
  Heart, 
  CreditCard, 
  Wallet, 
  Settings, 
  LogOut, 
  Camera,
  ChevronRight,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle
} from 'lucide-react';

interface ProfilePageProps {
  user: User;
  orders: Order[];
  products: Product[];
  wishlist: string[];
  settings: StoreSettings;
  language: Language;
  onUpdateUser: (user: User) => void;
  onLogout: () => void;
  onBack: () => void;
  onViewProduct: (product: Product) => void;
}

type ProfileTab = 'overview' | 'orders' | 'wishlist' | 'cards' | 'settings';

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  orders,
  products,
  wishlist,
  settings,
  language,
  onUpdateUser,
  onLogout,
  onBack,
  onViewProduct
}) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<User>>(user);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userOrders = orders.filter(o => o.customerId === user.id || o.customerEmail === user.email);
  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  const handleSaveProfile = () => {
    onUpdateUser({ ...user, ...editData });
    setIsEditing(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateUser({ ...user, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'shipped': return <Truck className="w-4 h-4 text-blue-500" />;
      case 'created': return <Clock className="w-4 h-4 text-amber-500" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4 text-rose-500" />;
      default: return <Package className="w-4 h-4 text-slate-400" />;
    }
  };

  const tabs = [
    { id: 'overview', label: 'Обзор', icon: UserIcon },
    { id: 'orders', label: 'Заказы', icon: Package, count: userOrders.length },
    { id: 'wishlist', label: 'Избранное', icon: Heart, count: wishlistProducts.length },
    { id: 'cards', label: 'Карты', icon: CreditCard },
    { id: 'settings', label: 'Настройки', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 pt-20 pb-20 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
        >
          <ChevronRight className="w-4 h-4 rotate-180" /> Назад в магазин
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className="relative group mb-6">
                <div className="w-32 h-32 rounded-[2.5rem] bg-slate-100 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center text-4xl font-black text-[#6C5DD3]">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user.name[0]
                  )}
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-10 h-10 bg-[#6C5DD3] text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                >
                  <Camera className="w-5 h-5" />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleAvatarChange} 
                />
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">{user.name}</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{user.email}</p>
              
              <div className="mt-8 w-full p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Wallet className="w-5 h-5 text-emerald-500" />
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Кэшбэк</span>
                </div>
                <span className="text-lg font-black text-emerald-600">{(user.cashback || 0).toLocaleString()} {settings.currency}</span>
              </div>

              <button 
                onClick={onLogout}
                className="mt-8 w-full flex items-center justify-center gap-3 py-4 text-rose-500 font-black text-[11px] uppercase tracking-widest hover:bg-rose-50 rounded-2xl transition-colors"
              >
                <LogOut className="w-4 h-4" /> Выйти
              </button>
            </div>

            <nav className="bg-white rounded-[2.5rem] p-4 shadow-sm border border-slate-100 space-y-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ProfileTab)}
                  className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all ${
                    activeTab === tab.id 
                      ? 'bg-[#6C5DD3] text-white shadow-lg shadow-indigo-500/20' 
                      : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <tab.icon className="w-5 h-5" />
                    <span className="text-[11px] font-black uppercase tracking-widest">{tab.label}</span>
                  </div>
                  {tab.count !== undefined && (
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${
                      activeTab === tab.id ? 'bg-white/20' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-slate-100 min-h-[600px]"
              >
                {activeTab === 'overview' && (
                  <div className="space-y-12">
                    <div className="flex justify-between items-center">
                      <h3 className="text-3xl font-black text-slate-900 italic uppercase tracking-tight">Личные данные</h3>
                      <button 
                        onClick={() => setIsEditing(!isEditing)}
                        className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-colors"
                      >
                        {isEditing ? 'Отмена' : 'Редактировать'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Имя</label>
                        {isEditing ? (
                          <input 
                            type="text" 
                            value={editData.name || ''} 
                            onChange={e => setEditData({ ...editData, name: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold outline-none focus:ring-2 focus:ring-[#6C5DD3]"
                          />
                        ) : (
                          <div className="bg-slate-50 rounded-2xl p-5 text-sm font-bold text-slate-900">{user.name}</div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Фамилия</label>
                        {isEditing ? (
                          <input 
                            type="text" 
                            value={editData.surname || ''} 
                            onChange={e => setEditData({ ...editData, surname: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold outline-none focus:ring-2 focus:ring-[#6C5DD3]"
                          />
                        ) : (
                          <div className="bg-slate-50 rounded-2xl p-5 text-sm font-bold text-slate-900">{user.surname || '—'}</div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Телефон</label>
                        {isEditing ? (
                          <input 
                            type="tel" 
                            value={editData.phone || ''} 
                            onChange={e => setEditData({ ...editData, phone: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold outline-none focus:ring-2 focus:ring-[#6C5DD3]"
                          />
                        ) : (
                          <div className="bg-slate-50 rounded-2xl p-5 text-sm font-bold text-slate-900">{user.phone || '—'}</div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Email</label>
                        <div className="bg-slate-50 rounded-2xl p-5 text-sm font-bold text-slate-400">{user.email}</div>
                      </div>
                    </div>

                    {isEditing && (
                      <button 
                        onClick={handleSaveProfile}
                        className="w-full py-5 bg-[#6C5DD3] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-indigo-500/20"
                      >
                        Сохранить изменения
                      </button>
                    )}

                    <div className="pt-12 border-t border-slate-100">
                      <h4 className="text-xl font-black text-slate-900 italic uppercase tracking-tight mb-8">Последние заказы</h4>
                      <div className="space-y-4">
                        {userOrders.slice(0, 3).map(order => (
                          <div key={order.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-[#6C5DD3]/20 transition-colors">
                            <div className="flex items-center gap-6">
                              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                {getStatusIcon(order.status)}
                              </div>
                              <div>
                                <p className="text-sm font-black text-slate-900 tracking-tight">Заказ #{order.orderNumber}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-black text-slate-900 tracking-tighter">{order.total.toLocaleString()} {settings.currency}</p>
                              <p className={`text-[9px] font-black uppercase tracking-widest ${order.status === 'completed' ? 'text-emerald-500' : 'text-amber-500'}`}>{order.status}</p>
                            </div>
                          </div>
                        ))}
                        {userOrders.length === 0 && (
                          <p className="text-center py-12 text-slate-300 font-black uppercase tracking-widest text-xs">Заказов пока нет</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'orders' && (
                  <div className="space-y-10">
                    <h3 className="text-3xl font-black text-slate-900 italic uppercase tracking-tight">История заказов</h3>
                    <div className="space-y-6">
                      {userOrders.map(order => (
                        <div key={order.id} className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                          <div className="p-8 bg-slate-50/50 flex flex-wrap justify-between items-center gap-6 border-b border-slate-100">
                            <div className="flex items-center gap-6">
                              <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Заказ</p>
                                <p className="text-lg font-black text-slate-900 tracking-tight">#{order.orderNumber}</p>
                              </div>
                              <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Дата</p>
                                <p className="text-sm font-bold text-slate-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-8">
                              <div className="text-right">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Сумма</p>
                                <p className="text-xl font-black text-[#6C5DD3] tracking-tighter">{order.total.toLocaleString()} {settings.currency}</p>
                              </div>
                              <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                                order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                order.status === 'cancelled' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                                'bg-amber-500/10 text-amber-500 border-amber-500/20'
                              }`}>
                                {order.status}
                              </div>
                            </div>
                          </div>
                          <div className="p-8 space-y-4">
                            {order.items.map((item, idx) => {
                              const product = products.find(p => p.id === item.productId);
                              return (
                                <div key={idx} className="flex items-center justify-between">
                                  <div className="flex items-center gap-4">
                                    <img src={product?.image || undefined} className="w-12 h-12 rounded-xl object-cover border border-slate-100" />
                                    <div>
                                      <p className="text-sm font-bold text-slate-900">{product?.name || 'Товар удален'}</p>
                                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.quantity} шт.</p>
                                    </div>
                                  </div>
                                  <p className="text-sm font-black text-slate-900">{(item.quantity * item.price).toLocaleString()} {settings.currency}</p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                      {userOrders.length === 0 && (
                        <div className="text-center py-32 space-y-6">
                          <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto text-slate-200">
                            <Package className="w-10 h-10" />
                          </div>
                          <p className="text-slate-400 font-black uppercase tracking-widest text-xs">У вас пока нет заказов</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'wishlist' && (
                  <div className="space-y-10">
                    <h3 className="text-3xl font-black text-slate-900 italic uppercase tracking-tight">Избранное</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {wishlistProducts.map(product => (
                        <div 
                          key={product.id} 
                          className="bg-white rounded-[2.5rem] p-6 border border-slate-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group cursor-pointer"
                          onClick={() => onViewProduct(product)}
                        >
                          <div className="aspect-square bg-slate-50 rounded-[2rem] p-6 mb-6 flex items-center justify-center relative overflow-hidden">
                            <img 
                              src={product.image || undefined} 
                              alt={product.name} 
                              className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" 
                            />
                            <div className="absolute top-4 right-4">
                              <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-rose-500 shadow-sm">
                                <Heart className="w-5 h-5 fill-current" />
                              </div>
                            </div>
                          </div>
                          <h4 className="font-black text-slate-900 tracking-tight line-clamp-2 mb-2">{product.name}</h4>
                          <p className="text-xl font-black text-[#6C5DD3] tracking-tighter">{product.price.toLocaleString()} {settings.currency}</p>
                        </div>
                      ))}
                      {wishlistProducts.length === 0 && (
                        <div className="col-span-full text-center py-32 space-y-6">
                          <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto text-slate-200">
                            <Heart className="w-10 h-10" />
                          </div>
                          <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Список желаемого пуст</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'cards' && (
                  <div className="space-y-10">
                    <div className="flex justify-between items-center">
                      <h3 className="text-3xl font-black text-slate-900 italic uppercase tracking-tight">Мои карты</h3>
                      <button className="px-6 py-3 bg-[#6C5DD3] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20">
                        + Добавить карту
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="aspect-[1.6/1] bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-10 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
                        <div className="flex justify-between items-start relative z-10">
                          <div className="w-12 h-10 bg-amber-400/20 rounded-lg border border-amber-400/30 flex items-center justify-center">
                            <div className="w-8 h-6 bg-amber-400/40 rounded-md" />
                          </div>
                          <span className="text-2xl font-black italic opacity-50 uppercase tracking-tighter">VISA</span>
                        </div>
                        <div className="relative z-10">
                          <p className="text-2xl font-black tracking-[0.2em] mb-6">•••• •••• •••• 4242</p>
                          <div className="flex justify-between items-end">
                            <div>
                              <p className="text-[8px] font-black uppercase tracking-widest opacity-40 mb-1">Владелец</p>
                              <p className="text-sm font-bold uppercase tracking-widest">{user.name}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[8px] font-black uppercase tracking-widest opacity-40 mb-1">Срок</p>
                              <p className="text-sm font-bold">12/26</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="aspect-[1.6/1] border-4 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-300 hover:border-[#6C5DD3]/20 hover:text-[#6C5DD3] transition-all cursor-pointer group">
                        <div className="w-16 h-16 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <CreditCard className="w-8 h-8" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest">Добавить новый способ оплаты</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="space-y-12">
                    <h3 className="text-3xl font-black text-slate-900 italic uppercase tracking-tight">Настройки аккаунта</h3>
                    
                    <div className="space-y-8">
                      <div className="flex items-center justify-between p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-400">
                            <BellRing className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900 tracking-tight">Уведомления</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Получать новости и акции</p>
                          </div>
                        </div>
                        <div className="w-14 h-8 bg-[#6C5DD3] rounded-full p-1 flex items-center justify-end cursor-pointer">
                          <div className="w-6 h-6 bg-white rounded-full shadow-sm" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-400">
                            <ShieldCheck className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900 tracking-tight">Безопасность</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Двухфакторная аутентификация</p>
                          </div>
                        </div>
                        <div className="w-14 h-8 bg-slate-200 rounded-full p-1 flex items-center justify-start cursor-pointer">
                          <div className="w-6 h-6 bg-white rounded-full shadow-sm" />
                        </div>
                      </div>
                    </div>

                    <div className="pt-12 border-t border-slate-100">
                      <button className="w-full py-5 border-2 border-rose-500/20 text-rose-500 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">
                        Удалить аккаунт
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

import { BellRing, ShieldCheck } from 'lucide-react';
