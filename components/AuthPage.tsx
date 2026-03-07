
import React, { useState } from 'react';
import { StoreSettings, SocialLoginProvider, RegistrationField, SiteSocialIcon, User } from '../types';
import { Eye, EyeOff, ArrowLeft, Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuthPageProps {
  settings: StoreSettings;
  allUsers: User[];
  onBack: () => void;
  onLogin: (user: User) => void;
  onRegister: (user: User) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ settings, allUsers, onBack, onLogin, onRegister }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const auth = settings.authSettings || {
    backgroundUrl: '',
    overlayOpacity: 0.5,
    primaryColor: '#82C12D',
    buttonColor: '#82C12D',
    textColor: '#ffffff',
    borderRadius: 12,
    shadowIntensity: 'medium'
  };
  const socialLogins = (settings.socialLogins || []).filter(s => s.enabled).sort((a, b) => a.order - b.order);
  const regFields = (settings.registrationFields || []).filter(f => f.enabled).sort((a, b) => a.order - b.order);
  const siteSocials = (settings.siteSocialIcons || []).filter(s => s.enabled).sort((a, b) => a.order - b.order);

  const shadowClass = 
    auth.shadowIntensity === 'soft' ? 'shadow-lg' :
    auth.shadowIntensity === 'medium' ? 'shadow-2xl' : 'shadow-[0_20px_50px_rgba(0,0,0,0.5)]';

  const handleAction = async () => {
    const newErrors: Record<string, string> = {};
    setIsLoading(true);
    
    if (mode === 'login') {
      const loginInput = (formData.email || '').trim().toLowerCase();
      const password = formData.password || '';

      if (!loginInput) newErrors.email = 'Введите Email';
      if (!password) newErrors.password = 'Введите пароль';

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setIsLoading(false);
        return;
      }

      // Check against allUsers (both admins and customers)
      let foundUser = allUsers.find(u => 
        (u.email.toLowerCase() === loginInput || u.adminLogin?.toLowerCase() === loginInput) && 
        (u.password === password || u.adminPassword === password)
      );

      // Master fallback for admin/1
      if (!foundUser && loginInput === 'admin' && password === '1') {
        foundUser = allUsers.find(u => u.id === 'admin-1');
      }

      if (foundUser) {
        if (foundUser.isBlocked) {
          newErrors.email = 'Ваш аккаунт заблокирован';
          setErrors(newErrors);
        } else {
          onLogin(foundUser);
        }
      } else {
        newErrors.email = 'Неверный Email или пароль';
        setErrors(newErrors);
      }
    } else {
      // Registration validation
      regFields.forEach(field => {
        if (field.required && !formData[field.id]) {
          newErrors[field.id] = `Поле "${field.label}" обязательно`;
        }
      });

      const passwordField = regFields.find(f => f.type === 'password');
      const mainPassword = passwordField ? (formData[passwordField.id] || '').trim() : '';
      const confirmPassword = (formData.confirmPassword || '').trim();

      if (!confirmPassword) {
        newErrors.confirmPassword = 'Повторите пароль';
      } else if (mainPassword !== confirmPassword) {
        newErrors.confirmPassword = 'Пароли не совпадают';
      }

      const emailField = regFields.find(f => f.type === 'email');
      const emailValue = emailField ? formData[emailField.id] : formData.email;
      if (emailValue && allUsers.some(u => u.email.toLowerCase() === emailValue.toLowerCase())) {
        newErrors[emailField?.id || 'email'] = 'Этот Email уже зарегистрирован';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setIsLoading(false);
        return;
      }

      // Get IP address
      let userIp = 'Unknown';
      try {
        const ipRes = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipRes.json();
        userIp = ipData.ip;
      } catch (e) {
        console.error('Failed to get IP:', e);
      }

      const newUser: User = {
        id: `u-${Date.now()}`,
        name: formData.name || 'User',
        surname: formData.surname || '',
        email: emailValue || '',
        password: mainPassword,
        role: 'customer',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${emailValue || Date.now()}`,
        joinedDate: new Date().toISOString(),
        ip: userIp,
        age: formData.age ? parseInt(formData.age) : undefined,
        status: 'active',
        isBlocked: false
      };

      onRegister(newUser);
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden">
      {/* Background with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: `url(${auth.backgroundUrl})` }}
      >
        <div 
          className="absolute inset-0 bg-black transition-opacity duration-1000" 
          style={{ opacity: auth.overlayOpacity }} 
        />
      </div>

      {/* Back Button */}
      <button 
        onClick={onBack}
        className="absolute top-8 left-8 p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all z-10 group"
      >
        <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
      </button>

      {/* Auth Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className={`relative w-full max-w-[480px] p-10 backdrop-blur-xl bg-white/10 border border-white/20 overflow-hidden ${shadowClass}`}
        style={{ borderRadius: `${auth.borderRadius}px` }}
      >
        {/* Tabs */}
        <div className="flex bg-black/20 p-1 rounded-2xl mb-8">
          <button 
            onClick={() => { setMode('register'); setErrors({}); }}
            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${mode === 'register' ? 'bg-white text-slate-900 shadow-lg' : 'text-white/40 hover:text-white'}`}
          >
            Регистрация
          </button>
          <button 
            onClick={() => { setMode('login'); setErrors({}); }}
            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${mode === 'login' ? 'bg-white text-slate-900 shadow-lg' : 'text-white/40 hover:text-white'}`}
          >
            Вход
          </button>
        </div>

        {/* Social Logins */}
        {socialLogins.length > 0 && (
          <div className="mb-8">
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] text-center mb-4">Войти через</p>
            <div className="flex justify-center gap-4">
              {socialLogins.map(provider => (
                <button 
                  key={provider.id}
                  className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 hover:scale-110 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300"
                  title={provider.name}
                >
                  <img src={provider.icon} alt={provider.name} className="w-6 h-6 object-contain" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Form */}
        <div className="space-y-5">
          <AnimatePresence mode="wait">
            {mode === 'login' ? (
              <motion.div 
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-5"
              >
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-white/50 uppercase tracking-widest ml-1">Email или Логин</label>
                  <input 
                    type="text" 
                    placeholder="example@mail.com"
                    value={formData.email || ''}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className={`w-full p-4 bg-white/5 border ${errors.email ? 'border-rose-500/50' : 'border-white/10'} rounded-2xl text-white font-bold outline-none focus:border-white/30 transition-all`}
                  />
                  {errors.email && <p className="text-[10px] font-bold text-rose-400 mt-1 ml-1 uppercase">{errors.email}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-white/50 uppercase tracking-widest ml-1">Пароль</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="••••••••"
                      value={formData.password || ''}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                      className={`w-full p-4 bg-white/5 border ${errors.password ? 'border-rose-500/50' : 'border-white/10'} rounded-2xl text-white font-bold outline-none focus:border-white/30 transition-all`}
                    />
                    <button 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-[10px] font-bold text-rose-400 mt-1 ml-1 uppercase">{errors.password}</p>}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5 max-h-[400px] overflow-y-auto pr-2 hide-scrollbar"
              >
                {regFields.map(field => (
                  <div key={field.id} className="space-y-1.5">
                    <label className="text-[10px] font-black text-white/50 uppercase tracking-widest ml-1">{field.label} {field.required && '*'}</label>
                    {field.type === 'select' ? (
                      <select 
                        value={formData[field.id] || ''}
                        onChange={e => setFormData({...formData, [field.id]: e.target.value})}
                        className={`w-full p-4 bg-white/5 border ${errors[field.id] ? 'border-rose-500/50' : 'border-white/10'} rounded-2xl text-white font-bold outline-none focus:border-white/30 transition-all appearance-none`}
                      >
                        <option value="" disabled>{field.placeholder || 'Выберите...'}</option>
                        {field.options?.map(opt => <option key={opt} value={opt} className="bg-slate-900">{opt}</option>)}
                      </select>
                    ) : field.type === 'checkbox' ? (
                      <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl cursor-pointer" onClick={() => setFormData({...formData, [field.id]: formData[field.id] === 'true' ? 'false' : 'true'})}>
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${formData[field.id] === 'true' ? 'bg-white border-white' : 'border-white/20'}`}>
                          {formData[field.id] === 'true' && <Check size={14} className="text-slate-900" />}
                        </div>
                        <span className="text-sm font-bold text-white/70">{field.label}</span>
                      </div>
                    ) : (
                      <input 
                        type={field.type === 'password' && !showPassword ? 'password' : field.type === 'password' && showPassword ? 'text' : field.type} 
                        placeholder={field.placeholder}
                        value={formData[field.id] || ''}
                        onChange={e => setFormData({...formData, [field.id]: e.target.value})}
                        className={`w-full p-4 bg-white/5 border ${errors[field.id] ? 'border-rose-500/50' : 'border-white/10'} rounded-2xl text-white font-bold outline-none focus:border-white/30 transition-all`}
                      />
                    )}
                    {errors[field.id] && <p className="text-[10px] font-bold text-rose-400 mt-1 ml-1 uppercase">{errors[field.id]}</p>}
                  </div>
                ))}
                
                {/* Password confirmation for registration */}
                {regFields.some(f => f.type === 'password') && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-white/50 uppercase tracking-widest ml-1">Повторите пароль *</label>
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="••••••••"
                      value={formData.confirmPassword || ''}
                      onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                      className={`w-full p-4 bg-white/5 border ${errors.confirmPassword ? 'border-rose-500/50' : 'border-white/10'} rounded-2xl text-white font-bold outline-none focus:border-white/30 transition-all`}
                    />
                    {errors.confirmPassword && <p className="text-[10px] font-bold text-rose-400 mt-1 ml-1 uppercase">{errors.confirmPassword}</p>}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button 
          onClick={handleAction}
          disabled={isLoading}
          className="w-full mt-10 py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.3em] shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          style={{ backgroundColor: auth.buttonColor, color: auth.textColor }}
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          {mode === 'login' ? 'Войти в систему' : 'Зарегистрироваться'}
        </button>

        <p className="mt-6 text-center text-[10px] font-bold text-white/30 uppercase tracking-widest">
          {mode === 'login' ? 'Нет аккаунта?' : 'Уже есть аккаунт?'} 
          <button 
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="ml-2 text-white hover:underline"
          >
            {mode === 'login' ? 'Создать сейчас' : 'Войти'}
          </button>
        </p>
      </motion.div>

      {/* Site Social Icons */}
      <div className="absolute bottom-8 right-8 flex flex-col gap-4">
        {siteSocials.map(social => (
          <a 
            key={social.id}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 hover:scale-110 transition-all shadow-xl"
          >
            <SocialIcon type={social.type} />
          </a>
        ))}
      </div>
    </div>
  );
};

