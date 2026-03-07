
import React from 'react';
import { StoreSettings, RegistrationField } from '../../types';
import { Plus, Trash2, GripVertical, CheckCircle2, Circle } from 'lucide-react';

interface RegFormBuilderProps {
  settings: StoreSettings;
  onUpdateSettings: (s: StoreSettings) => void;
}

export const RegFormBuilder: React.FC<RegFormBuilderProps> = ({ settings, onUpdateSettings }) => {
  const fields = settings.registrationFields || [];

  const updateFields = (newFields: RegistrationField[]) => {
    onUpdateSettings({ ...settings, registrationFields: newFields });
  };

  const addField = () => {
    const newField: RegistrationField = {
      id: Date.now().toString(),
      type: 'text',
      label: 'Новое поле',
      placeholder: 'Введите значение',
      required: false,
      enabled: true,
      order: fields.length + 1
    };
    updateFields([...fields, newField]);
  };

  const removeField = (id: string) => {
    updateFields(fields.filter(f => f.id !== id));
  };

  const updateField = (id: string, updates: Partial<RegistrationField>) => {
    updateFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  return (
    <div className="p-10 space-y-10 animate-fade-in max-w-5xl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 italic uppercase">Конструктор Регистрации</h2>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">Настройка полей формы регистрации</p>
        </div>
        <button 
          onClick={addField}
          className="px-8 py-3 bg-[#6C5DD3] text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2"
        >
          <Plus size={16} /> Добавить поле
        </button>
      </div>

      <div className="space-y-4">
        {[...fields].sort((a, b) => (a.order || 0) - (b.order || 0)).map((field, index) => (
          <div key={field.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all duration-300">
            <div className="text-slate-300 cursor-grab active:cursor-grabbing">
              <GripVertical size={20} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 flex-grow">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Название (Label)</label>
                <input 
                  type="text" 
                  value={field.label}
                  onChange={e => updateField(field.id, { label: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold outline-none focus:ring-2 focus:ring-[#6C5DD3]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Тип поля</label>
                <select 
                  value={field.type}
                  onChange={e => updateField(field.id, { type: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold outline-none focus:ring-2 focus:ring-[#6C5DD3]"
                >
                  <option value="text">Текст</option>
                  <option value="email">Email</option>
                  <option value="password">Пароль</option>
                  <option value="phone">Телефон</option>
                  <option value="date">Дата</option>
                  <option value="select">Выбор (Select)</option>
                  <option value="checkbox">Галочка (Checkbox)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Подсказка (Placeholder)</label>
                <input 
                  type="text" 
                  value={field.placeholder || ''}
                  onChange={e => updateField(field.id, { placeholder: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold outline-none focus:ring-2 focus:ring-[#6C5DD3]"
                />
              </div>
              <div className="flex items-center gap-6 pt-4">
                <button 
                  onClick={() => updateField(field.id, { required: !field.required })}
                  className="flex items-center gap-2 group/btn"
                >
                  {field.required ? <CheckCircle2 size={20} className="text-emerald-500" /> : <Circle size={20} className="text-slate-300" />}
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover/btn:text-slate-900">Обязательно</span>
                </button>
                <button 
                  onClick={() => updateField(field.id, { enabled: !field.enabled })}
                  className="flex items-center gap-2 group/btn"
                >
                  {field.enabled ? <CheckCircle2 size={20} className="text-[#6C5DD3]" /> : <Circle size={20} className="text-slate-300" />}
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover/btn:text-slate-900">Активно</span>
                </button>
              </div>
            </div>

            <button 
              onClick={() => removeField(field.id)}
              className="p-3 bg-rose-50 text-rose-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
