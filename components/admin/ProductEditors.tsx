
import React, { useState } from 'react';
import { Product, CharacteristicGroup, CharacteristicItem, PromotionInfo, Category } from '../../types';
import { Plus, Trash2, ChevronUp, ChevronDown, Search, Check, X } from 'lucide-react';

// --- Characteristics Editor ---

interface CharacteristicsEditorProps {
  groups: CharacteristicGroup[];
  onChange: (groups: CharacteristicGroup[]) => void;
}

export const CharacteristicsEditor: React.FC<CharacteristicsEditorProps> = ({ groups, onChange }) => {
  const addGroup = () => {
    const newGroup: CharacteristicGroup = {
      id: Date.now().toString(),
      name: 'Новая группа',
      items: []
    };
    onChange([...groups, newGroup]);
  };

  const removeGroup = (groupId: string) => {
    onChange(groups.filter(g => g.id !== groupId));
  };

  const updateGroupName = (groupId: string, name: string) => {
    onChange(groups.map(g => g.id === groupId ? { ...g, name } : g));
  };

  const addItem = (groupId: string) => {
    const newItem: CharacteristicItem = {
      id: Date.now().toString(),
      name: 'Характеристика',
      value: 'Значение'
    };
    onChange(groups.map(g => g.id === groupId ? { ...g, items: [...g.items, newItem] } : g));
  };

  const removeItem = (groupId: string, itemId: string) => {
    onChange(groups.map(g => g.id === groupId ? { ...g, items: g.items.filter(i => i.id !== itemId) } : g));
  };

  const updateItem = (groupId: string, itemId: string, field: 'name' | 'value', val: string) => {
    onChange(groups.map(g => g.id === groupId ? {
      ...g,
      items: g.items.map(i => i.id === itemId ? { ...i, [field]: val } : i)
    } : g));
  };

  const moveGroup = (idx: number, dir: number) => {
    const newGroups = [...groups];
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= newGroups.length) return;
    [newGroups[idx], newGroups[targetIdx]] = [newGroups[targetIdx], newGroups[idx]];
    onChange(newGroups);
  };

  const moveItem = (groupId: string, idx: number, dir: number) => {
    onChange(groups.map(g => {
      if (g.id !== groupId) return g;
      const newItems = [...g.items];
      const targetIdx = idx + dir;
      if (targetIdx < 0 || targetIdx >= newItems.length) return g;
      [newItems[idx], newItems[targetIdx]] = [newItems[targetIdx], newItems[idx]];
      return { ...g, items: newItems };
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Характеристики</h4>
        <button
          onClick={addGroup}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all"
        >
          <Plus size={14} /> Добавить группу
        </button>
      </div>

      <div className="space-y-4">
        {groups.map((group, gIdx) => (
          <div key={group.id} className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={group.name}
                onChange={e => updateGroupName(group.id, e.target.value)}
                className="flex-grow bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Название группы"
              />
              <div className="flex items-center gap-2">
                <button onClick={() => moveGroup(gIdx, -1)} className="p-2 text-slate-400 hover:text-slate-900 transition-colors"><ChevronUp size={16} /></button>
                <button onClick={() => moveGroup(gIdx, 1)} className="p-2 text-slate-400 hover:text-slate-900 transition-colors"><ChevronDown size={16} /></button>
                <button onClick={() => removeGroup(group.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"><Trash2 size={16} /></button>
              </div>
            </div>

            <div className="space-y-2 pl-4 border-l-2 border-slate-200">
              {group.items.map((item, iIdx) => (
                <div key={item.id} className="flex items-center gap-3 group">
                  <input
                    type="text"
                    value={item.name}
                    onChange={e => updateItem(group.id, item.id, 'name', e.target.value)}
                    className="w-1/3 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Название"
                  />
                  <input
                    type="text"
                    value={item.value}
                    onChange={e => updateItem(group.id, item.id, 'value', e.target.value)}
                    className="flex-grow bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Значение"
                  />
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => moveItem(group.id, iIdx, -1)} className="p-1 text-slate-400 hover:text-slate-900"><ChevronUp size={14} /></button>
                    <button onClick={() => moveItem(group.id, iIdx, 1)} className="p-1 text-slate-400 hover:text-slate-900"><ChevronDown size={14} /></button>
                    <button onClick={() => removeItem(group.id, item.id)} className="p-1 text-rose-500 hover:bg-rose-50 rounded-md"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
              <button
                onClick={() => addItem(group.id)}
                className="flex items-center gap-2 text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:opacity-70 transition-all mt-2"
              >
                <Plus size={12} /> Добавить характеристику
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Promotion Editor ---

interface PromotionEditorProps {
  promotion: PromotionInfo;
  onChange: (promo: PromotionInfo) => void;
}

export const PromotionEditor: React.FC<PromotionEditorProps> = ({ promotion, onChange }) => {
  return (
    <div className="bg-amber-50 rounded-2xl p-8 border border-amber-100 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>
          </div>
          <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Акция</h4>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            className="sr-only peer" 
            checked={promotion.isActive}
            onChange={e => onChange({ ...promotion, isActive: e.target.checked })}
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
          <span className="ml-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Участвует в акции</span>
        </label>
      </div>

      {promotion.isActive && (
        <div className="grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Скидка (%)</label>
            <input 
              type="number" 
              value={promotion.discountPercent || ''} 
              onChange={e => onChange({ ...promotion, discountPercent: parseFloat(e.target.value) || 0 })}
              className="w-full bg-white border border-amber-200 rounded-xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Напр. 15"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Акционная цена</label>
            <input 
              type="number" 
              value={promotion.promoPrice || ''} 
              onChange={e => onChange({ ...promotion, promoPrice: parseFloat(e.target.value) || 0 })}
              className="w-full bg-white border border-amber-200 rounded-xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Напр. 1500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Дата начала</label>
            <input 
              type="date" 
              value={promotion.startDate || ''} 
              onChange={e => onChange({ ...promotion, startDate: e.target.value })}
              className="w-full bg-white border border-amber-200 rounded-xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Дата окончания</label>
            <input 
              type="date" 
              value={promotion.endDate || ''} 
              onChange={e => onChange({ ...promotion, endDate: e.target.value })}
              className="w-full bg-white border border-amber-200 rounded-xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      )}
    </div>
  );
};

// --- Product Selector Modal ---

interface ProductSelectorModalProps {
  products: Product[];
  categories: Category[];
  onClose: () => void;
  onApply: (selectedIds: string[], promoParams: Partial<PromotionInfo>) => void;
}

export const ProductSelectorModal: React.FC<ProductSelectorModalProps> = ({ products, categories, onClose, onApply }) => {
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [promoParams, setPromoParams] = useState<Partial<PromotionInfo>>({
    isActive: true,
    discountPercent: 0,
    promoPrice: 0,
    startDate: '',
    endDate: ''
  });

  const filteredProducts = (products || []).filter(p => 
    (p.name || '').toLowerCase().includes(search.toLowerCase()) || 
    (p.sku || '').toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const selectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map(p => p.id));
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[4000] flex items-center justify-center p-6">
      <div className="bg-white rounded-[3rem] w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-2xl font-black text-slate-900 italic uppercase">Выбор товаров для акции</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Выбрано товаров: {selectedIds.length}</p>
          </div>
          <button onClick={onClose} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 shadow-sm transition-all"><X size={24} /></button>
        </div>

        <div className="flex-grow flex overflow-hidden">
          {/* Left: Product List */}
          <div className="w-1/2 border-r border-slate-100 flex flex-col p-8 space-y-6">
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#6C5DD3] transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Поиск по названию или артикулу..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-[#6C5DD3] transition-all"
              />
            </div>

            <div className="flex justify-between items-center px-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Список товаров ({filteredProducts.length})</span>
              <button onClick={selectAll} className="text-[10px] font-black text-[#6C5DD3] uppercase tracking-widest hover:opacity-70">
                {selectedIds.length === filteredProducts.length ? 'Снять выделение' : 'Выбрать все'}
              </button>
            </div>

            <div className="flex-grow overflow-y-auto space-y-2 pr-2 hide-scrollbar">
              {filteredProducts.map(p => (
                <div 
                  key={p.id} 
                  onClick={() => toggleSelect(p.id)}
                  className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border-2 ${selectedIds.includes(p.id) ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-50 hover:border-slate-200'}`}
                >
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${selectedIds.includes(p.id) ? 'bg-[#6C5DD3] border-[#6C5DD3]' : 'border-slate-200'}`}>
                    {selectedIds.includes(p.id) && <Check size={14} className="text-white" />}
                  </div>
                  <img src={p.image || undefined} className="w-10 h-10 rounded-lg object-cover" />
                  <div className="flex-grow min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{p.name}</p>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{p.sku}</p>
                  </div>
                  <p className="text-sm font-black text-slate-900">{(Number(p.price) || 0).toLocaleString()} ֏</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Promotion Settings */}
          <div className="w-1/2 p-10 bg-slate-50/30 flex flex-col">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8">Параметры акции</h4>
            
            <div className="space-y-8 flex-grow">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Скидка (%)</label>
                  <input 
                    type="number" 
                    value={promoParams.discountPercent || ''}
                    onChange={e => setPromoParams({ ...promoParams, discountPercent: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-white border border-slate-200 rounded-2xl p-5 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-[#6C5DD3] transition-all"
                    placeholder="Напр. 20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Акционная цена (если фикс.)</label>
                  <input 
                    type="number" 
                    value={promoParams.promoPrice || ''}
                    onChange={e => setPromoParams({ ...promoParams, promoPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-white border border-slate-200 rounded-2xl p-5 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-[#6C5DD3] transition-all"
                    placeholder="Напр. 990"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Дата начала</label>
                  <input 
                    type="date" 
                    value={promoParams.startDate || ''}
                    onChange={e => setPromoParams({ ...promoParams, startDate: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-2xl p-5 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-[#6C5DD3] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Дата окончания</label>
                  <input 
                    type="date" 
                    value={promoParams.endDate || ''}
                    onChange={e => setPromoParams({ ...promoParams, endDate: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-2xl p-5 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-[#6C5DD3] transition-all"
                  />
                </div>
              </div>

              <div className="bg-indigo-50 rounded-[2rem] p-8 border border-indigo-100">
                <p className="text-xs font-medium text-indigo-900 leading-relaxed">
                  Выбранные параметры будут применены ко всем <span className="font-black">{selectedIds.length}</span> выделенным товарам. 
                  Если вы укажете процент скидки, акционная цена будет рассчитана автоматически от текущей цены товара.
                </p>
              </div>
            </div>

            <button 
              onClick={() => onApply(selectedIds, promoParams)}
              disabled={selectedIds.length === 0}
              className="w-full py-6 bg-[#6C5DD3] text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Применить акцию к выбранным
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
