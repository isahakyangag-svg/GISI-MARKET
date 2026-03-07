
import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Minus, Maximize2 } from 'lucide-react';
import * as Icons from 'lucide-react';
import { StoreSettings, ChatSettings } from '../types';

interface Message {
  text: string;
  sender: 'user' | 'admin' | 'system';
  timestamp: string;
  user?: {
    name: string;
    email: string;
    phone: string;
  };
}

interface UserData {
  name: string;
  email: string;
  phone: string;
}

interface LiveChatProps {
  settings: StoreSettings;
}

const DynamicIcon = ({ name, className }: { name: string, className?: string }) => {
  const IconComponent = (Icons as any)[name] || Icons.MessageCircle;
  return <IconComponent className={className} />;
};

export const LiveChat: React.FC<LiveChatProps> = ({ settings }) => {
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

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(() => {
    try {
      const saved = localStorage.getItem('chat_user_data');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error('Failed to parse chat user data:', e);
      return null;
    }
  });
  const [formInput, setFormInput] = useState<UserData>({
    name: '',
    email: '',
    phone: ''
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chat.enabled) return;

    const newSocket = io();
    
    newSocket.on('connect', () => {
      console.log('Connected to chat server');
      newSocket.emit('update_telegram_config', {
        token: chat.telegramBotToken,
        chatId: chat.telegramChatId
      });
    });

    setSocket(newSocket);

    newSocket.on('server_message', (msg: Message) => {
      setMessages(prev => [...prev, msg]);
      if (!isOpen || isMinimized) {
        setUnreadCount(prev => prev + 1);
      }
    });

    return () => {
      newSocket.close();
    };
  }, [chat.enabled, chat.telegramBotToken, chat.telegramChatId]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setUnreadCount(0);
    }
  }, [isOpen, isMinimized]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, showForm]);

  const handleSend = (textOverride?: string) => {
    const messageText = textOverride || input.trim();
    if (!messageText || !socket) return;

    if (!userData) {
      setShowForm(true);
      return;
    }

    const userMsg: Message = {
      text: messageText,
      sender: 'user',
      timestamp: new Date().toISOString(),
      user: userData
    };

    setMessages(prev => [...prev, userMsg]);
    socket.emit('client_message', userMsg);
    if (!textOverride) setInput('');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formInput.name || !formInput.email || !formInput.phone) return;

    const data = { ...formInput };
    setUserData(data);
    localStorage.setItem('chat_user_data', JSON.stringify(data));
    setShowForm(false);
    
    // If there was a pending message, send it now
    if (input.trim()) {
      handleSend();
    }
  };

  if (!chat.enabled) return null;

  return (
    <div className={`fixed bottom-8 z-[1000] ${chat.buttonPosition === 'left' ? 'left-8' : 'right-8'}`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              height: isMinimized ? '64px' : '550px'
            }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            style={{ backgroundColor: chat.chatBackground }}
            className="backdrop-blur-xl w-[350px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] rounded-[2rem] border border-white overflow-hidden flex flex-col transition-all duration-300"
          >
            {/* Header */}
            <div 
              style={{ backgroundColor: chat.headerColor }}
              className="p-5 flex items-center justify-between text-white shrink-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center overflow-hidden border border-white/10">
                  {chat.avatarUrl ? (
                    <img src={chat.avatarUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="text-sm font-black uppercase">{chat.title?.[0] || 'C'}</div>
                  )}
                </div>
                <div>
                  <h4 className="font-black text-xs tracking-tighter uppercase">{chat.title}</h4>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${chat.status === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`} />
                    <span className={`text-[9px] font-black uppercase tracking-widest ${chat.status === 'online' ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {chat.status === 'online' ? 'Онлайн' : 'Офлайн'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-all"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-grow overflow-y-auto p-5 space-y-4 hide-scrollbar" ref={scrollRef}>
                  {showForm ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4"
                    >
                      <div className="text-center space-y-1 mb-4">
                        <h5 className="text-xs font-black uppercase tracking-widest text-slate-900">Представьтесь</h5>
                        <p className="text-[10px] font-bold text-slate-400">Чтобы мы могли вам ответить</p>
                      </div>
                      <form onSubmit={handleFormSubmit} className="space-y-3">
                        <input 
                          required
                          type="text" 
                          placeholder="Ваше имя"
                          value={formInput.name}
                          onChange={e => setFormInput(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-[11px] font-bold outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                        <input 
                          required
                          type="email" 
                          placeholder="Email"
                          value={formInput.email}
                          onChange={e => setFormInput(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-[11px] font-bold outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                        <input 
                          required
                          type="tel" 
                          placeholder="Телефон"
                          value={formInput.phone}
                          onChange={e => setFormInput(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-[11px] font-bold outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                        <button 
                          type="submit"
                          className="w-full py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-200 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                          Начать чат
                        </button>
                      </form>
                    </motion.div>
                  ) : (
                    <>
                      {(messages || []).length === 0 && (
                        <div className="text-center py-10 opacity-30">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">{chat.welcomeMessage}</p>
                        </div>
                      )}
                      {(messages || []).map((m, i) => (
                        <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div 
                            style={{ 
                              backgroundColor: m.sender === 'user' ? chat.userMessageColor : chat.adminMessageColor,
                              color: m.sender === 'user' ? '#ffffff' : '#1e293b'
                            }}
                            className={`max-w-[85%] p-4 text-xs font-bold shadow-sm rounded-2xl ${
                              m.sender === 'user' ? 'rounded-tr-none' : 'rounded-tl-none'
                            }`}
                          >
                            {m.text}
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>

                {!showForm && (
                  <>
                    {/* Quick Replies */}
                    {(chat.quickReplies || []).length > 0 && (
                      <div className="px-5 pb-3 flex gap-2 overflow-x-auto hide-scrollbar">
                        {(chat.quickReplies || []).map((qr) => (
                          <button
                            key={qr.id}
                            onClick={() => handleSend(qr.text)}
                            className="shrink-0 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                          >
                            {qr.label}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Input */}
                    <div className="p-5 pt-0">
                      <div className="relative flex items-center bg-slate-50 rounded-2xl px-4 py-1 border border-slate-100 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all">
                        <input 
                          type="text" 
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                          placeholder="Введите сообщение..."
                          className="w-full py-4 bg-transparent border-none outline-none text-xs font-bold text-slate-700"
                        />
                        <button 
                          onClick={() => handleSend()}
                          disabled={!input.trim()}
                          style={{ color: chat.buttonColor }}
                          className="p-2 hover:scale-110 active:scale-95 disabled:opacity-30 transition-all"
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          style={{ backgroundColor: chat.buttonColor }}
          className="w-16 h-16 rounded-2xl shadow-2xl flex items-center justify-center text-white group relative overflow-hidden"
        >
          <DynamicIcon name={chat.buttonIcon} className="w-8 h-8 transition-transform group-hover:scale-110" />
          {unreadCount > 0 && (
            <div className="absolute top-2 right-2 w-5 h-5 bg-rose-500 border-2 border-white rounded-full flex items-center justify-center text-[10px] font-black">
              {unreadCount}
            </div>
          )}
        </motion.button>
      )}
    </div>
  );
};
