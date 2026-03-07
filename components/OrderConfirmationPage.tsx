import React from 'react';
import { motion } from 'motion/react';
import { useParams, useNavigate } from 'react-router-dom';
import { Order, StoreSettings } from '../types';
import { Check, Package, Truck, CreditCard, User, MapPin, Calendar, Clock, ChevronRight } from 'lucide-react';

interface OrderConfirmationPageProps {
  orders: Order[];
  settings: StoreSettings;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({ orders, settings }) => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const order = orders.find(o => o.id === orderId || o.orderNumber === orderId);
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

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Заказ не найден</h1>
          <button 
            onClick={() => navigate('/')}
            className="bg-[#82C12D] text-white px-6 py-2 rounded-lg font-bold"
          >
            Вернуться в магазин
          </button>
        </div>
      </div>
    );
  }

  const getShadow = () => {
    switch (design.shadowIntensity) {
      case 'soft': return 'shadow-sm';
      case 'medium': return 'shadow-md';
      case 'hard': return 'shadow-lg';
      default: return '';
    }
  };

  return (
    <div 
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8"
      style={{ 
        fontFamily: design.fontFamily,
        color: design.textColor,
        backgroundImage: design.backgroundUrl ? `url(${design.backgroundUrl})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: design.backgroundUrl ? 'transparent' : '#F8FAFC'
      }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {design.logoUrl && (
              <img src={design.logoUrl} alt="Logo" className="h-12 object-contain" />
            )}
            <h1 
              className="text-3xl font-black uppercase tracking-tighter"
              style={{ color: design.headerColor }}
            >
              Заказ оформлен
            </h1>
          </div>
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-200"
          >
            <Check size={24} strokeWidth={3} />
          </motion.div>
        </div>

        {/* Order Summary Card */}
        <div 
          className={`overflow-hidden mb-8 ${getShadow()}`}
          style={{ 
            backgroundColor: design.blockBackground,
            borderRadius: `${design.borderRadius}px`
          }}
        >
          <div className="bg-white/50 border-b border-slate-100 px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-bold text-sm uppercase tracking-widest">№</span>
              <span className="text-xl font-black text-slate-900">{order.orderNumber}</span>
            </div>
            <div className="text-slate-400 text-sm font-medium">
              {new Date(order.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Delivery & Payment */}
            <div className="space-y-6">
              <section>
                <div className="flex items-center gap-2 mb-3 text-slate-400 uppercase text-[10px] font-black tracking-widest">
                  <Truck size={14} className="text-[#82C12D]" />
                  Доставка
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-slate-900">{order.deliveryMethod || 'Курьерская доставка'}</p>
                  {order.deliveryDate && (
                    <p className="text-sm text-slate-500 flex items-center gap-1">
                      <Calendar size={12} /> {order.deliveryDate}
                      {order.deliveryTime && <span className="flex items-center gap-1 ml-2"><Clock size={12} /> {order.deliveryTime}</span>}
                    </p>
                  )}
                  <p className="text-sm text-slate-500 flex items-start gap-1">
                    <MapPin size={12} className="mt-1 flex-shrink-0" /> {order.deliveryAddress}
                  </p>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-3 text-slate-400 uppercase text-[10px] font-black tracking-widest">
                  <CreditCard size={14} className="text-[#82C12D]" />
                  Оплата
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-slate-900">{order.paymentMethod || 'Оплата при получении'}</p>
                  <p className="text-2xl font-black text-[#82C12D]">
                    {order.total.toLocaleString()} {settings.currency}
                  </p>
                </div>
              </section>
            </div>

            {/* Right Column: Customer Info */}
            <div className="space-y-6">
              <section>
                <div className="flex items-center gap-2 mb-3 text-slate-400 uppercase text-[10px] font-black tracking-widest">
                  <User size={14} className="text-[#82C12D]" />
                  Клиент
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-slate-900">{order.customerName || 'Имя не указано'}</p>
                  <p className="text-sm text-slate-500">{order.customerEmail}</p>
                  <p className="text-sm text-slate-500">{order.customerPhone}</p>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div 
          className={`overflow-hidden mb-12 ${getShadow()}`}
          style={{ 
            backgroundColor: design.blockBackground,
            borderRadius: `${design.borderRadius}px`
          }}
        >
          <div className="bg-white/50 border-b border-slate-100 px-6 py-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
              <Package size={16} className="text-[#82C12D]" />
              Товары в заказе
            </h3>
          </div>
          <div className="divide-y divide-slate-100">
            {order.items.map((item, idx) => (
              <div key={idx} className="p-6 flex items-center gap-6 bg-white/30 hover:bg-white/50 transition-colors">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-white border border-slate-100 flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                  <h4 className="font-bold text-slate-900 mb-1">{item.name}</h4>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {item.attributes?.map((attr, aIdx) => (
                      <span key={aIdx} className="text-[10px] font-bold uppercase px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md">
                        {attr.label}: {attr.value}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-400 font-medium">
                      {item.quantity} шт. × {item.price.toLocaleString()} {settings.currency}
                    </div>
                    <div className="font-black text-slate-900">
                      {(item.quantity * item.price).toLocaleString()} {settings.currency}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
            <span className="text-sm font-bold uppercase tracking-widest opacity-60">Итого к оплате</span>
            <span className="text-3xl font-black italic tracking-tighter">
              {order.total.toLocaleString()} {settings.currency}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="group relative inline-flex items-center gap-3 px-12 py-5 rounded-2xl font-black uppercase text-sm tracking-widest text-white transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-emerald-200 overflow-hidden"
            style={{ backgroundColor: design.buttonColor }}
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative z-10">{design.buttonText}</span>
            <ChevronRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
