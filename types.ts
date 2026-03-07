
export type Language = 'en' | 'ru' | 'hy';
export type UserRole = 'super_admin' | 'admin' | 'operator' | 'moderator' | 'finance' | 'support' | 'seller_manager' | 'customer';
export type OrderStatus = 'created' | 'paid' | 'packed' | 'shipped' | 'delivered' | 'completed' | 'cancelled';
export type ModerationStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'blocked';
export type SellerStatus = 'onboarding' | 'active' | 'suspended' | 'review';
export type ShipmentStatus = 'ready' | 'in_transit' | 'delivered' | 'failed';
export type DisputeStatus = 'requested' | 'approved' | 'received' | 'refunded' | 'rejected';

export type AdminPermission = 
  | 'view_dashboard'
  | 'view_products' | 'add_products' | 'edit_products' | 'delete_products'
  | 'view_categories' | 'add_categories' | 'edit_categories' | 'delete_categories'
  | 'view_orders' | 'status_orders' | 'edit_orders' | 'delete_orders' | 'export_orders'
  | 'view_users' | 'add_users' | 'edit_users' | 'delete_users' | 'block_users' | 'manage_roles' | 'manage_permissions'
  | 'view_auth_settings' | 'view_reg_form' | 'view_visual_editor' | 'view_banners' | 'view_settings'
  | 'manage_content' | 'publish_content'
  | 'view_reports' | 'manage_discounts' | 'manage_reviews' | 'manage_seo' | 'manage_promocodes'
  | 'full_access' | 'view_logs' | 'manage_system';

export interface AdminRole {
  id: string;
  name: string;
  permissions: AdminPermission[];
}

export interface User {
  id: string;
  name: string;
  surname?: string;
  email: string;
  role: UserRole;
  avatar: string;
  joinedDate: string;
  phone?: string;
  status?: string;
  segment?: 'high_value' | 'regular' | 'risky';
  isPhoneVerified?: boolean;
  loyaltyPoints?: number;
  loyaltyLevel?: 'basic' | 'silver' | 'gold' | 'platinum';
  smsNotificationsEnabled?: boolean;
  address?: string;
  cashback?: number;
  adminLogin?: string;
  adminPassword?: string;
  password?: string;
  ip?: string;
  age?: number;
  roleId?: string;
  customPermissions?: AdminPermission[];
  isBlocked?: boolean;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  reviewerName: string;
  rating: number;
  comment: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected' | 'draft';
  verified: boolean;
  images?: string[];
  videos?: string[];
}

export interface CharacteristicItem {
  id: string;
  name: string;
  value: string;
}

export interface CharacteristicGroup {
  id: string;
  name: string;
  items: CharacteristicItem[];
}

export interface PromotionInfo {
  isActive: boolean;
  discountPercent?: number;
  promoPrice?: number;
  startDate?: string;
  endDate?: string;
}

export interface Product {
  id: string;
  tenantId?: string;
  sellerId?: string;
  name: string;
  brand: string;
  model?: string;
  price: number;
  oldPrice?: number;
  costPrice: number;
  stock: number;
  categoryId: string;
  subCategoryId?: string;
  sku: string;
  moderationStatus?: ModerationStatus;
  status?: string;
  images: string[];
  attributes: { label: string; value: string }[];
  updatedAt?: string;
  image?: string;
  description?: string;
  rating: number;
  features: string[];
  maxDiscount?: number;
  allowDiscounts?: boolean;
  unit?: string;
  isPromo?: boolean;
  isHit?: boolean;
  isNew?: boolean;
  reviews?: Review[];
  discount?: number;
  category?: string;
  characteristicGroups?: CharacteristicGroup[];
  promotion?: PromotionInfo;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  sellerId: string;
  status: OrderStatus;
  total: number;
  subtotal?: number;
  discount?: number;
  items: { 
    productId: string; 
    quantity: number; 
    price: number;
    name?: string;
    image?: string;
    attributes?: { label: string; value: string }[];
  }[];
  deliveryMethod?: string;
  deliveryAddress: string;
  deliveryDate?: string;
  deliveryTime?: string;
  paymentMethod?: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
  warehouseId: string;
  date?: string;
}

export interface BackgroundSettings {
  imageUrl: string;
  size: 'cover' | 'contain' | 'auto';
  position: 'center' | 'top' | 'bottom' | 'left' | 'right' | 'center center';
  behavior: 'fixed' | 'scroll';
  color: string;
  overlayOpacity: number;
  blur: number;
  applyToHome: boolean;
  applyToCart: boolean;
  applyToProfile: boolean;
  applyToAdmin: boolean;
  isHidden?: boolean;
  videoUrl?: string;
  isFixed?: boolean;
}

export interface FooterItem {
  id: string;
  label: string;
  url?: string;
  linkedPageId?: string;
  type: 'link' | 'text' | 'image' | 'video' | 'file' | 'page';
  isVisible: boolean;
  icon?: string;
  style?: {
    fontSize?: number;
    fontWeight?: string;
    italic?: boolean;
    color?: string;
    textAlign?: 'left' | 'center' | 'right';
  };
}

export interface FooterColumn {
  id: string;
  title: string;
  items: FooterItem[];
  columnSize?: number;
}

export interface FooterSettings {
  copyrightText: string;
  supportPhone: string;
  columns: FooterColumn[];
  backgroundColor?: string;
  textColor?: string;
  layout?: 'grid' | 'flex' | 'columns';
  logoUrl?: string;
  showSubscription?: boolean;
  subscriptionPlaceholder?: string;
  paymentIcons?: string[];
}

