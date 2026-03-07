
import React, { useState } from 'react';
import { Product, Language, Review } from '../types';
import { ShoppingCart, Heart, ArrowLeft, Star, CheckCircle2, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductPageProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (p: Product, rect?: DOMRect) => void;
  onAddReview: (id: string, r: Review) => void;
  language: Language;
  currency: string;
  loyaltyLevel?: string;
}

export const ProductPage: React.FC<ProductPageProps> = ({
  product, onBack, onAddToCart, onAddReview, language, currency, loyaltyLevel
}) => {
  const [activeImage, setActiveImage] = useState(product.image || (product.images && product.images.length > 0 ? product.images[0] : ''));
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '', name: '' });
  const [showSuccess, setShowSuccess] = useState(false);

  const images = product.images && product.images.length > 0 ? product.images : [product.image || ''];

  const reviews = product.reviews || [];
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : '0.0';

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const filesArray = Array.from(files);
    filesArray.forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReviewForm(prev => ({
          ...prev,
          images: [...(prev.images || []), reader.result as string]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeReviewImage = (index: number) => {
    setReviewForm(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index)
    }));
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.comment || !reviewForm.name) return;

    const newReview: Review = {
      id: Date.now().toString(),
      productId: product.id,
      productName: product.name,
      reviewerName: reviewForm.name,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
      date: new Date().toLocaleDateString(),
      status: 'approved',
      verified: true,
      images: reviewForm.images
    };

    onAddReview(product.id, newReview);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setReviewForm({ rating: 5, comment: '', name: '', images: [] });
    }, 3000);
  };

  const hasPromotion = product.promotion?.isActive;
  const displayPrice = hasPromotion && product.promotion?.promoPrice ? product.promotion.promoPrice : (product.price || 0);
  const oldPrice = hasPromotion ? (product.price || 0) : product.oldPrice;
  const discountPercent = hasPromotion && product.promotion?.discountPercent 
    ? product.promotion.discountPercent 
    : (oldPrice ? Math.round((1 - (Number(displayPrice) || 0) / (Number(oldPrice) || 1)) * 100) : 0);

  return (
    <div className="min-h-screen bg-slate-50/30 pb-20">
      <div className="container-premium pt-10">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-black uppercase text-[11px] tracking-widest mb-10 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          {language === 'ru' ? 'Назад в каталог' : 'Back to catalog'}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left: Images */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-8 rounded-[4rem] aspect-square flex items-center justify-center overflow-hidden shadow-2xl relative group"
            >
              <img 
                src={activeImage || undefined} 
                alt={product.name} 
                className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700" 
              />
              {oldPrice && (
                <div className="absolute top-10 left-10 bg-rose-500 text-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-xl">
                  -{discountPercent}%
                </div>
              )}
            </motion.div>

            <div className="grid grid-cols-4 gap-6">
              {images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`glass p-4 rounded-3xl aspect-square flex items-center justify-center overflow-hidden transition-all ${activeImage === img ? 'ring-4 ring-[#82C12D] scale-95 shadow-inner' : 'hover:scale-105 opacity-60 hover:opacity-100'}`}
                >
                  <img src={img || undefined} className="max-w-full max-h-full object-contain mix-blend-multiply" alt="" />
                </button>
              ))}
            </div>
          </div>

            {/* Right: Info */}
            <div className="lg:col-span-5 space-y-8">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-4">
                  <span className="px-4 py-1.5 bg-[#82C12D]/10 text-[#82C12D] rounded-full text-[10px] font-black uppercase tracking-widest">{product.brand}</span>
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">SKU: {product.sku}</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                  {product.name}
                </h1>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full">
                    <span className="text-sm font-black text-amber-600">{averageRating}</span>
                    <div className="flex text-amber-500">
                      {Array.from({length: 5}).map((_, i) => <Star key={i} size={14} fill={i < Math.floor(Number(averageRating)) ? "currentColor" : "none"} />)}
                    </div>
                  </div>
                  <span className="text-sm font-black text-slate-400">({reviews.length} {language === 'ru' ? 'отзывов' : 'reviews'})</span>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 space-y-8 border border-slate-100">
                  <div className="flex items-baseline gap-4">
                    <span className={`text-5xl font-black tracking-tighter ${hasPromotion ? 'text-rose-500' : 'text-slate-900'}`}>{ (Number(displayPrice) || 0).toLocaleString()} {currency}</span>
                    {oldPrice && <span className="text-xl font-bold text-slate-300 line-through">{ (Number(oldPrice) || 0).toLocaleString()} {currency}</span>}
                  </div>

                  <div className="space-y-4">
                    <button 
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        onAddToCart(product, rect);
                      }}
                      className="w-full bg-[#A855F7] text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-4 hover:bg-[#9333EA] transition-all shadow-lg shadow-purple-200 transform active:scale-95"
                    >
                      <ShoppingCart size={18} />
                      {language === 'ru' ? 'Добавить в корзину' : 'Add to cart'}
                    </button>
                    <button 
                      onClick={() => {
                        onAddToCart(product);
                        // In a real app, this would redirect to checkout
                      }}
                      className="w-full bg-[#F5F3FF] text-[#A855F7] py-5 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-4 hover:bg-[#EDE9FE] transition-all border border-purple-100 transform active:scale-95"
                    >
                      {language === 'ru' ? 'Купить сейчас' : 'Buy now'}
                    </button>
                  </div>

                  <div className="pt-4 space-y-3 border-t border-slate-50">
                    <div className="flex items-center gap-3 text-slate-500">
                      <Truck size={18} className="text-[#82C12D]" />
                      <span className="text-xs font-bold uppercase tracking-wider">{language === 'ru' ? 'Завтра, склад WB' : 'Tomorrow, WB warehouse'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500">
                      <ShieldCheck size={18} className="text-[#82C12D]" />
                      <span className="text-xs font-bold uppercase tracking-wider">{language === 'ru' ? 'Магазин 4,3' : 'Store 4.3'}</span>
                    </div>
                  </div>
                </div>

                <p className="text-slate-500 leading-relaxed text-lg font-medium">
                  {product.description || (language === 'ru' ? 'Превосходное качество и современный дизайн. Этот товар станет отличным дополнением к вашему образу жизни.' : 'Superior quality and modern design. This product will be a great addition to your lifestyle.')}
                </p>
              </motion.div>
            </div>
        </div>

        {/* Characteristics Section */}
        {product.characteristicGroups && product.characteristicGroups.length > 0 && (
          <div className="mt-32 space-y-16">
            <div className="flex items-center justify-between">
              <h2 className="text-4xl font-black text-slate-900 italic uppercase tracking-tighter">{language === 'ru' ? 'Характеристики' : 'Specifications'}</h2>
              <div className="h-1 flex-grow mx-10 bg-slate-100 rounded-full" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12">
              {product.characteristicGroups.map(group => (
                <div key={group.id} className="space-y-6">
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight border-b-2 border-slate-900 pb-2 inline-block">
                    {group.name}
                  </h3>
                  <div className="space-y-4">
                    {group.items.map(item => (
                      <div key={item.id} className="flex justify-between items-baseline gap-4 border-b border-slate-100 pb-2">
                        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest shrink-0">{item.name}</span>
                        <div className="flex-grow border-b border-dotted border-slate-200 mx-2" />
                        <span className="text-sm font-black text-slate-900 text-right">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="mt-32 space-y-16">
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-black text-slate-900 italic uppercase tracking-tighter">{language === 'ru' ? 'Отзывы покупателей' : 'Customer Reviews'}</h2>
            <div className="h-1 flex-grow mx-10 bg-slate-100 rounded-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Review Summary & Form */}
            <div className="lg:col-span-4 space-y-8">
              <div className="glass p-8 rounded-[3rem] space-y-6">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-6xl font-black text-slate-900 tracking-tighter leading-none">{averageRating}</p>
                    <div className="flex text-amber-500 mt-2 justify-center">
                      {Array.from({length: 5}).map((_, i) => <Star key={i} size={14} fill={i < Math.floor(Number(averageRating)) ? "currentColor" : "none"} />)}
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{reviews.length} {language === 'ru' ? 'оценок' : 'ratings'}</p>
                  </div>
                  <div className="flex-grow space-y-2">
                    {[5,4,3,2,1].map(star => {
                      const count = reviews.filter(r => r.rating === star).length;
                      const percent = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                      return (
                        <div key={star} className="flex items-center gap-3">
                          <span className="text-[10px] font-black text-slate-400 w-2">{star}</span>
                          <div className="flex-grow h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${percent}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* All Review Photos Summary */}
                {reviews.some(r => r.images && r.images.length > 0) && (
                  <div className="pt-6 border-t border-slate-100">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{language === 'ru' ? 'Фото покупателей' : 'Customer photos'}</h4>
                      <button className="text-[10px] font-black text-[#82C12D] uppercase tracking-widest hover:underline">
                        {language === 'ru' ? 'Смотреть все' : 'View all'}
                      </button>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                      {reviews.flatMap(r => r.images || []).slice(0, 10).map((img, i) => (
                        <div key={i} className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-100 shadow-sm">
                          <img src={img} className="w-full h-full object-cover" alt="" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="glass-dark p-10 rounded-[3rem] text-white space-y-8 relative overflow-hidden">
                {showSuccess && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 z-50 bg-[#3BB19B]/95 backdrop-blur-md flex flex-col items-center justify-center text-white p-8 text-center"
                  >
                    <CheckCircle2 size={64} className="mb-6" />
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter">{language === 'ru' ? 'Спасибо за отзыв!' : 'Thanks for the review!'}</h3>
                  </motion.div>
                )}
                
                <h3 className="text-xl font-black uppercase italic tracking-tighter">{language === 'ru' ? 'Оставить отзыв' : 'Leave a review'}</h3>
                <form onSubmit={handleReviewSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-4">{language === 'ru' ? 'Ваше имя' : 'Your name'}</label>
                    <input 
                      type="text" 
                      required
                      value={reviewForm.name}
                      onChange={e => setReviewForm({...reviewForm, name: e.target.value})}
                      className="w-full bg-white/10 border border-white/10 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-[#82C12D]" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-4">{language === 'ru' ? 'Оценка' : 'Rating'}</label>
                    <div className="flex gap-2">
                      {[1,2,3,4,5].map(s => (
                        <button 
                          key={s} 
                          type="button"
                          onClick={() => setReviewForm({...reviewForm, rating: s})}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${reviewForm.rating >= s ? 'bg-amber-500 text-white' : 'bg-white/10 text-white/40'}`}
                        >
                          <Star size={16} fill={reviewForm.rating >= s ? "currentColor" : "none"} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-4">{language === 'ru' ? 'Комментарий' : 'Comment'}</label>
                    <textarea 
                      required
                      rows={4}
                      value={reviewForm.comment}
                      onChange={e => setReviewForm({...reviewForm, comment: e.target.value})}
                      className="w-full bg-white/10 border border-white/10 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-[#82C12D] resize-none" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-4">{language === 'ru' ? 'Фото товара' : 'Product photos'}</label>
                    <div className="flex flex-wrap gap-3">
                      {(reviewForm.images || []).map((img, idx) => (
                        <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/20">
                          <img src={img} className="w-full h-full object-cover" alt="" />
                          <button 
                            type="button"
                            onClick={() => removeReviewImage(idx)}
                            className="absolute top-0 right-0 bg-rose-500 text-white p-0.5 rounded-bl-lg"
                          >
                            <ArrowLeft size={10} className="rotate-45" />
                          </button>
                        </div>
                      ))}
                      <label className="w-16 h-16 rounded-xl border-2 border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/5 transition-colors">
                        <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                        <span className="text-xl text-white/40">+</span>
                      </label>
                    </div>
                  </div>

                  <button className="w-full py-5 bg-[#82C12D] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-emerald-900/20">
                    {language === 'ru' ? 'Отправить' : 'Submit'}
                  </button>
                </form>
              </div>
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {reviews.length > 0 ? reviews.map((rev) => (
                  <div key={rev.id} className="glass p-8 rounded-[3rem] space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-lg">
                          {rev.reviewerName[0].toUpperCase()}
                        </div>
                        <div>
                          <h5 className="font-black text-slate-900 tracking-tight">{rev.reviewerName}</h5>
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{rev.date}</p>
                        </div>
                      </div>
                      <div className="flex text-amber-500">
                        {Array.from({length: 5}).map((_, i) => <Star key={i} size={14} fill={i < rev.rating ? "currentColor" : "none"} />)}
                      </div>
                    </div>
                    <p className="text-slate-500 font-medium leading-relaxed italic">"{rev.comment}"</p>
                    
                    {rev.images && rev.images.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {rev.images.map((img, i) => (
                          <div key={i} className="w-20 h-20 rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:scale-105 transition-transform cursor-zoom-in">
                            <img src={img} className="w-full h-full object-cover" alt="" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )) : (
                  <div className="col-span-2 py-20 text-center glass rounded-[3rem]">
                    <p className="text-slate-300 font-black uppercase tracking-[0.3em]">{language === 'ru' ? 'Отзывов пока нет' : 'No reviews yet'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
