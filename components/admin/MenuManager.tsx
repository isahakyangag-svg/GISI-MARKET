
import React from 'react';
import { StoreSettings, MenuItem } from '../../types';
import { Plus, Trash2, GripVertical, Link as LinkIcon, Eye, EyeOff } from 'lucide-react';

interface MenuManagerProps {
  settings: StoreSettings;
  onUpdateSettings: (s: StoreSettings) => void;
}

export const MenuManager: React.FC<MenuManagerProps> = ({ settings, onUpdateSettings }) => {
  const items = settings.menuItems || [];

  const updateItems = (newItems: MenuItem[]) => {
    onUpdateSettings({ ...settings, menuItems: newItems });
  };

  const addItem = () => {
    const newItem: MenuItem = {
      id: Date.now().toString(),
      label: 'Новый пункт',
      url: '#',
      enabled: true,
      order: items.length + 1
    };
    updateItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    updateItems(items.filter(i => i.id !== id));
  };

  const updateItem = (id: string, updates: Partial<MenuItem>) => {
    updateItems(items.map(i => i.id === id ? { ...i, ...updates } : i));
  };

  return (
    <div className="p-10 space-y-10 animate-fade-in max-w-5xl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 italic uppercase">Меню Сайта</h2>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">Управление навигацией в шапке сайта</p>
        </div>
        <button 
          onClick={addItem}
          className="px-8 py-3 bg-[#6C5DD3] text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2"
        >
          <Plus size={16} /> Добавить пункт
        </button>
      </div>

      <div className="space-y-4">
        {[...items].sort((a, b) => (a.order || 0) - (b.order || 0)).map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all duration-300">
            <div className="text-slate-300 cursor-grab active:cursor-grabbing">
              <GripVertical size={20} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Название пункта</label>
                <input 
                  type="text" 
                  value={item.label}
                  onChange={e => updateItem(item.id, { label: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold outline-none focus:ring-2 focus:ring-[#6C5DD3]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Ссылка (URL)</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={item.url}
                    onChange={e => updateItem(item.id, { url: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 pl-10 text-sm font-bold outline-none focus:ring-2 focus:ring-[#6C5DD3]"
                  />
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => updateItem(item.id, { enabled: !item.enabled })}
                className={`p-3 rounded-xl transition-all ${item.enabled ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-50 text-slate-300'}`}
                title={item.enabled ? 'Скрыть' : 'Показать'}
              >
                {item.enabled ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
              <button 
                onClick={() => removeItem(item.id)}
                className="p-3 bg-rose-50 text-rose-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