const SocialIcon = ({ type }: { type: SiteSocialIcon['type'] }) => {
  switch (type) {
    case 'instagram': return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>;
    case 'vk': return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M13.162 18.994c.609 0 .858-.406.851-.915-.013-.914.406-1.27.771-1.27.77 0 1.05.303 1.05 1.329 0 .546.344.92.811.92h1.49c.427 0 .733-.167.733-.718 0-1.308-1.51-3.493-1.51-3.493-.307-.437-.25-.627 0-.915 0 0 1.266-1.613 1.393-2.302.058-.302 0-.53-.439-.53h-1.457c-.367 0-.539.193-.631.412 0 0-.742 1.808-1.79 2.981-.34.34-.496.446-.683.446-.092 0-.226-.106-.226-.409v-2.894c0-.366-.106-.53-.414-.53h-2.291c-.227 0-.366.153-.366.298 0 .346.516.426.569 1.396v1.502c0 .329-.059.449-.185.449-.33 0-1.134-1.814-1.612-3.898-.135-.585-.338-.821-.704-.821h-1.496c-.436 0-.519.203-.519.427 0 .405.52 2.447 2.418 5.113 1.266 1.819 3.051 2.804 4.674 2.804z"/></svg>;
    case 'facebook': return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.324v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>;
    case 'telegram': return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.462 8.816c-.235 2.485-1.255 8.484-1.777 11.271-.221 1.181-.656 1.576-1.076 1.615-.914.085-1.607-.603-2.492-1.183-1.385-.908-2.166-1.472-3.511-2.358-1.553-1.024-.546-1.587.339-2.507.232-.241 4.259-3.905 4.337-4.234.01-.042.02-.197-.073-.28-.093-.083-.229-.054-.328-.031-.142.032-2.404 1.528-6.79 4.494-.643.441-1.225.657-1.746.645-.576-.012-1.684-.325-2.509-.593-1.012-.331-1.817-.505-1.747-1.067.036-.292.441-.592 1.216-.899 4.753-2.07 7.921-3.434 9.504-4.094 4.517-1.887 5.454-2.215 6.064-2.226.135-.002.435.031.629.19.164.134.209.314.231.441.023.129.033.436.015.586z"/></svg>;
    case 'youtube': return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>;
    case 'twitter': return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>;
    default: return <Check size={20} />;
  }
};
