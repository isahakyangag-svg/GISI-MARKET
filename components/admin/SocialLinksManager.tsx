
import React from 'react';
import { StoreSettings, SiteSocialIcon } from '../../types';
import { Plus, Trash2, ExternalLink } from 'lucide-react';

interface SocialLinksManagerProps {
  settings: StoreSettings;
  onUpdateSettings: (s: StoreSettings) => void;
}

export const SocialLinksManager: React.FC<SocialLinksManagerProps> = ({ settings, onUpdateSettings }) => {
  const icons = settings.siteSocialIcons || [];

  const updateIcons = (newIcons: SiteSocialIcon[]) => {
    onUpdateSettings({ ...settings, siteSocialIcons: newIcons });
  };

  const addIcon = () => {
    const newIcon: SiteSocialIcon = {
      id: Date.now().toString(),
      type: 'instagram',
      url: 'https://',
      enabled: true,
      order: icons.length + 1
    };
    updateIcons([...icons, newIcon]);
  };

  const removeIcon = (id: string) => {
    updateIcons(icons.filter(i => i.id !== id));
  };

  const updateIcon = (id: string, updates: Partial<SiteSocialIcon>) => {
    updateIcons(icons.map(i => i.id === id ? { ...i, ...updates } : i));
  };

  return (
    <div className="p-10 space-y-10 animate-fade-in max-w-5xl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 italic uppercase">Социальные Сети</h2>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">Управление иконками соц. сетей на сайте</p>
        </div>
        <button 
          onClick={addIcon}
          className="px-8 py-3 bg-[#6C5DD3] text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2"
        >
          <Plus size={16} /> Добавить ссылку
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...icons].sort((a, b) => (a.order || 0) - (b.order || 0)).map((icon) => (
          <div key={icon.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6 group hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900">
                  <SocialIconPreview type={icon.type} />
                </div>
                <div>
                  <select 
                    value={icon.type}
                    onChange={e => updateIcon(icon.id, { type: e.target.value as any })}
                    className="bg-transparent font-black uppercase text-xs tracking-widest outline-none cursor-pointer hover:text-[#6C5DD3]"
                  >
                    <option value="instagram">Instagram</option>
                    <option value="vk">VK</option>
                    <option value="facebook">Facebook</option>
                    <option value="telegram">Telegram</option>
                    <option value="youtube">YouTube</option>
                    <option value="twitter">Twitter</option>
                    <option value="other">Другое</option>
                  </select>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Тип иконки</p>
                </div>
              </div>
              <button 
                onClick={() => removeIcon(icon.id)}
                className="p-3 bg-rose-50 text-rose-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Ссылка (URL)</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={icon.url}
                    onChange={e => updateIcon(icon.id, { url: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 pl-12 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-[#6C5DD3]"
                  />
                  <ExternalLink className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => updateIcon(icon.id, { enabled: !icon.enabled })}
                    className={`w-10 h-5 rounded-full relative transition-all ${icon.enabled ? 'bg-emerald-500' : 'bg-slate-300'}`}
                  >
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${icon.enabled ? 'right-1' : 'left-1'}`} />
                  </button>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Показывать на сайте</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Порядок:</span>
                  <input 
                    type="number" 
                    value={icon.order || 0}
                    onChange={e => updateIcon(icon.id, { order: parseInt(e.target.value) || 0 })}
                    className="w-12 bg-slate-50 border border-slate-100 rounded-lg p-1 text-center text-xs font-bold outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SocialIconPreview = ({ type }: { type: SiteSocialIcon['type'] }) => {
  switch (type) {
    case 'instagram': return <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>;
    case 'vk': return <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M13.162 18.994c.609 0 .858-.406.851-.915-.013-.914.406-1.27.771-1.27.77 0 1.05.303 1.05 1.329 0 .546.344.92.811.92h1.49c.427 0 .733-.167.733-.718 0-1.308-1.51-3.493-1.51-3.493-.307-.437-.25-.627 0-.915 0 0 1.266-1.613 1.393-2.302.058-.302 0-.53-.439-.53h-1.457c-.367 0-.539.193-.631.412 0 0-.742 1.808-1.79 2.981-.34.34-.496.446-.683.446-.092 0-.226-.106-.226-.409v-2.894c0-.366-.106-.53-.414-.53h-2.291c-.227 0-.366.153-.366.298 0 .346.516.426.569 1.396v1.502c0 .329-.059.449-.185.449-.33 0-1.134-1.814-1.612-3.898-.135-.585-.338-.821-.704-.821h-1.496c-.436 0-.519.203-.519.427 0 .405.52 2.447 2.418 5.113 1.266 1.819 3.051 2.804 4.674 2.804z"/></svg>;
    case 'facebook': return <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.324v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>;
    case 'telegram': return <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.462 8.816c-.235 2.485-1.255 8.484-1.777 11.271-.221 1.181-.656 1.576-1.076 1.615-.914.085-1.607-.603-2.492-1.183-1.385-.908-2.166-1.472-3.511-2.358-1.553-1.024-.546-1.587.339-2.507.232-.241 4.259-3.905 4.337-4.234.01-.042.02-.197-.073-.28-.093-.083-.229-.054-.328-.031-.142.032-2.404 1.528-6.79 4.494-.643.441-1.225.657-1.746.645-.576-.012-1.684-.325-2.509-.593-1.012-.331-1.817-.505-1.747-1.067.036-.292.441-.592 1.216-.899 4.753-2.07 7.921-3.434 9.504-4.094 4.517-1.887 5.454-2.215 6.064-2.226.135-.002.435.031.629.19.164.134.209.314.231.441.023.129.033.436.015.586z"/></svg>;
    case 'youtube': return <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>;
    case 'twitter': return <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>;
    default: return <ExternalLink size={24} />;
  }
};
