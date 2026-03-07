
import React, { useState, useEffect } from 'react';
import { Banner, StoreSettings } from '../types';

interface HeroSliderProps {
  banners: Banner[];
  settings: StoreSettings;
  onBannerClick?: (banner: Banner) => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ banners, settings, onBannerClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const activeBanners = (banners || []).filter(b => b.status === 'active').sort((a, b) => a.order - b.order);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  if (activeBanners.length === 0) return null;

  return (
    <div className="container-premium mt-10 no-print">
      <div className="relative h-[300px] md:h-[550px] group rounded-[3rem] overflow-hidden shadow-2xl">
        {activeBanners.map((banner, index) => {
          const isActive = index === currentIndex;
          const alignClass = 
            banner.contentAlignment === 'center' ? 'items-center text-center' :
            banner.contentAlignment === 'right' ? 'items-end text-right' : 'items-start text-left';

          return (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-all duration-1000 transform ${isActive ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'}`}
            >
              {/* Background Media */}
              <div className="absolute inset-0">
                {banner.videoUrl ? (
                  <div className="w-full h-full bg-black relative">
                    {banner.videoUrl.includes('youtube') ? (
                      <iframe 
                        className="absolute inset-0 w-full h-full pointer-events-none opacity-80"
                        src={`${banner.videoUrl.replace('watch?v=', 'embed/')}?autoplay=1&mute=1&loop=1&playlist=${(banner.videoUrl.match(/[?&]v=([^&]+)/) || [])[1] || banner.videoUrl.split('/').pop()}&controls=0`}
                        frameBorder="0"
                        allow="autoplay; encrypted-media"
                      />
                    ) : (
                      <video autoPlay muted loop className="w-full h-full object-cover opacity-80">
                        <source src={banner.videoUrl} type="video/mp4" />
                      </video>
                    )}
                  </div>
                ) : (
                  <img src={banner.imageUrl} alt="" className="w-full h-full object-cover" />
                )}
                {/* Overlay for better readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-transparent to-slate-950/20" />
              </div>

              {/* Content Overlay */}
              <div className={`absolute inset-0 flex flex-col justify-center p-12 md:p-24 ${alignClass} z-20`}>
                <h2 className={`text-4xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none drop-shadow-2xl transition-all duration-1000 delay-300 ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                  {banner.title}
                </h2>
                <p className={`mt-4 text-sm md:text-xl font-bold text-white/80 uppercase tracking-[0.3em] transition-all duration-1000 delay-500 ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                  {banner.subtitle}
                </p>
                <button 
                  onClick={() => onBannerClick?.(banner)} 
                  className={`mt-10 px-12 py-5 bg-white text-slate-950 font-black uppercase text-[10px] tracking-[0.3em] rounded-full hover:bg-[#82C12D] hover:text-white transition-all shadow-2xl transform active:scale-95 duration-1000 delay-700 ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                >
                  {banner.buttonText}
                </button>
              </div>
            </div>
          );
        })}

        {/* Navigation Controls */}
        <button 
          onClick={() => setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length)} 
          className="absolute left-10 top-1/2 -translate-y-1/2 z-30 w-14 h-14 rounded-full glass text-white flex items-center justify-center border-white/20 shadow-2xl hover:bg-white hover:text-slate-950 transition-all opacity-0 group-hover:opacity-100"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="3"/></svg>
        </button>
        <button 
          onClick={() => setCurrentIndex((prev) => (prev + 1) % activeBanners.length)} 
          className="absolute right-10 top-1/2 -translate-y-1/2 z-30 w-14 h-14 rounded-full glass text-white flex items-center justify-center border-white/20 shadow-2xl hover:bg-white hover:text-slate-950 transition-all opacity-0 group-hover:opacity-100"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="3"/></svg>
        </button>

        {/* Indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
           {activeBanners.map((_, i) => (
             <button 
                key={i} 
                onClick={() => setCurrentIndex(i)} 
                className={`h-1 rounded-full transition-all duration-500 shadow-md ${i === currentIndex ? 'w-12 bg-white' : 'w-4 glass border-none hover:bg-white/50'}`} 
             />
           ))}
        </div>
      </div>
    </div>
  );
};
