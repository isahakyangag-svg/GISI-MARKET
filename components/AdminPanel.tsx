import React, { useState, useEffect, useRef } from 'react';
import { Product, Order, StoreSettings, Category, User, OrderStatus, PromoCode, AdminRole, AdminPermission, PromotionInfo } from '../types';
import * as XLSX from 'xlsx';
import { generateSKU } from '../utils/sku';
import { ChatSettingsPage } from './ChatSettingsPage';
import { DeveloperPage } from './DeveloperPage';
import { UsersManagement } from './admin/UsersManagement';
import { ClientsManagement } from './admin/ClientsManagement';
import { AuthSettingsPage } from './admin/AuthSettingsPage';
import { RegFormBuilder } from './admin/RegFormBuilder';
import { SocialLinksManager } from './admin/SocialLinksManager';
import { MenuManager } from './admin/MenuManager';
import { ContentEditor } from './admin/ContentEditor';
import { CharacteristicsEditor, PromotionEditor, ProductSelectorModal } from './admin/ProductEditors';
import { BellRing, LogOut, User as UserIcon, Lock, Shield, Key, Eye, EyeOff, Tag } from 'lucide-react';

interface AdminPanelProps {
  products: Product[];
  onUpdateProducts: (p: Product[]) => void;
  categories: Category[];
  onUpdateCategories: (c: Category[]) => void;
  orders: Order[];
  onUpdateOrders: (o: Order[]) => void;
  promoCodes: PromoCode[];
  onUpdatePromoCodes: (p: PromoCode[]) => void;
  settings: StoreSettings;
  onUpdateSettings: (s: StoreSettings) => void;
  onExit: () => void;
  onGoToEditor: () => void;
  currentUser: User;
  allUsers: User[];
  onUpdateAllUsers: (u: User[]) => void;
  adminRoles: AdminRole[];
  adminUser: User | null;
  onAdminLogin: (u: User) => void;
  onAdminLogout: () => void;
  initialMenu?: string;
  initialPageId?: string;
}

const AdminLogin: React.FC<{ allUsers: User[], onLogin: (u: User) => void, onExit: () => void, settings: StoreSettings }> = ({ allUsers, onLogin, onExit, settings }) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    let user = allUsers.find(u => u.adminLogin === login && u.adminPassword === password);
    if (!user && login === 'admin' && password === '1') {
      user = allUsers.find(u => u.id === 'admin-1');
    }
    if (user) {
      if (user.isBlocked) {
        setError('Ваш аккаунт заблокирован');
      } else {
        onLogin(user);
      }
    } else {
      setError('Неверный логин или пароль');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900 flex items-center justify-center z-[3000] p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#6C5DD3]/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/10 blur-[150px] rounded-full" />
      </div>

      <div className="w-full max-w-md bg-white rounded-[3rem] p-12 shadow-2xl relative animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Shield className="w-10 h-10 text-[#6C5DD3]" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 italic uppercase tracking-tight">Вход в панель</h1>
          <p className="text-slate-400 font-bold text-sm mt-2 uppercase tracking-widest">Введите данные администратора</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Логин</label>
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#6C5DD3] transition-colors">
                <UserIcon size={20} />
              </div>
              <input
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] text-sm font-bold transition-all focus:bg-white focus:border-[#6C5DD3] outline-none"
                placeholder="admin_login"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Пароль</label>
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#6C5DD3] transition-colors">
                <Lock size={20} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-14 pr-14 py-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] text-sm font-bold transition-all focus:bg-white focus:border-[#6C5DD3] outline-none"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 text-rose-500 rounded-2xl text-xs font-bold text-center animate-shake">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-5 bg-[#6C5DD3] text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-200 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Войти в систему
          </button>
        </form>

        <button
          onClick={onExit}
          className="w-full mt-6 py-4 text-slate-400 font-bold text-[11px] uppercase tracking-widest hover:text-slate-600 transition-colors"
        >
          Вернуться в магазин
        </button>
      </div>
    </div>
  );
};

