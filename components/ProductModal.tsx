import React, { useState, useEffect, useRef } from 'react';
import { Product, Language, Review } from '../types';
import { Button } from './Button';
import { translations } from '../translations';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  onAddReview: (productId: string, review: Review) => void;
  language: Language;
  currency: string;
  loyaltyLevel?: string;
}

export const ProductModal: React.FC<ProductModalProps> = ({ 
  product, isOpen, onClose, onAddToCart, onAddReview, language, currency, loyaltyLevel = 'basic' 
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showFullSpecs, setShowFullSpecs] = useState(false);
  
  // Review Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewImages, setReviewImages] = useState<string[]>([]);
  const [reviewVideos, setReviewVideos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = translations[language];

  useEffect(() => {
    if (isOpen && product) {
      setActiveImageIndex(0);
      setShowFullSpecs(false);
      setShowSuccess(false);
      setIsFormOpen(false);
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const galleryImages = product.images && product.images.length > 0 ? product.images : [product.image || ''];

  const cashbackPercent = loyaltyLevel === 'platinum' ? 0.10 : loyaltyLevel === 'gold' ? 0.05 : loyaltyLevel === 'silver' ? 0.03 : 0.01;
  const cashbackAmount = Math.round((product.price || 0) * cashbackPercent);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const url = event.target.result as string;
          if (file.type.startsWith('image/')) {
            setReviewImages(prev => [...prev, url]);
          } else if (file.type.startsWith('video/')) {
            setReviewVideos(prev => [...prev, url]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) {
      alert(language === 'ru' ? 'Пожалуйста, заполните все обязательные поля.' : 'Please fill in all required fields.');
      return;
    }
    
    setIsSubmitting(true);
    
    const newReview: Review = {
      id: 'rev-' + Date.now(),
      productId: product.id,
      productName: product.name,
      reviewerName: reviewName,
      rating: reviewRating,
      comment: reviewComment,
      date: new Date().toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US', { day: 'numeric', month: 'long' }),
      status: 'approved',
      verified: true,
      images: reviewImages,
      videos: reviewVideos
    };
    
    // Simulate API delay
    setTimeout(() => {
      onAddReview(product.id, newReview);
      setReviewName('');
      setReviewComment('');
      setReviewRating(5);
      setReviewImages([]);
      setReviewVideos([]);
      setIsSubmitting(false);
      setShowSuccess(true);
      setIsFormOpen(false);
      setTimeout(() => setShowSuccess(false), 5000);
    }, 1200);
  };

  const FullSpecsOverlay = () => (
    <div className="absolute inset-0 z-[60] bg-white/95 backdrop-blur-xl animate-fade-in flex flex-col">
      <div className="p-8 md:p-14 flex items-center justify-between border-b border-slate-100">
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Характеристики и описание</h2>
        <button 
          onClick={() => setShowFullSpecs(false)} 
          className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-500 transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="flex-grow overflow-y-auto p-8 md:p-14 max-w-4xl mx-auto w-full space-y-12">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.64.304 1.24.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Документы проверены
        </div>

        <div className="space-y-10">
          <section className="space-y-6">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Основная информация</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-medium text-slate-400">Бренд</span>
                <div className="flex-grow border-b border-dotted border-slate-200 mx-3 h-0" />
                <span className="text-sm font-bold text-slate-900">{product.brand}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-medium text-slate-400">Модель</span>
                <div className="flex-grow border-b border-dotted border-slate-200 mx-3 h-0" />
                <span className="text-sm font-bold text-slate-900">{product.sku}</span>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Все характеристики</h3>
            <div className="space-y-8">
              {product.characteristicGroups && product.characteristicGroups.length > 0 ? (
                product.characteristicGroups.map(group => (
                  <div key={group.id} className="space-y-4">
                    <h4 className="text-sm font-black text-[#3BB19B] uppercase tracking-widest border-b border-[#3BB19B]/20 pb-1 inline-block">{group.name}</h4>
                    <div className="space-y-3">
                      {group.items.map(item => (
                        <div key={item.id} className="flex justify-between items-baseline">
                          <span className="text-sm font-medium text-slate-400">{item.name}</span>
                          <div className="flex-grow border-b border-dotted border-slate-200 mx-3 h-0" />
                          <span className="text-sm font-bold text-slate-900">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="space-y-4">
                  {(product.attributes || []).map((attr, i) => (
                    <div key={i} className="flex justify-between items-baseline">
                      <span className="text-sm font-medium text-slate-400">{attr.label}</span>
                      <div className="flex-grow border-b border-dotted border-slate-200 mx-3 h-0" />
                      <span className="text-sm font-bold text-slate-900">{attr.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="pt-10 border-t border-slate-100 space-y-6 pb-20">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Описание</h3>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-600 leading-relaxed font-medium whitespace-pre-line">
                {product.description || "Информация о товаре временно отсутствует."}
              </p>
            </div>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest pt-8">Вся информация предоставлена продавцом</p>
          </section>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl animate-fade-in" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-[1400px] h-full md:h-[95vh] glass md:rounded-[3rem] shadow-[0_120px_240px_-60px_rgba(0,0,0,0.3)] border-white/40 overflow-hidden flex flex-col animate-zoom-in">
        <button 
          onClick={onClose} 
          className="absolute top-8 right-8 z-50 p-4 glass hover:bg-white rounded-2xl text-slate-500 hover:text-slate-950 transition-all border-white shadow-2xl"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {showFullSpecs && <FullSpecsOverlay />}

        <div className="flex-grow overflow-y-auto p-6 md:p-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <div className="lg:col-span-1 hidden lg:flex flex-col gap-4">
              {(galleryImages || []).map((img, i) => (
                <button 
                  key={i}
                  onMouseEnter={() => setActiveImageIndex(i)}
                  className={`aspect-[3/4] rounded-2xl overflow-hidden border-4 transition-all ${activeImageIndex === i ? 'border-[#3BB19B] shadow-lg scale-105' : 'border-white/40 opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt={`Thumb ${i}`} />
                </button>
              ))}
            </div>

            <div className="lg:col-span-5 flex items-start justify-center">
              <div className="relative w-full aspect-square bg-white/30 rounded-[3.5rem] flex items-center justify-center p-8 border border-white/60 shadow-inner group">
                <img 
                  src={galleryImages[activeImageIndex] || ''} 
                  className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-110 drop-shadow-2xl" 
                  alt={product.name} 
                />
                <div className="absolute top-6 left-6 bg-gradient-to-r from-[#4ade80] to-[#fbbf24] text-white px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">
                  {language === 'ru' ? 'АКЦИЯ' : 'PROMO'}
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-10">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-[11px] font-black text-[#3BB19B] uppercase tracking-[0.3em] bg-[#3BB19B]/10 px-3 py-1.5 rounded-xl">{product.brand}</span>
                  <div className="flex items-center gap-1.5 text-amber-500 text-sm font-black">
                    <span>★</span> {product.rating || '4.5'}
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{product.reviews?.length || 0} {language === 'ru' ? 'отзывов' : 'reviews'} • 0 {language === 'ru' ? 'вопросов' : 'questions'}</span>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter italic leading-tight">
                  {product.name}
                </h1>
              </div>

              <div className="space-y-4 pt-8 border-t border-white/40">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-6">{language === 'ru' ? 'Характеристики' : 'Specifications'}</h3>
                <div className="space-y-3.5">
                  {(product.attributes || []).slice(0, 4).map((attr, i) => (
                    <div key={i} className="flex justify-between items-baseline">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{attr.label}</span>
                      <div className="flex-grow border-b border-dotted border-slate-200 mx-3 h-0" />
                      <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{attr.value}</span>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => setShowFullSpecs(true)}
                  className="text-[10px] font-black text-[#3BB19B] hover:text-emerald-700 uppercase tracking-widest pt-4 block"
                >
                  {language === 'ru' ? 'Все характеристики и описание' : 'All specifications & description'}
                </button>
              </div>

              <div className="flex items-center gap-4 pt-8 border-t border-white/40 text-slate-400">
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
                   <div className="w-8 h-8 bg-white/40 rounded-lg flex items-center justify-center">🔄</div>
                   {language === 'ru' ? 'Возврат через заявку' : 'Easy returns'}
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="glass-dark rounded-[3rem] border border-white/10 p-10 shadow-2xl space-y-8 sticky top-0 text-white">
                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    {product.oldPrice && (
                      <span className="text-lg font-bold text-white/30 line-through">{(Number(product.oldPrice) || 0).toLocaleString()} {currency}</span>
                    )}
                    <div className="flex items-baseline gap-4">
                      <span className="text-4xl font-black text-white tracking-tighter">{(Number(product.price) || 0).toLocaleString()} <span className="text-xl">{currency}</span></span>
                    </div>
                  </div>
                  
                  {/* Detailed Cashback Info */}
                  <div className="bg-emerald-500/20 border border-emerald-500/30 p-4 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest opacity-60">Ваш кэшбэк</p>
                      <p className="text-lg font-black text-emerald-400 tracking-tight">+{cashbackAmount.toLocaleString()} {currency}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest opacity-60">Уровень</p>
                       <p className="text-xs font-black text-emerald-400 uppercase">{loyaltyLevel}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{language === 'ru' ? `В наличии: ${product.stock} шт.` : `In stock: ${product.stock} pcs.`}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button 
                    onClick={(e) => onAddToCart(product, e)} 
                    className="w-full py-6 bg-white text-slate-900 rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl transition-all hover:scale-105"
                  >
                    {language === 'ru' ? 'Добавить в корзину' : 'Add to cart'}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full py-6 glass border-none text-white hover:bg-white/10 rounded-3xl font-black text-xs uppercase tracking-widest"
                  >
                    {language === 'ru' ? 'Купить сейчас' : 'Buy now'}
                  </Button>
                </div>
              </div>
            </div>

            {/* REVIEWS SECTION */}
            <div className="lg:col-span-12 mt-12 space-y-12 animate-slide-up">
               {/* Stats and Call to Action */}
               <div className="glass-dark p-10 md:p-14 rounded-[4rem] border border-white/10 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-16 overflow-hidden relative text-white">
                  {showSuccess && (
                    <div className="absolute inset-0 z-50 bg-[#3BB19B]/95 backdrop-blur-md flex flex-col items-center justify-center text-white animate-fade-in">
                       <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-6">
                          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                       </div>
                       <h3 className="text-3xl font-black uppercase tracking-tighter italic">{language === 'ru' ? 'Отзыв принят!' : 'Review accepted!'}</h3>
                       <p className="mt-2 font-bold uppercase tracking-widest opacity-80">{language === 'ru' ? 'Спасибо за ваш вклад' : 'Thank you for your feedback'}</p>
                    </div>
                  )}

                  <div className="text-center lg:text-left shrink-0 space-y-4">
                     <h2 className="text-[100px] font-black text-slate-950 tracking-tighter italic leading-none">{product.rating || '4.5'}</h2>
                     <div className="space-y-2">
                        <div className="flex justify-center lg:justify-start text-amber-500 text-3xl">★★★★★</div>
                        <p className="text-[11px] font-black text-[#3BB19B] uppercase tracking-[0.2em] italic">{language === 'ru' ? 'РЕКОМЕНДУЮТ 98% ПОКУПАТЕЛЕЙ' : '98% OF CUSTOMERS RECOMMEND'}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{language === 'ru' ? `НА ОСНОВЕ ${product.reviews?.length || 0} МНЕНИЙ` : `BASED ON ${product.reviews?.length || 0} REVIEWS`}</p>
                     </div>
                     {!isFormOpen && (
                        <button 
                          onClick={() => setIsFormOpen(true)}
                          className="mt-6 px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl"
                        >
                          {language === 'ru' ? 'Оставить отзыв' : 'Write a review'}
                        </button>
                     )}
                  </div>

                  <div className={`flex-grow w-full max-w-3xl space-y-6 transition-all duration-500 ${isFormOpen ? 'opacity-100 translate-y-0 visible h-auto' : 'opacity-0 translate-y-10 invisible h-0 overflow-hidden'}`}>
                     <form onSubmit={handleAddReviewSubmit} className="flex flex-col gap-6">
                        <div className="flex flex-col md:flex-row gap-6">
                           <input 
                              type="text" 
                              placeholder={language === 'ru' ? 'Ваше имя' : 'Your name'} 
                              value={reviewName}
                              onChange={(e) => setReviewName(e.target.value)}
                              className="flex-grow bg-white/60 p-5 rounded-2xl text-sm font-bold outline-none border border-white shadow-sm focus:border-[#3BB19B] transition-all"
                              required
                           />
                           <div className="flex items-center bg-white/60 p-3 rounded-2xl border border-white shadow-sm gap-4 px-6">
                              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{language === 'ru' ? 'ОЦЕНКА:' : 'RATING:'}</span>
                              <div className="flex text-2xl text-amber-500">
                                 {[1,2,3,4,5].map(s => (
                                    <button 
                                      key={s} 
                                      type="button" 
                                      onMouseEnter={() => setHoverRating(s)}
                                      onMouseLeave={() => setHoverRating(0)}
                                      onClick={() => setReviewRating(s)} 
                                      className={`transition-all duration-200 transform hover:scale-125 ${ (hoverRating || reviewRating) >= s ? 'text-amber-500 scale-110' : 'text-slate-200'}`}
                                    >
                                      ★
                                    </button>
                                 ))}
                              </div>
                           </div>
                        </div>
                        
                        <div className="relative">
                           <textarea 
                              placeholder={language === 'ru' ? 'Напишите ваш честный отзыв...' : 'Write your honest review...'} 
                              value={reviewComment}
                              onChange={(e) => setReviewComment(e.target.value)}
                              className="w-full bg-white/60 p-6 rounded-[2.5rem] text-sm font-bold outline-none border border-white shadow-sm focus:border-[#3BB19B] transition-all min-h-[160px] resize-none"
                              required
                           />
                           <div className="absolute bottom-4 right-4 flex items-center gap-4">
                              <input type="file" ref={fileInputRef} multiple accept="image/*,video/*" className="hidden" onChange={handleFileChange} />
                              <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 bg-white/80 hover:bg-white rounded-xl text-slate-400 hover:text-[#3BB19B] transition-all shadow-sm border border-white">
                                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                              </button>
                              <button 
                                 type="submit" 
                                 disabled={isSubmitting}
                                 className="bg-gradient-to-r from-[#4ade80] to-[#3BB19B] text-white px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                              >
                                 {isSubmitting ? (language === 'ru' ? 'ОБРАБОТКА...' : 'SUBMITTING...') : (language === 'ru' ? 'ОТПРАВИТЬ' : 'SUBMIT')}
                              </button>
                              <button type="button" onClick={() => setIsFormOpen(false)} className="p-4 text-slate-400 font-black text-[10px] uppercase hover:text-slate-900 transition-colors">
                                {language === 'ru' ? 'ОТМЕНА' : 'CANCEL'}
                              </button>
                           </div>
                        </div>

                        {(reviewImages.length > 0 || reviewVideos.length > 0) && (
                           <div className="flex flex-wrap gap-4 pt-2 animate-fade-in">
                              {(reviewImages || []).map((url, i) => (
                                 <div key={i} className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-white shadow-md group">
                                    <img src={url} className="w-full h-full object-cover" alt="Preview" />
                                    <button onClick={() => setReviewImages(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-rose-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="3" /></svg></button>
                                 </div>
                              ))}
                              {(reviewVideos || []).map((url, i) => (
                                 <div key={i} className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-white shadow-md group bg-slate-900 flex items-center justify-center">
                                    <video src={url} className="w-full h-full object-cover opacity-60" />
                                    <div className="absolute inset-0 flex items-center justify-center text-white"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg></div>
                                    <button onClick={() => setReviewVideos(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-rose-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="3" /></svg></button>
                                 </div>
                              ))}
                           </div>
                        )}
                     </form>
                  </div>
               </div>

               {/* Reviews List */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-20">
                  {(product.reviews || []).length > 0 ? (product.reviews || []).map((rev) => (
                    <div key={rev.id} className="glass-dark p-10 rounded-[4rem] border border-white/10 shadow-xl space-y-6 hover:translate-y-[-10px] transition-all group text-white">
                       <div className="flex justify-between items-start">
                          <div className="flex items-center gap-5">
                             <div className="w-14 h-14 bg-[#1e2b6e] text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg">
                                {(rev.reviewerName?.[0] || 'U').toUpperCase()}
                             </div>
                             <div>
                                <h5 className="font-black text-slate-950 tracking-tight">{rev.reviewerName}</h5>
                                <div className="flex items-center gap-1.5 mt-1">
                                   <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] text-white font-black">✓</div>
                                   <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">{language === 'ru' ? 'Купил товар' : 'Verified purchase'}</p>
                                </div>
                             </div>
                          </div>
                          <div className="text-right">
                             <div className="flex text-amber-500 text-sm mb-1">
                                {Array.from({length: 5}).map((_, i) => (
                                   <span key={i}>{i < rev.rating ? '★' : '☆'}</span>
                                ))}
                             </div>
                             <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{rev.date}</p>
                          </div>
                       </div>
                       <p className="text-sm font-bold text-slate-700 leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity">"{rev.comment}"</p>
                       {(rev.images?.length || 0) + (rev.videos?.length || 0) > 0 && (
                         <div className="flex flex-wrap gap-3 pt-2">
                           {(rev.images || []).map((url, idx) => <img key={idx} src={url} className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-sm hover:scale-150 transition-transform z-10 cursor-zoom-in" alt="review" />)}
                           {(rev.videos || []).map((url, idx) => (
                             <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-white shadow-sm bg-slate-900 flex items-center justify-center">
                               <video src={url} className="w-full h-full object-cover opacity-50" /><div className="absolute inset-0 flex items-center justify-center text-white"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg></div>
                             </div>
                           ))}
                         </div>
                       )}
                    </div>
                  )) : (
                    <div className="col-span-full py-24 text-center">
                       <div className="inline-block p-10 bg-white/20 backdrop-blur-md rounded-[3rem] border border-white/40">
                          <p className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">{language === 'ru' ? 'Будьте первым, кто оставит отзыв' : 'Be the first to write a review'}</p>
                       </div>
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