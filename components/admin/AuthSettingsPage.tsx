
import React from 'react';
import { StoreSettings } from '../../types';
import { Image, Palette, Layout, Shield } from 'lucide-react';

interface AuthSettingsPageProps {
  settings: StoreSettings;
  onUpdateSettings: (s: StoreSettings) => void;
}

export const AuthSettingsPage: React.FC<AuthSettingsPageProps> = ({ settings, onUpdateSettings }) => {
  const auth = settings.authSettings || {
    backgroundUrl: '',
    overlayOpacity: 0.5,
    primaryColor: '#82C12D',
    buttonColor: '#82C12D',
    textColor: '#ffffff',
    borderRadius: 12,
    shadowIntensity: 'medium'
  };

  const updateAuth = (updates: Partial<typeof auth>) => {
    onUpdateSettings({
      ...settings,
      authSettings: { ...auth, ...updates }
    });
  };

  return (
    <div className="p-10 space-y-10 animate-fade-in max-w-5xl">
      <div>
        <h2 className="text-3xl font-black text-slate-900 italic uppercase">Страница Авторизации</h2>
        <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">Настройка дизайна и поведения входа</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Background Settings */}
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-[#6C5DD3]">
              <Image size={24} />
            </div>
            <h3 className="text-lg font-black text-slate-900 uppercase italic tracking-widest">Фон и Оверлей</h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">URL фонового изображения</label>
              <input 
                type="text" 
                value={auth.backgroundUrl}
                onChange={e => updateAuth({ backgroundUrl: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#6C5DD3] outline-none"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Прозрачность оверлея</label>
                <span className="text-xs font-black text-[#6C5DD3]">{Math.round(auth.overlayOpacity * 100)}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01"
                value={auth.overlayOpacity}
                onChange={e => updateAuth({ overlayOpacity: parseFloat(e.target.value) || 0 })}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#6C5DD3]"
              />
            </div>
          </div>
        </div>

        {/* Colors & Style */}
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500">
              <Palette size={24} />
            </div>
            <h3 className="text-lg font-black text-slate-900 uppercase italic tracking-widest">Цвета и Стили</h3>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Цвет кнопки</label>
              <div className="flex gap-3">
                <input type="color" value={auth.buttonColor} onChange={e => updateAuth({ buttonColor: e.target.value })} className="w-12 h-12 rounded-xl border-none p-0 cursor-pointer" />
                <input type="text" value={auth.buttonColor} onChange={e => updateAuth({ buttonColor: e.target.value })} className="flex-grow bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs font-black uppercase outline-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Цвет текста кнопки</label>
              <div className="flex gap-3">
                <input type="color" value={auth.textColor} onChange={e => updateAuth({ textColor: e.target.value })} className="w-12 h-12 rounded-xl border-none p-0 cursor-pointer" />
                <input type="text" value={auth.textColor} onChange={e => updateAuth({ textColor: e.target.value })} className="flex-grow bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs font-black uppercase outline-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Скругление (px)</label>
              <input 
                type="number" 
                value={auth.borderRadius || 0}
                onChange={e => updateAuth({ borderRadius: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold text-slate-900 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Интенсивность тени</label>
              <select 
                value={auth.shadowIntensity}
                onChange={e => updateAuth({ shadowIntensity: e.target.value as any })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold text-slate-900 outline-none"
              >
                <option value="soft">Мягкая</option>
                <option value="medium">Средняя</option>
                <option value="hard">Сильная</option>
              </select>
            </div>
          </div>
        </div>

        {/* Social Logins */}
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8 lg:col-span-2">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
              <Shield size={24} />
            </div>
            <h3 className="text-lg font-black text-slate-900 uppercase italic tracking-widest">Социальные сети для входа</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {settings.socialLogins.map(provider => (
              <div key={provider.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-4">
                  <img src={provider.icon} alt={provider.name} className="w-10 h-10 object-contain" />
                  <div>
                    <p className="font-black text-slate-900 uppercase text-xs tracking-widest">{provider.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{provider.enabled ? 'Включено' : 'Выключено'}</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    const newList = settings.socialLogins.map(p => p.id === provider.id ? { ...p, enabled: !p.enabled } : p);
                    onUpdateSettings({ ...settings, socialLogins: newList });
                  }}
                  className={`w-12 h-6 rounded-full relative transition-all ${provider.enabled ? 'bg-emerald-500' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${provider.enabled ? 'right-1' : 'left-1'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
