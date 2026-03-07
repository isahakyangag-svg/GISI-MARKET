
import React from 'react';
import { Product, Language } from '../types';
import { Button } from './Button';
import { translations } from '../translations';
import { motion, AnimatePresence } from 'framer-motion';

interface WishlistModalProps {
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  onToggleWishlist: (id: string) => void;
  language: Language;
  currency: string;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({ 
  products, 
  isOpen, 
  onClose, 
  onAddToCart,
  onToggleWishlist,
  language,
  currency
}) => {
  const t = translations[language];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-8">
      <div 
        className="absolute inset-0 bg-[#0F172A]/60 backdrop-blur-xl animate-fade-in" 
        onClick={onClose} 
      />
      
      <div className="relative bg-white/90 backdrop-blur-3xl w-full max-w-4xl max-h-[85vh] rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border border-white overflow-hidden flex flex-col animate-zoom-in">
        
        {/* Header */}
        <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white/50">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">{t.wishlist}</h2>
            <p className="text-[10px] font-black text-[#3BB19B] uppercase tracking-[0.2em] mt-1">{(products || []).length} {language === 'ru' ? 'ТОВАРА В СПИСКЕ' : 'ITEMS IN LIST'}</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-4 bg-slate-50 hover:bg-rose-50 hover:text-rose-500 rounded-2xl text-slate-400 transition-all shadow-sm"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto hide-scrollbar p-10">
          {(products || []).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-30">
               <div className="text-6xl mb-6">❤️</div>
               <p className="font-black uppercase tracking-widest text-slate-900">Ваш список желаний пуст</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AnimatePresence>
                {(products || []).map(p => (
                  <motion.div 
                    key={p.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm flex gap-6 group relative"
                  >
                    <button 
                      onClick={() => onToggleWishlist(p.id)}
                      className="absolute top-4 right-4 text-rose-500 hover:scale-125 transition-transform"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </button>

                    <div className="w-32 h-32 bg-slate-50 rounded-3xl p-4 flex items-center justify-center shrink-0">
                      <img src={p.image || undefined} alt={p.name} className="max-h-full max-w-full object-contain mix-blend-multiply" />
                    </div>

                    <div className="flex flex-col justify-between flex-grow">
                      <div>
                        <p className="text-[9px] font-black text-[#3BB19B] uppercase tracking-widest mb-1">{p.brand}</p>
                        <h4 className="font-black text-slate-900 text-sm line-clamp-2 uppercase tracking-tight mb-2">{p.name}</h4>
                        <p className="text-xl font-black text-slate-950 tracking-tighter italic">{p.price.toLocaleString()} {currency}</p>
                      </div>
                      
                      <Button 
                        onClick={(e) => onAddToCart(p, e)}
                        className="w-full mt-4 bg-slate-900 text-white rounded-xl py-3 text-[10px] font-black uppercase tracking-widest shadow-lg"
                      >
                        {t.addToCart}
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="px-10 py-8 border-t border-slate-100 bg-slate-50 flex justify-end shrink-0">
           <button 
             onClick={onClose}
             className="px-12 py-4 bg-[#1e2b6e] text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all"
           >
             Вернуться к покупкам
           </button>
        </div>
      </div>
    </div>
  );
};