export interface TickerItem {
  id: string;
  text: string;
  imageUrl?: string;
  emoji?: string;
  color?: string;
  fontSize?: number;
  isVisible: boolean;
}

export interface TickerSettings {
  items: TickerItem[];
  speed: number; // seconds for full cycle
  backgroundColor?: string;
  isActive: boolean;
  height?: number; // in pixels
}

export interface QuickReply {
  id: string;
  label: string;
  text: string;
}

export interface ChatSettings {
  enabled: boolean;
  title: string;
  status: 'online' | 'offline';
  avatarUrl: string;
  welcomeMessage: string;
  // Design
  headerColor: string;
  buttonColor: string;
  chatBackground: string;
  userMessageColor: string;
  adminMessageColor: string;
  buttonPosition: 'left' | 'right';
  buttonIcon: string;
  // Telegram
  telegramBotToken: string;
  telegramChatId: string;
  // Quick Replies
  quickReplies: QuickReply[];
}

export interface PromoCode {
  id: string;
  code: string;
  discount: number; // percentage
  isActive: boolean;
  discountValue?: number;
  type?: 'percent' | 'fixed';
  status?: 'active' | 'expired';
  usedCount?: number;
  minOrderAmount?: number;
  usageLimit?: number;
  expiresAt?: string;
}

export interface OrderDesignSettings {
  logoUrl?: string;
  backgroundUrl?: string;
  textColor: string;
  headerColor: string;
  buttonColor: string;
  buttonText: string;
  blockBackground: string;
  borderRadius: number;
  shadowIntensity: 'none' | 'soft' | 'medium' | 'hard';
  fontFamily: string;
  showIcons: boolean;
}

export interface TelegramSettings {
  botToken: string;
  chatId: string;
  enabled: boolean;
}

export interface StoreSettings {
  storeName: string;
  logoUrl?: string;
  logoWidth?: number;
  logoHeight?: number;
  headerDisplayMode?: 'logo' | 'text' | 'both';
  currency: string;
  primaryColor: string;
  accentColor: string;
  borderRadius: string;
  background: BackgroundSettings;
  design?: {
    fontFamily: string;
    buttonRadius: string;
    menuStyle?: string;
    headerWeight?: string;
    linkColor?: string;
  };
  footer: FooterSettings;
  ticker: TickerSettings;
  adminEmail?: string;
  adminPassword?: string;
  contentType?: 'products' | 'services';
  popups?: {
    id: string;
    name: string;
    active: boolean;
    type: string;
  }[];
  security?: {
    is2FAEnabled: boolean;
  };
  bannerAutoPlay?: boolean;
  bannerAutoPlaySpeed?: number;
  chat?: ChatSettings;
  telegram?: TelegramSettings;
  orderDesign?: OrderDesignSettings;
  openaiKey?: string;
  authSettings: AuthPageSettings;
  socialLogins: SocialLoginProvider[];
  registrationFields: RegistrationField[];
  menuItems: MenuItem[];
  siteSocialIcons: SiteSocialIcon[];
  contentSections: ContentSection[];
}

export interface Category {
  id: string;
  name: string;
  parentId?: string;
  slug?: string;
  description?: string;
  image?: string;
  status: 'active' | 'inactive';
}

export interface SocialLoginProvider {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
  order: number;
}

export interface RegistrationField {
  id: string;
  type: 'text' | 'email' | 'password' | 'phone' | 'date' | 'select' | 'checkbox';
  label: string;
  placeholder?: string;
  required: boolean;
  enabled: boolean;
  order: number;
  options?: string[];
}

export interface MenuItem {
  id: string;
  label: string;
  url: string;
  order: number;
  enabled: boolean;
}

export interface SiteSocialIcon {
  id: string;
  type: 'instagram' | 'vk' | 'facebook' | 'telegram' | 'youtube' | 'twitter' | 'other';
  url: string;
  enabled: boolean;
  order: number;
}

export interface ContentBlock {
  id: string;
  type: 'text' | 'image' | 'video' | 'header';
  content: string;
  style?: {
    fontSize?: number;
    textAlign?: 'left' | 'center' | 'right';
    fontWeight?: string;
  };
}

export interface ContentSection {
  id: string;
  title: string;
  slug: string;
  blocks: ContentBlock[];
  isVisible: boolean;
}

export interface AuthPageSettings {
  backgroundUrl: string;
  overlayOpacity: number;
  primaryColor: string;
  buttonColor: string;
  textColor: string;
  borderRadius: number;
  shadowIntensity: 'soft' | 'medium' | 'hard';
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  buttonText?: string;
  status: 'active' | 'inactive';
  order: number;
  imageUrl?: string;
  videoUrl?: string;
  animationType?: 'fade' | 'slide';
  overlayOpacity?: number;
  contentAlignment?: 'left' | 'center' | 'right';
}

export interface AITask {
  id: string;
  title: string;
  status: 'todo' | 'done';
}

export interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'document';
  size: number;
  folder: string;
  createdAt: string;
  dimensions?: string;
}

export interface DeveloperLog {
  id: string;
  timestamp: string;
  adminEmail: string;
  request: string;
  result: 'success' | 'error';
  changes: string[];
  versionId: string;
}

export interface AIVersion {
  id: string;
  timestamp: string;
  settings: StoreSettings;
  products: Product[];
  categories: Category[];
  description: string;
}
