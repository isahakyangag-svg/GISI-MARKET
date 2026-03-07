
import React, { useState } from 'react';
import { StoreSettings, ChatSettings, QuickReply } from '../types';
import { 
  Settings, Palette, MessageSquare, Bot, Plus, Trash2, 
  Check, Save, Image as ImageIcon, Layout, MessageCircle,
  Hash, Info, Zap, Bell, History, Smartphone
} from 'lucide-react';

interface ChatSettingsPageProps {
  settings: StoreSettings;
  onUpdateSettings: (s: StoreSettings) => void;
}

export const ChatSettingsPage: React.FC<ChatSettingsPageProps> = ({ settings, onUpdateSettings }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'design' | 'telegram' | 'quick'>('general');
  const chat = settings.chat || {
    enabled: true,
    title: 'ЧАТ ПОДДЕРЖКИ',
    status: 'online',
    avatarUrl: '',
    welcomeMessage: 'Напишите нам, мы ответим в Telegram!',
    headerColor: '#0f172a',
    buttonColor: '#0f172a',
    chatBackground: '#ffffff',
    userMessageColor: '#4f46e5',
    adminMessageColor: '#f1f5f9',
    buttonPosition: 'left',
    buttonIcon: 'MessageCircle',
    telegramBotToken: '',
    telegramChatId: '',
    quickReplies: []
  };

  const updateChat = (updates: Partial<ChatSettings>) => {
    onUpdateSettings({
      ...settings,
      chat: { ...chat, ...updates }
    });
  };

  const addQuickReply = () => {
    const newQR: QuickReply = {
      id: Date.now().toString(),
      label: 'Новый вопрос',
      text: 'Текст ответа'
    };
    updateChat({ quickReplies: [...(chat.quickReplies || []), newQR] });
  };

  const removeQuickReply = (id: string) => {
    updateChat({ quickReplies: (chat.quickReplies || []).filter(qr => qr.id !== id) });
  };

  const updateQuickReply = (id: string, updates: Partial<QuickReply>) => {
    updateChat({
      quickReplies: (chat.quickReplies || []).map(qr => qr.id === id ? { ...qr, ...updates } : qr)
    });
  };

  const TabButton = ({ id, label, icon: Icon }: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${
        activeTab === id 
          ? 'bg-[#6C5DD3] text-white shadow-lg shadow-indigo-900/20' 
          : 'bg-white text-slate-500 hover:text-slate-900 border border-slate-100'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  return (
    <div className="p-10 space-y-10 animate-fade-in max-w-5xl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 italic uppercase tracking-tight">Настройки чата</h2>
          <p className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-widest">Управление онлайн-консультантом и интеграциями</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Статус чата</span>
          <button 
            onClick={() => updateChat({ enabled: !chat.enabled })}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              chat.enabled ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
            }`}
          >
            {chat.enabled ? 'Включен' : 'Выключен'}
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        <TabButton id="general" label="Основные" icon={Settings} />
        <TabButton id="design" label="Дизайн" icon={Palette} />
        <TabButton id="telegram" label="Telegram" icon={Bot} />
        <TabButton id="quick" label="Быстрые ответы" icon={Zap} />
      </div>

      <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
        {activeTab === 'general' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-4">Название чата</label>
                <input 
                  type="text" 
                  value={chat.title}
                  onChange={(e) => updateChat({ title: e.target.value })}
                  className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#6C5DD3]" 
                />
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-4">Статус</label>
                <select 
                  value={chat.status}
                  onChange={(e) => updateChat({ status: e.target.value as any })}
                  className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-[#6C5DD3] appearance-none cursor-pointer"
                >
                  <option value="online">Онлайн</option>
                  <option value="offline">Офлайн</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-4">Аватар чата (URL)</label>
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden border border-slate-100">
                  {chat.avatarUrl ? <img src={chat.avatarUrl} className="w-full h-full object-cover" /> : <ImageIcon className="w-6 h-6 text-slate-300" />}
                </div>
                <input 
                  type="text" 
                  value={chat.avatarUrl}
                  onChange={(e) => updateChat({ avatarUrl: e.target.value })}
                  placeholder="https://example.com/avatar.jpg"
                  className="flex-grow bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#6C5DD3]" 
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-4">Приветственное сообщение</label>
              <textarea 
                value={chat.welcomeMessage}
                onChange={(e) => updateChat({ welcomeMessage: e.target.value })}
                rows={3}
                className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#6C5DD3] resize-none" 
              />
            </div>
          </div>
        )}

        {activeTab === 'design' && (
          <div className="space-y-10">
            <div className="grid grid-cols-2 gap-10">
              <div className="space-y-6">
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Цвета интерфейса</h4>
                <div className="space-y-4">
                  {[
                    { label: 'Шапка чата', key: 'headerColor' },
                    { label: 'Кнопка чата', key: 'buttonColor' },
                    { label: 'Фон чата', key: 'chatBackground' },
                    { label: 'Сообщения клиента', key: 'userMessageColor' },
                    { label: 'Сообщения оператора', key: 'adminMessageColor' },
                  ].map((c) => (
                    <div key={c.key} className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <span className="text-xs font-bold text-slate-600">{c.label}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono text-slate-400 uppercase">{(chat as any)[c.key]}</span>
                        <input 
                          type="color" 
                          value={(chat as any)[c.key]} 
                          onChange={(e) => updateChat({ [c.key]: e.target.value })}
                          className="w-8 h-8 rounded-lg border-none p-0 cursor-pointer bg-transparent" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Расположение и иконка</h4>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-4">Положение кнопки</label>
                    <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100">
                      <button 
                        onClick={() => updateChat({ buttonPosition: 'left' })}
                        className={`flex-grow py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${chat.buttonPosition === 'left' ? 'bg-[#6C5DD3] text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
                      >
                        Слева
                      </button>
                      <button 
                        onClick={() => updateChat({ buttonPosition: 'right' })}
                        className={`flex-grow py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${chat.buttonPosition === 'right' ? 'bg-[#6C5DD3] text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
                      >
                        Справа
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-4">Иконка кнопки</label>
                    <div className="grid grid-cols-4 gap-3">
                      {['MessageCircle', 'MessageSquare', 'Zap', 'Headset'].map((icon) => (
                        <button 
                          key={icon}
                          onClick={() => updateChat({ buttonIcon: icon })}
                          className={`p-4 rounded-2xl flex items-center justify-center transition-all border-2 ${
                            chat.buttonIcon === icon 
                              ? 'bg-[#6C5DD3]/10 border-[#6C5DD3] text-[#6C5DD3]' 
                              : 'bg-slate-50 border-transparent text-slate-400 hover:text-slate-900'
                          }`}
                        >
                          {icon === 'MessageCircle' && <MessageCircle className="w-6 h-6" />}
                          {icon === 'MessageSquare' && <MessageSquare className="w-6 h-6" />}
                          {icon === 'Zap' && <Zap className="w-6 h-6" />}
                          {icon === 'Headset' && <div className="w-6 h-6 flex items-center justify-center font-black">H</div>}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'telegram' && (
          <div className="space-y-8">
            <div className="bg-indigo-500/10 border border-indigo-500/20 p-6 rounded-[2rem] flex gap-5 items-start">
              <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-500/20">
                <Bot className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-black text-indigo-400 uppercase tracking-widest italic">Инструкция по настройке</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  1. Создайте бота в <span className="text-white font-bold">@BotFather</span> и получите токен.<br />
                  2. Узнайте свой ID через <span className="text-white font-bold">@userinfobot</span>.<br />
                  3. Вставьте данные ниже и сохраните. Сообщения будут приходить вам в Telegram.<br />
                  4. <span className="text-emerald-400 font-bold">Двусторонняя связь:</span> Отвечайте на сообщения прямо в Telegram (через функцию "Ответить" / "Reply"), и ваш ответ мгновенно придет пользователю на сайт.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-4">Telegram Bot Token</label>
                <input 
                  type="password" 
                  value={chat.telegramBotToken}
                  onChange={(e) => updateChat({ telegramBotToken: e.target.value })}
                  placeholder="0000000000:AAH..."
                  className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#6C5DD3]" 
                />
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-4">Telegram Chat ID</label>
                <input 
                  type="text" 
                  value={chat.telegramChatId}
                  onChange={(e) => updateChat({ telegramChatId: e.target.value })}
                  placeholder="7122180601"
                  className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#6C5DD3]" 
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'quick' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Список быстрых ответов</h4>
              <button 
                onClick={addQuickReply}
                className="flex items-center gap-2 px-6 py-3 bg-[#6C5DD3] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-900/20 hover:scale-105 transition-all"
              >
                <Plus className="w-4 h-4" />
                Добавить
              </button>
            </div>

            <div className="space-y-4">
              {(chat.quickReplies || []).length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                  <Zap className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Нет быстрых ответов</p>
                </div>
              ) : (
                (chat.quickReplies || []).map((qr) => (
                  <div key={qr.id} className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex gap-6 items-start group">
                    <div className="flex-grow grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Текст кнопки</label>
                        <input 
                          type="text" 
                          value={qr.label}
                          onChange={(e) => updateQuickReply(qr.id, { label: e.target.value })}
                          className="w-full bg-white border border-slate-100 rounded-xl p-4 text-xs font-bold text-slate-900" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Ответ системы</label>
                        <input 
                          type="text" 
                          value={qr.text}
                          onChange={(e) => updateQuickReply(qr.id, { text: e.target.value })}
                          className="w-full bg-white border border-slate-100 rounded-xl p-4 text-xs font-bold text-slate-900" 
                        />
                      </div>
                    </div>
                    <button 
                      onClick={() => removeQuickReply(qr.id)}
                      className="p-4 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all mt-6"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Уведомления</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-1">Звук при новом сообщении</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
              <History className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-900 uppercase tracking-widest">История</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-1">Сохранение переписки</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Адаптивность</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-1">Оптимизация для мобильных</p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => alert('Настройки чата успешно сохранены!')}
          className="px-14 py-5 bg-[#6C5DD3] text-white rounded-[1.8rem] font-black text-[11px] uppercase tracking-widest shadow-2xl shadow-indigo-900/40 hover:scale-105 transition-all flex items-center gap-3"
        >
          <Save className="w-4 h-4" />
          Сохранить всё
        </button>
      </div>
    </div>
  );
};
