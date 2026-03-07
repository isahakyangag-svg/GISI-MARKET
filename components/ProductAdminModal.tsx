
import React, { useState, useEffect, useRef } from 'react';
import { Product, Category, StoreSettings, CharacteristicGroup, PromotionInfo } from '../types';
import { CharacteristicsEditor, PromotionEditor } from './admin/ProductEditors';

interface ProductAdminModalProps {
  product: Product | null;
  categories: Category[];
  settings: StoreSettings;
  isOpen: boolean;
  onClose: () => void;
  onSave: (p: Product) => void;
}

// Выносим компоненты за пределы основного функционального компонента,
// чтобы избежать потери фокуса (ре-маунтинга) при каждом вводе буквы.
const Section = ({ title, children, isOpen = true }: { title: string, children?: React.ReactNode, isOpen?: boolean }) => (
  <div className="bg-white border border-slate-200 rounded-lg shadow-sm mb-4 overflow-hidden">
    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between cursor-pointer hover:bg-white transition-colors">
      <h3 className="text-[14px] font-bold text-slate-800">{title}</h3>
      <svg className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 15l7-7 7 7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </div>
    <div className="p-6 bg-white">{children}</div>
  </div>
);

const InputLabel = ({ children, required = false }: { children?: React.ReactNode, required?: boolean }) => (
  <label className="block text-[12px] font-medium text-slate-600 mb-2">
    {children}{required && <span className="text-rose-500 ml-0.5 font-bold">*</span>}
  </label>
);

