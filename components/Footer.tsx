
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreSettings, Language, FooterItem } from '../types';
import { translations } from '../translations';
import * as LucideIcons from 'lucide-react';

interface FooterProps {
  settings: StoreSettings;
  onPageClick: (pageId: string) => void;
  language: Language;
}

export const Footer: React.FC<FooterProps> = ({ settings, onPageClick, language }) => {
  const navigate = useNavigate();
  const footer = settings.footer;
  const t = translations[language] || translations.ru;

  const renderIcon = (iconName?: string) => {
    if (!iconName) return null;
    // Check if it's an emoji
    if (/\p{Emoji}/u.test(iconName)) return <span className="mr-2">{iconName}</span>;
    
    const Icon = (LucideIcons as any)[iconName];
    if (typeof Icon === 'function' && /^[A-Z]/.test(iconName)) {
      return <Icon size={14} className="mr-2 inline-block" />;
    }
    return null;
  };

  const renderItem = (item: FooterItem) => {
    if (!item.isVisible) return null;

    const commonStyle = {
      fontSize: `${item.style?.fontSize || 13}px`,
      fontWeight: item.style?.fontWeight || 'normal',
      fontStyle: item.style?.italic ? 'italic' : 'normal',
      color: footer.textColor || '#1A1A1A',
      textAlign: item.style?.textAlign || 'left',
      display: 'flex',
      alignItems: 'center',
      width: '100%'
    } as React.CSSProperties;

    switch (item.type) {
      case 'text':
        return <div key={item.id} style={commonStyle}>{renderIcon(item.icon)}{item.label}</div>;
      case 'link':
        return (
          <button 
            key={item.id} 
            onClick={() => onPageClick(item.url || item.label)}
            style={commonStyle} 
            className="hover:opacity-70 transition-opacity text-left bg-transparent border-none p-0 cursor-pointer group"
          >
            {renderIcon(item.icon)}
            <span className="group-hover:translate-x-1 transition-transform">{item.label}</span>
          </button>
        );
      case 'page':
        return (
          <button 
            key={item.id} 
            onClick={() => onPageClick(item.linkedPageId || 'home')}
            style={commonStyle} 
            className="hover:opacity-70 transition-opacity text-left bg-transparent border-none p-0 cursor-pointer group"
          >
            {renderIcon(item.icon) || '📄'}
            <span className="group-hover:translate-x-1 transition-transform ml-2">{item.label}</span>
          </button>
        );
      case 'image':
        return (
          <div key={item.id} className={`w-full flex ${item.style?.textAlign === 'center' ? 'justify-center' : item.style?.textAlign === 'right' ? 'justify-end' : 'justify-start'} py-2`}>
            <img src={item.url} alt={item.label} className="max-w-full h-auto rounded-lg shadow-sm" style={{ maxHeight: '150px' }} />
          </div>
        );
      case 'video':
        return (
          <div key={item.id} className="w-full py-2">
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black/20 group">
               {item.url?.includes('youtube') ? (
                 <iframe className="w-full h-full" src={item.url.replace('watch?v=', 'embed/')} frameBorder="0" allowFullScreen />
               ) : (
                 <video src={item.url} controls className="w-full h-full object-cover" />
               )}
            </div>
          </div>
        );
      case 'file':
        return (
          <a key={item.id} href={item.url} download style={commonStyle} className="flex items-center gap-2 py-1 group">
             {renderIcon(item.icon) || <LucideIcons.FileText size={14} />}
             <span className="underline underline-offset-4 decoration-current/30">{item.label}</span>
          </a>
        );
      default:
        return null;
    }
  };

  const paymentIcons = [
    { id: 'visa', icon: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg' },
    { id: 'mastercard', icon: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg' },
    { id: 'arca', icon: 'https://arca.am/img/logo.png' },
    { id: 'mir', icon: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Mir-logo.svg' }
  ];

  return (
    <footer 
      className="pt-24 pb-12 font-sans border-t border-slate-100 transition-colors duration-500 rounded-t-[4rem] mt-20" 
      style={{ 
        backgroundColor: footer.backgroundColor || '#FFFFFF',
        color: footer.textColor || '#1A1A1A'
      }}
    >
      <div className="container-premium">
        {/* Newsletter Section */}
        {footer.showSubscription !== false && (
          <div className="glass-dark p-10 mb-20 flex flex-col lg:flex-row items-center justify-between gap-10 rounded-[3rem] border border-white/10 shadow-sm text-white">
            <div className="max-w-md text-center lg:text-left">
              <h3 className="text-2xl font-black uppercase tracking-tighter italic">{t.newsletterTitle}</h3>
              <p className="text-sm font-bold opacity-50 mt-2">{t.newsletterSubtitle}</p>
            </div>
            <div className="flex w-full lg:w-auto gap-3 glass p-2 rounded-3xl shadow-inner border border-white/20">
              <input 
                type="email" 
                placeholder={footer.subscriptionPlaceholder || t.newsletterPlaceholder} 
                className="flex-grow lg:w-80 px-6 py-4 bg-transparent border-none outline-none text-sm font-bold text-white placeholder:text-white/50" 
              />
              <button className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-100 transition-all shadow-xl">
                {t.newsletterButton}
              </button>
            </div>
          </div>
        )}

        {/* Logo & Columns */}
        <div className="flex flex-col xl:flex-row gap-20 mb-24">
          {/* Logo Column */}
          <div className="xl:w-1/4 space-y-8">
            <button 
              onClick={() => { navigate('/'); onPageClick('home'); }}
              className="text-left bg-transparent border-none p-0 cursor-pointer hover:opacity-80 transition-opacity"
            >
              {footer.logoUrl ? (
                <img src={footer.logoUrl} alt="Footer Logo" className="h-12 w-auto object-contain" />
              ) : (
                <h2 className="text-3xl font-black italic tracking-tighter uppercase">
                  {(settings.storeName || '').split(' ')[0]}<span className="text-[#82C12D]">{(settings.storeName || '').split(' ').slice(1).join(' ') || ''}</span>
                </h2>
              )}
            </button>
            <p className="text-sm font-bold opacity-40 leading-relaxed uppercase tracking-tight">
              {footer.copyrightText}
            </p>
            <div className="flex gap-4">
              <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors"><LucideIcons.Instagram size={18} /></button>
              <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors"><LucideIcons.Facebook size={18} /></button>
              <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors"><LucideIcons.Twitter size={18} /></button>
            </div>
          </div>

          {/* Dynamic Columns */}
          <div className={`flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12`}>
            {(footer.columns || []).map(col => (
              <div key={col.id} className="space-y-8 group">
                 <h4 className="text-[12px] font-black uppercase tracking-[0.3em] opacity-30 border-b border-slate-100 pb-6 italic group-hover:opacity-100 transition-opacity">
                   {col.title}
                 </h4>
                 <div className="space-y-4">
                   {(col.items || []).map(item => renderItem(item))}
                 </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-100 pt-12 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex flex-col items-center md:items-start gap-2">
             <p className="text-[10px] font-black opacity-20 uppercase tracking-[0.4em]">
               Power by Gisi Market OS v3.5 • Premium CMS
             </p>
          </div>
          
          <div className="flex items-center gap-16">
             <div className="text-center md:text-right">
                <p className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-2">{t.supportTitle}</p>
                <p className="text-2xl font-black italic tracking-tighter">{footer.supportPhone}</p>
             </div>
             <div className="flex gap-4">
                {paymentIcons.map(card => (
                  <div key={card.id} className="h-8 w-12 flex items-center justify-center opacity-30 hover:opacity-100 transition-opacity grayscale hover:grayscale-0 cursor-help" title={card.id.toUpperCase()}>
                     <img src={card.icon} alt={card.id} className="max-h-full max-w-full object-contain" />
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
