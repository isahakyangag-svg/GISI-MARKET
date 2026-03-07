
import { Product } from '../types';

export const products: Product[] = [
  // --- Кондиционеры и климатическая техника ---
  {
    id: 'p_ballu_01',
    sku: 'BALLU-BSPR07HN1',
    brand: 'BALLU',
    status: 'active',
    name: 'Кондиционер BALLU BSPR07HN1',
    price: 45000,
    costPrice: 32000,
    maxDiscount: 10,
    allowDiscounts: true,
    unit: 'шт',
    description: 'Настенная сплит-система серии BSPR. Надежное решение для вашего комфорта в помещениях до 20 кв.м.',
    categoryId: 'cat5',
    image: 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=800',
    images: ['https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=800'],
    rating: 5,
    isNew: true,
    features: ['Авторестарт', 'Турбо режим', 'Самоочистка'],
    attributes: [
      { label: 'Артикул', value: 'BSPR07HN1' },
      { label: 'Площадь', value: 'до 20 м²' },
      { label: 'Мощность', value: '7000 BTU' },
      { label: 'Режимы', value: 'Холод / Тепло' },
      { label: 'Хладагент', value: 'R410A' },
      { label: 'Уровень шума', value: '23 дБ' }
    ],
    stock: 15
  },
  {
    id: 'p_ballu_02',
    sku: 'BALLU-BSPR09HN1',
    brand: 'BALLU',
    status: 'active',
    name: 'Кондиционер BALLU BSPR09HN1',
    price: 48000,
    costPrice: 35000,
    maxDiscount: 5,
    allowDiscounts: true,
    unit: 'шт',
    description: 'Производительный кондиционер для помещений до 25 кв.м.',
    categoryId: 'cat5',
    image: 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=800',
    images: ['https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=800'],
    rating: 5,
    isHit: true,
    features: ['Инвертор', 'Тихий режим'],
    attributes: [
      { label: 'Площадь', value: 'до 25 м²' },
      { label: 'Мощность', value: '9000 BTU' },
      { label: 'Класс энергоэффективности', value: 'A++' }
    ],
    stock: 8
  },
  // --- Ноутбуки ---
  {
    id: 'p_laptop_01',
    sku: 'NS-LAP-512',
    brand: 'SANCTY',
    status: 'active',
    name: 'Ноутбук 15.6 дюймов для работы и игр 16 + 512ГБ',
    price: 94720,
    oldPrice: 146998,
    costPrice: 65000,
    maxDiscount: 35,
    allowDiscounts: true,
    unit: 'шт',
    description: 'Разблокировка по отпечатку пальца, работает быстро и безопасно. Компактный и мощный помощник.',
    categoryId: 'cat1',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800'
    ],
    rating: 4.5,
    isPromo: true,
    features: ['Windows 10', 'Сканер отпечатка', 'Full HD экран'],
    attributes: [
      { label: 'Оперативная память', value: '16 ГБ DDR4' },
      { label: 'Объем SSD', value: '512 ГБ M.2' },
      { label: 'Процессор', value: 'Intel Pentium' },
      { label: 'Диагональ экрана', value: '15.6"' },
      { label: 'Разрешение', value: '1920x1080' },
      { label: 'Вес', value: '1.7 кг' }
    ],
    stock: 24,
    reviews: [
      { id: 'r1', productId: 'p_laptop_01', productName: 'Ноутбук SANCTY', reviewerName: 'Марк', rating: 5, comment: 'За свои деньги это лучший выбор. Очень шустрый.', date: '12 марта', status: 'approved', verified: true }
    ]
  },
  {
    id: 'p1',
    sku: 'NS-P1',
    brand: 'NovaStyle',
    status: 'active',
    name: 'Наушники Aero Pro',
    price: 349.99,
    costPrice: 200,
    maxDiscount: 15,
    allowDiscounts: true,
    unit: 'шт',
    description: 'Окунитесь в чистый звук с активным шумоподавлением и 40 часами автономной работы.',
    categoryId: 'cat1',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.8,
    features: ['Шумоподавление', 'Bluetooth 5.2', 'Пространственный звук'],
    attributes: [
      { label: 'Тип', value: 'Полноразмерные' },
      { label: 'Bluetooth', value: '5.2' },
      { label: 'Автономность', value: '40 часов' },
      { label: 'Разъем зарядки', value: 'Type-C' }
    ],
    stock: 12
  },
  {
    id: 'p2',
    sku: 'NS-P2',
    brand: 'NovaStyle',
    status: 'active',
    name: 'Смарт-часы Horizon',
    price: 199.99,
    costPrice: 120,
    maxDiscount: 10,
    allowDiscounts: true,
    unit: 'шт',
    description: 'Следите за здоровьем и оставайтесь на связи с новыми смарт-часами Horizon.',
    categoryId: 'cat2',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'],
    rating: 4.6,
    features: ['ЭКГ', 'GPS', 'Водонепроницаемость'],
    attributes: [
      { label: 'Экран', value: 'AMOLED' },
      { label: 'Защита', value: 'IP68' }
    ],
    stock: 25
  },
  {
    id: 'p3',
    sku: 'NS-P3',
    brand: 'NovaStyle',
    status: 'active',
    name: 'Кофемашина Barista Pro',
    price: 899.99,
    costPrice: 550,
    maxDiscount: 20,
    allowDiscounts: true,
    unit: 'шт',
    description: 'Профессиональный кофе у вас дома.',
    categoryId: 'cat3',
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80'],
    rating: 4.9,
    features: ['15 бар', 'Капучинатор', 'Сенсорное управление'],
    attributes: [
      { label: 'Давление', value: '15 бар' },
      { label: 'Объем', value: '2 л' }
    ],
    stock: 5
  },
  {
    id: 'p4',
    sku: 'NS-P4',
    brand: 'NovaStyle',
    status: 'active',
    name: 'Умная колонка Echo',
    price: 129.99,
    costPrice: 80,
    maxDiscount: 15,
    allowDiscounts: true,
    unit: 'шт',
    description: 'Ваш персональный ассистент с отличным звуком.',
    categoryId: 'cat4',
    image: 'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1589492477829-5e65395b66cc?auto=format&fit=crop&w=800&q=80'],
    rating: 4.7,
    features: ['Голосовое управление', 'Стереозвук', 'Умный дом'],
    attributes: [
      { label: 'Мощность', value: '30 Вт' },
      { label: 'Микрофоны', value: '4 шт' }
    ],
    stock: 40
  },
  {
    id: 'p5',
    sku: 'NS-P5',
    brand: 'NovaStyle',
    status: 'active',
    name: 'Робот-пылесос CleanBot',
    price: 449.99,
    costPrice: 280,
    maxDiscount: 10,
    allowDiscounts: true,
    unit: 'шт',
    description: 'Идеальная чистота без вашего участия.',
    categoryId: 'cat3',
    image: 'https://images.unsplash.com/photo-1589639960404-d893bb822f75?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1589639960404-d893bb822f75?auto=format&fit=crop&w=800&q=80'],
    rating: 4.5,
    features: ['Лидар', 'Влажная уборка', 'Автовыгрузка'],
    attributes: [
      { label: 'Время работы', value: '120 мин' },
      { label: 'Сила всасывания', value: '4000 Па' }
    ],
    stock: 18
  },
  {
    id: 'p6',
    sku: 'NS-P6',
    brand: 'NovaStyle',
    status: 'active',
    name: 'Планшет Tab X',
    price: 699.99,
    costPrice: 450,
    maxDiscount: 12,
    allowDiscounts: true,
    unit: 'шт',
    description: 'Мощный планшет для работы и творчества.',
    categoryId: 'cat1',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80'],
    rating: 4.8,
    features: ['120 Гц', 'Стилус в комплекте', '5G'],
    attributes: [
      { label: 'Экран', value: '12.4"' },
      { label: 'Память', value: '256 ГБ' }
    ],
    stock: 10
  },
  {
    id: 'p7',
    sku: 'NS-P7',
    brand: 'NovaStyle',
    status: 'active',
    name: 'Игровая консоль Quest',
    price: 499.99,
    costPrice: 350,
    maxDiscount: 5,
    allowDiscounts: true,
    unit: 'шт',
    description: 'Новое поколение игр.',
    categoryId: 'cat1',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80'],
    rating: 4.9,
    features: ['4K 120fps', 'Ray Tracing', 'SSD 1TB'],
    attributes: [
      { label: 'Процессор', value: 'Custom AMD' },
      { label: 'Память', value: '16 ГБ GDDR6' }
    ],
    stock: 7
  },
  {
    id: 'p8',
    sku: 'NS-P8',
    brand: 'NovaStyle',
    status: 'active',
    name: 'Электросамокат Glide',
    price: 599.99,
    costPrice: 400,
    maxDiscount: 8,
    allowDiscounts: true,
    unit: 'шт',
    description: 'Быстрое и экологичное перемещение по городу.',
    categoryId: 'cat5',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80'],
    rating: 4.4,
    features: ['Запас хода 45 км', 'Складной механизм', 'LED фара'],
    attributes: [
      { label: 'Скорость', value: '25 км/ч' },
      { label: 'Вес', value: '14 кг' }
    ],
    stock: 12
  },
  {
    id: 'p9',
    sku: 'NS-P9',
    brand: 'NovaStyle',
    status: 'active',
    name: 'Фотокамера Vision',
    price: 1299.99,
    costPrice: 850,
    maxDiscount: 10,
    allowDiscounts: true,
    unit: 'шт',
    description: 'Запечатлейте каждый момент в высоком качестве.',
    categoryId: 'cat1',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80'],
    rating: 4.7,
    features: ['45 Мп', '8K Видео', 'Автофокус по глазам'],
    attributes: [
      { label: 'Матрица', value: 'Full Frame' },
      { label: 'ISO', value: '100-51200' }
    ],
    stock: 4
  }
];
