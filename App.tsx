
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  StoreSettings, 
  Product, 
  CartItem, 
  Language, 
  Banner,
  Category,
  User,
  Order,
  Review
} from './types';
import { sendOrderToTelegram } from './services/telegramService';
import { OrderConfirmationPage } from './components/OrderConfirmationPage';
import { Footer } from './components/Footer';
import { HeroSlider } from './components/HeroSlider';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { AuthPage } from './components/AuthPage';
import { CatalogMenu } from './components/CatalogMenu';
import { ProfileDropdown } from './components/ProfileDropdown';
import { ProductCard } from './components/ProductCard';
import { AdminPanel } from './components/AdminPanel';
import { EditorTopBar } from './components/EditorTopBar';
import { EditorSideMenu } from './components/EditorSideMenu';
import { Pagination } from './components/Pagination';
import { BrandingModal } from './components/BrandingModal';
import { BackgroundModal } from './components/BackgroundModal';
import { TickerModal } from './components/TickerModal';
import { Ticker } from './components/Ticker';
import { LiveChat } from './components/LiveChat';
import { SiteDataModal } from './components/SiteDataModal';
import { TemplateSettingsModal } from './components/TemplateSettingsModal';
import { PopupsModal } from './components/PopupsModal';
import { BannersModal } from './components/BannersModal';
import { ContentPage } from './components/ContentPage';
import { FooterModal } from './components/FooterModal';
import { ProductsEditorModal } from './components/ProductsEditorModal';
import { EditableSection } from './components/VisualEditor';
import { ProductPage } from './components/ProductPage';
import { ProfilePage } from './components/ProfilePage';
import { CartPage } from './components/CartPage';
import { PromoCode } from './types';
import { generateSKU } from './utils/sku';
import { translations } from './translations';
import { products as initialProducts } from './data/products';
import { DEFAULT_ROLES } from './src/data/roles';
import { Search, ShoppingCart, User as UserIcon, Heart, Menu, Phone, Mail, MapPin, Settings } from 'lucide-react';
import { AdminRole } from './types';

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'Gisi Market',
  primaryColor: '#82C12D',
  accentColor: '#F7D000',
  borderRadius: '12px',
  currency: '֏',
  headerDisplayMode: 'both',
  background: {
    imageUrl: '',
    size: 'cover',
    position: 'center',
    behavior: 'scroll',
    color: '#F8FAFC',
    overlayOpacity: 0,
    blur: 0,
    applyToHome: true,
    applyToCart: true,
    applyToProfile: true,
    applyToAdmin: true
  },
  footer: {
    copyrightText: '© 2024 Gisi Market. Все права защищены.',
    supportPhone: '+374 00 000 000',
    backgroundColor: '#FFFFFF',
    textColor: '#1A1A1A',
    columns: [
      {
        id: 'col1',
        title: 'О КОМПАНИИ',
        items: [
          { id: 'i1', label: 'О нас', type: 'link', isVisible: true },
          { id: 'i2', label: 'Контакты', type: 'link', isVisible: true },
          { id: 'i3', label: 'Вакансии', type: 'link', isVisible: true }
        ]
      },
      {
        id: 'col2',
        title: 'ПОМОЩЬ',
        items: [
          { id: 'i4', label: 'Доставка', type: 'link', isVisible: true },
          { id: 'i5', label: 'Оплата', type: 'link', isVisible: true },
          { id: 'i6', label: 'Возврат', type: 'link', isVisible: true }
        ]
      },
      {
        id: 'col3',
        title: 'СЕРВИСЫ',
        items: [
          { id: 'i7', label: 'Сервис', type: 'link', isVisible: true },
          { id: 'i8', label: 'Гарантия', type: 'link', isVisible: true },
          { id: 'i9', label: 'Документация', type: 'link', isVisible: true }
        ]
      }
    ]
  },
  ticker: {
    items: [
      { id: 't1', text: 'БЕСПЛАТНАЯ ДОСТАВКА ОТ 5000 ֏', emoji: '🚚', color: '#82C12D', fontSize: 12, isVisible: true },
      { id: 't2', text: 'СКИДКИ ДО 50% НА ВСЕ ТОВАРЫ', emoji: '🔥', color: '#ffffff', fontSize: 12, isVisible: true },
      { id: 't3', text: 'НОВЫЕ ПОСТУПЛЕНИЯ КАЖДУЮ НЕДЕЛЮ', emoji: '✨', color: '#82C12D', fontSize: 12, isVisible: true }
    ],
    speed: 20,
    isActive: true,
    height: 48
  },
  adminEmail: 'admin',
  adminPassword: '1',
  chat: {
    enabled: true,
    title: 'ЧАТ ПОДДЕРЖКИ',
    status: 'online',
    avatarUrl: '',
    welcomeMessage: 'Напишите нам, мы ответим в Telegram!',
    headerColor: '#6C5DD3',
    buttonColor: '#6C5DD3',
    chatBackground: '#ffffff',
    userMessageColor: '#6C5DD3',
    adminMessageColor: '#f1f5f9',
    buttonPosition: 'right',
    buttonIcon: 'MessageCircle',
    telegramBotToken: '',
    telegramChatId: '',
    quickReplies: [
      { id: '1', label: 'Где мой заказ?', text: 'Пожалуйста, укажите номер вашего заказа.' },
      { id: '2', label: 'Как вернуть товар?', text: 'Вы можете вернуть товар в течение 14 дней.' }
    ]
  },
  authSettings: {
    backgroundUrl: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1920&q=80',
    overlayOpacity: 0.4,
    primaryColor: '#82C12D',
    buttonColor: '#82C12D',
    textColor: '#ffffff',
    borderRadius: 32,
    shadowIntensity: 'medium'
  },
  socialLogins: [
    { id: 'google', name: 'Google', icon: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png', enabled: true, order: 1 },
    { id: 'facebook', name: 'Facebook', icon: 'https://cdn-icons-png.flaticon.com/512/733/733547.png', enabled: true, order: 2 },
    { id: 'vk', name: 'VK', icon: 'https://cdn-icons-png.flaticon.com/512/145/145813.png', enabled: true, order: 3 },
    { id: 'yandex', name: 'Yandex', icon: 'https://cdn-icons-png.flaticon.com/512/5968/5968945.png', enabled: true, order: 4 },
    { id: 'mailru', name: 'Mail.ru', icon: 'https://cdn-icons-png.flaticon.com/512/10091/10091475.png', enabled: true, order: 5 }
  ],
  registrationFields: [
    { id: 'name', type: 'text', label: 'Имя', placeholder: 'Введите ваше имя', required: true, enabled: true, order: 1 },
    { id: 'surname', type: 'text', label: 'Фамилия', placeholder: 'Введите вашу фамилию', required: true, enabled: true, order: 2 },
    { id: 'age', type: 'text', label: 'Возраст', placeholder: 'Введите ваш возраст', required: false, enabled: true, order: 3 },
    { id: 'email', type: 'email', label: 'E-mail', placeholder: 'example@mail.com', required: true, enabled: true, order: 4 },
    { id: 'password', type: 'password', label: 'Пароль', placeholder: '••••••••', required: true, enabled: true, order: 5 }
  ],
  menuItems: [
    { id: 'm1', label: 'Туры', url: '#', order: 1, enabled: true },
    { id: 'm2', label: 'Цены', url: '#', order: 2, enabled: true },
    { id: 'm3', label: 'Галерея', url: '#', order: 3, enabled: true },
    { id: 'm4', label: 'Контакты', url: '#', order: 4, enabled: true }
  ],
  siteSocialIcons: [
    { id: 's1', type: 'vk', url: 'https://vk.com', enabled: true, order: 1 },
    { id: 's2', type: 'instagram', url: 'https://instagram.com', enabled: true, order: 2 }
  ],
  contentSections: [
    {
      id: 'about',
      title: 'О нас',
      slug: 'about',
      isVisible: true,
      blocks: [
        { id: 'b1', type: 'header', content: 'Добро пожаловать в Gisi Market' },
        { id: 'b2', type: 'text', content: 'Мы предлагаем лучшие товары по лучшим ценам.' }
      ]
    }
  ]
};

