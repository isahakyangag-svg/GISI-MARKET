
import React, { useState, useRef } from 'react';
import { Product, StoreSettings, Category } from '../types';
import * as XLSX from 'xlsx';
import { generateSKU } from '../utils/sku';

interface ProductsEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUpdateProducts: (p: Product[]) => void;
  settings: StoreSettings;
  categories: Category[];
}

type TabId = 'catalog' | 'import_export' | 'prices_stock';

const Section = ({ title, children }: { title: string, children?: React.ReactNode }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-6 mb-4">
    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{title}</h4>
    <div className="space-y-4">{children}</div>
  </div>
);

const ProductForm = ({ 
  product, 
  onUpdate, 
  onCancel, 
  currency,
  categories,
  allProducts
}: { 
  product: Product, 
  onUpdate: (p: Product) => void, 
  onCancel: () => void,
  currency: string,
  categories: Category[],
  allProducts: Product[]
}) => {
  const [localProduct, setLocalProduct] = useState({
    ...product,
    sku: product.sku || generateSKU(allProducts),
    images: product.images || [product.image || ''],
    costPrice: product.costPrice || 0
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setLocalProduct(prev => ({
            ...prev,
            images: [...(prev.images || []), base64String],
            image: prev.image || base64String
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between mb-4">
         <h3 className="text-xl font-black uppercase tracking-tighter italic">Редактирование товара</h3>
         <div className="flex gap-3">
            <button onClick={onCancel} className="px-6 py-2 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-900">Отмена</button>
            <button onClick={() => onUpdate(localProduct)} className="px-8 py-2 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-100">Сохранить</button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Section title="Основная информация">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Название товара</label>
                <input 
                  type="text" 
                  value={localProduct.name} 
                  onChange={e => setLocalProduct({...localProduct, name: e.target.value})}
                  className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:bg-white focus:border-indigo-400 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Артикул (SKU)</label>
                  <input 
                    type="text" 
                    value={localProduct.sku} 
                    readOnly
                    className="w-full p-3 bg-slate-100 border border-slate-100 rounded-xl text-sm font-black outline-none cursor-not-allowed"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Бренд / Фирма</label>
                  <input 
                    type="text" 
                    value={localProduct.brand} 
                    onChange={e => setLocalProduct({...localProduct, brand: e.target.value})}
                    className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:bg-white focus:border-indigo-400"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Модель</label>
                  <input 
                    type="text" 
                    value={localProduct.model || ''} 
                    onChange={e => setLocalProduct({...localProduct, model: e.target.value})}
                    className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:bg-white focus:border-indigo-400"
                  />
                </div>
              </div>
            </div>
          </Section>

          <Section title="Цены и Наличие">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Закупочная цена ({currency})</label>
                <input 
                  type="number" 
                  value={localProduct.costPrice} 
                  onChange={e => setLocalProduct({...localProduct, costPrice: parseFloat(e.target.value) || 0})}
                  className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-black outline-none focus:bg-white focus:border-indigo-400"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Цена продажи ({currency})</label>
                <input 
                  type="number" 
                  value={localProduct.price} 
                  onChange={e => setLocalProduct({...localProduct, price: parseFloat(e.target.value) || 0})}
                  className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-black outline-none focus:bg-white focus:border-indigo-400"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Старая цена</label>
                <input 
                  type="number" 
                  value={localProduct.oldPrice || 0} 
                  onChange={e => setLocalProduct({...localProduct, oldPrice: parseFloat(e.target.value) || 0})}
                  className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-black outline-none focus:bg-white focus:border-indigo-400 text-slate-400"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Остаток на складе</label>
                <input 
                  type="number" 
                  value={localProduct.stock} 
                  onChange={e => setLocalProduct({...localProduct, stock: parseInt(e.target.value) || 0})}
                  className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-black outline-none focus:bg-white focus:border-indigo-400"
                />
              </div>
            </div>
          </Section>
        </div>

        <div className="space-y-6">
          <Section title="Медиа">
            <div className="space-y-4">
               <div className="grid grid-cols-3 gap-2 mb-4">
                  {(localProduct.images || []).map((img, idx) => (
                    <div key={idx} className="relative aspect-square bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center overflow-hidden p-2 group">
                      <img src={img} className="max-w-full max-h-full object-contain mix-blend-multiply" alt="" />
                      <button 
                        onClick={() => {
                          const next = (localProduct.images || []).filter((_, i) => i !== idx);
                          setLocalProduct({ ...localProduct, images: next, image: next[0] || '' });
                        }}
                        className="absolute inset-0 bg-rose-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="3"/></svg>
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:text-indigo-500 hover:border-indigo-300 transition-all cursor-pointer">
                    <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="3"/></svg>
                    <span className="text-[8px] font-black uppercase tracking-widest">Добавить</span>
                  </label>
               </div>
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Или вставьте URL Изображения</label>
                  <input 
                    type="text" 
                    placeholder="https://..."
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        const val = (e.target as HTMLInputElement).value;
                        if (val) {
                          setLocalProduct({ ...localProduct, images: [...(localProduct.images || []), val], image: localProduct.image || val });
                          (e.target as HTMLInputElement).value = '';
                        }
                      }
                    }}
                    className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-indigo-400"
                  />
               </div>
            </div>
          </Section>

          <Section title="Категория">
             <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Выберите категорию</label>
                <select 
                  value={localProduct.categoryId} 
                  onChange={e => {
                    const cat = categories.find(c => c.id === e.target.value);
                    setLocalProduct({...localProduct, categoryId: e.target.value, category: cat?.name});
                  }}
                  className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none"
                >
                   <option value="">Без категории</option>
                   {categories.map(c => (
                     <option key={c.id} value={c.id}>{c.name}</option>
                   ))}
                </select>
             </div>
          </Section>
        </div>
      </div>
    </div>
  );
};

export const ProductsEditorModal: React.FC<ProductsEditorModalProps> = ({ 
  isOpen, onClose, products, onUpdateProducts, settings, categories 
}) => {
  const [activeTab, setActiveTab] = useState<TabId>('catalog');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const filteredProducts = (products || []).filter(p => 
    (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.sku || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот товар?')) {
      onUpdateProducts(products.filter(p => p.id !== id));
    }
  };

  const handleAdd = () => {
    const newProduct: Product = {
      id: 'p' + Date.now(),
      name: 'Новый товар',
      brand: 'Бренд',
      price: 0,
      costPrice: 0,
      stock: 0,
      categoryId: '',
      sku: generateSKU(products),
      images: [],
      image: 'https://picsum.photos/seed/product/400/400',
      attributes: [],
      rating: 5,
      features: [],
      unit: 'шт'
    };
    setEditingProduct(newProduct);
  };

  const handleSaveProduct = (p: Product) => {
    const exists = products.find(prod => prod.id === p.id);
    if (exists) {
      onUpdateProducts(products.map(prod => prod.id === p.id ? p : prod));
    } else {
      onUpdateProducts([...products, p]);
    }
    setEditingProduct(null);
  };

  const renderCatalog = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      {editingProduct ? (
        <ProductForm 
          product={editingProduct} 
          onUpdate={handleSaveProduct} 
          onCancel={() => setEditingProduct(null)} 
          currency={settings.currency}
          categories={categories}
          allProducts={products}
        />
      ) : (
        <>
          <div className="flex items-center justify-between mb-8">
             <div className="relative w-full max-w-md">
                <input 
                  type="text" 
                  placeholder="Поиск по названию или артикулу..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-[1.5rem] font-bold text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all shadow-sm"
                />
                <svg className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth="3"/></svg>
             </div>
             <button onClick={handleAdd} className="px-10 py-4 bg-[#82C12D] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-emerald-100">+ Добавить товар</button>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="py-6 px-10">Товар</th>
                  <th className="py-6 px-6">Артикул</th>
                  <th className="py-6 px-6">Категория</th>
                  <th className="py-6 px-6">Цена</th>
                  <th className="py-6 px-6 text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {(filteredProducts || []).map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-5 px-10">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center p-2 shrink-0">
                           <img src={p.image || undefined} className="max-h-full max-w-full object-contain mix-blend-multiply" />
                        </div>
                        <span className="font-bold text-slate-800 text-sm line-clamp-1">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-5 px-6"><span className="text-[11px] font-black text-slate-300 uppercase">{p.sku}</span></td>
                    <td className="py-5 px-6"><span className="px-3 py-1 bg-blue-50 text-blue-500 rounded-lg text-[10px] font-black uppercase">{p.categoryId}</span></td>
                    <td className="py-5 px-6 font-black text-slate-900">{(p.price || 0).toLocaleString()} {settings.currency}</td>
                    <td className="py-5 px-10 text-right">
                       <div className="flex justify-end gap-2">
                          <button onClick={() => setEditingProduct(p)} className="p-3 bg-slate-50 rounded-xl text-slate-300 hover:text-blue-500 hover:bg-blue-50 transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeWidth="2.5"/></svg></button>
                          <button onClick={() => handleDelete(p.id)} className="p-3 bg-slate-50 rounded-xl text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6" strokeWidth="2.5"/></svg></button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );

  const handleExport = () => {
    const data = products.map(p => ({
      'ID': p.id,
      'Название': p.name,
      'Бренд': p.brand,
      'Модель': p.model || '',
      'Артикул (SKU)': p.sku,
      'Категория': p.category || '',
      'Закупочная цена': p.costPrice || 0,
      'Цена продажи': p.price,
      'Старая цена': p.oldPrice || 0,
      'Склад (Кол-во)': p.stock,
      'Ед. измерения': p.unit || 'шт',
      'URL Изображения': p.image
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products");
    XLSX.writeFile(wb, "products_catalog.xlsx");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target?.result;
        const wb = XLSX.read(data, { type: 'array' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const rows = XLSX.utils.sheet_to_json(ws) as any[];

        const newProducts = [...products];
        
        rows.forEach(row => {
          const importedProduct: Product = {
            id: String(row['ID'] || 'p' + Math.random().toString(36).substr(2, 9)),
            name: String(row['Название'] || 'Без названия'),
            brand: String(row['Бренд'] || ''),
            model: String(row['Модель'] || ''),
            sku: String(row['Артикул (SKU)'] || generateSKU(newProducts)),
            categoryId: categories.find(c => c.name === row['Категория'])?.id || '',
            costPrice: Number(row['Закупочная цена'] || 0),
            price: Number(row['Цена продажи'] || 0),
            oldPrice: Number(row['Старая цена'] || 0),
            stock: Number(row['Склад (Кол-во)'] || 0),
            unit: String(row['Ед. измерения'] || 'шт'),
            image: String(row['URL Изображения'] || ''),
            images: [String(row['URL Изображения'] || '')],
            rating: 5,
            reviews: [],
            attributes: [],
            features: []
          };

          const index = newProducts.findIndex(p => p.id === importedProduct.id);
          if (index !== -1) {
            newProducts[index] = { ...newProducts[index], ...importedProduct };
          } else {
            newProducts.push(importedProduct);
          }
        });

        if (confirm(`Вы действительно хотите импортировать ${rows.length} товаров? Существующие товары с такими же ID будут обновлены.`)) {
          onUpdateProducts(newProducts);
          alert('Импорт успешно завершен!');
        }
      } catch (error) {
        console.error('Import error:', error);
        alert('Ошибка при чтении файла. Убедитесь, что это корректный Excel файл.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const renderImportExport = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in slide-in-from-bottom-4 duration-500">
       <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm flex flex-col items-center text-center space-y-8 group hover:border-blue-400 transition-all">
          <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
             <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div>
             <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Импорт товаров</h3>
             <p className="text-sm font-bold text-slate-400 mt-2 leading-relaxed">Загрузите файл XLSX для массового обновления каталога</p>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleImport} accept=".xlsx, .xls, .csv" className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-blue-100 hover:bg-blue-700">Выбрать файл</button>
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Макс. размер: 50MB • До 5000 позиций</span>
       </div>

       <div className="bg-slate-900 p-12 rounded-[3.5rem] flex flex-col items-center text-center space-y-8 group hover:shadow-2xl transition-all relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 blur-3xl rounded-full" />
          <div className="w-24 h-24 bg-white/10 rounded-[2rem] flex items-center justify-center text-white group-hover:scale-110 transition-transform">
             <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div className="relative z-10">
             <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic">Экспорт базы</h3>
             <p className="text-sm font-bold text-white/40 mt-2 leading-relaxed">Выгрузите текущий каталог в Excel для редактирования</p>
          </div>
          <button onClick={handleExport} className="w-full py-5 bg-white text-slate-900 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-slate-100 transition-all">Скачать каталог (XLSX)</button>
          <div className="flex gap-4 opacity-40">
             <span className="text-[10px] font-black text-white uppercase">XLSX</span>
             <span className="text-[10px] font-black text-white uppercase">CSV</span>
          </div>
       </div>
    </div>
  );

  const renderPricesStock = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
       <div className="bg-amber-50 border border-amber-100 p-6 rounded-[2rem] flex items-center gap-5">
          <span className="text-3xl">⚡</span>
          <div>
             <p className="text-sm font-black text-amber-900 uppercase tracking-tight italic">Режим быстрого редактирования</p>
             <p className="text-xs font-bold text-amber-700 mt-1 uppercase tracking-widest">Изменения применяются мгновенно ко всем товарам</p>
          </div>
       </div>

       <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <th className="py-6 px-10">Товар / Артикул</th>
              <th className="py-6 px-6">Цена ({settings.currency})</th>
              <th className="py-6 px-6">Старая цена</th>
              <th className="py-6 px-6">Остаток</th>
              <th className="py-6 px-10 text-right">Статус</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {(products || []).map(p => (
              <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-5 px-10">
                   <p className="font-bold text-slate-800 text-[13px]">{p.name}</p>
                   <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-1">{p.sku}</p>
                </td>
                <td className="py-5 px-6">
                   <input type="number" defaultValue={p.price} className="w-28 p-2 bg-slate-50 border border-slate-100 rounded-lg text-sm font-black outline-none focus:border-blue-400" />
                </td>
                <td className="py-5 px-6">
                   <input type="number" defaultValue={p.oldPrice || 0} className="w-28 p-2 bg-slate-50 border border-slate-100 rounded-lg text-sm font-black outline-none focus:border-blue-400 text-slate-400" />
                </td>
                <td className="py-5 px-6">
                   <div className="flex items-center gap-3">
                      <input type="number" defaultValue={p.stock} className="w-20 p-2 bg-slate-50 border border-slate-100 rounded-lg text-sm font-black outline-none focus:border-blue-400" />
                      <span className="text-[10px] font-black text-slate-300 uppercase">{p.unit}</span>
                   </div>
                </td>
                <td className="py-5 px-10 text-right">
                   <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${p.stock > 0 ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                      {p.stock > 0 ? 'В продаже' : 'Нет в наличии'}
                   </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[8000] flex items-center justify-center p-4 md:p-10 font-['Inter']">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-fade-in" onClick={onClose} />
      
      <div className="relative bg-[#F8FAFC] w-full max-w-[1200px] h-[90vh] rounded-[3.5rem] shadow-2xl flex flex-col overflow-hidden border border-white animate-zoom-in">
        
        {/* Header Tabs */}
        <header className="px-10 py-6 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-12">
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Товары</h2>
            <nav className="flex gap-8">
               {(['catalog', 'import_export', 'prices_stock'] as TabId[]).map(tab => (
                 <button 
                   key={tab}
                   onClick={() => setActiveTab(tab)}
                   className={`text-[12px] font-black uppercase tracking-widest pb-2 transition-all border-b-4 ${activeTab === tab ? 'text-blue-600 border-blue-600' : 'text-slate-300 border-transparent hover:text-slate-600'}`}
                 >
                    {tab === 'catalog' ? 'Каталог товаров' : tab === 'import_export' ? 'Импорт/Экспорт' : 'Цены и остатки'}
                 </button>
               ))}
            </nav>
          </div>
          <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-950 transition-all hover:rotate-90">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5" strokeLinecap="round"/></svg>
          </button>
        </header>

        {/* Scrollable Area */}
        <div className="flex-grow overflow-y-auto p-10 hide-scrollbar bg-slate-50/30">
          {activeTab === 'catalog' && renderCatalog()}
          {activeTab === 'import_export' && renderImportExport()}
          {activeTab === 'prices_stock' && renderPricesStock()}
        </div>

        <footer className="px-10 py-6 bg-white border-t border-slate-100 flex justify-end gap-4 shrink-0">
           <p className="mr-auto self-center text-[10px] font-black text-slate-300 uppercase tracking-widest">Gisi Market CMS • Управление каталогом v2.4</p>
           <button onClick={onClose} className="px-12 py-3.5 bg-slate-950 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all">Закрыть</button>
        </footer>
      </div>
    </div>
  );
};
