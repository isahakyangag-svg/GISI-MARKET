
import React from 'react';
import { TickerSettings } from '../types';

interface TickerProps {
  settings: TickerSettings;
}

export const Ticker: React.FC<TickerProps> = ({ settings }) => {
  if (!settings.isActive || !settings.items || settings.items.length === 0) return null;

  const visibleItems = settings.items.filter(item => item.isVisible);
  if (visibleItems.length === 0) return null;

  // Duplicate items to ensure smooth infinite scroll
  const displayItems = [...visibleItems, ...visibleItems, ...visibleItems];

  return (
    <div 
      className="w-full overflow-hidden relative z-[40]"
      style={{ 
        backgroundColor: settings.backgroundColor || 'rgba(15, 23, 42, 0.9)',
        height: `${settings.height || 48}px`,
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <div 
        className="flex whitespace-nowrap animate-ticker"
        style={{ 
          animationDuration: `${settings.speed || 20}s`,
        }}
      >
        {displayItems.map((item, index) => (
          <div 
            key={`${item.id}-${index}`} 
            className="inline-flex items-center gap-3 px-8"
            style={{ 
              color: item.color || '#ffffff',
              fontSize: `${item.fontSize || 12}px`
            }}
          >
            {item.emoji && <span style={{ fontSize: `${(settings.height || 48) * 0.5}px` }}>{item.emoji}</span>}
            {item.imageUrl && (
              <img 
                src={item.imageUrl} 
                alt="" 
                style={{ height: `${(settings.height || 48) * 0.6}px`, width: 'auto' }} 
                className="object-contain" 
              />
            )}
            <span className="font-black uppercase tracking-widest">{item.text}</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-ticker {
          animation: ticker linear infinite;
        }
      `}</style>
    </div>
  );
};
