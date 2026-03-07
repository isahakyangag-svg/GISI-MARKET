
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import OpenAI from 'openai';
import { StoreSettings, Product, Category, DeveloperLog, AIVersion, User } from '../types';
import { 
  Terminal, Send, Trash2, RotateCcw, History, 
  CheckCircle2, AlertCircle, FileCode, Play, Save,
  ChevronRight, ChevronDown, Search, Sparkles,
  ShieldCheck, Clock, User as UserIcon, Settings as SettingsIcon,
  Key, Cpu
} from 'lucide-react';

interface DeveloperPageProps {
  settings: StoreSettings;
  onUpdateSettings: (s: StoreSettings) => void;
  products: Product[];
  onUpdateProducts: (p: Product[]) => void;
  categories: Category[];
  onUpdateCategories: (c: Category[]) => void;
  currentUser: User;
}

export const DeveloperPage: React.FC<DeveloperPageProps> = ({ 
  settings, onUpdateSettings, products, onUpdateProducts, categories, onUpdateCategories, currentUser 
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'logs' | 'settings'>('chat');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'model', text: string }[]>([]);
  const [proposedChanges, setProposedChanges] = useState<{
    settings?: Partial<StoreSettings>;
    products?: Product[];
    categories?: Category[];
    description: string;
  } | null>(null);
  const [logs, setLogs] = useState<DeveloperLog[]>([]);
  const [versions, setVersions] = useState<AIVersion[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // OpenAI Key from settings
  const [openaiKey, setOpenaiKey] = useState(settings.openaiKey || '');

  useEffect(() => {
    setOpenaiKey(settings.openaiKey || '');
  }, [settings.openaiKey]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const safeParseAIResponse = (text: string) => {
    try {
      // Remove markdown code blocks if present
      const cleaned = text.replace(/```json\n?|```/g, '').trim();
      return JSON.parse(cleaned);
    } catch (e) {
      console.error('Failed to parse AI response:', e, text);
      return null;
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setChatHistory(prev => [...prev, { role: 'user', text: prompt }]);
    
    try {
      const systemInstruction = `
        You are a Senior Web Developer and UI/UX Designer. 
        Your task is to help the user modify their online store configuration.
        
        Current Store Settings: ${JSON.stringify(settings)}
        Current Categories: ${JSON.stringify(categories)}
        
        The user will describe a task (e.g., "change primary color to red", "make buttons more rounded").
        You must return a JSON object representing the proposed changes.
        
        The JSON MUST follow this schema:
        {
          "settings": Partial<StoreSettings>,
          "description": "Short explanation of what will be changed"
        }
        
        Rules:
        1. Only modify fields that are relevant to the user's request.
        2. Do not change IDs or critical structural data unless asked.
        3. Be creative but professional.
        4. Return ONLY the JSON object.
      `;

      let result: any = {};
      let usedGeminiFallback = false;

      if (settings.openaiKey) {
        try {
          // Use OpenAI
          const openai = new OpenAI({
            apiKey: settings.openaiKey,
            dangerouslyAllowBrowser: true
          });

          const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
              { role: "system", content: systemInstruction },
              { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" }
          });

          result = safeParseAIResponse(response.choices[0].message.content || '{}');
        } catch (error: any) {
          const status = error.status || (error.message?.match(/\d{3}/)?.[0]);
          if (status === 429 || status === '429') {
            console.warn('OpenAI Quota exceeded, falling back to Gemini...');
            usedGeminiFallback = true;
          } else {
            throw error; // Re-throw other errors
          }
        }
      }

      // If no OpenAI key OR OpenAI failed with 429, use Gemini
      if (!settings.openaiKey || usedGeminiFallback) {
        const ai = new GoogleGenAI({ apiKey: (process.env as any).GEMINI_API_KEY });
        const model = "gemini-3-flash-preview";

        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                settings: { type: Type.OBJECT, description: "Partial settings object with changes" },
                description: { type: Type.STRING, description: "Explanation of changes" }
              },
              required: ["description"]
            }
          }
        });

        result = safeParseAIResponse(response.text || '{}');
        
        if (usedGeminiFallback) {
          result.description = `⚠️ (OpenAI Quota Exceeded - Fallback to Gemini) ${result.description}`;
        }
      }

      if (!result) {
        throw new Error("Не удалось разобрать ответ ИИ. Пожалуйста, попробуйте переформулировать запрос.");
      }

      setProposedChanges(result);
      setChatHistory(prev => [...prev, { role: 'model', text: result.description || "Я подготовил изменения. Проверьте их в панели справа." }]);
      setPrompt('');
    } catch (error: any) {
      console.error('AI Generation Error:', error);
      let errorMsg = "Произошла ошибка при генерации изменений. Пожалуйста, попробуйте еще раз.";
      
      const status = error.status || (error.message?.match(/\d{3}/)?.[0]);
      
      if (status === 401 || status === '401') {
        errorMsg = "Ошибка авторизации OpenAI. Проверьте ваш API Key в настройках.";
      } else if (status === 429 || status === '429') {
        errorMsg = "Превышена квота OpenAI (Error 429). Пожалуйста, проверьте баланс вашего аккаунта на platform.openai.com или удалите ключ в настройках, чтобы вернуться на бесплатный Gemini AI.";
      } else if (error.message) {
        errorMsg = `Ошибка ИИ: ${error.message}`;
      }
      
      setChatHistory(prev => [...prev, { role: 'model', text: errorMsg }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const applyChanges = () => {
    if (!proposedChanges) return;

    // Create a snapshot for rollback
    const newVersion: AIVersion = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      settings: { ...settings },
      products: [...products],
      categories: [...categories],
      description: proposedChanges.description
    };

    setVersions(prev => [newVersion, ...prev]);

    // Apply changes
    if (proposedChanges.settings) {
      onUpdateSettings({ ...settings, ...proposedChanges.settings });
    }
    if (proposedChanges.products) {
      onUpdateProducts(proposedChanges.products);
    }
    if (proposedChanges.categories) {
      onUpdateCategories(proposedChanges.categories);
    }

    // Log the action
    const newLog: DeveloperLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      adminEmail: currentUser.email,
      request: chatHistory[chatHistory.length - 2]?.text || "Прямое применение",
      result: 'success',
      changes: [proposedChanges.description],
      versionId: newVersion.id
    };

    setLogs(prev => [newLog, ...prev]);
    setProposedChanges(null);
    alert('Изменения успешно применены!');
  };

  const rollback = (version: AIVersion) => {
    if (window.confirm(`Вы уверены, что хотите откатиться к версии от ${new Date(version.timestamp).toLocaleString()}?`)) {
      onUpdateSettings(version.settings);
      onUpdateProducts(version.products);
      onUpdateCategories(version.categories);
      alert('Откат выполнен успешно!');
    }
  };

  const saveDeveloperSettings = () => {
    onUpdateSettings({ ...settings, openaiKey });
    alert('Настройки разработчика сохранены!');
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="p-8 border-b border-slate-200 bg-white flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 italic uppercase tracking-tight">Разработчик</h2>
            <div className="flex items-center gap-2 mt-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Режим песочницы • {settings.openaiKey ? 'ChatGPT (OpenAI)' : 'Gemini AI'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('chat')}
            className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'chat' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Чат и Правки
          </button>
          <button 
            onClick={() => setActiveTab('logs')}
            className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'logs' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Логи и Откаты
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'settings' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Настройки ИИ
          </button>
        </div>
      </div>

      <div className="flex-grow flex overflow-hidden">
        {activeTab === 'chat' ? (
          <>
            {/* Left Column: Chat */}
            <div className="w-1/2 flex flex-col border-r border-slate-200 bg-white">
              <div className="flex-grow overflow-y-auto p-8 space-y-6 hide-scrollbar" ref={scrollRef}>
                {chatHistory.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
                      <Sparkles className="w-10 h-10 text-indigo-600" />
                    </div>
                    <div className="max-w-xs">
                      <p className="text-sm font-black uppercase tracking-widest text-slate-900">ИИ Разработчик готов</p>
                      <p className="text-xs font-bold text-slate-500 mt-2">
                        {settings.openaiKey ? 'Используется ваш ChatGPT (OpenAI)' : 'Используется встроенный Gemini AI'}
                      </p>
                    </div>
                  </div>
                )}
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-5 rounded-3xl text-sm font-bold shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-indigo-600 text-white rounded-tr-none' 
                        : 'bg-slate-100 text-slate-900 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isGenerating && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 p-5 rounded-3xl rounded-tl-none flex gap-2">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-8 border-t border-slate-200 bg-slate-50/50">
                <div className="relative flex items-center bg-white rounded-[2rem] px-6 py-2 shadow-xl shadow-indigo-900/5 border border-slate-200 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all">
                  <input 
                    type="text" 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                    placeholder="Опишите изменения..."
                    className="w-full py-5 bg-transparent border-none outline-none text-sm font-bold text-slate-700"
                  />
                  <button 
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || isGenerating}
                    className="p-3 bg-indigo-600 text-white rounded-2xl hover:scale-110 active:scale-95 disabled:opacity-30 disabled:scale-100 transition-all shadow-lg shadow-indigo-200"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Preview & Apply */}
            <div className="w-1/2 flex flex-col bg-slate-50 overflow-y-auto hide-scrollbar">
              <div className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Предпросмотр изменений</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Черновик</span>
                  </div>
                </div>

                {proposedChanges ? (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
                          <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">План изменений</p>
                          <p className="text-sm font-bold text-slate-900 mt-1 leading-relaxed">{proposedChanges.description}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2">Детализация правок</p>
                        <div className="space-y-3">
                          {proposedChanges.settings && Object.entries(proposedChanges.settings).map(([key, value]) => {
                            const oldValue = (settings as any)[key];
                            if (JSON.stringify(oldValue) === JSON.stringify(value)) return null;
                            
                            return (
                              <div key={key} className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{key}</span>
                                  <div className="px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded text-[8px] font-black uppercase">изменено</div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 items-center">
                                  <div className="space-y-1">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Было</p>
                                    <p className="text-xs font-bold text-slate-400 line-through truncate">
                                      {typeof oldValue === 'object' ? '{...}' : String(oldValue)}
                                    </p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Станет</p>
                                    <p className="text-xs font-black text-slate-900 truncate">
                                      {typeof value === 'object' ? '{...}' : String(value)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="pt-6 border-t border-slate-100">
                        <div className="bg-slate-900 rounded-3xl p-6 font-mono text-[11px] text-indigo-300 overflow-x-auto">
                          <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
                            <span className="text-white/40 uppercase tracking-widest text-[9px]">Raw JSON Patch</span>
                            <FileCode className="w-4 h-4 text-white/20" />
                          </div>
                          <pre>{JSON.stringify(proposedChanges.settings, null, 2)}</pre>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button 
                        onClick={() => setProposedChanges(null)}
                        className="flex-grow py-5 bg-white border border-slate-200 text-slate-400 rounded-[1.8rem] font-black text-[11px] uppercase tracking-widest hover:text-slate-900 transition-all"
                      >
                        Отклонить
                      </button>
                      <button 
                        onClick={applyChanges}
                        className="flex-[2] py-5 bg-indigo-600 text-white rounded-[1.8rem] font-black text-[11px] uppercase tracking-widest shadow-2xl shadow-indigo-900/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                      >
                        <Save className="w-4 h-4" />
                        Применить изменения
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="h-[400px] border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center text-center p-10 opacity-40">
                    <Play className="w-12 h-12 text-slate-300 mb-4" />
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Нет активных правок</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-2">Используйте чат слева, чтобы сгенерировать план изменений</p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : activeTab === 'logs' ? (
          /* Logs & Rollbacks Tab */
          <div className="flex-grow overflow-y-auto p-12 space-y-10 bg-white">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-slate-900 italic uppercase">История изменений</h3>
                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Логи операций и точки восстановления</p>
              </div>
              <div className="flex items-center gap-3 px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Всего версий: {versions.length}</span>
              </div>
            </div>

            <div className="space-y-6">
              {logs.length === 0 ? (
                <div className="py-20 text-center opacity-30">
                  <History className="w-16 h-16 mx-auto mb-6" />
                  <p className="text-sm font-black uppercase tracking-widest">История пуста</p>
                </div>
              ) : (
                logs.map((log) => {
                  const version = versions.find(v => v.id === log.versionId);
                  return (
                    <div key={log.id} className="group bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-6">
                          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform">
                            <UserIcon className="w-6 h-6" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{log.adminEmail}</span>
                              <span className="w-1 h-1 bg-slate-300 rounded-full" />
                              <span className="text-[10px] font-bold text-slate-400">{new Date(log.timestamp).toLocaleString()}</span>
                            </div>
                            <p className="text-sm font-bold text-slate-600 italic">"{log.request}"</p>
                            <div className="flex flex-wrap gap-2 mt-4">
                              {log.changes.map((c, idx) => (
                                <span key={idx} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                  {c}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        {version && (
                          <button 
                            onClick={() => rollback(version)}
                            className="px-6 py-3 bg-white border border-slate-200 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all flex items-center gap-2"
                          >
                            <RotateCcw className="w-3 h-3" />
                            Откатить
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ) : (
          /* Settings Tab */
          <div className="flex-grow overflow-y-auto p-12 space-y-10 bg-white">
            <div className="max-w-2xl space-y-10">
              <div>
                <h3 className="text-xl font-black text-slate-900 italic uppercase">Настройки ИИ</h3>
                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Подключение вашего аккаунта ChatGPT</p>
              </div>

              <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 space-y-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                    <Key className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">OpenAI API Key</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">Ваш ключ будет использоваться для генерации правок</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <input 
                    type="password" 
                    value={openaiKey}
                    onChange={(e) => setOpenaiKey(e.target.value)}
                    placeholder="sk-..."
                    className="w-full bg-white border border-slate-200 rounded-2xl p-5 text-sm font-mono outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  />
                  <div className="flex items-start gap-3 px-4">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] font-bold text-slate-400 leading-relaxed">
                      Ключ хранится локально в настройках вашего магазина. Если поле пустое, система будет использовать встроенный Gemini AI.
                    </p>
                  </div>
                </div>

                <button 
                  onClick={saveDeveloperSettings}
                  className="w-full py-5 bg-indigo-600 text-white rounded-[1.8rem] font-black text-[11px] uppercase tracking-widest shadow-xl shadow-indigo-900/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  <Save className="w-4 h-4" />
                  Сохранить настройки
                </button>
              </div>

              <div className="bg-indigo-50/50 p-8 rounded-[2rem] border border-indigo-100 flex gap-6 items-center">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shrink-0 shadow-sm">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900 uppercase tracking-tight">Как получить ключ?</p>
                  <p className="text-[11px] font-bold text-slate-500 mt-1">
                    Создайте API ключ в панели управления OpenAI (platform.openai.com). Убедитесь, что у вас есть доступ к модели GPT-4o для лучших результатов.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
