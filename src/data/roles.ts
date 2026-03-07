
import { AdminRole, AdminPermission } from '../../types';

export const ALL_PERMISSIONS: { id: AdminPermission; label: string; category: string }[] = [
  // Основные разделы
  { id: 'view_dashboard', label: 'Доступ к обзору', category: 'Разделы' },
  { id: 'view_products', label: 'Доступ к товарам', category: 'Разделы' },
  { id: 'view_categories', label: 'Доступ к категориям', category: 'Разделы' },
  { id: 'view_orders', label: 'Доступ к заказам', category: 'Разделы' },
  { id: 'view_users', label: 'Доступ к пользователям', category: 'Разделы' },
  { id: 'view_auth_settings', label: 'Доступ к странице входа', category: 'Разделы' },
  { id: 'view_reg_form', label: 'Доступ к форме регистрации', category: 'Разделы' },
  { id: 'view_visual_editor', label: 'Доступ к редактору сайта', category: 'Разделы' },
  { id: 'view_banners', label: 'Доступ к баннерам', category: 'Разделы' },
  { id: 'view_settings', label: 'Доступ к настройкам сайта', category: 'Разделы' },
  { id: 'manage_roles', label: 'Доступ к ролям и правам', category: 'Разделы' },
  { id: 'view_reports', label: 'Доступ к отчетам', category: 'Разделы' },
  { id: 'manage_discounts', label: 'Доступ к скидкам и акциям', category: 'Разделы' },
  { id: 'manage_reviews', label: 'Доступ к комментариям / отзывам', category: 'Разделы' },
  { id: 'manage_seo', label: 'Доступ к SEO-настройкам', category: 'Разделы' },
  { id: 'manage_promocodes', label: 'Доступ к промокодам', category: 'Разделы' },

  // Товары
  { id: 'add_products', label: 'Добавление товаров', category: 'Товары' },
  { id: 'edit_products', label: 'Редактирование товаров', category: 'Товары' },
  { id: 'delete_products', label: 'Удаление товаров', category: 'Товары' },

  // Категории
  { id: 'add_categories', label: 'Добавление категорий', category: 'Категории' },
  { id: 'edit_categories', label: 'Редактирование категорий', category: 'Категории' },
  { id: 'delete_categories', label: 'Удаление категорий', category: 'Категории' },

  // Заказы
  { id: 'status_orders', label: 'Изменение статуса заказа', category: 'Заказы' },
  { id: 'edit_orders', label: 'Редактирование заказа', category: 'Заказы' },
  { id: 'delete_orders', label: 'Удаление заказа', category: 'Заказы' },
  { id: 'export_orders', label: 'Экспорт заказов', category: 'Заказы' },

  // Пользователи
  { id: 'add_users', label: 'Добавление пользователей', category: 'Пользователи' },
  { id: 'edit_users', label: 'Редактирование пользователей', category: 'Пользователи' },
  { id: 'delete_users', label: 'Удаление пользователей', category: 'Пользователи' },
  { id: 'block_users', label: 'Блокировка пользователей', category: 'Пользователи' },
  { id: 'manage_permissions', label: 'Изменение прав доступа', category: 'Пользователи' },

  // Редактор сайта
  { id: 'manage_content', label: 'Редактирование текста и блоков', category: 'Редактор сайта' },
  { id: 'publish_content', label: 'Публикация изменений', category: 'Редактор сайта' },

  // Системные права
  { id: 'full_access', label: 'Полный доступ ко всей админке', category: 'Система' },
  { id: 'view_logs', label: 'Просмотр логов', category: 'Система' },
  { id: 'manage_system', label: 'Управление настройками системы', category: 'Система' },
];

export const DEFAULT_ROLES: AdminRole[] = [
  {
    id: 'super_admin',
    name: 'Супер админ',
    permissions: ['full_access'],
  },
  {
    id: 'senior_admin',
    name: 'Старший админ',
    permissions: [
      'view_dashboard', 'view_products', 'add_products', 'edit_products', 'delete_products',
      'view_categories', 'add_categories', 'edit_categories', 'delete_categories',
      'view_orders', 'status_orders', 'edit_orders', 'delete_orders', 'export_orders',
      'view_users', 'add_users', 'edit_users', 'delete_users', 'block_users',
      'view_auth_settings', 'view_reg_form', 'view_visual_editor', 'view_banners', 'view_settings',
      'manage_content', 'publish_content', 'view_reports', 'manage_discounts', 'manage_reviews', 'manage_seo', 'manage_promocodes',
      'view_logs'
    ],
  },
  {
    id: 'junior_admin',
    name: 'Младший админ',
    permissions: [
      'view_dashboard', 'view_products', 'add_products', 'edit_products',
      'view_categories', 'add_categories', 'edit_categories',
      'view_orders', 'status_orders', 'edit_orders',
      'view_users', 'view_banners', 'manage_reviews', 'manage_promocodes'
    ],
  },
  {
    id: 'project_manager',
    name: 'Руководитель проекта',
    permissions: [
      'view_dashboard', 'view_reports', 'view_users', 'view_visual_editor',
      'view_products', 'view_categories', 'view_orders', 'manage_content'
    ],
  },
  {
    id: 'manager',
    name: 'Менеджер',
    permissions: [
      'view_orders', 'status_orders', 'edit_orders', 'view_users',
      'view_products', 'view_categories'
    ],
  },
  {
    id: 'marketer',
    name: 'Маркетолог',
    permissions: [
      'view_banners', 'manage_discounts', 'manage_promocodes', 'manage_seo', 'view_reports'
    ],
  },
  {
    id: 'site_editor',
    name: 'Редактор сайта',
    permissions: [
      'view_visual_editor', 'manage_content', 'publish_content'
    ],
  },
  {
    id: 'banner_editor',
    name: 'Редактор баннеров',
    permissions: [
      'view_banners', 'add_products', 'edit_products' // Assuming banners are managed here
    ],
  },
  {
    id: 'product_editor',
    name: 'Редактор товаров',
    permissions: [
      'view_products', 'add_products', 'edit_products', 'delete_products',
      'view_categories', 'add_categories', 'edit_categories', 'delete_categories'
    ],
  },
  {
    id: 'order_operator',
    name: 'Оператор заказов',
    permissions: [
      'view_orders', 'status_orders', 'view_users'
    ],
  },
];