export const ProductAdminModal: React.FC<ProductAdminModalProps> = ({
  product, categories, settings, isOpen, onClose, onSave
}) => {
  const [formData, setFormData] = useState<Product>({
    id: '', sku: '', name: '', brand: '', description: '', 
    categoryId: '', subCategoryId: '', image: '', images: [], 
    price: 0, oldPrice: 0, costPrice: 0, maxDiscount: 0, stock: 0, unit: 'шт', 
    status: 'active', rating: 5, features: [], attributes: [],
    isNew: true, isHit: false, isPromo: false,
    characteristicGroups: [],
    promotion: { isActive: false }
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (product) {
        setFormData(product);
      } else {
        setFormData({
          id: 'p-' + Date.now(), sku: '', name: '', brand: '', description: '', 
          categoryId: categories[0]?.id || '', subCategoryId: '', 
          image: '', images: [], 
          price: 0, oldPrice: 0, costPrice: 0, maxDiscount: 0, stock: 0, unit: 'шт', 
          status: 'active', rating: 5, features: [], attributes: [],
          isNew: true, isHit: false, isPromo: false
        });
      }
    }
  }, [product, isOpen, categories]);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const url = ev.target?.result as string;
        setFormData(prev => ({
          ...prev,
          image: prev.image ? prev.image : url,
          images: [...(prev.images || []), url]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const generateSerialNumber = () => {
    const randomNum = Math.floor(1000000 + Math.random() * 9000000);
    setFormData(prev => ({ ...prev, sku: randomNum.toString() }));
  };

  return (
    <div className="fixed inset-0 z-[10000] flex flex-col bg-white font-['Inter'] overflow-hidden animate-fade-in">
      
      {/* HEADER */}
      <header className="h-[60px] bg-white border-b border-slate-200 px-6 flex items-center shrink-0 shadow-sm">
        <button onClick={onClose} className="p-2 -ml-2 text-slate-400 hover:text-slate-900 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <h1 className="ml-4 text-[18px] font-medium text-slate-800">
          {product ? 'Редактирование товара' : 'Новый товар'}
        </h1>
      </header>

      {/* CONTENT AREA */}
      <div className="flex-grow overflow-y-auto p-6 md:p-8 hide-scrollbar bg-white">
        <div className="max-w-[1000px] mx-auto space-y-4">
          
          {/* SECTION: О ТОВАРЕ */}
          <Section title="О товаре">
            <div className="space-y-6">
              {/* Media */}
              <div>
                <div className="flex items-center gap-1 mb-2">
                  <InputLabel>Медиа</InputLabel>
                  <div className="w-4 h-4 rounded-full border border-slate-300 text-slate-300 text-[10px] flex items-center justify-center cursor-help">?</div>
                </div>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 rounded-lg p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white transition-all group bg-white"
                >
                  <input type="file" ref={fileInputRef} className="hidden" multiple accept="image/*" onChange={handleImageUpload} />
                  <span className="text-blue-500 font-medium text-sm hover:underline">Добавить файлы</span>
                  <p className="text-[12px] text-slate-400 mt-1">Загрузите файлы с расширением .jpg, .png, .gif</p>
                </div>
                <button className="text-blue-500 text-[12px] font-medium mt-3 hover:underline">Добавить ссылку на видео</button>
              </div>

              {/* Name */}
              <div className="space-y-1">
                <InputLabel required>Наименование</InputLabel>
                <input 
                  type="text" 
                  value={formData.name || ''}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded focus:border-blue-400 outline-none transition-all text-sm"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <InputLabel>Описание</InputLabel>
                <div className="border border-slate-300 rounded overflow-hidden">
                  <div className="bg-white border-b border-slate-200 px-3 py-2 flex flex-wrap gap-4 items-center">
                    <div className="flex gap-2">
                      <button type="button" className="p-1 font-black text-slate-600 hover:bg-slate-100 rounded">B</button>
                      <button type="button" className="p-1 italic text-slate-600 hover:bg-slate-100 rounded">I</button>
                    </div>
                    <div className="h-4 w-px bg-slate-200" />
                    <button type="button" className="text-[12px] text-slate-600 flex items-center gap-1">Формат <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg></button>
                    <div className="h-4 w-px bg-slate-200" />
                    <div className="flex gap-3 text-slate-400">
                      <span>A</span><span>E</span><span>F</span>
                    </div>
                  </div>
                  <textarea 
                    value={formData.description || ''}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="Укажите главные особенности, характеристики и ключевые слова, чтобы сгенерировать более качественное описание."
                    className="w-full p-6 text-sm outline-none min-h-[180px] resize-none text-slate-700 leading-relaxed bg-white"
                  />
                  <div className="border-t border-slate-200 px-4 py-2 flex items-center justify-between bg-white">
                    <button type="button" className="flex items-center gap-2 text-[#6C5DD3] text-[13px] font-bold">
                       <span className="text-lg">✨</span> Создать с AI
                    </button>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{(formData.description || '').split(' ').filter(x => x).length} WORDS</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <input type="checkbox" id="add-desc" className="w-4 h-4 rounded border-slate-300" />
                  <label htmlFor="add-desc" className="text-[13px] text-slate-600">Дополнительное описание</label>
                </div>
              </div>
            </div>
          </Section>

          {/* SECTION: ЦЕНЫ И ОСТАТКИ */}
          <Section title="Цены и остатки">
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-[13px] font-bold text-slate-800">Цены</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <InputLabel required>Цена</InputLabel>
                    <div className="relative">
                      <input 
                        type="number" value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                        className="w-full px-4 py-2.5 border border-slate-300 bg-white rounded outline-none focus:border-blue-400 text-sm" 
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-slate-400 uppercase">{settings?.currency || 'руб'}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      <InputLabel>Цена до скидки</InputLabel>
                      <span className="w-3 h-3 rounded-full border border-slate-300 text-slate-300 text-[8px] flex items-center justify-center cursor-help">?</span>
                    </div>
                    <div className="relative">
                      <input 
                        type="number" value={formData.oldPrice} onChange={e => setFormData({...formData, oldPrice: parseFloat(e.target.value) || 0})}
                        className="w-full px-4 py-2.5 border border-slate-300 bg-white rounded outline-none focus:border-blue-400 text-sm text-slate-400" 
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-slate-400 uppercase">{settings?.currency || 'руб'}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      <InputLabel>Себестоимость</InputLabel>
                      <span className="w-3 h-3 rounded-full border border-slate-300 text-slate-300 text-[8px] flex items-center justify-center cursor-help">?</span>
                    </div>
                    <div className="relative">
                      <input 
                        type="number" value={formData.costPrice} onChange={e => setFormData({...formData, costPrice: parseFloat(e.target.value) || 0})}
                        className="w-full px-4 py-2.5 border border-slate-300 bg-white rounded outline-none focus:border-blue-400 text-sm text-slate-400" 
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-slate-400 uppercase">{settings?.currency || 'руб'}</span>
                    </div>
                  </div>
                </div>
                <button type="button" className="text-blue-500 text-[12px] font-medium hover:underline">Типы цен</button>
              </div>

              <div className="pt-6 border-t border-slate-100 space-y-4">
                <p className="text-[13px] font-bold text-slate-800">Остатки</p>
                <div className="max-w-md space-y-2">
                  <InputLabel>Склад</InputLabel>
                  <input 
                    type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-2.5 border border-slate-300 bg-white rounded outline-none focus:border-blue-400 text-sm" 
                    placeholder="∞"
                  />
                </div>
              </div>
            </div>
          </Section>

          {/* SECTION: СЕРИЙНЫЙ НОМЕР И ГАБАРИТЫ */}
          <Section title="Серийный номер и габариты">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <div className="flex items-center gap-2">
                      <InputLabel>Серийный номер</InputLabel>
                      <span className="w-3 h-3 rounded-full border border-slate-300 text-slate-300 text-[8px] flex items-center justify-center cursor-help -mt-2">?</span>
                      <button 
                        type="button"
                        onClick={generateSerialNumber}
                        title="Сгенерировать случайный номер"
                        className="p-1 -mt-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md transition-all border border-blue-200 flex items-center justify-center"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                   </div>
                   <input 
                    type="text" 
                    value={formData.sku || ''} 
                    onChange={e => setFormData({...formData, sku: e.target.value})} 
                    placeholder="Напр: 1234567"
                    className="w-full px-4 py-2.5 border border-slate-300 bg-white rounded text-sm outline-none focus:border-blue-400 transition-all" 
                   />
                </div>
                <div className="space-y-2">
                   <div className="flex items-center gap-1">
                      <InputLabel>Штрих-код</InputLabel>
                      <span className="w-3 h-3 rounded-full border border-slate-300 text-slate-300 text-[8px] flex items-center justify-center cursor-help">?</span>
                   </div>
                   <input type="text" className="w-full px-4 py-2.5 border border-slate-300 bg-white rounded text-sm outline-none focus:border-blue-400 transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <InputLabel>Вес, кг</InputLabel>
                   <input type="number" className="w-full px-4 py-2.5 border border-slate-300 bg-white rounded text-sm outline-none focus:border-blue-400 transition-all" />
                </div>
                <div className="space-y-2">
                   <InputLabel>Габариты (ДхШхВ), см</InputLabel>
                   <div className="flex items-center gap-2">
                      <input type="number" className="w-full px-4 py-2.5 border border-slate-300 bg-white rounded text-sm outline-none focus:border-blue-400 transition-all" />
                      <span className="text-slate-300">x</span>
                      <input type="number" className="w-full px-4 py-2.5 border border-slate-300 bg-white rounded text-sm outline-none focus:border-blue-400 transition-all" />
                      <span className="text-slate-300">x</span>
                      <input type="number" className="w-full px-4 py-2.5 border border-slate-300 bg-white rounded text-sm outline-none focus:border-blue-400 transition-all" />
                   </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 italic">Если товар поставляется в нескольких упаковках, в полях вес и габариты укажите сумму параметров по всем упаковкам</p>
            </div>
          </Section>

          {/* SECTION: ВАРИАНТЫ ТОВАРА */}
          <Section title="Варианты товара">
            <p className="text-[13px] text-slate-400 leading-relaxed bg-white">
              Варианты товара - это отдельные товарные позиции, которые отличаются по одной или нескольким значениям свойств вариантов. Например, футболка размера S может быть вариантом товара футболка
            </p>
            <button type="button" className="text-blue-500 text-[13px] font-medium mt-6 hover:underline">Добавить</button>
          </Section>

          {/* SECTION: ОПЦИИ */}
          <Section title="Опции">
            <p className="text-[13px] text-slate-400 leading-relaxed bg-white">
              Опции позволяют дать покупателю возможность кастомизировать товар. Например, пицца может иметь опции дополнительного сыра или соуса.
            </p>
            <button type="button" className="text-blue-500 text-[13px] font-medium mt-6 hover:underline">Добавить</button>
          </Section>

          {/* SECTION: ХАРАКТЕРИСТИКИ */}
          <Section title="Характеристики">
            <CharacteristicsEditor 
              groups={formData.characteristicGroups || []} 
              onChange={(groups) => setFormData({ ...formData, characteristicGroups: groups })}
            />
          </Section>

          {/* SECTION: АКЦИЯ */}
          <Section title="Акция">
            <PromotionEditor 
              promotion={formData.promotion || { isActive: false }} 
              onChange={(promo) => setFormData({ ...formData, promotion: promo })}
            />
          </Section>

          <div className="h-20" /> {/* Spacer */}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="h-[70px] bg-white border-t border-slate-200 px-8 flex items-center justify-end shrink-0 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
        <button 
          onClick={() => onSave(formData)}
          className="px-10 py-3 bg-[#E0E5EA] text-slate-400 rounded font-bold text-sm transition-all hover:bg-[#337ab7] hover:text-white"
        >
          {product ? 'Сохранить' : 'Создать'}
        </button>
      </footer>
    </div>
  );
};
