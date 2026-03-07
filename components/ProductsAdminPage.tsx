
import React, { useState, useMemo, useRef } from 'react';
import { Product, Category, StoreSettings } from '../types';
import { ProductAdminModal } from './ProductAdminModal';

interface ProductsAdminPageProps {
  onExit: () => void;
  products: Product[];
  onUpdateProducts: (p: Product[]) => void;
  categories: Category[];
  settings: StoreSettings;
}

export const ProductsAdminPage: React.FC<ProductsAdminPageProps> = ({ 
  onExit, products, onUpdateProducts, categories, settings 
}) => {
  const [activeTab, setActiveTab] = useState('catalog');
  const [pricesSubTab, setPricesSubTab] = useState('all'); // 'all' | 'prices' | 'stock'
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState('all');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMassiveChangesOpen, setIsMassiveChangesOpen] = useState(false);
  const [massiveChangesView, setMassiveChangesView] = useState<'list' | 'upload'>('list');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadFileInputRef = useRef<HTMLInputElement>(null);

  const menuItems = [
    { id: 'catalog', label: 'Каталог товаров', icon: 'M4 7v10c0 2 1.5 3 3.5 3h9c2 0 3.5-1 3.5-3V7c0-2-1.5-3-3.5-3h-9C5.5 4 4 5 4 7z' },
    { id: 'import', label: 'Импорт/Экспорт', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' },
    { id: 'prices', label: 'Цены и остатки', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

  const filteredProducts = useMemo(() => {
    return (products || []).filter(p => {
      const name = p.name || '';
      const sku = p.sku || '';
      const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategoryId === 'all' || p.categoryId === activeCategoryId;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, activeCategoryId]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsEditModalOpen(true);
  };

  const handleEditProduct = (p: Product) => {
    setEditingProduct(p);
    setIsEditModalOpen(true);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот товар?')) {
      onUpdateProducts((products || []).filter(p => p.id !== id));
    }
  };

  const handleUpdateStock = (id: string, newStock: number) => {
     onUpdateProducts((products || []).map(p => p.id === id ? {...p, stock: newStock} : p));
  };

  const renderCatalogTable = () => (
    <div className="bg-[#1e293b] rounded-lg border border-slate-800 shadow-sm overflow-hidden animate-in fade-in duration-500 w-full max-w-6xl">
      <div className="flex justify-between items-center p-6 border-b border-slate-800">
        <div className="flex gap-4">
            <button onClick={handleAddProduct} className="px-6 py-2.5 bg-[#337ab7] text-white rounded text-[13px] font-bold hover:bg-[#286090] transition-all shadow-sm">Добавить товар</button>
            <button onClick={() => setActiveTab('import')} className="px-6 py-2.5 bg-[#0f172a] border border-slate-800 text-slate-300 rounded text-[13px] font-medium hover:bg-slate-800 transition-all">Импорт / Экспорт</button>
        </div>
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Найдено: {(filteredProducts || []).length}</span>
      </div>
      <table className="w-full text-left border-collapse">
        <thead className="bg-[#0f172a] border-b border-slate-800">
          <tr className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
            <th className="py-4 px-6 w-16">Фото</th>
            <th className="py-4 px-6">Товар / Артикул</th>
            <th className="py-4 px-6">Категория</th>
            <th className="py-4 px-6">Цена</th>
            <th className="py-4 px-6">Остаток</th>
            <th className="py-4 px-6 text-right">Действия</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {(filteredProducts || []).map(p => (
            <tr key={p.id} className="hover:bg-slate-800/30 transition-colors group text-slate-300">
              <td className="py-4 px-6">
                <div className="w-12 h-12 bg-white rounded border border-slate-800 p-1">
                  <img src={p.image} className="w-full h-full object-contain mix-blend-multiply" />
                </div>
              </td>
              <td className="py-4 px-6">
                <p className="text-sm font-bold text-white">{p.name}</p>
                <p className="text-[10px] text-slate-500 font-mono uppercase mt-0.5">{p.sku}</p>
              </td>
              <td className="py-4 px-6">
                 <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded text-[10px] font-bold uppercase tracking-tight">
                    {(categories || []).find(c => c.id === p.categoryId)?.name || 'Нет'}
                 </span>
              </td>
              <td className="py-4 px-6 font-black text-white">{(Number(p.price) || 0).toLocaleString()} {settings?.currency || '֏'}</td>
              <td className="py-4 px-6">
                 <span className={`font-bold ${p.stock <= 0 ? 'text-rose-500' : 'text-emerald-500'}`}>{p.stock} {p.unit}</span>
              </td>
              <td className="py-4 px-6 text-right">
                <div className="flex justify-end gap-2">
                   <button onClick={() => handleEditProduct(p)} className="p-2 text-slate-500 hover:text-blue-400 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeWidth="2.5"/></svg></button>
                   <button onClick={() => handleDeleteProduct(p.id)} className="p-2 text-slate-500 hover:text-rose-500 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6" strokeWidth="2.5"/></svg></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderPricesAndStock = () => (
    <div className="w-full max-w-[1400px] animate-in fade-in duration-500 font-['Inter'] text-slate-300">
       {/* Page Header */}
       <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
             <h2 className="text-[18px] font-medium text-white">Цены и остатки</h2>
             <div className="flex items-center gap-1 text-[#337ab7] cursor-pointer hover:underline text-[13px]">
                <span className="w-4 h-4 rounded-full border border-[#337ab7] flex items-center justify-center text-[10px] font-bold">?</span>
                <span>Инструкция к разделу</span>
             </div>
          </div>
          <button 
            onClick={() => {
              setMassiveChangesView('list');
              setIsMassiveChangesOpen(true);
            }}
            className="px-5 py-2 bg-[#1e293b] border border-slate-800 rounded text-[13px] text-white hover:bg-slate-800 transition-colors"
          >
            Массовые изменения
          </button>
       </div>

       {/* Sub Tabs */}
       <div className="flex gap-6 border-b border-slate-800 mb-6">
          {(['all', 'prices', 'stock']).map((t) => (
            <button 
              key={t}
              onClick={() => setPricesSubTab(t)}
              className={`pb-3 px-1 text-[13px] transition-all relative ${pricesSubTab === t ? 'text-[#337ab7] font-medium' : 'text-slate-500 hover:text-white'}`}
            >
              {t === 'all' ? 'Все' : t === 'prices' ? 'Цены' : 'Остатки'}
              {pricesSubTab === t && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#337ab7]" />}
            </button>
          ))}
       </div>

       {/* Filter Bar */}
       <div className="bg-[#1e293b] p-4 border border-slate-800 rounded-t-lg flex justify-between items-center gap-4">
          <div className="flex items-center gap-3 flex-grow">
             <div className="relative w-full max-w-md">
                <input 
                  type="text" 
                  placeholder="Поиск" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#0f172a] border border-slate-800 rounded text-sm outline-none focus:border-[#337ab7] text-white"
                />
                <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth="2.5"/></svg>
             </div>
             <button className="px-4 py-2 border border-slate-800 rounded text-[13px] text-slate-300 hover:bg-slate-800 transition-colors">Фильтры</button>
          </div>
          <div className="flex items-center border border-slate-800 rounded divide-x divide-slate-800">
             <button className="px-4 py-2 text-[13px] text-slate-300 hover:bg-slate-800 flex items-center gap-2">
                Ещё <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
             </button>
          </div>
       </div>

       {/* Dark InSales-style Table */}
       <div className="bg-[#1e293b] border-x border-b border-slate-800 rounded-b-lg overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {/* Grouping Row */}
              <tr className="bg-[#0f172a]">
                <th className="px-6 py-2 border-r border-slate-800 min-w-[250px]"></th>
                <th className="px-6 py-2 border-r border-slate-800 min-w-[150px]"></th>
                <th className="px-6 py-2 border-r border-slate-800 min-w-[120px] text-[11px] font-medium text-slate-600 text-center uppercase tracking-tight">Мои склады</th>
                <th colSpan={4} className="px-6 py-2 border-r border-slate-800 text-[11px] font-medium text-slate-600 text-center uppercase tracking-tight">
                   <div className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 text-slate-500" fill="currentColor" viewBox="0 0 20 20"><path d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 16H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm2 0v8h10V5H5z"/></svg>
                      Мой интернет-магазин
                   </div>
                </th>
                <th className="px-6 py-2 min-w-[150px]"></th>
              </tr>
              {/* Labels Row */}
              <tr className="bg-[#0f172a] border-b border-slate-800 text-slate-500">
                <th className="px-6 py-4 border-r border-slate-800 text-[11px] font-bold uppercase tracking-tight">
                  Название
                </th>
                <th className="px-6 py-4 border-r border-slate-800 text-[11px] font-bold uppercase tracking-tight">
                  Себестоимость
                </th>
                <th className="px-6 py-4 border-r border-slate-800 text-[11px] font-bold uppercase tracking-tight text-center">
                  Склад
                </th>
                <th className="px-6 py-4 border-r border-slate-800 text-[11px] font-bold uppercase tracking-tight">
                  Цена продажи
                </th>
                <th className="px-6 py-4 border-r border-slate-800 text-[11px] font-bold uppercase tracking-tight text-center">
                  Скидка
                </th>
                <th className="px-6 py-4 border-r border-slate-800 text-[11px] font-bold uppercase tracking-tight">
                  Цена до скидки
                </th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-tight">
                  Штрихкод
                </th>
              </tr>
            </thead>
            <tbody>
              {(filteredProducts || []).length > 0 ? (filteredProducts || []).map(p => (
                <tr key={p.id} className="hover:bg-slate-800/50 group border-b border-slate-800 text-slate-300">
                   <td className="px-6 py-4 border-r border-slate-800">
                      <div className="flex flex-col">
                        <span className="text-[13px] font-medium text-[#337ab7] hover:underline cursor-pointer">{p.name}</span>
                        <span className="text-[11px] text-slate-600 mt-0.5">{p.sku}</span>
                      </div>
                   </td>
                   <td className="px-6 py-4 border-r border-slate-800">
                      <input 
                        type="number" 
                        defaultValue={p.costPrice || 0}
                        className="w-full p-1.5 bg-transparent outline-none text-[13px] text-right border border-transparent hover:border-slate-700 focus:border-[#337ab7] rounded text-white"
                      />
                   </td>
                   <td className="px-6 py-4 border-r border-slate-800 text-center">
                      <input 
                        type="number" 
                        value={p.stock || 0}
                        onChange={(e) => handleUpdateStock(p.id, parseInt(e.target.value) || 0)}
                        className="w-full p-1.5 bg-transparent outline-none text-[13px] text-center font-medium border border-transparent hover:border-slate-700 focus:border-[#337ab7] rounded text-emerald-400"
                      />
                   </td>
                   <td className="px-6 py-4 border-r border-slate-800">
                      <input 
                        type="number" 
                        defaultValue={p.price}
                        onBlur={(e) => onUpdateProducts((products || []).map(it => it.id === p.id ? {...it, price: parseFloat(e.target.value) || 0} : it))}
                        className="w-full p-1.5 bg-transparent outline-none text-[13px] text-right font-bold border border-transparent hover:border-slate-700 focus:border-[#337ab7] rounded text-white"
                      />
                   </td>
                   <td className="px-6 py-4 border-r border-slate-800 text-center">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${p.promotion?.isActive ? 'bg-amber-500/10 text-amber-500' : 'text-slate-600'}`}>
                         {p.promotion?.isActive ? `${p.promotion.discountPercent}%` : '0%'}
                      </span>
                   </td>
                   <td className="px-6 py-4 border-r border-slate-800 text-right">
                      <input 
                        type="number" 
                        value={p.promotion?.isActive ? p.promotion.promoPrice : (p.oldPrice || 0)}
                        onChange={(e) => {
                           const val = parseFloat(e.target.value) || 0;
                           if (p.promotion?.isActive) {
                              onUpdateProducts((products || []).map(it => it.id === p.id ? {...it, promotion: {...it.promotion!, promoPrice: val}} : it));
                           } else {
                              onUpdateProducts((products || []).map(it => it.id === p.id ? {...it, oldPrice: val} : it));
                           }
                        }}
                        className="w-full p-1.5 bg-transparent outline-none text-[13px] text-right text-slate-600 border border-transparent hover:border-slate-700 focus:border-[#337ab7] rounded"
                      />
                   </td>
                   <td className="px-6 py-4 text-slate-600">—</td>
                </tr>
              )) : (
                <tr>
                   <td colSpan={7} className="py-24 text-center">
                      <p className="text-[14px] text-slate-600">Нет результатов по заданным критериям</p>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
       </div>
    </div>
  );

  const renderImportExport = () => (
    <div className="w-full max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* ИМПОРТ */}
        <div className="bg-[#1e293b] p-10 rounded-lg border border-slate-800 shadow-sm flex flex-col items-center text-center space-y-6">
           <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
           </div>
           <div>
              <h3 className="text-xl font-bold text-white uppercase italic tracking-tight">Импорт товаров</h3>
              <p className="text-sm text-slate-500 mt-3 leading-relaxed">Загрузите файл формата CSV или XLSX для массового обновления каталога, цен и остатков.</p>
           </div>
           <button 
             onClick={() => fileInputRef.current?.click()}
             className="w-full py-4 bg-[#337ab7] text-white rounded font-bold text-xs uppercase tracking-widest hover:bg-[#286090] transition-all"
           >
             Выбрать файл
           </button>
           <input type="file" ref={fileInputRef} className="hidden" accept=".csv, .xlsx" />
           <p className="text-[11px] text-[#337ab7] hover:underline cursor-pointer font-medium uppercase tracking-tighter">Скачать образец файла</p>
        </div>

        {/* ЭКСПОРТ */}
        <div className="bg-[#1e293b] p-10 rounded-lg border border-slate-800 shadow-sm flex flex-col items-center text-center space-y-6">
           <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center text-slate-500">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
           </div>
           <div>
              <h3 className="text-xl font-bold text-white uppercase italic tracking-tight">Экспорт каталога</h3>
              <p className="text-sm text-slate-500 mt-3 leading-relaxed">Выгрузите всю базу товаров со всеми характеристиками в один клик для редактирования или бэкапа.</p>
           </div>
           <button className="w-full py-4 bg-[#0f172a] border border-slate-800 text-slate-300 rounded font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all">
             Скачать всё (XLSX)
           </button>
           <div className="flex gap-4 opacity-30">
             <span className="text-[10px] font-black text-slate-500 uppercase">CSV</span>
             <span className="text-[10px] font-black text-slate-500 uppercase">JSON</span>
           </div>
        </div>
      </div>

      {/* ИСТОРИЯ ОПЕРАЦИЙ */}
      <div className="bg-[#1e293b] rounded-lg border border-slate-800 shadow-sm overflow-hidden">
         <div className="px-8 py-5 border-b border-slate-800">
            <h4 className="text-[14px] font-bold text-white uppercase tracking-widest italic">История импортов</h4>
         </div>
         <div className="p-20 text-center flex flex-col items-center opacity-10">
            <div className="w-24 h-24 bg-slate-800 rounded-3xl flex items-center justify-center mb-6">
               <svg className="w-12 h-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2"/></svg>
            </div>
            <p className="text-sm font-bold uppercase tracking-widest text-white">История операций пуста</p>
         </div>
      </div>
    </div>
  );

  const renderMassiveChangesDrawer = () => (
    <>
      <div 
        className="fixed inset-0 z-[10000] bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={() => setIsMassiveChangesOpen(false)}
      />
      <div className="fixed top-0 right-0 bottom-0 w-[350px] bg-[#1e293b] z-[10001] shadow-2xl border-l border-slate-800 flex flex-col animate-in slide-in-from-right duration-500 font-['Inter'] text-slate-300">
         {massiveChangesView === 'list' ? (
           <>
             <div className="h-[60px] px-6 border-b border-slate-800 flex items-center justify-between shrink-0 bg-[#0f172a]">
                <h3 className="text-[15px] font-bold text-white">Массовые изменения</h3>
                <button onClick={() => setIsMassiveChangesOpen(false)} className="p-2 text-slate-500 hover:text-white transition-colors">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
             </div>
             <div className="flex-grow p-6 space-y-6 overflow-y-auto hide-scrollbar">
                <p className="text-[13px] text-slate-500 leading-relaxed">
                   Позволяет скачать товары файлом, в котором вы можете изменить цены и остатки, а потом загрузить обратно.
                </p>
                
                {/* Action Card: Скачать */}
                <div className="p-5 border border-slate-800 bg-[#0f172a]/30 rounded-xl hover:border-[#337ab7] transition-all cursor-pointer group space-y-4">
                   <div className="flex items-center justify-between">
                      <span className="text-[13px] font-bold text-white">Скачать</span>
                      <svg className="w-5 h-5 text-slate-600 group-hover:text-[#337ab7] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                   </div>
                   <p className="text-[12px] text-slate-600">Таблицу с ценами и остатками</p>
                </div>

                {/* Action Card: Загрузить */}
                <div 
                  onClick={() => setMassiveChangesView('upload')}
                  className="p-5 border border-slate-800 bg-[#0f172a]/30 rounded-xl hover:border-[#337ab7] transition-all cursor-pointer group space-y-4"
                >
                   <div className="flex items-center justify-between">
                      <span className="text-[13px] font-bold text-white">Загрузить</span>
                      <svg className="w-5 h-5 text-slate-600 group-hover:text-[#337ab7] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                   </div>
                   <p className="text-[12px] text-slate-600">Измененную таблицу с ценами и остатками</p>
                </div>

                <div className="pt-4">
                   <p className="text-[11px] text-slate-600 font-medium">Если вам требуется внести другие изменения, данный способ вам не подходит.</p>
                </div>
             </div>
           </>
         ) : (
           <div className="flex flex-col h-full animate-in fade-in duration-300">
             {/* HEADER FOR UPLOAD VIEW */}
             <div className="h-[60px] px-6 border-b border-slate-800 flex items-center justify-between shrink-0 bg-[#0f172a]">
                <div className="flex items-center gap-3">
                   <button onClick={() => setMassiveChangesView('list')} className="p-1 text-slate-500 hover:text-white transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                   </button>
                   <h3 className="text-[15px] font-bold text-white">Загрузить</h3>
                </div>
                <button onClick={() => setIsMassiveChangesOpen(false)} className="p-2 text-slate-500 hover:text-white transition-colors">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
             </div>
             
             {/* CONTENT AREA FOR UPLOAD VIEW */}
             <div className="flex-grow p-6">
                <div 
                   onClick={() => uploadFileInputRef.current?.click()}
                   className="w-full py-12 border-2 border-dashed border-slate-800 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-slate-800/50 hover:border-[#337ab7] transition-all group"
                >
                   <input type="file" ref={uploadFileInputRef} className="hidden" accept=".xlsx, .csv" />
                   <span className="text-[#337ab7] text-[13px] font-medium group-hover:underline">Добавить файл</span>
                </div>
             </div>

             {/* FOOTER FOR UPLOAD VIEW */}
             <div className="h-[70px] border-t border-slate-800 bg-[#0f172a]/50 px-6 flex items-center justify-end gap-3 shrink-0">
                <button 
                  onClick={() => setMassiveChangesView('list')}
                  className="px-5 py-2 bg-slate-800 text-slate-300 rounded text-[13px] font-medium hover:bg-slate-700 transition-colors"
                >
                   Отменить
                </button>
                <button 
                  className="px-6 py-2 bg-[#337ab7] text-white rounded text-[13px] font-bold hover:bg-[#286090] transition-all shadow-sm"
                >
                   Загрузить
                </button>
             </div>
           </div>
         )}
      </div>
    </>
  );

  return (
    <div className="fixed inset-0 z-[9000] bg-[#0f172a] flex flex-col font-['Inter'] overflow-hidden text-slate-300">
      
      <div className="flex-grow flex overflow-hidden">
        
        {/* 1. ТЕМНЫЙ САЙДБАР СЛЕВА */}
        <aside className="w-[240px] bg-[#1e293b] flex flex-col shrink-0 border-r border-slate-800/50">
          <div className="h-[60px] px-6 flex items-center gap-3 border-b border-slate-800 bg-[#0f172a]">
             <div className="w-8 h-8 bg-[#6C5DD3] rounded flex items-center justify-center text-white shadow-lg shadow-indigo-900/20">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
             </div>
             <span className="text-[14px] font-bold text-white uppercase tracking-tight">Товары</span>
          </div>

          <nav className="flex-grow py-4">
             {(menuItems || []).map(item => (
               <button 
                 key={item.id}
                 onClick={() => setActiveTab(item.id)}
                 className={`w-full flex items-center gap-3 px-6 py-3.5 text-[13px] transition-all relative ${activeTab === item.id ? 'bg-[#0f172a] text-white' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
               >
                 {activeTab === item.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#6C5DD3]" />}
                 <svg className="w-5 h-5 shrink-0 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}/></svg>
                 <span className="font-medium">{item.label}</span>
               </button>
             ))}
          </nav>

          <div className="p-4 border-t border-slate-800">
             <button onClick={onExit} className="w-full flex items-center justify-center gap-2 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded font-bold text-[12px] uppercase tracking-widest transition-all shadow-lg shadow-rose-900/20">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Выход
             </button>
          </div>
        </aside>

        {/* 2. ОСНОВНОЙ КОНТЕНТ */}
        <main className="flex-grow flex flex-col min-w-0 bg-[#0f172a] overflow-hidden">
           
           <header className="h-[60px] border-b border-slate-800 flex items-center justify-between px-8 bg-[#1e293b] shrink-0">
              <div className="flex items-center gap-4">
                 <div className="flex bg-[#0f172a] border border-slate-800 rounded overflow-hidden">
                    <button onClick={handleAddProduct} className="p-2 border-r border-slate-800 text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="3"/></svg></button>
                    <button className="p-2 border-r border-slate-800 text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="3"/></svg></button>
                 </div>
                 <div className="relative group">
                    <input 
                      type="text" placeholder="Поиск..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 pr-4 py-1.5 bg-[#0f172a] border border-slate-800 rounded text-sm outline-none focus:border-[#337ab7] w-48 transition-all text-white placeholder:text-slate-600"
                    />
                    <svg className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth="2.5"/></svg>
                 </div>
              </div>
           </header>

           <div className="flex-grow flex overflow-hidden">
              {/* Левый сайдбар категорий (скрыт на вкладках импорта и цен) */}
              {(activeTab === 'catalog') && (
                <aside className="w-[200px] border-r border-slate-800 bg-[#0f172a] py-4 flex flex-col shrink-0">
                  <button onClick={() => setActiveCategoryId('all')} className={`px-6 py-2 text-[13px] font-medium text-left transition-all ${activeCategoryId === 'all' ? 'bg-[#6C5DD3]/10 text-white border-l-2 border-[#6C5DD3]' : 'text-slate-500 hover:bg-white/5'}`}>Все</button>
                  {(categories || []).filter(c => !c.parentId).map(c => (
                    <button key={c.id} onClick={() => setActiveCategoryId(c.id)} className={`px-6 py-2 text-[13px] text-left transition-all ${activeCategoryId === c.id ? 'bg-[#6C5DD3]/10 text-white border-l-2 border-[#6C5DD3]' : 'text-slate-600 hover:bg-white/5'}`}>- {c.name}</button>
                  ))}
                  <div className="mt-4 px-6 text-[11px] text-[#337ab7] hover:underline cursor-pointer">Добавить категорию</div>
                </aside>
              )}

              {/* Рабочая область */}
              <div className="flex-grow overflow-y-auto p-12 bg-[#0f172a] flex flex-col items-center hide-scrollbar">
                 {/* Main Title logic is handled inside renderPricesAndStock when in that mode */}
                 {activeTab !== 'prices' && (
                    <div className="w-full max-w-6xl flex items-center justify-between mb-10">
                       <h2 className="text-3xl font-normal text-white flex items-center gap-3">
                          {activeTab === 'catalog' ? 'Все товары' : activeTab === 'import' ? 'Импорт и Экспорт' : 'Раздел'}
                          <button className="text-slate-600 hover:text-blue-400 transition-colors">
                             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                       </button>
                       <span className="text-sm text-slate-500 font-light underline decoration-dotted cursor-pointer">Видеоинструкция</span>
                    </h2>
                 </div>
                 )}

                 {(products || []).length === 0 && activeTab === 'catalog' ? (
                    <div className="flex flex-col items-center text-center max-w-md animate-in fade-in zoom-in duration-500 py-20 text-slate-400">
                       <div className="w-[180px] h-[180px] bg-[#1e293b] rounded-lg mb-8 relative flex flex-col items-center justify-center border border-slate-800 shadow-inner">
                          <div className="w-20 h-24 bg-[#0f172a] shadow-sm rounded-md relative flex flex-col items-center pt-2">
                             <div className="w-12 h-16 bg-slate-800 rounded" />
                             <div className="w-14 h-1 bg-slate-700 mt-2" />
                             <div className="w-10 h-1 bg-slate-700 mt-1" />
                             <div className="absolute top-2 right-[-5px] w-6 h-6 bg-[#3BB19B] rotate-45 rounded-sm" />
                          </div>
                       </div>
                       <h3 className="text-2xl font-medium text-white mb-4">Добавьте товары</h3>
                       <p className="text-[14px] text-slate-500 font-light leading-relaxed mb-10">Здесь вы будете добавлять товары и управлять ими. Вы можете добавить товары вручную или загрузить их из файла.</p>
                       <div className="flex items-center gap-2">
                          <button onClick={handleAddProduct} className="px-8 py-3 bg-[#337ab7] hover:bg-[#286090] text-white rounded font-medium text-[14px] transition-all shadow-sm">Добавить товар</button>
                          <button className="px-4 py-3 bg-[#1e293b] border border-slate-800 text-slate-300 rounded font-medium text-[14px] hover:bg-slate-800 flex items-center gap-3 transition-colors">Другие действия <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="2.5" strokeLinecap="round"/></svg></button>
                       </div>
                    </div>
                 ) : (
                    <>
                       {activeTab === 'catalog' && renderCatalogTable()}
                       {activeTab === 'prices' && renderPricesAndStock()}
                       {activeTab === 'import' && renderImportExport()}
                    </>
                 )}
              </div>
           </div>
        </main>
      </div>

      <ProductAdminModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        product={editingProduct} 
        categories={categories} 
        settings={settings}
        onSave={(p) => {
          if (editingProduct) onUpdateProducts((products || []).map(it => it.id === p.id ? p : it));
          else onUpdateProducts([...(products || []), p]);
          setIsEditModalOpen(false);
        }}
      />

      {/* Drawer: Массовые изменения */}
      {isMassiveChangesOpen && renderMassiveChangesDrawer()}
    </div>
  );
};
