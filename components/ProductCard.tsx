import React from 'react';
import { Product, StoreSettings, Language } from '../types';
import { translations } from '../translations';
import { Heart, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  settings: StoreSettings;
  onAddToCart: (p: Product, rect?: DOMRect) => void;
  onToggleWishlist: (id: string) => void;
  isWishlisted: boolean;
  onClick: (p: Product) => void;
  language: Language;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  settings, 
  onAddToCart, 
  onToggleWishlist, 
  isWishlisted,
  onClick,
  language
}) => {
  const t = translations[language] || translations.ru;
  const hasPromotion = product.promotion?.isActive;
  const displayPrice = hasPromotion && product.promotion?.promoPrice ? product.promotion.promoPrice : (product.price || 0);
  const oldPrice = hasPromotion ? (product.price || 0) : product.oldPrice;
  const discountPercent = hasPromotion && product.promotion?.discountPercent 
    ? product.promotion.discountPercent 
    : (oldPrice ? Math.round((1 - (Number(displayPrice) || 0) / (Number(oldPrice) || 1)) * 100) : 0);

  return (
    <div 
      className="glass rounded-[2rem] p-4 shadow-sm hover:shadow-xl transition-all group border-white/20 relative overflow-hidden cursor-pointer"
      onClick={() => onClick(product)}
    >
      <div className="relative aspect-square mb-4 rounded-2xl overflow-hidden bg-slate-50">
        <img 
          src={product.image || undefined} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id); }}
          className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white text-slate-400 hover:text-red-500'}`}
        >
          <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>
        {hasPromotion && (
          <span className="absolute top-4 left-4 bg-rose-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-rose-500/20 z-10">
            -{discountPercent}%
          </span>
        )}
        {!hasPromotion && product.isNew && <span className="absolute top-4 left-4 bg-[#82C12D] text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{t.new}</span>}
        {!hasPromotion && product.isHit && <span className="absolute top-4 left-4 bg-orange-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{t.hit}</span>}
      </div>

      <div className="space-y-2">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{product.brand}</p>
        <h3 className="text-sm font-bold text-slate-900 line-clamp-2 min-h-[40px] leading-tight">{product.name}</h3>
        <div className="flex items-center gap-2 pt-2">
          <span className={`text-xl font-black ${hasPromotion ? 'text-rose-500' : 'text-slate-900'}`}>
            {(Number(displayPrice) || 0).toLocaleString()} {settings?.currency || '֏'}
          </span>
          {oldPrice && (
            <span className="text-xs text-slate-400 line-through">
              {(Number(oldPrice) || 0).toLocaleString()} {settings?.currency || '֏'}
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button 
          className={`flex-grow py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${hasPromotion ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-500/20' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
        >
          {hasPromotion ? (language === 'ru' ? 'АКЦИЯ' : 'PROMO') : t.details}
        </button>
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            const rect = e.currentTarget.getBoundingClientRect();
            onAddToCart(product, rect); 
          }}
          className="w-12 h-12 bg-[#82C12D] text-white rounded-xl flex items-center justify-center hover:bg-opacity-90 transition-all shadow-lg shadow-emerald-100"
        >
          <ShoppingCart size={20} />
        </button>
      </div>
    </div>
  );
};
