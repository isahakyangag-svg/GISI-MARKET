
import React from 'react';
import { Category } from '../types';

interface CatalogMenuProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  activeCategoryId: string;
  onSelectCategory: (id: string) => void;
}

export const CatalogMenu: React.FC<CatalogMenuProps> = ({ 
  isOpen, 
  onClose, 
  categories, 
  activeCategoryId,
  onSelectCategory 
}) => {
  if (!isOpen) return null;

  const rootCategories = (categories || []).filter(c => !c.parentId);

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[90] bg-slate-900/20 backdrop-blur-sm animate-fade-in" 
        onClick={onClose} 
      />
      
      {/* Menu Container */}
      <div className="fixed top-[130px] left-0 right-0 z-[100] bg-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] border-b border-slate-100 animate-slide-down origin-top">
        <div className="container-premium py-12 px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10">
            
            {/* Все товары / Корень */}
            <div className="space-y-6">
               <button 
                 onClick={() => { onSelectCategory(''); onClose(); }}
                 className={`group flex items-center gap-4 p-4 rounded-2xl w-full transition-all ${activeCategoryId === '' ? 'bg-[#82C12D]/10' : 'hover:bg-slate-50'}`}
               >
                  <div className="w-12 h-12 bg-[#82C12D] text-white rounded-xl flex items-center justify-center text-xl shadow-lg shadow-emerald-100 group-hover:scale-110 transition-transform">
                    📦
                  </div>
                  <div className="text-left">
                    <p className="text-[13px] font-black text-slate-900 uppercase tracking-tight italic">Все товары</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Полный каталог</p>
                  </div>
               </button>
               <div className="h-px bg-slate-100 mx-4" />
            </div>

            {/* Динамические категории */}
            {(rootCategories || []).map(cat => {
              const subs = (categories || []).filter(c => c.parentId === cat.id);
              return (
                <div key={cat.id} className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="flex items-center gap-4 px-2">
                    {cat.image ? (
                      <img src={cat.image} className="w-10 h-10 rounded-xl object-cover shadow-sm border border-slate-100" alt={cat.name} />
                    ) : (
                      <div className="w-1.5 h-6 bg-[#82C12D] rounded-full" />
                    )}
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest italic">{cat.name}</h3>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <button 
                      onClick={() => { onSelectCategory(cat.id); onClose(); }}
                      className={`text-left px-4 py-2 text-[13px] font-bold rounded-xl transition-all ${activeCategoryId === cat.id ? 'text-[#82C12D] bg-[#82C12D]/5' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                    >
                      Смотреть всё
                    </button>
                    {(subs || []).map(sub => (
                      <button 
                        key={sub.id}
                        onClick={() => { onSelectCategory(sub.id); onClose(); }}
                        className={`text-left px-4 py-2 text-[13px] font-medium rounded-xl transition-all ${activeCategoryId === sub.id ? 'text-[#82C12D] bg-[#82C12D]/5' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-50'}`}
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Специальное предложение в меню */}
            <div className="lg:col-span-1 xl:col-start-5 hidden xl:block">
               <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden h-full min-h-[250px] group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#82C12D]/20 blur-3xl rounded-full" />
                  <div className="relative z-10 flex flex-col h-full">
                    <span className="text-[10px] font-black text-[#82C12D] uppercase tracking-[0.3em] mb-2">ХИТ ПРОДАЖ</span>
                    <h4 className="text-xl font-black italic tracking-tighter uppercase leading-tight mb-4">НОВИНКИ<br/>ЭЛЕКТРОНИКИ</h4>
                    <p className="text-[11px] text-slate-400 font-bold leading-relaxed mb-auto">Успейте купить по самым выгодным ценам этой весны.</p>
                    <button className="mt-6 w-full py-3 bg-white text-slate-950 rounded-xl text-[9px] font-black uppercase tracking-widest group-hover:bg-[#82C12D] group-hover:text-white transition-all">Смотреть</button>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};