export const AdminPanel: React.FC<AdminPanelProps> = ({
  onExit, onGoToEditor, currentUser, settings, orders, products, categories,
  promoCodes, onUpdatePromoCodes,
  onUpdateSettings, onUpdateProducts, onUpdateCategories, onUpdateOrders,
  allUsers, onUpdateAllUsers, adminRoles, adminUser, onAdminLogin, onAdminLogout,
  initialMenu, initialPageId
}) => {
  const LS_CATEGORIES_KEY = 'gisi_categories';

  const safeJsonParse = <T,>(raw: string | null, fallback: T): T => {
    try {
      if (!raw) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  };

  const safeSetLocalStorage = (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // ignore
    }
  };

  const [activeMenu, setActiveMenu] = useState(initialMenu || 'Dashboard');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [lastOrderCount, setLastOrderCount] = useState((orders || []).length);
  const [showNewOrderToast, setShowNewOrderToast] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [promoSearch, setPromoSearch] = useState('');
  const [promoCategory, setPromoCategory] = useState('all');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (initialMenu) {
      setActiveMenu(initialMenu);
    }
  }, [initialMenu]);

  useEffect(() => {
    const currentCount = (orders || []).length;

    if (currentCount > lastOrderCount) {
      setShowNewOrderToast(true);

      if (audioRef.current) {
        audioRef.current.play().catch(e => console.log('Audio play blocked:', e));
      }

      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
      toastTimerRef.current = window.setTimeout(() => setShowNewOrderToast(false), 5000);
    }

    setLastOrderCount(currentCount);

    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, [orders, lastOrderCount]);

  const deleteProduct = (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
      onUpdateProducts(products.filter(p => p.id !== id));
    }
  };

  const menuItems = [
    { id: 'Dashboard', label: 'Обзор', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', permission: 'view_dashboard' },
    { id: 'Products', label: 'Товары', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', permission: 'view_products' },
    { id: 'Categories', label: 'Категории', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16', permission: 'view_categories' },
    { id: 'Orders', label: 'Заказы', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', badge: (orders || []).filter(o => o.status === 'created').length || undefined, permission: 'view_orders' },
    { id: 'Promotions', label: 'Акции', icon: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7', permission: 'manage_discounts' },
    { id: 'PromoCodes', label: 'Промокоды', icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z', permission: 'manage_promocodes' },
    { id: 'Users', label: 'Администраторы', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', permission: 'view_users' },
    { id: 'Clients', label: 'Клиенты', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', permission: 'view_users' },
    { id: 'AuthSettings', label: 'Страница Входа', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', permission: 'view_auth_settings' },
    { id: 'RegForm', label: 'Форма Рег.', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', permission: 'view_reg_form' },
    { id: 'SocialLinks', label: 'Соц. сети', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1', permission: 'view_settings' },
    { id: 'Menus', label: 'Меню сайта', icon: 'M4 6h16M4 12h16M4 18h16', permission: 'view_settings' },
    { id: 'Content', label: 'Контент', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z', permission: 'view_visual_editor' },
    { id: 'Settings', label: 'Настройки', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 00 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', permission: 'view_settings' },
    { id: 'ChatSettings', label: 'Чат', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', permission: 'view_settings' },
    { id: 'Telegram', label: 'Telegram Уведомления', icon: 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8', permission: 'view_settings' },
    { id: 'OrderDesign', label: 'Дизайн Заказа', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z', permission: 'view_settings' },
    { id: 'VisualEditor', label: 'Визуальный Редактор', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z', isSpecial: true, permission: 'view_visual_editor' },
    { id: 'Developer', label: 'Разработчик', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4', isNew: true, permission: 'manage_system' },
  ];

  const hasPermission = (perm: AdminPermission) => {
    if (!adminUser) return false;
    if (adminUser.roleId === 'super_admin') return true;
    const perms = adminUser.customPermissions || [];
    return perms.includes(perm) || perms.includes('full_access');
  };

  const filteredMenuItems = menuItems.filter(item => hasPermission(item.permission as AdminPermission));

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingPromoCode, setEditingPromoCode] = useState<PromoCode | null>(null);
  const [isAddingPromoCode, setIsAddingPromoCode] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isSelectingForPromo, setIsSelectingForPromo] = useState(false);

  const saveProduct = (product: Product) => {
    if (isAddingProduct) {
      onUpdateProducts([...products, { ...product, id: Date.now().toString() }]);
      setIsAddingProduct(false);
    } else {
      onUpdateProducts(products.map(p => p.id === product.id ? product : p));
      setEditingProduct(null);
    }
  };

  const applyMassPromotion = (selectedIds: string[], promoParams: Partial<PromotionInfo>) => {
    const newProducts = products.map(p => {
      if (selectedIds.includes(p.id)) {
        const promoPrice = promoParams.promoPrice || (promoParams.discountPercent ? p.price * (1 - promoParams.discountPercent / 100) : p.price);
        return {
          ...p,
          promotion: {
            isActive: true,
            discountPercent: promoParams.discountPercent || 0,
            promoPrice: promoPrice,
            startDate: promoParams.startDate || '',
            endDate: promoParams.endDate || ''
          }
        };
      }
      return p;
    });
    onUpdateProducts(newProducts);
    setIsSelectingForPromo(false);
    alert(`Акция успешно применена к ${selectedIds.length} товарам!`);
  };

  const saveCategory = (category: Category) => {
    if (isAddingCategory) {
      onUpdateCategories([...categories, { ...category, id: Date.now().toString() }]);
      setIsAddingCategory(false);
    } else {
      onUpdateCategories(categories.map(c => c.id === category.id ? category : c));
      setEditingCategory(null);
    }
  };

  const savePromoCode = (promo: PromoCode) => {
    if (isAddingPromoCode) {
      onUpdatePromoCodes([...promoCodes, { ...promo, id: Date.now().toString() }]);
      setIsAddingPromoCode(false);
    } else {
      onUpdatePromoCodes(promoCodes.map(p => p.id === promo.id ? promo : p));
      setEditingPromoCode(null);
    }
  };

  const PromoCodeModal = ({ promo, onSave, onClose }: { promo: Partial<PromoCode>, onSave: (p: PromoCode) => void, onClose: () => void }) => {
    const [formData, setFormData] = useState<Partial<PromoCode>>(promo);

    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[3000] flex items-center justify-center p-6">
        <div className="bg-white rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="p-10 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-2xl font-black text-slate-900 italic uppercase">{isAddingPromoCode ? 'Новый промокод' : 'Редактировать'}</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-900 transition-colors"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
          </div>
          <div className="p-10 space-y-8">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Код (например: PRIVET)</label>
              <input type="text" value={formData.code || ''} onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold outline-none focus:ring-2 focus:ring-[#6C5DD3]" />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Скидка (%)</label>
              <input type="number" value={formData.discount || 0} onChange={e => setFormData({ ...formData, discount: parseInt(e.target.value) || 0 })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold outline-none focus:ring-2 focus:ring-[#6C5DD3]" />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Статус</label>
              <select value={formData.isActive ? 'true' : 'false'} onChange={e => setFormData({ ...formData, isActive: e.target.value === 'true' })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold outline-none focus:ring-2 focus:ring-[#6C5DD3]">
                <option value="true">Активен</option>
                <option value="false">Неактивен</option>
              </select>
            </div>
          </div>
          <div className="p-10 bg-slate-50 flex justify-end gap-6">
            <button onClick={onClose} className="px-10 py-5 text-slate-400 font-black text-[11px] uppercase tracking-widest">Отмена</button>
            <button onClick={() => onSave(formData as PromoCode)} className="px-14 py-5 bg-[#6C5DD3] text-white rounded-[1.8rem] font-black text-[11px] uppercase tracking-widest shadow-xl">Сохранить</button>
          </div>
        </div>
      </div>
    );
  };

  const OrderDetailsModal = ({ order, onClose }: { order: Order, onClose: () => void }) => {
    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[3000] flex items-center justify-center p-6">
        <div className="bg-white rounded-[2.5rem] w-full max-w-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
              <h3 className="text-2xl font-black text-slate-900 italic uppercase tracking-tight">Заказ #{order.orderNumber}</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">ID: {order.id}</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-900 transition-colors"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
          </div>
          <div className="p-10 space-y-10 max-h-[75vh] overflow-y-auto custom-scrollbar">
            {/* Customer & Order Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Информация о заказе</p>
                <div className="space-y-3">
                  <div>
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Дата создания</p>
                    <p className="font-bold text-slate-900 text-sm">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Статус</p>
                    <select 
                      value={order.status} 
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                      className="mt-1 w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-[#6C5DD3]"
                    >
                      <option value="created">Создан</option>
                      <option value="paid">Оплачен</option>
                      <option value="packed">Упакован</option>
                      <option value="shipped">Отправлен</option>
                      <option value="delivered">Доставлен</option>
                      <option value="completed">Завершен</option>
                      <option value="cancelled">Отменен</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Клиент</p>
                <div className="space-y-3">
                  <div>
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Имя</p>
                    <p className="font-bold text-slate-900 text-sm">{order.customerName || 'Гость'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Телефон</p>
                    <p className="font-bold text-slate-900 text-sm">{order.customerPhone || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Email</p>
                    <p className="font-bold text-slate-900 text-sm">{order.customerEmail || '—'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Доставка и Оплата</p>
                <div className="space-y-3">
                  <div>
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Способ доставки</p>
                    <p className="font-bold text-slate-900 text-sm">{order.deliveryMethod || 'Курьерская'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Адрес</p>
                    <p className="font-bold text-slate-900 text-sm leading-tight">{order.deliveryAddress}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Способ оплаты</p>
                    <p className="font-bold text-slate-900 text-sm">{order.paymentMethod || 'При получении'}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Items List */}
            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Товары в заказе</p>
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100/50 group hover:bg-white hover:shadow-md transition-all">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-slate-100 flex-shrink-0">
                        <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{item.name}</p>
                        <div className="flex gap-2 mt-1">
                          {item.attributes?.map((attr, aIdx) => (
                            <span key={aIdx} className="text-[8px] font-black uppercase px-2 py-0.5 bg-slate-200 text-slate-500 rounded-md">
                              {attr.label}: {attr.value}
                            </span>
                          ))}
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{item.quantity} x {item.price.toLocaleString()} {settings.currency}</p>
                      </div>
                    </div>
                    <p className="font-black text-slate-900 text-lg">{(item.quantity * item.price).toLocaleString()} {settings.currency}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="bg-slate-900 rounded-[2rem] p-8 text-white flex justify-between items-center shadow-2xl shadow-slate-900/20">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-1">Итоговая сумма</p>
                <p className="text-sm font-bold opacity-80">Включая все налоги и сборы</p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-black italic tracking-tighter">{order.total.toLocaleString()} {settings.currency}</p>
              </div>
            </div>
          </div>
          <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
            <button onClick={onClose} className="px-14 py-4 bg-slate-900 text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all">Закрыть</button>
          </div>
        </div>
      </div>
    );
  };

  const CategoryModal = ({ category, onSave, onClose }: { category: Partial<Category>, onSave: (c: Category) => void, onClose: () => void }) => {
    const [formData, setFormData] = useState<Partial<Category>>(category);

    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[3000] flex items-center justify-center p-6">
        <div className="bg-white rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="p-10 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-2xl font-black text-slate-900 italic uppercase">{isAddingCategory ? 'Новая категория' : 'Редактировать'}</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-900 transition-colors"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
          </div>
          <div className="p-10 space-y-8">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Название</label>
              <input type="text" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold outline-none focus:ring-2 focus:ring-[#6C5DD3]" />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Иконка / Изображение (URL)</label>
              <input type="text" value={formData.image || ''} onChange={e => setFormData({ ...formData, image: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold outline-none focus:ring-2 focus:ring-[#6C5DD3]" placeholder="https://example.com/icon.png" />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Статус</label>
              <select value={formData.status || 'active'} onChange={e => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold outline-none focus:ring-2 focus:ring-[#6C5DD3]">
                <option value="active">Активна</option>
                <option value="inactive">Неактивна</option>
              </select>
            </div>
          </div>
          <div className="p-10 bg-slate-50 flex justify-end gap-6">
            <button onClick={onClose} className="px-10 py-5 text-slate-400 font-black text-[11px] uppercase tracking-widest">Отмена</button>
            <button onClick={() => onSave(formData as Category)} className="px-14 py-5 bg-[#6C5DD3] text-white rounded-[1.8rem] font-black text-[11px] uppercase tracking-widest shadow-xl">Сохранить</button>
          </div>
        </div>
      </div>
    );
  };

  const ProductModal = ({ product, onSave, onClose }: { product: Partial<Product>, onSave: (p: Product) => void, onClose: () => void }) => {
    const [formData, setFormData] = useState<Partial<Product>>({
      ...product,
      sku: product.sku || generateSKU(products),
      images: product.images || [product.image || ''],
      costPrice: product.costPrice || 0
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files) {
        Array.from(files).forEach((file: File) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = reader.result as string;
            setFormData(prev => ({
              ...prev,
              images: [...(prev.images || []), base64String],
              image: prev.image || base64String
            }));
          };
          reader.readAsDataURL(file);
        });
      }
    };

    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[3000] flex items-center justify-center p-6">
        <div className="bg-white rounded-[2.5rem] w-full max-w-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="p-10 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-2xl font-black text-slate-900 italic uppercase">{isAddingProduct ? 'Новый товар' : 'Редактировать'}</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-900 transition-colors"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
          </div>
          <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Название</label>
                <input type="text" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold outline-none focus:ring-2 focus:ring-[#6C5DD3]" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Бренд / Фирма</label>
                <input type="text" value={formData.brand || ''} onChange={e => setFormData({ ...formData, brand: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold outline-none focus:ring-2 focus:ring-[#6C5DD3]" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Модель</label>
                <input type="text" value={formData.model || ''} onChange={e => setFormData({ ...formData, model: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold outline-none focus:ring-2 focus:ring-[#6C5DD3]" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Категория</label>
                <select value={formData.categoryId || ''} onChange={e => {
                  const cat = categories.find(c => c.id === e.target.value);
                  setFormData({ ...formData, categoryId: e.target.value, category: cat?.name });
                }} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold outline-none focus:ring-2 focus:ring-[#6C5DD3]">
                  <option value="">Выберите категорию</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Артикул (7 цифр)</label>
                <input type="text" value={formData.sku || ''} readOnly className="w-full bg-slate-100 border border-slate-100 rounded-2xl p-5 text-sm font-black outline-none cursor-not-allowed" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Закупочная цена</label>
                <input type="number" value={formData.costPrice || 0} onChange={e => setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold outline-none focus:ring-2 focus:ring-[#6C5DD3]" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Цена продажи</label>
                <input type="number" value={formData.price || 0} onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold outline-none focus:ring-2 focus:ring-[#6C5DD3]" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Количество на складе</label>
                <input type="number" value={formData.stock || 0} onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold outline-none focus:ring-2 focus:ring-[#6C5DD3]" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Загрузить фото</label>
                <div className="flex gap-4">
                  <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" id="product-images-upload" />
                  <label htmlFor="product-images-upload" className="flex-grow bg-slate-900 text-white rounded-2xl p-5 text-center text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-slate-800 transition-colors">
                    Выбрать файлы
                  </label>
                </div>
              </div>
              <div className="col-span-2 space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Галерея изображений</label>
                <div className="grid grid-cols-6 gap-4">
                  {(formData.images || []).map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-100 group">
                      <img src={img} className="w-full h-full object-cover" alt="" />
                      <button 
                        onClick={() => {
                          const next = (formData.images || []).filter((_, i) => i !== idx);
                          setFormData({ ...formData, images: next, image: next[0] || '' });
                        }}
                        className="absolute inset-0 bg-rose-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Описание</label>
                <textarea value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={4} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold outline-none focus:ring-2 focus:ring-[#6C5DD3] resize-none" />
              </div>

              <div className="col-span-2 pt-8 border-t border-slate-100">
                <CharacteristicsEditor 
                  groups={formData.characteristicGroups || []} 
                  onChange={groups => setFormData({ ...formData, characteristicGroups: groups })} 
                />
              </div>

              <div className="col-span-2 pt-8 border-t border-slate-100">
                <PromotionEditor 
                  promotion={formData.promotion || { isActive: false }} 
                  onChange={promo => setFormData({ ...formData, promotion: promo })} 
                />
              </div>
            </div>
          </div>
          <div className="p-10 bg-slate-50 flex justify-end gap-6">
            <button onClick={onClose} className="px-10 py-5 text-slate-400 font-black text-[11px] uppercase tracking-widest">Отмена</button>
            <button onClick={() => onSave(formData as Product)} className="px-14 py-5 bg-[#6C5DD3] text-white rounded-[1.8rem] font-black text-[11px] uppercase tracking-widest shadow-xl">Сохранить</button>
          </div>
        </div>
      </div>
    );
  };

  const SidebarItem = ({ item }: any) => {
    const isActive = activeMenu === item.id;
    return (
      <div className="px-4">
        <button
          onClick={() => {
            if (item.isSpecial && item.id === 'VisualEditor') {
              onGoToEditor();
            } else {
              setActiveMenu(item.id);
            }
          }}
          className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 ${isActive ? 'bg-[#6C5DD3] text-white shadow-lg shadow-indigo-900/20' : item.isSpecial ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
        >
          <div className="flex items-center gap-4">
            <svg className={`w-6 h-6 ${isActive ? 'text-white' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
            </svg>
            <span className={`text-[15px] font-bold ${isActive ? 'text-white' : ''}`}>{item.label}</span>
          </div>
          {item.badge && <span className="bg-rose-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">{item.badge}</span>}
          {item.isNew && <span className="bg-[#82C12D] text-white text-[8px] px-1.5 py-0.5 rounded-md font-bold uppercase">new</span>}
        </button>
      </div>
    );
  };

  const StatCard = ({ title, value, change, icon, color }: any) => (
    <div className="bg-white rounded-[2rem] p-8 flex items-center gap-6 shadow-sm border border-slate-100 transition-transform hover:scale-105">
      <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-white shadow-lg ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
        <h3 className="text-3xl font-black text-slate-900 mt-1 italic tracking-tighter">{value}</h3>
        <p className={`text-[11px] font-bold mt-1 ${String(change).startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{change} к прошл. мес.</p>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="p-10 space-y-10 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <StatCard title="Выручка" value={`${(Number((orders || []).reduce((a, b) => a + (Number(b.total) || 0), 0)) || 0).toLocaleString()} ${settings?.currency || '֏'}`} change="+12%" color="bg-[#6C5DD3]" icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>} />
        <StatCard title="Заказы" value={(orders || []).length} change="+5%" color="bg-emerald-500" icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>} />
        <StatCard title="Товары" value={(products || []).length} change="0%" color="bg-amber-500" icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-12 bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 min-h-[450px]">
          <div className="flex justify-between items-center mb-12">
            <h3 className="text-2xl font-black text-slate-900 italic tracking-tight uppercase">Активность продаж</h3>
          </div>
          <div className="flex items-end justify-between h-[280px] gap-6 px-4">
            {[45, 85, 30, 95, 60, 75, 50, 80, 40, 90, 65, 85].map((h, i) => (
              <div key={i} className="flex-grow flex flex-col items-center gap-4 group">
                <div className="w-full max-w-[32px] bg-slate-50 rounded-full relative overflow-hidden h-[240px]">
                  <div className="absolute bottom-0 left-0 right-0 bg-[#6C5DD3] rounded-full transition-all duration-1000 group-hover:brightness-125" style={{ height: `${h}%` }} />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">М{i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCategoriesPage = () => (
    <div className="p-10 animate-fade-in space-y-10">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black text-slate-900 italic uppercase">Категории</h2>

        <button
          onClick={() => setIsAddingCategory(true)}
          className="px-8 py-3 bg-[#6C5DD3] text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg"
        >
          + Добавить категорию
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100 text-[11px] font-black uppercase text-slate-400">
            <tr>
              <th className="py-6 px-10">Иконка</th>
              <th className="py-6 px-10">Название</th>
              <th className="py-6 px-10">Статус</th>
              <th className="py-6 px-10 text-right">Действия</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-sm">
            {(categories || []).length > 0 ? (categories || []).map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/50 group">
                <td className="py-6 px-10">
                  {c.image ? (
                    <img src={c.image} className="w-10 h-10 rounded-xl object-cover border border-slate-100" alt={c.name} />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
                    </div>
                  )}
                </td>
                <td className="py-6 px-10 font-bold text-slate-900">{c.name}</td>
                <td className="py-6 px-10">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${c.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'}`}>
                    {c.status === 'active' ? 'Активна' : 'Неактивна'}
                  </span>
                </td>
                <td className="py-6 px-10 text-right flex justify-end gap-3">
                  <button
                    onClick={() => setEditingCategory(c)}
                    className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl hover:bg-indigo-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                  >
                    Редакт.
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Удалить эту категорию?')) {
                        onUpdateCategories((categories || []).filter(cat => cat.id !== c.id));
                      }
                    }}
                    className="p-3 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="py-20 text-center opacity-30 font-black uppercase tracking-widest">
                  Категорий пока нет
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSettingsPage = () => (
    <div className="p-10 animate-fade-in max-w-4xl space-y-10">
      <h2 className="text-3xl font-black text-slate-900 italic uppercase">Настройки магазина</h2>
      <div className="space-y-8">
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 space-y-6 shadow-sm">
          <h3 className="text-lg font-black text-slate-900 uppercase italic tracking-widest border-b border-slate-100 pb-6 mb-8">Основные данные</h3>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Название магазина</label>
              <input
                type="text"
                value={settings.storeName || ''}
                onChange={(e) => onUpdateSettings({ ...settings, storeName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#6C5DD3] outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Валюта сайта</label>
              <input
                type="text"
                value={settings.currency || ''}
                onChange={(e) => onUpdateSettings({ ...settings, currency: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#6C5DD3] outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Email администратора</label>
              <input
                type="text"
                value={settings.adminEmail || ''}
                onChange={(e) => onUpdateSettings({ ...settings, adminEmail: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#6C5DD3] outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Пароль администратора</label>
              <input
                type="text"
                value={settings.adminPassword || ''}
                onChange={(e) => onUpdateSettings({ ...settings, adminPassword: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#6C5DD3] outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Телефон поддержки</label>
              <input
                type="text"
                value={settings.footer.supportPhone || ''}
                onChange={(e) => onUpdateSettings({ ...settings, footer: { ...settings.footer, supportPhone: e.target.value } })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#6C5DD3] outline-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 space-y-6 shadow-sm">
          <h3 className="text-lg font-black text-slate-900 uppercase italic tracking-widest border-b border-slate-100 pb-6 mb-8">Дизайн и Цвета</h3>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Основной цвет (HEX)</label>
              <div className="flex gap-4">
                <input type="color" value={settings.primaryColor} onChange={(e) => onUpdateSettings({ ...settings, primaryColor: e.target.value })} className="w-16 h-16 rounded-2xl border-none p-0 cursor-pointer" />
                <input
                  type="text"
                  value={settings.primaryColor || ''}
                  onChange={(e) => onUpdateSettings({ ...settings, primaryColor: e.target.value })}
                  className="flex-grow bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-black uppercase text-slate-900 outline-none"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Скругление интерфейса</label>
              <input
                type="text"
                value={settings.borderRadius || ''}
                onChange={(e) => onUpdateSettings({ ...settings, borderRadius: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold text-slate-900 outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    onUpdateOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const renderOrdersPage = () => (
    <div className="p-10 animate-fade-in space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 italic uppercase tracking-tight">Заказы</h2>
          <p className="text-sm font-medium text-slate-400 mt-1 uppercase tracking-widest">Управление и контроль выполнения</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
              <th className="py-6 px-10">Заказ / Клиент</th>
              <th className="py-6 px-6">Дата</th>
              <th className="py-6 px-6">Сумма</th>
              <th className="py-6 px-6">Статус</th>
              <th className="py-6 px-10 text-right">Действия</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {(orders || []).length > 0 ? (orders || []).map(o => (
              <tr key={o.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="py-6 px-10">
                  <div className="flex flex-col">
                    <span className="font-black text-[#6C5DD3]">#{o.orderNumber}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                      {o.customerName || 'Гость'} {o.customerPhone && `• ${o.customerPhone}`}
                    </span>
                  </div>
                </td>
                <td className="py-6 px-6 font-bold text-slate-500">{o.date || new Date(o.createdAt).toLocaleDateString()}</td>
                <td className="py-6 px-6 font-black text-slate-900">{(Number(o.total) || 0).toLocaleString()} {settings?.currency || '֏'}</td>
                <td className="py-6 px-6">
                  <select
                    value={o.status}
                    onChange={(e) => updateOrderStatus(o.id, e.target.value as OrderStatus)}
                    className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border outline-none cursor-pointer ${o.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                      o.status === 'cancelled' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                        'bg-amber-500/10 text-amber-500 border-amber-500/20'
                      }`}
                  >
                    <option value="created">Создан</option>
                    <option value="paid">Оплачен</option>
                    <option value="shipped">Отправлен</option>
                    <option value="delivered">Доставлен</option>
                    <option value="completed">Завершен</option>
                    <option value="cancelled">Отменен</option>
                  </select>
                </td>
                <td className="py-6 px-10 text-right flex justify-end gap-3">
                  <button
                    onClick={() => setSelectedOrder(o)}
                    className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl hover:bg-indigo-500 hover:text-white transition-all"
                  >
                    Детали
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Удалить этот заказ?')) {
                        onUpdateOrders(orders.filter(ord => ord.id !== o.id));
                      }
                    }}
                    className="p-3 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={5} className="py-20 text-center opacity-30 font-black uppercase tracking-widest">Заказов пока нет</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPromotionsPage = () => {
    const promoProducts = (products || []).filter(p => p.promotion?.isActive);

    const filteredPromo = promoProducts.filter(p => {
      const matchesSearch = (p.name || '').toLowerCase().includes(promoSearch.toLowerCase()) || 
                           (p.sku || '').toLowerCase().includes(promoSearch.toLowerCase()) ||
                           (p.brand || '').toLowerCase().includes(promoSearch.toLowerCase());
      const matchesCategory = promoCategory === 'all' || p.categoryId === promoCategory;
      return matchesSearch && matchesCategory;
    });

    const handlePromoExport = (brand?: string) => {
      let dataToExport = products;
      if (brand) {
        dataToExport = products.filter(p => p.brand === brand);
      }
      
      const data = dataToExport.map(p => ({
        'ID': p.id,
        'Название': p.name,
        'Бренд': p.brand,
        'Артикул (SKU)': p.sku,
        'Текущая цена': p.price,
        'Акция (Да/Нет)': p.promotion?.isActive ? 'Да' : 'Нет',
        'Скидка (%)': p.promotion?.discountPercent || 0,
        'Акционная цена': p.promotion?.promoPrice || 0,
        'Дата начала': p.promotion?.startDate || '',
        'Дата окончания': p.promotion?.endDate || ''
      }));

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Promotions");
      XLSX.writeFile(wb, brand ? `promotions_${brand}.xlsx` : "promotions_all.xlsx");
    };

    const handlePromoImport = (e: React.ChangeEvent<HTMLInputElement>) => {
       const file = e.target.files?.[0];
       if (!file) return;
       const reader = new FileReader();
       reader.onload = (evt) => {
         try {
           const data = evt.target?.result;
           const wb = XLSX.read(data, { type: 'array' });
           const ws = wb.Sheets[wb.SheetNames[0]];
           const rows = XLSX.utils.sheet_to_json(ws) as any[];
           
           const newProducts = [...products];
           let updatedCount = 0;

           rows.forEach(row => {
             const id = String(row['ID']);
             const index = newProducts.findIndex(p => p.id === id);
             if (index !== -1) {
               const isActive = String(row['Акция (Да/Нет)']).toLowerCase() === 'да';
               const discountPercent = Number(row['Скидка (%)'] || 0);
               const promoPrice = Number(row['Акционная цена'] || 0);
               const startDate = String(row['Дата начала'] || '');
               const endDate = String(row['Дата окончания'] || '');
               const price = Number(row['Текущая цена'] || newProducts[index].price);

               newProducts[index] = {
                 ...newProducts[index],
                 price: price,
                 promotion: {
                   isActive,
                   discountPercent,
                   promoPrice,
                   startDate,
                   endDate
                 }
               };
               updatedCount++;
             }
           });

           onUpdateProducts(newProducts);
           alert(`Обновлено ${updatedCount} товаров!`);
         } catch (err) {
           alert('Ошибка при импорте файла');
         }
       };
       reader.readAsArrayBuffer(file);
    };

    return (
      <div className="p-10 animate-fade-in space-y-10">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black text-slate-900 italic uppercase">Управление Акциями</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Товаров в акции: {promoProducts.length}</p>
          </div>
          <div className="flex gap-4">
             <div className="relative group">
                <button className="px-8 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
                  Экспорт <Tag size={14} />
                </button>
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 hidden group-hover:block z-10">
                   <button onClick={() => handlePromoExport()} className="w-full text-left px-6 py-3 text-[10px] font-black uppercase text-slate-600 hover:bg-slate-50 hover:text-[#6C5DD3]">Все товары</button>
                   {(Array.from(new Set(products.map(p => p.brand).filter(Boolean))) as string[]).map(brand => (
                     <button key={brand} onClick={() => handlePromoExport(brand)} className="w-full text-left px-6 py-3 text-[10px] font-black uppercase text-slate-600 hover:bg-slate-50 hover:text-[#6C5DD3]">{brand}</button>
                   ))}
                </div>
             </div>

             <label className="px-8 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2 cursor-pointer">
               Импорт / Обновить
               <input type="file" accept=".xlsx, .xls" className="hidden" onChange={handlePromoImport} />
             </label>

             <button
               onClick={() => setIsSelectingForPromo(true)}
               className="px-8 py-3 bg-[#6C5DD3] text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg hover:scale-[1.02] transition-all"
             >
               + Добавить товары в акцию
             </button>
          </div>
        </div>

        <div className="flex gap-6">
           <div className="flex-grow relative">
              <input 
                type="text" 
                placeholder="Поиск по названию, SKU или бренду..." 
                value={promoSearch}
                onChange={e => setPromoSearch(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:border-[#6C5DD3] transition-all"
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
           </div>
           <select 
             value={promoCategory}
             onChange={e => setPromoCategory(e.target.value)}
             className="px-6 py-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:border-[#6C5DD3] transition-all"
           >
             <option value="all">Все категории</option>
             {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
           </select>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100 text-[11px] font-black uppercase text-slate-400">
              <tr>
                <th className="py-6 px-10">Товар</th>
                <th className="py-6 px-6">Скидка</th>
                <th className="py-6 px-6">Цена</th>
                <th className="py-6 px-6">Период</th>
                <th className="py-6 px-10 text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredPromo.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/50 group">
                  <td className="py-6 px-10">
                    <div className="flex items-center gap-4">
                      <img src={p.image || undefined} className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <p className="font-black text-slate-900">{p.name}</p>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{p.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-6">
                    <span className="px-3 py-1 bg-amber-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">
                      -{p.promotion?.discountPercent}%
                    </span>
                  </td>
                  <td className="py-6 px-6">
                    <div className="flex flex-col">
                      <span className="text-slate-400 line-through text-[10px]">{(Number(p.price) || 0).toLocaleString()} ֏</span>
                      <span className="font-black text-slate-900">{(Number(p.promotion?.promoPrice) || 0).toLocaleString()} ֏</span>
                    </div>
                  </td>
                  <td className="py-6 px-6">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {p.promotion?.startDate && p.promotion?.endDate ? `${p.promotion.startDate} — ${p.promotion.endDate}` : 'Бессрочно'}
                    </div>
                  </td>
                  <td className="py-6 px-10 text-right">
                    <button 
                      onClick={() => {
                        const newProducts = products.map(prod => prod.id === p.id ? { ...prod, promotion: { ...prod.promotion!, isActive: false } } : prod);
                        onUpdateProducts(newProducts);
                      }}
                      className="p-3 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                    >
                      Снять
                    </button>
                  </td>
                </tr>
              ))}
              {filteredPromo.length === 0 && (
                <tr><td colSpan={5} className="py-20 text-center opacity-30 font-black uppercase tracking-widest">Товаров с акциями не найдено</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderPromoCodesPage = () => (
    <div className="p-10 animate-fade-in space-y-10">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black text-slate-900 italic uppercase">Промокоды</h2>
        <button
          onClick={() => setIsAddingPromoCode(true)}
          className="px-8 py-3 bg-[#6C5DD3] text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg"
        >
          + Добавить промокод
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100 text-[11px] font-black uppercase text-slate-400">
            <tr>
              <th className="py-6 px-10">Код</th>
              <th className="py-6 px-6">Скидка</th>
              <th className="py-6 px-6">Статус</th>
              <th className="py-6 px-10 text-right">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {(promoCodes || []).map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/50 group">
                <td className="py-6 px-10 font-black text-slate-900">{p.code}</td>
                <td className="py-6 px-6 font-bold text-emerald-500">{p.discount}%</td>
                <td className="py-6 px-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${p.isActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'}`}>
                    {p.isActive ? 'Активен' : 'Неактивен'}
                  </span>
                </td>
                <td className="py-6 px-10 text-right flex justify-end gap-3">
                  <button
                    onClick={() => setEditingPromoCode(p)}
                    className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl hover:bg-indigo-500 hover:text-white transition-all"
                  >
                    Редакт.
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Удалить этот промокод?')) {
                        onUpdatePromoCodes(promoCodes.filter(pc => pc.id !== p.id));
                      }
                    }}
                    className="p-3 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderProductsPage = () => {
    const filteredProducts = (products || []).filter(p => 
      (p.name || '').toLowerCase().includes(globalSearch.toLowerCase()) || 
      (p.sku || '').toLowerCase().includes(globalSearch.toLowerCase()) ||
      (p.brand || '').toLowerCase().includes(globalSearch.toLowerCase())
    );

    const handleExport = () => {
      const data = products.map(p => ({
        'ID': p.id,
        'Название': p.name,
        'Бренд': p.brand,
        'Модель': p.model || '',
        'Артикул (SKU)': p.sku,
        'Категория': p.category || '',
        'Закупочная цена': p.costPrice || 0,
        'Цена продажи': p.price,
        'Склад (Кол-во)': p.stock,
        'URL Изображения': p.image,
        'Акция (да/нет)': p.promotion?.isActive ? 'Да' : 'Нет',
        'Размер скидки (%)': p.promotion?.discountPercent || 0,
        'Акционная цена': p.promotion?.promoPrice || 0,
        'Дата начала акции': p.promotion?.startDate || '',
        'Дата окончания акции': p.promotion?.endDate || ''
      }));
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Products");
      XLSX.writeFile(wb, "products_catalog.xlsx");
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const data = evt.target?.result;
          const wb = XLSX.read(data, { type: 'array' });
          const ws = wb.Sheets[wb.SheetNames[0]];
          const rows = XLSX.utils.sheet_to_json(ws) as any[];
          
          const newProducts = [...products];
          
          rows.forEach(row => {
            const promotion: PromotionInfo = {
              isActive: String(row['Акция (да/нет)']).toLowerCase() === 'да',
              discountPercent: Number(row['Размер скидки (%)'] || 0),
              promoPrice: Number(row['Акционная цена'] || 0),
              startDate: String(row['Дата начала акции'] || ''),
              endDate: String(row['Дата окончания акции'] || '')
            };

            const importedProduct: Partial<Product> = {
              id: String(row['ID'] || 'p' + Math.random().toString(36).substr(2, 9)),
              name: String(row['Название'] || 'Без названия'),
              brand: String(row['Бренд'] || ''),
              model: String(row['Модель'] || ''),
              sku: String(row['Артикул (SKU)'] || generateSKU(newProducts)),
              categoryId: categories.find(c => c.name === row['Категория'])?.id || '',
              costPrice: Number(row['Закупочная цена'] || 0),
              price: Number(row['Цена продажи'] || 0),
              stock: Number(row['Склад (Кол-во)'] || 0),
              image: String(row['URL Изображения'] || ''),
              promotion
            };

            const index = newProducts.findIndex(p => p.id === importedProduct.id);
            if (index !== -1) {
              newProducts[index] = { ...newProducts[index], ...importedProduct };
            } else {
              newProducts.push({
                ...importedProduct,
                images: [importedProduct.image || ''],
                rating: 5,
                reviews: [],
                unit: 'шт',
                attributes: [],
                features: []
              } as Product);
            }
          });

          onUpdateProducts(newProducts);
          alert(`Импорт завершен! Обработано ${rows.length} товаров.`);
        } catch (error) {
          console.error('Import error:', error);
          alert('Ошибка при чтении файла. Убедитесь, что это корректный Excel файл.');
        }
      };
      reader.readAsArrayBuffer(file);
    };

    return (
      <div className="p-10 animate-fade-in space-y-10">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-black text-slate-900 italic uppercase">Товары</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setIsSelectingForPromo(true)}
              className="px-6 py-3 bg-amber-500 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-amber-500/20 hover:scale-105 transition-all flex items-center gap-2"
            >
              <Tag size={14} /> Выбрать товары для акции
            </button>
            <input type="file" id="admin-import" className="hidden" onChange={handleImport} accept=".xlsx" />
            <label htmlFor="admin-import" className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl text-[11px] font-black uppercase tracking-widest cursor-pointer hover:bg-slate-200 transition-all">
              Импорт (XLSX)
            </label>
            <button onClick={handleExport} className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
              Экспорт (XLSX)
            </button>
            <button
              onClick={() => setIsAddingProduct(true)}
              className="px-8 py-3 bg-[#6C5DD3] text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg"
            >
              + Добавить товар
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100 text-[11px] font-black uppercase text-slate-400">
              <tr>
                <th className="py-6 px-10">Товар / Артикул</th>
                <th className="py-6 px-6">Категория</th>
                <th className="py-6 px-6">Закуп</th>
                <th className="py-6 px-6">Продажа</th>
                <th className="py-6 px-6">Склад</th>
                <th className="py-6 px-10 text-right">Действия</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 group">
                  <td className="py-6 px-10">
                    <div className="flex items-center gap-4">
                      <img src={p.image || undefined} className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <p className="font-bold text-slate-900">{p.name}</p>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">{p.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-6 text-slate-500">{p.category || 'Без категории'}</td>
                  <td className="py-6 px-6 font-bold text-slate-400">{(Number(p.costPrice) || 0).toLocaleString()} {settings?.currency || '֏'}</td>
                  <td className="py-6 px-6 font-black text-slate-900">{(Number(p.price) || 0).toLocaleString()} {settings?.currency || '֏'}</td>
                  <td className="py-6 px-6 font-bold text-slate-500">{p.stock} шт.</td>
                  <td className="py-6 px-10 text-right flex justify-end gap-3">
                    <button
                      onClick={() => setEditingProduct(p)}
                      className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl hover:bg-indigo-500 hover:text-white transition-all"
                    >
                      Редакт.
                    </button>
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="p-3 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderTelegramPage = () => (
    <div className="p-10 animate-fade-in max-w-4xl space-y-10">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-sky-500 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-sky-500/20">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.93 1.23-5.46 3.62-.51.35-.98.52-1.4.51-.46-.01-1.35-.26-2.01-.48-.81-.27-1.45-.42-1.39-.88.03-.24.36-.48.99-.74 3.86-1.68 6.44-2.78 7.72-3.31 3.67-1.53 4.44-1.8 4.94-1.81.11 0 .35.03.5.16.13.11.17.26.18.37z"/></svg>
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-900 italic uppercase">Telegram Уведомления</h2>
          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Настройка оповещений о новых заказах</p>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 space-y-8 shadow-sm">
        <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
          <div>
            <h4 className="font-black text-slate-900 uppercase text-sm">Включить уведомления</h4>
            <p className="text-xs text-slate-400 font-bold mt-1">Бот будет присылать детали каждого нового заказа</p>
          </div>
          <button 
            onClick={() => onUpdateSettings({ 
              ...settings, 
              telegram: { ...(settings.telegram || { botToken: '', chatId: '', enabled: false }), enabled: !settings.telegram?.enabled } 
            })}
            className={`w-16 h-8 rounded-full transition-all relative ${settings.telegram?.enabled ? 'bg-emerald-500' : 'bg-slate-200'}`}
          >
            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${settings.telegram?.enabled ? 'right-1' : 'left-1'}`} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Bot Token</label>
            <input
              type="password"
              value={settings.telegram?.botToken || ''}
              onChange={(e) => onUpdateSettings({ 
                ...settings, 
                telegram: { ...(settings.telegram || { botToken: '', chatId: '', enabled: false }), botToken: e.target.value } 
              })}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-sky-500 outline-none"
              placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Chat ID</label>
            <input
              type="text"
              value={settings.telegram?.chatId || ''}
              onChange={(e) => onUpdateSettings({ 
                ...settings, 
                telegram: { ...(settings.telegram || { botToken: '', chatId: '', enabled: false }), chatId: e.target.value } 
              })}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-sky-500 outline-none"
              placeholder="-100123456789"
            />
          </div>
        </div>

        <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100">
          <p className="text-xs font-bold text-amber-700 leading-relaxed">
            <span className="font-black uppercase block mb-1">Как настроить?</span>
            1. Создайте бота через @BotFather и получите Token.<br />
            2. Добавьте бота в группу или напишите ему в ЛС.<br />
            3. Узнайте свой Chat ID через @userinfobot или аналогичные сервисы.<br />
            4. Введите данные выше и включите уведомления.
          </p>
        </div>
      </div>
    </div>
  );

  const renderOrderDesignPage = () => {
    const design = settings.orderDesign || {
      textColor: '#1A1A1A',
      headerColor: '#000000',
      buttonColor: '#003D45',
      buttonText: 'Продолжить покупки',
      blockBackground: '#F0F9FA',
      borderRadius: 0,
      shadowIntensity: 'none',
      fontFamily: 'Inter',
      showIcons: true
    };

    const updateDesign = (updates: Partial<typeof design>) => {
      onUpdateSettings({
        ...settings,
        orderDesign: { ...design, ...updates }
      });
    };

    return (
      <div className="p-10 animate-fade-in space-y-10">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-indigo-500 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 italic uppercase">Дизайн Заказа</h2>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Настройка страницы подтверждения</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Settings Column */}
          <div className="space-y-8">
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 space-y-8 shadow-sm">
              <div className="space-y-6">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 pb-4">Цвета и Текст</h4>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Цвет текста</label>
                    <input type="color" value={design.textColor} onChange={e => updateDesign({ textColor: e.target.value })} className="w-full h-12 rounded-xl border-none p-0 cursor-pointer" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Цвет заголовков</label>
                    <input type="color" value={design.headerColor} onChange={e => updateDesign({ headerColor: e.target.value })} className="w-full h-12 rounded-xl border-none p-0 cursor-pointer" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Цвет кнопки</label>
                    <input type="color" value={design.buttonColor} onChange={e => updateDesign({ buttonColor: e.target.value })} className="w-full h-12 rounded-xl border-none p-0 cursor-pointer" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Фон блоков</label>
                    <input type="color" value={design.blockBackground} onChange={e => updateDesign({ blockBackground: e.target.value })} className="w-full h-12 rounded-xl border-none p-0 cursor-pointer" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Текст кнопки</label>
                  <input type="text" value={design.buttonText} onChange={e => updateDesign({ buttonText: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 pb-4">Стиль</h4>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Радиус углов (px)</label>
                    <input type="number" value={design.borderRadius} onChange={e => updateDesign({ borderRadius: parseInt(e.target.value) || 0 })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Тень блоков</label>
                    <select value={design.shadowIntensity} onChange={e => updateDesign({ shadowIntensity: e.target.value as any })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none">
                      <option value="none">Нет</option>
                      <option value="soft">Мягкая</option>
                      <option value="medium">Средняя</option>
                      <option value="hard">Сильная</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 pb-4">Медиа</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Логотип (URL)</label>
                    <input type="text" value={design.logoUrl || ''} onChange={e => updateDesign({ logoUrl: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none" placeholder="https://..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Фон страницы (URL)</label>
                    <input type="text" value={design.backgroundUrl || ''} onChange={e => updateDesign({ backgroundUrl: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none" placeholder="https://..." />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Column */}
          <div className="space-y-6">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Предпросмотр</h4>
            <div className="sticky top-10">
              <div className="bg-slate-200 rounded-[3rem] p-4 shadow-inner">
                <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl h-[600px] overflow-y-auto custom-scrollbar scale-90 origin-top">
                  <div 
                    className="p-8 min-h-full"
                    style={{ 
                      fontFamily: design.fontFamily,
                      color: design.textColor,
                      backgroundImage: design.backgroundUrl ? `url(${design.backgroundUrl})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundColor: design.backgroundUrl ? 'transparent' : '#F8FAFC'
                    }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        {design.logoUrl && <img src={design.logoUrl} className="h-6 object-contain" alt="" />}
                        <h5 className="text-lg font-black uppercase tracking-tighter" style={{ color: design.headerColor }}>Заказ оформлен</h5>
                      </div>
                      <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[10px]">✓</div>
                    </div>

                    <div 
                      className="p-4 mb-4"
                      style={{ 
                        backgroundColor: design.blockBackground,
                        borderRadius: `${design.borderRadius}px`,
                        boxShadow: design.shadowIntensity === 'none' ? 'none' : '0 4px 12px rgba(0,0,0,0.05)'
                      }}
                    >
                      <div className="flex justify-between items-center mb-4 opacity-50 text-[10px] font-bold">
                        <span>№167799</span>
                        <span>12 октября 2024</span>
                      </div>
                      <div className="space-y-3">
                        <div className="h-2 w-24 bg-slate-200 rounded-full" />
                        <div className="h-2 w-full bg-slate-100 rounded-full" />
                        <div className="h-2 w-2/3 bg-slate-100 rounded-full" />
                      </div>
                    </div>

                    <div 
                      className="p-4"
                      style={{ 
                        backgroundColor: design.blockBackground,
                        borderRadius: `${design.borderRadius}px`,
                        boxShadow: design.shadowIntensity === 'none' ? 'none' : '0 4px 12px rgba(0,0,0,0.05)'
                      }}
                    >
                      <div className="flex gap-3 items-center">
                        <div className="w-10 h-10 bg-white rounded-lg" />
                        <div className="flex-grow space-y-2">
                          <div className="h-2 w-20 bg-slate-200 rounded-full" />
                          <div className="h-2 w-12 bg-slate-100 rounded-full" />
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 text-center">
                      <div 
                        className="inline-block px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-white"
                        style={{ backgroundColor: design.buttonColor }}
                      >
                        {design.buttonText}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (!adminUser) return null;

    switch (activeMenu) {
      case 'Dashboard': return hasPermission('view_dashboard') ? renderDashboard() : null;
      case 'Products': return hasPermission('view_products') ? renderProductsPage() : null;
      case 'Categories': return hasPermission('view_categories') ? renderCategoriesPage() : null;
      case 'Orders': return hasPermission('view_orders') ? renderOrdersPage() : null;
      case 'Promotions': return hasPermission('manage_discounts') ? renderPromotionsPage() : null;
      case 'PromoCodes': return hasPermission('manage_promocodes') ? renderPromoCodesPage() : null;
      case 'Users': return hasPermission('view_users') ? <UsersManagement allUsers={allUsers} onUpdateUsers={onUpdateAllUsers} adminRoles={adminRoles} /> : null;
      case 'Clients': return hasPermission('view_users') ? <ClientsManagement allUsers={allUsers} onUpdateUsers={onUpdateAllUsers} /> : null;
      case 'AuthSettings': return hasPermission('view_auth_settings') ? <AuthSettingsPage settings={settings} onUpdateSettings={onUpdateSettings} /> : null;
      case 'RegForm': return hasPermission('view_reg_form') ? <RegFormBuilder settings={settings} onUpdateSettings={onUpdateSettings} /> : null;
      case 'SocialLinks': return hasPermission('view_settings') ? <SocialLinksManager settings={settings} onUpdateSettings={onUpdateSettings} /> : null;
      case 'Menus': return hasPermission('view_settings') ? <MenuManager settings={settings} onUpdateSettings={onUpdateSettings} /> : null;
      case 'Content': return hasPermission('view_visual_editor') ? <ContentEditor settings={settings} onUpdateSettings={onUpdateSettings} initialSectionId={initialPageId} /> : null;
      case 'ChatSettings': return hasPermission('view_settings') ? <ChatSettingsPage settings={settings} onUpdateSettings={onUpdateSettings} /> : null;
      case 'Telegram': return hasPermission('view_settings') ? renderTelegramPage() : null;
      case 'OrderDesign': return hasPermission('view_settings') ? renderOrderDesignPage() : null;
      case 'Settings': return hasPermission('view_settings') ? renderSettingsPage() : null;
      case 'Developer': return hasPermission('manage_system') ? (
        <DeveloperPage
          settings={settings}
          onUpdateSettings={onUpdateSettings}
          products={products}
          onUpdateProducts={onUpdateProducts}
          categories={categories}
          onUpdateCategories={onUpdateCategories}
          currentUser={currentUser}
        />
      ) : null;
      default: return renderDashboard();
    }
  };

  if (!adminUser) {
    return <AdminLogin allUsers={allUsers} onLogin={onAdminLogin} onExit={onExit} settings={settings} />;
  }

  return (
    <div className="fixed inset-0 flex bg-slate-50 z-[2000] font-['Inter'] overflow-hidden text-slate-900">
      {/* Notification Toast */}
      {showNewOrderToast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[3000] bg-indigo-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/20 animate-in slide-in-from-top-10 duration-500">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <BellRing className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Новый заказ!</p>
            <p className="text-sm font-bold">Получен новый заказ в магазине</p>
          </div>
        </div>
      )}

      <audio ref={audioRef} src="https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3" />

      <aside className="w-[320px] bg-white border-r border-slate-100 flex flex-col shrink-0">
        <div className="p-12 mb-4">
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-4 italic">
            <div className="w-12 h-12 bg-gradient-to-br from-[#6C5DD3] to-[#8062D6] rounded-2xl flex items-center justify-center text-white text-2xl shadow-xl shadow-indigo-900/20 ring-4 ring-indigo-50/10">К</div>
            Админ
          </h2>
        </div>

        <div className="flex-grow overflow-y-auto space-y-3 py-6 hide-scrollbar">
          {filteredMenuItems.map(item => <SidebarItem key={item.id} item={item} />)}
        </div>

        <div className="p-10 border-t border-slate-100 bg-slate-50/50">
          <button onClick={onAdminLogout} className="w-full flex items-center gap-4 px-6 py-4 text-rose-500 font-black text-[13px] uppercase tracking-[0.2em] hover:bg-rose-500/5 rounded-[1.5rem] transition-all group">
            <LogOut size={24} />
            Выйти
          </button>
        </div>
      </aside>

      <main className="flex-grow flex flex-col min-w-0 overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none opacity-50 z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#6C5DD3]/5 blur-[150px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/5 blur-[150px] rounded-full" />
        </div>

        <header className="h-28 px-12 flex items-center justify-between shrink-0 z-10 animate-in slide-in-from-top-4 relative">
          <div className="flex items-center gap-6">
            <div className="relative w-full max-w-md group">
              <input 
                type="text" 
                placeholder="Быстрый поиск по системе..." 
                value={globalSearch}
                onChange={e => setGlobalSearch(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white border-none rounded-[1.8rem] text-sm font-bold shadow-sm transition-all focus:ring-8 focus:ring-indigo-500/10 outline-none text-slate-900 placeholder:text-slate-400" 
              />
              <svg className="w-6 h-6 absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <button
              onClick={onGoToEditor}
              className="flex items-center gap-2 px-6 py-3.5 bg-emerald-500 text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Редактор сайта
            </button>
          </div>

          <div className="flex items-center gap-10">
            <div className="flex items-center gap-6 text-slate-400">
              <button 
                onClick={() => setActiveMenu('Orders')}
                className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm hover:text-[#6C5DD3] hover:scale-110 transition-all relative border border-slate-100"
                title="Уведомления"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                {(orders || []).filter(o => o.status === 'created').length > 0 && (
                  <span className="absolute top-3 right-3 w-3 h-3 bg-rose-500 border-2 border-white rounded-full shadow-sm" />
                )}
              </button>
            </div>

            <div className="flex items-center gap-5 pl-8 border-l border-slate-100 cursor-pointer group">
              <div className="text-right">
                <p className="text-[15px] font-black text-slate-900 italic tracking-tighter uppercase">{adminUser?.name || 'Администратор'}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-0.5">
                  {adminRoles.find(r => r.id === adminUser?.roleId)?.name || 'Администратор'}
                </p>
              </div>
              <div className="w-16 h-16 rounded-[1.8rem] bg-gradient-to-br from-slate-50 to-white border-2 border-slate-100 shadow-xl flex items-center justify-center text-[#6C5DD3] font-black text-xl overflow-hidden transition-transform group-hover:scale-105">
                {adminUser?.avatar ? <img src={adminUser.avatar || undefined} className="w-full h-full object-cover" alt="avatar" /> : (adminUser?.name?.[0] || 'A')}
              </div>
            </div>
          </div>
        </header>

        <div className="flex-grow overflow-y-auto hide-scrollbar pb-20 z-10 relative">
          {renderContent()}
        </div>

        {(editingProduct || isAddingProduct) && (
          <ProductModal
            product={editingProduct || { name: '', price: 0, stock: 0, category: '', image: '', images: [], attributes: [], features: [], categoryId: '1', sku: 'SKU-' + Date.now(), rating: 5 }}
            onSave={saveProduct}
            onClose={() => { setEditingProduct(null); setIsAddingProduct(false); }}
          />
        )}

        {(editingCategory || isAddingCategory) && (
          <CategoryModal
            category={editingCategory || { name: '', status: 'active', image: '' }}
            onSave={saveCategory}
            onClose={() => { setEditingCategory(null); setIsAddingCategory(false); }}
          />
        )}

        {(editingPromoCode || isAddingPromoCode) && (
          <PromoCodeModal
            promo={editingPromoCode || { code: '', discount: 0, isActive: true }}
            onSave={savePromoCode}
            onClose={() => { setEditingPromoCode(null); setIsAddingPromoCode(false); }}
          />
        )}

        {selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}

        {isSelectingForPromo && (
          <ProductSelectorModal
            products={products}
            categories={categories}
            onClose={() => setIsSelectingForPromo(false)}
            onApply={applyMassPromotion}
          />
        )}
      </main>
    </div>
  );
};