const DEFAULT_BANNERS: Banner[] = [
  {
    id: 'b1',
    title: 'ПРЕМИУМ ЭЛЕКТРОНИКА',
    subtitle: 'ЛУЧШИЕ ЦЕНЫ В ЭТОМ СЕЗОНЕ',
    buttonText: 'СМОТРЕТЬ КАТАЛОГ',
    status: 'active',
    order: 1,
    imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1600&q=80',
    contentAlignment: 'left'
  },
  {
    id: 'b2',
    title: 'НОВЫЕ ПОСТУПЛЕНИЯ',
    subtitle: 'ОТКРОЙТЕ ДЛЯ СЕБЯ МИР ТЕХНОЛОГИЙ',
    buttonText: 'УЗНАТЬ БОЛЬШЕ',
    status: 'active',
    order: 2,
    imageUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1600&q=80',
    contentAlignment: 'center'
  }
];

const App: React.FC = () => {
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('gisi_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          adminEmail: parsed.adminEmail || DEFAULT_SETTINGS.adminEmail,
          adminPassword: parsed.adminPassword || DEFAULT_SETTINGS.adminPassword,
          authSettings: { ...DEFAULT_SETTINGS.authSettings, ...(parsed.authSettings || {}) },
          background: { ...DEFAULT_SETTINGS.background, ...(parsed.background || {}) },
          footer: { ...DEFAULT_SETTINGS.footer, ...(parsed.footer || {}) },
          ticker: { ...DEFAULT_SETTINGS.ticker, ...(parsed.ticker || {}) },
          chat: { ...DEFAULT_SETTINGS.chat, ...(parsed.chat || {}) },
          socialLogins: parsed.socialLogins || DEFAULT_SETTINGS.socialLogins,
          registrationFields: parsed.registrationFields || DEFAULT_SETTINGS.registrationFields,
          menuItems: parsed.menuItems || DEFAULT_SETTINGS.menuItems,
          siteSocialIcons: parsed.siteSocialIcons || DEFAULT_SETTINGS.siteSocialIcons,
          contentSections: parsed.contentSections || DEFAULT_SETTINGS.contentSections
        };
      }
    } catch (e) {
      console.error('Failed to parse settings:', e);
    }
    return DEFAULT_SETTINGS;
  });

  const navigate = useNavigate();
  const location = useLocation();

  // Sync currentView with URL
  useEffect(() => {
    if (location.pathname === '/') setCurrentView('store');
    else if (location.pathname.startsWith('/product/')) setCurrentView('product-detail');
    else if (location.pathname === '/profile') setCurrentView('profile');
    else if (location.pathname === '/cart') setCurrentView('cart');
    else if (location.pathname === '/admin') setCurrentView('admin');
    else if (location.pathname === '/auth') setCurrentView('auth');
    else if (location.pathname === '/editor') setCurrentView('editor');
  }, [location]);

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('gisi_products');
      return saved ? JSON.parse(saved) : initialProducts;
    } catch (e) {
      console.error('Failed to parse products:', e);
      return initialProducts;
    }
  });

  const [banners, setBanners] = useState<Banner[]>(() => {
    try {
      const saved = localStorage.getItem('gisi_banners');
      return saved ? JSON.parse(saved) : DEFAULT_BANNERS;
    } catch (e) {
      console.error('Failed to parse banners:', e);
      return DEFAULT_BANNERS;
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('gisi_categories');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to parse categories:', e);
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('gisi_orders');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to parse orders:', e);
      return [];
    }
  });
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(() => {
    try {
      const saved = localStorage.getItem('gisi_promo_codes');
      return saved ? JSON.parse(saved) : [
        { id: '1', code: 'PRIVET', discount: 10, isActive: true }
      ];
    } catch (e) {
      console.error('Failed to parse promo codes:', e);
      return [{ id: '1', code: 'PRIVET', discount: 10, isActive: true }];
    }
  });
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('gisi_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('gisi_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [language, setLanguage] = useState<Language>('ru');
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('gisi_all_users');
      return saved ? JSON.parse(saved) : [
        { 
          id: 'admin-1', 
          name: 'Super', 
          surname: 'Admin', 
          email: 'admin@market.com', 
          role: 'super_admin', 
          roleId: 'super_admin',
          adminLogin: 'admin',
          adminPassword: '1',
          joinedDate: new Date().toISOString(),
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
        }
      ];
    } catch (e) {
      return [];
    }
  });

  const [adminRoles, setAdminRoles] = useState<AdminRole[]>(() => {
    try {
      const saved = localStorage.getItem('gisi_admin_roles');
      return saved ? JSON.parse(saved) : DEFAULT_ROLES;
    } catch (e) {
      return DEFAULT_ROLES;
    }
  });

  const [adminUser, setAdminUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('gisi_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const handlePageClick = (pageId: string) => {
    setActivePage(pageId);
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Persistence
  useEffect(() => {
    localStorage.setItem('gisi_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('gisi_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('gisi_banners', JSON.stringify(banners));
  }, [banners]);

  useEffect(() => {
    localStorage.setItem('gisi_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('gisi_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('gisi_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('gisi_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('gisi_promo_codes', JSON.stringify(promoCodes));
  }, [promoCodes]);

  useEffect(() => {
    localStorage.setItem('gisi_all_users', JSON.stringify(allUsers));
  }, [allUsers]);

  // Force update default admin to ensure admin/1 always works
  useEffect(() => {
    setAllUsers(prev => {
      const adminExists = prev.find(u => u.id === 'admin-1');
      if (adminExists) {
        return prev.map(u => {
          if (u.id === 'admin-1') {
            return { ...u, adminLogin: 'admin', adminPassword: '1', role: 'super_admin' };
          }
          return u;
        });
      } else {
        return [
          { 
            id: 'admin-1', 
            name: 'Super', 
            surname: 'Admin', 
            email: 'admin@market.com', 
            role: 'super_admin', 
            roleId: 'super_admin',
            adminLogin: 'admin',
            adminPassword: '1',
            joinedDate: new Date().toISOString(),
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
          },
          ...prev
        ];
      }
    });
  }, []);

  useEffect(() => {
    localStorage.setItem('gisi_admin_roles', JSON.stringify(adminRoles));
  }, [adminRoles]);

  useEffect(() => {
    localStorage.setItem('gisi_admin_user', JSON.stringify(adminUser));
  }, [adminUser]);

  const [homeFilter, setHomeFilter] = useState<'all' | 'sale' | 'new' | 'catalog'>('all');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [activePage, setActivePage] = useState('home');
  const [adminInitialMenu, setAdminInitialMenu] = useState<string | undefined>(undefined);
  const [adminInitialPageId, setAdminInitialPageId] = useState<string | undefined>(undefined);
  const [currentView, setCurrentView] = useState<'store' | 'admin' | 'editor' | 'auth' | 'product-detail' | 'profile' | 'cart'>('store');
  const [editorViewMode, setEditorViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isEditorMenuOpen, setIsEditorMenuOpen] = useState(false);
  const [activeEditorModal, setActiveEditorModal] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  // Body overflow management
  useEffect(() => {
    if (isCartOpen || isAuthOpen || isProfileOpen || isCatalogOpen || isEditorMenuOpen || !!selectedProduct) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen, isAuthOpen, isProfileOpen, isCatalogOpen, isEditorMenuOpen, selectedProduct]);

  const t = translations[language] || translations.ru;

  const [flyingItems, setFlyingItems] = useState<{ id: string; startX: number; startY: number; endX: number; endY: number; image: string }[]>([]);
  const cartIconRef = React.useRef<HTMLButtonElement>(null);

  const addToCart = (product: Product, startRect?: DOMRect) => {
    const hasPromotion = product.promotion?.isActive;
    const finalPrice = hasPromotion && product.promotion?.promoPrice ? product.promotion.promoPrice : product.price;
    const productWithCorrectPrice = { ...product, price: finalPrice };
    
    setCart(prev => {
      const currentCart = prev || [];
      const existing = currentCart.find(item => item.id === product.id);
      if (existing) {
        return currentCart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...currentCart, { ...productWithCorrectPrice, quantity: 1 }];
    });

    if (startRect && cartIconRef.current) {
      const targetRect = cartIconRef.current.getBoundingClientRect();
      const id = Math.random().toString(36).substr(2, 9);
      
      setFlyingItems(prev => [...prev, {
        id,
        startX: startRect.left + startRect.width / 2,
        startY: startRect.top + startRect.height / 2,
        endX: targetRect.left + targetRect.width / 2,
        endY: targetRect.top + targetRect.height / 2,
        image: product.image || ''
      }]);

      setTimeout(() => {
        setFlyingItems(prev => prev.filter(item => item.id !== id));
      }, 800);
    }
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => (prev || []).includes(productId) ? (prev || []).filter(id => id !== productId) : [...(prev || []), productId]);
  };

  const handleAddReview = (productId: string, review: Review) => {
    // In a real app, this would be an API call
    console.log('Adding review for product:', productId, review);
  };

  const filteredProducts = (products || []).filter(p => 
    (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.brand || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.sku || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const saleProducts = (filteredProducts || []).filter(p => p.oldPrice || p.promotion?.isActive);
  const newProducts = (filteredProducts || []).filter(p => p.isNew);

  const renderProductDetail = (productId?: string) => {
    const product = productId ? products.find(p => p.id === productId) : selectedProduct;
    if (!product) return null;
    return (
      <ProductPage 
        product={product}
        onBack={() => navigate('/')}
        onAddToCart={addToCart}
        onAddReview={handleAddReview}
        language={language}
        currency={settings.currency}
        loyaltyLevel={user?.loyaltyLevel}
      />
    );
  };

  const ProductDetailRoute = () => {
    const { id } = useParams();
    return renderProductDetail(id);
  };

  const renderProfile = () => {
    if (!user) return null;
    return (
      <ProfilePage
        user={user}
        orders={orders}
        products={products}
        wishlist={wishlist}
        settings={settings}
        language={language}
        onUpdateUser={setUser}
        onLogout={() => { setUser(null); setCurrentView('store'); }}
        onBack={() => setCurrentView('store')}
        onViewProduct={(p) => { setSelectedProduct(p); setCurrentView('product-detail'); }}
      />
    );
  };

  const renderCart = () => {
    return (
      <CartPage
        items={cart}
        user={user}
        settings={settings}
        promoCodes={promoCodes}
        onUpdateQuantity={updateCartQuantity}
        onRemove={removeFromCart}
        onToggleWishlist={toggleWishlist}
        onClose={() => setCurrentView('store')}
        onAuth={() => setCurrentView('auth')}
        onPlaceOrder={async (total, details) => {
          const generateUniqueOrderNumber = () => {
            let num;
            let exists = true;
            while (exists) {
              num = Math.floor(100000 + Math.random() * 900000).toString();
              exists = orders.some(o => o.orderNumber === num);
            }
            return num || '000000';
          };

          const orderNumber = generateUniqueOrderNumber();
          const newOrder: Order = {
            id: Date.now().toString(),
            orderNumber,
            customerId: user?.id || 'guest',
            customerName: user?.name || 'Гость',
            customerPhone: user?.phone || '',
            customerEmail: user?.email || 'guest@example.com',
            sellerId: '1',
            status: 'created',
            total,
            subtotal: cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
            items: cart.map(item => ({ 
              productId: item.id, 
              quantity: item.quantity, 
              price: item.price,
              name: item.name,
              image: item.image,
              attributes: item.attributes
            })),
            deliveryMethod: 'Курьерская доставка',
            deliveryAddress: details.address,
            paymentMethod: details.paymentMethod === 'cash' ? 'Наличными' : details.paymentMethod === 'card' ? 'Картой' : 'Перевод',
            createdAt: new Date().toISOString(),
            paymentStatus: 'pending',
            warehouseId: '1'
          };
          
          const updatedOrders = [...orders, newOrder];
          setOrders(updatedOrders);
          setCart([]);
          
          // Send Telegram notification
          await sendOrderToTelegram(newOrder, settings);
          
          navigate(`/order-success/${orderNumber}`);
        }}
        language={language}
      />
    );
  };

  if (currentView === 'admin') {
    return (
      <AdminPanel 
        products={products}
        onUpdateProducts={setProducts}
        categories={categories}
        onUpdateCategories={setCategories}
        orders={orders}
        onUpdateOrders={setOrders}
        promoCodes={promoCodes}
        onUpdatePromoCodes={setPromoCodes}
        settings={settings}
        onUpdateSettings={setSettings}
        onExit={() => { setCurrentView('store'); setAdminInitialMenu(undefined); setAdminInitialPageId(undefined); }}
        onGoToEditor={() => { setCurrentView('editor'); setAdminInitialMenu(undefined); setAdminInitialPageId(undefined); }}
        currentUser={user!}
        allUsers={allUsers}
        onUpdateAllUsers={setAllUsers}
        adminRoles={adminRoles}
        adminUser={adminUser}
        onAdminLogin={setAdminUser}
        onAdminLogout={() => setAdminUser(null)}
        initialMenu={adminInitialMenu}
        initialPageId={adminInitialPageId}
      />
    );
  }

  if (currentView === 'auth') {
    return (
      <AuthPage 
        settings={settings} 
        allUsers={allUsers}
        onBack={() => setCurrentView('store')} 
        onLogin={(u) => {
          setUser(u);
          setCurrentView(u.role === 'admin' || u.role === 'super_admin' ? 'admin' : 'store');
        }}
        onRegister={(newUser) => {
          const updatedUsers = [...allUsers, newUser];
          setAllUsers(updatedUsers);
          setUser(newUser);
          setCurrentView('store');
        }}
      />
    );
  }

  return (
    <div 
      className="min-h-screen font-['Inter'] relative"
      style={{ 
        backgroundColor: settings.background.color,
        backgroundImage: settings.background.imageUrl ? `url(${settings.background.imageUrl})` : 'none',
        backgroundSize: settings.background.size,
        backgroundPosition: settings.background.position,
        backgroundAttachment: settings.background.behavior,
      }}
    >
      {/* Background Overlay & Blur */}
      {settings.background.imageUrl && (
        <div 
          className="fixed inset-0 pointer-events-none z-0"
          style={{ 
            backgroundColor: `rgba(0,0,0,${settings.background.overlayOpacity})`,
            backdropFilter: `blur(${settings.background.blur}px)`,
          }}
        />
      )}

      <Routes>
        <Route path="/admin" element={
          <AdminPanel 
            products={products}
            onUpdateProducts={setProducts}
            categories={categories}
            onUpdateCategories={setCategories}
            orders={orders}
            onUpdateOrders={setOrders}
            promoCodes={promoCodes}
            onUpdatePromoCodes={setPromoCodes}
            settings={settings}
            onUpdateSettings={setSettings}
            onExit={() => { navigate('/'); setAdminInitialMenu(undefined); setAdminInitialPageId(undefined); }}
            onGoToEditor={() => { navigate('/editor'); setAdminInitialMenu(undefined); setAdminInitialPageId(undefined); }}
            currentUser={user!}
            allUsers={allUsers}
            onUpdateAllUsers={setAllUsers}
            adminRoles={adminRoles}
            adminUser={adminUser}
            onAdminLogin={setAdminUser}
            onAdminLogout={() => setAdminUser(null)}
          />
        } />
        <Route path="/auth" element={
          <AuthPage 
            onClose={() => navigate('/')} 
            onLogin={(newUser) => {
              setUser(newUser);
              navigate('/');
            }}
          />
        } />
        <Route path="/*" element={
          <div className="relative z-10">
            {currentView === 'editor' && (
              <EditorTopBar 
                onExitEditor={() => navigate('/')}
                onGoToAdmin={() => navigate('/admin')}
                onSave={() => alert('Сохранено!')}
                onMenuClick={() => setIsEditorMenuOpen(true)}
                viewMode={editorViewMode}
                onViewModeChange={setEditorViewMode}
              />
            )}

            <EditorSideMenu 
              isOpen={isEditorMenuOpen}
              onClose={() => setIsEditorMenuOpen(false)}
              onOpenSiteData={() => { setActiveEditorModal('siteData'); setIsEditorMenuOpen(false); }}
              onOpenTemplateSettings={() => { setActiveEditorModal('template'); setIsEditorMenuOpen(false); }}
              onOpenPopups={() => { setActiveEditorModal('popups'); setIsEditorMenuOpen(false); }}
              onOpenBanners={() => { setActiveEditorModal('banners'); setIsEditorMenuOpen(false); }}
              onOpenFooter={() => { setActiveEditorModal('footer'); setIsEditorMenuOpen(false); }}
              onOpenBranding={() => { setActiveEditorModal('branding'); setIsEditorMenuOpen(false); }}
              onOpenTicker={() => { setActiveEditorModal('ticker'); setIsEditorMenuOpen(false); }}
              onOpenBackground={() => { setActiveEditorModal('background'); setIsEditorMenuOpen(false); }}
              onOpenProducts={() => { setActiveEditorModal('products'); setIsEditorMenuOpen(false); }}
              activePage="home"
              onPageSelect={() => {}}
            />

            <div className={`relative z-10 ${currentView === 'editor' && editorViewMode === 'mobile' ? 'max-w-[375px] mx-auto border-x border-slate-200 shadow-2xl' : ''}`}>
        {/* Top Bar */}
        <EditableSection 
          id="topbar" 
          title="Верхняя панель" 
          isActive={currentView === 'editor'} 
          onEdit={() => setActiveEditorModal('siteData')} 
          onAddWidget={() => {}} 
          onOpenReorder={() => {}}
        >
          <div className="glass-dark text-white py-2 text-[11px] font-bold uppercase tracking-widest sticky top-0 z-[60]">
            <div className="container-premium flex justify-between items-center">
              <div className="flex gap-6">
                <span className="flex items-center gap-2"><Phone size={12} className="text-[#82C12D]" /> {settings.footer.supportPhone}</span>
                <span className="flex items-center gap-2"><Mail size={12} className="text-[#82C12D]" /> {settings.adminEmail || 'info@gisimarket.am'}</span>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setLanguage('ru')} 
                  className={`flex items-center gap-1 transition-all hover:scale-110 ${language === 'ru' ? 'opacity-100 ring-1 ring-[#82C12D] ring-offset-2 ring-offset-slate-900 rounded-sm' : 'opacity-40 hover:opacity-100'}`}
                  title="Русский"
                >
                  <img src="https://flagcdn.com/w40/ru.png" alt="RU" className="w-6 h-4 object-cover rounded-sm shadow-sm" />
                </button>
                <button 
                  onClick={() => setLanguage('en')} 
                  className={`flex items-center gap-1 transition-all hover:scale-110 ${language === 'en' ? 'opacity-100 ring-1 ring-[#82C12D] ring-offset-2 ring-offset-slate-900 rounded-sm' : 'opacity-40 hover:opacity-100'}`}
                  title="English"
                >
                  <img src="https://flagcdn.com/w40/us.png" alt="EN" className="w-6 h-4 object-cover rounded-sm shadow-sm" />
                </button>
                <button 
                  onClick={() => setLanguage('hy')} 
                  className={`flex items-center gap-1 transition-all hover:scale-110 ${language === 'hy' ? 'opacity-100 ring-1 ring-[#82C12D] ring-offset-2 ring-offset-slate-900 rounded-sm' : 'opacity-40 hover:opacity-100'}`}
                  title="Հայերեն"
                >
                  <img src="https://flagcdn.com/w40/am.png" alt="AM" className="w-6 h-4 object-cover rounded-sm shadow-sm" />
                </button>
              </div>
            </div>
          </div>
        </EditableSection>

        {/* Main Header */}
        <EditableSection 
          id="header" 
          title="Шапка сайта" 
          isActive={currentView === 'editor'} 
          onEdit={() => setActiveEditorModal('branding')} 
          onAddWidget={() => {}} 
          onOpenReorder={() => {}}
        >
          <header className="glass sticky top-[34px] z-50 shadow-sm">
            <div className="container-premium py-4 flex items-center gap-8">
              {/* Logo */}
              <div className="flex-shrink-0">
                <button onClick={() => { navigate('/'); setActivePage('home'); }} className="flex items-center gap-3">
                  {(settings.headerDisplayMode === 'logo' || settings.headerDisplayMode === 'both') && settings.logoUrl ? (
                    <img 
                      src={settings.logoUrl} 
                      alt="Logo" 
                      style={{ 
                        width: settings.logoWidth ? `${settings.logoWidth}px` : 'auto',
                        height: settings.logoHeight ? `${settings.logoHeight}px` : '40px'
                      }}
                      className="object-contain" 
                    />
                  ) : null}
                  {(settings.headerDisplayMode === 'text' || settings.headerDisplayMode === 'both' || !settings.logoUrl) && (
                    <h1 className="text-2xl font-black italic tracking-tighter text-slate-900 uppercase">
                      {(settings.storeName || '').split(' ')[0]}<span className="text-[#82C12D]">{(settings.storeName || '').split(' ').slice(1).join(' ') || ''}</span>
                    </h1>
                  )}
                </button>
              </div>

              {/* Catalog Button */}
              <button 
                onClick={() => setIsCatalogOpen(!isCatalogOpen)}
                className="bg-[#82C12D] text-white px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest flex items-center gap-3 hover:bg-opacity-90 transition-all shadow-lg shadow-emerald-100"
              >
                <Menu size={18} />
                {t.catalog}
              </button>

              {/* Search */}
              <div className="flex-grow relative">
                <input 
                  type="text" 
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-xl px-6 py-3 text-sm focus:ring-2 focus:ring-[#82C12D] transition-all"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              </div>

              {/* Navigation Menu */}
              <nav className="hidden xl:flex items-center gap-8">
                {(settings.menuItems || []).filter(m => m.enabled).sort((a, b) => a.order - b.order).map(item => (
                  <a 
                    key={item.id} 
                    href={item.url} 
                    className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-[#82C12D] transition-all"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>

              {/* Actions */}
              <div className="flex items-center gap-6">
                {user?.role === 'admin' && (
                  <button 
                    onClick={() => setCurrentView('admin')}
                    className="hidden md:flex flex-col items-center gap-1 text-emerald-600 hover:text-emerald-700 transition-colors"
                    title="Админ-панель"
                  >
                    <Settings size={22} />
                    <span className="text-[10px] font-bold uppercase">Админ</span>
                  </button>
                )}
                <div className="relative">
                  {user ? (
                    <button 
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-900 transition-colors"
                    >
                      <div className="w-[22px] h-[22px] rounded-full overflow-hidden bg-slate-100 ring-1 ring-slate-200">
                        <img src={user.avatar || undefined} alt="avatar" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[10px] font-bold uppercase">{user.name?.split(' ')[0] || 'User'}</span>
                    </button>
                  ) : (
                    <button onClick={() => setCurrentView('auth')} className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-900 transition-colors">
                      <UserIcon size={22} />
                      <span className="text-[10px] font-bold uppercase">{t.login}</span>
                    </button>
                  )}
                  
                  {user && (
                    <ProfileDropdown 
                      user={user}
                      isOpen={isProfileOpen}
                      onClose={() => setIsProfileOpen(false)}
                      onLogout={() => {
                        setUser(null);
                        setIsProfileOpen(false);
                        setCurrentView('store');
                      }}
                      onOpenFullProfile={() => {
                        navigate('/profile');
                        setIsProfileOpen(false);
                      }}
                      onGoToAdmin={() => {
                        setCurrentView('admin');
                        setIsProfileOpen(false);
                      }}
                      onGoToEditor={() => {
                        setCurrentView('editor');
                        setIsProfileOpen(false);
                      }}
                    />
                  )}
                </div>
                <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-900 transition-colors relative">
                  <Heart size={22} />
                  <span className="text-[10px] font-bold uppercase">{t.wishlist}</span>
                  {(wishlist || []).length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center">{(wishlist || []).length}</span>}
                </button>
                <button 
                  ref={cartIconRef}
                  onClick={() => navigate('/cart')} 
                  className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-900 transition-colors relative"
                >
                  <ShoppingCart size={22} />
                  <span className="text-[10px] font-bold uppercase">{t.cart}</span>
                  {(cart || []).length > 0 && <span className="absolute -top-1 -right-1 bg-[#82C12D] text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center">{(cart || []).reduce((acc, item) => acc + item.quantity, 0)}</span>}
                </button>
              </div>
            </div>
          </header>
        </EditableSection>

        <Ticker settings={settings?.ticker} />

        <Routes>
          <Route path="/product/:id" element={<ProductDetailRoute />} />
          <Route path="/order-success/:orderId" element={<OrderConfirmationPage orders={orders} settings={settings} />} />
          <Route path="/profile" element={renderProfile()} />
          <Route path="/cart" element={renderCart()} />
          <Route path="/" element={
            <>
              {/* Hero Section */}
              <EditableSection 
                id="hero" 
                title="Слайдер" 
                isActive={currentView === 'editor'} 
                onEdit={() => setActiveEditorModal('banners')} 
                onAddWidget={() => {}} 
                onOpenReorder={() => {}}
              >
                <HeroSlider banners={banners} settings={settings} />
              </EditableSection>

              {/* Main Content */}
              <EditableSection 
                id="products" 
                title="Сетка товаров" 
                isActive={currentView === 'editor'} 
                onEdit={() => setActiveEditorModal('products')} 
                onAddWidget={() => {}} 
                onOpenReorder={() => {}}
              >
                {activePage === 'home' ? (
                  <main className="container-premium py-16">
                    {homeFilter === 'all' ? (
                      <div className="space-y-20">
                        {/* Sale Section */}
                        {saleProducts.length > 0 && (
                          <motion.section 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                          >
                            <div className="flex justify-between items-center mb-10 pb-4 border-b border-slate-100">
                              <div className="relative">
                                <h2 className="text-4xl font-black italic tracking-tighter text-slate-900 uppercase px-6 py-2 border-2 border-rose-500 rounded-2xl inline-block bg-white shadow-lg shadow-rose-50">
                                  АКЦИЯ
                                </h2>
                                <div className="absolute -bottom-1 -right-1 w-full h-full border-2 border-rose-200 rounded-2xl -z-10" />
                              </div>
                              <button 
                                onClick={() => setHomeFilter('sale')}
                                className="px-8 py-3 rounded-xl border-2 border-rose-500 text-rose-500 text-[11px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all shadow-lg shadow-rose-100 active:scale-95"
                              >
                                ПОДРОБНЕЕ
                              </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                              {saleProducts.slice(0, 6).map(product => (
                                <ProductCard 
                                  key={product.id}
                                  product={product}
                                  settings={settings}
                                  onAddToCart={addToCart}
                                  onToggleWishlist={toggleWishlist}
                                  isWishlisted={wishlist.includes(product.id)}
                                  onClick={(p) => navigate(`/product/${p.id}`)}
                                  language={language}
                                />
                              ))}
                            </div>
                          </motion.section>
                        )}

                        {/* New Section */}
                        {newProducts.length > 0 && (
                          <motion.section 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                          >
                            <div className="flex justify-between items-center mb-10 pb-4 border-b border-slate-100">
                              <div className="relative">
                                <h2 className="text-4xl font-black italic tracking-tighter text-slate-900 uppercase px-6 py-2 border-2 border-[#82C12D] rounded-2xl inline-block bg-white shadow-lg shadow-emerald-50">
                                  НОВИНКИ
                                </h2>
                                <div className="absolute -bottom-1 -right-1 w-full h-full border-2 border-emerald-100 rounded-2xl -z-10" />
                              </div>
                              <button 
                                onClick={() => setHomeFilter('new')}
                                className="px-8 py-3 rounded-xl border-2 border-[#82C12D] text-[#82C12D] text-[11px] font-black uppercase tracking-widest hover:bg-[#82C12D] hover:text-white transition-all shadow-lg shadow-emerald-100 active:scale-95"
                              >
                                ПОДРОБНЕЕ
                              </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                              {newProducts.slice(0, 6).map(product => (
                                <ProductCard 
                                  key={product.id}
                                  product={product}
                                  settings={settings}
                                  onAddToCart={addToCart}
                                  onToggleWishlist={toggleWishlist}
                                  isWishlisted={wishlist.includes(product.id)}
                                  onClick={(p) => navigate(`/product/${p.id}`)}
                                  language={language}
                                />
                              ))}
                            </div>
                          </motion.section>
                        )}

                        {/* All Products Section */}
                        <motion.section 
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          className="relative"
                        >
                          <div className="flex justify-between items-center mb-10 pb-4 border-b border-slate-100">
                            <div className="relative">
                              <h2 className="text-4xl font-black italic tracking-tighter text-slate-900 uppercase px-6 py-2 border-2 border-slate-900 rounded-2xl inline-block bg-white shadow-lg shadow-slate-50">
                                КАТАЛОГ
                              </h2>
                              <div className="absolute -bottom-1 -right-1 w-full h-full border-2 border-slate-200 rounded-2xl -z-10" />
                            </div>
                            <button 
                              onClick={() => setHomeFilter('catalog')}
                              className="px-8 py-3 rounded-xl border-2 border-slate-900 text-slate-900 text-[11px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-lg shadow-slate-100 active:scale-95"
                            >
                              ПОДРОБНЕЕ
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                            {(filteredProducts || []).slice(0, 12).map(product => (
                              <ProductCard 
                                key={product.id}
                                product={product}
                                settings={settings}
                                onAddToCart={addToCart}
                                onToggleWishlist={toggleWishlist}
                                isWishlisted={wishlist.includes(product.id)}
                                onClick={(p) => navigate(`/product/${p.id}`)}
                                language={language}
                              />
                            ))}
                          </div>
                        </motion.section>
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-between items-center mb-10">
                          <div className="flex items-center gap-4">
                            <button 
                              onClick={() => setHomeFilter('all')}
                              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                            >
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            </button>
                            <h2 className="text-3xl font-black italic tracking-tighter text-slate-900 uppercase">
                              {homeFilter === 'sale' ? 'АКЦИЯ' : homeFilter === 'new' ? 'НОВИНКИ' : 'КАТАЛОГ'}
                            </h2>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                          {(homeFilter === 'sale' ? saleProducts : homeFilter === 'new' ? newProducts : filteredProducts).map(product => (
                            <ProductCard 
                              key={product.id}
                              product={product}
                              settings={settings}
                              onAddToCart={addToCart}
                              onToggleWishlist={toggleWishlist}
                              isWishlisted={wishlist.includes(product.id)}
                              onClick={(p) => navigate(`/product/${p.id}`)}
                              language={language}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </main>
                ) : (
                  <ContentPage section={settings.contentSections.find(s => s.id === activePage) || settings.contentSections[0] || { id: 'empty', title: '', blocks: [] }} />
                )}
              </EditableSection>
            </>
          } />
        </Routes>

        {/* Footer */}
        <EditableSection 
          id="footer" 
          title="Подвал сайта" 
          isActive={currentView === 'editor'} 
          onEdit={() => setActiveEditorModal('footer')} 
          onAddWidget={() => {}} 
          onOpenReorder={() => {}}
        >
          <Footer settings={settings} onPageClick={handlePageClick} language={language} />
        </EditableSection>
      </div>

      {/* Modals & Drawers */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart}
        onUpdateQuantity={(id, q) => setCart(prev => (prev || []).map(item => item.id === id ? { ...item, quantity: Math.max(0, q) } : item).filter(item => item.quantity > 0))}
        onRemove={(id) => setCart(prev => (prev || []).filter(item => item.id !== id))}
        language={language}
        currency={settings?.currency || '֏'}
        onCheckout={() => {
          alert('Оформление заказа...');
          setIsCartOpen(false);
        }}
      />

      <CatalogMenu 
        isOpen={isCatalogOpen} 
        onClose={() => setIsCatalogOpen(false)} 
        categories={categories}
        activeCategoryId=""
        onSelectCategory={() => {}}
      />

      {/* Editor Modals */}
      <BrandingModal 
        isOpen={activeEditorModal === 'branding'} 
        onClose={() => setActiveEditorModal(null)} 
        settings={settings} 
        onUpdate={setSettings} 
      />
      <BackgroundModal 
        isOpen={activeEditorModal === 'background'} 
        onClose={() => setActiveEditorModal(null)} 
        settings={settings.background} 
        onUpdate={(background) => setSettings({ ...settings, background })} 
      />
      <TickerModal 
        isOpen={activeEditorModal === 'ticker'} 
        onClose={() => setActiveEditorModal(null)} 
        settings={settings.ticker} 
        onUpdate={(ticker) => setSettings({ ...settings, ticker })} 
      />
      <SiteDataModal 
        isOpen={activeEditorModal === 'siteData'} 
        onClose={() => setActiveEditorModal(null)} 
        settings={settings}
        onUpdate={setSettings}
      />
      <TemplateSettingsModal 
        isOpen={activeEditorModal === 'template'} 
        onClose={() => setActiveEditorModal(null)} 
        settings={settings} 
        onUpdate={setSettings} 
      />
      <PopupsModal 
        isOpen={activeEditorModal === 'popups'} 
        onClose={() => setActiveEditorModal(null)} 
        settings={settings}
        onUpdate={setSettings}
      />
      <BannersModal 
        isOpen={activeEditorModal === 'banners'} 
        onClose={() => setActiveEditorModal(null)} 
        banners={banners} 
        onUpdate={setBanners} 
        products={products} 
      />
      <FooterModal 
        isOpen={activeEditorModal === 'footer'} 
        onClose={() => setActiveEditorModal(null)} 
        settings={settings} 
        onUpdate={setSettings} 
        onOpenContentEditor={(pageId) => {
          setAdminInitialMenu('Content');
          setAdminInitialPageId(pageId);
          setCurrentView('admin');
          setActiveEditorModal(null);
        }}
      />
      <ProductsEditorModal 
        isOpen={activeEditorModal === 'products'} 
        onClose={() => setActiveEditorModal(null)} 
        products={products} 
        onUpdateProducts={setProducts} 
        settings={settings}
        categories={categories}
      />
      
      <LiveChat settings={settings} />
          </div>
        } />
      </Routes>
      {/* Flying Items Animation */}
      <div className="fixed inset-0 pointer-events-none z-[9999]">
        {flyingItems.map(item => (
          <motion.div
            key={item.id}
            initial={{ x: item.startX, y: item.startY, scale: 1, opacity: 1 }}
            animate={{ x: item.endX, y: item.endY, scale: 0.1, opacity: 0.2 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="absolute w-16 h-16 rounded-full overflow-hidden border-2 border-[#82C12D] bg-white shadow-2xl flex items-center justify-center"
            style={{ left: -32, top: -32 }}
          >
            <img src={item.image} className="w-full h-full object-cover" alt="" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default App;
