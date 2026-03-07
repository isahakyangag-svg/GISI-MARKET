
import React, { useState } from 'react';
import { User, StoreSettings } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (userData: User) => void;
  language: string;
  settings?: StoreSettings;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
}) => {
  const [isToggled, setIsToggled] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.toLowerCase() === 'admin' && password === '1') {
      const admin: User = {
        id: 'admin-01',
        name: 'GISI ADMIN',
        email: 'admin@gisimarket.am',
        role: 'admin',
        status: 'active',
        joinedDate: new Date().toISOString(),
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
      };
      onLogin(admin);
      onClose();
    } else {
      alert('Неверный логин или пароль (используйте admin / 1)');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: 'u-' + Math.random().toString(36).substr(2, 9),
      name: name || 'Пользователь',
      email: email,
      role: 'customer',
      status: 'active',
      joinedDate: new Date().toISOString(),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=82C12D&color=fff`,
    };
    onLogin(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-[#1a1a2e]/90 backdrop-blur-xl animate-fade-in font-['Poppins']">
      <style>{`
        .auth-wrapper {
            position: relative;
            width: 100%;
            max-width: 850px;
            height: 550px;
            border: 2px solid #82C12D;
            box-shadow: 0 0 35px rgba(130, 193, 45, 0.4);
            overflow: hidden;
            background: #1a1a2e;
            border-radius: 10px;
        }

        .auth-wrapper .credentials-panel {
            position: absolute;
            top: 0;
            width: 50%;
            height: 100%;
            display: flex;
            justify-content: center;
            flex-direction: column;
            z-index: 20;
            transition: .7s ease;
        }

        .credentials-panel.signin {
            left: 0;
            padding: 0 50px;
            opacity: 1;
            visibility: visible;
        }

        .auth-wrapper.toggled .credentials-panel.signin {
            transform: translateX(-100%);
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
        }

        .credentials-panel.signup {
            right: 0;
            padding: 0 50px;
            transform: translateX(100%);
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
        }

        .auth-wrapper.toggled .credentials-panel.signup {
            transform: translateX(0%);
            opacity: 1;
            visibility: visible;
            pointer-events: auto;
        }

        .field-wrapper {
            position: relative;
            width: 100%;
            height: 50px;
            margin-top: 30px;
        }

        .field-wrapper input {
            width: 100%;
            height: 100%;
            background: transparent;
            border: none;
            outline: none;
            font-size: 16px;
            color: #fff;
            font-weight: 500;
            border-bottom: 2px solid #fff;
            padding-right: 30px;
            transition: .5s;
        }

        .field-wrapper input:focus,
        .field-wrapper input:valid {
            border-bottom: 2px solid #82C12D;
        }

        .field-wrapper label {
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            font-size: 16px;
            color: #fff;
            transition: .5s;
            pointer-events: none;
        }

        .field-wrapper input:focus~label,
        .field-wrapper input:valid~label {
            top: -5px;
            color: #82C12D;
            font-size: 12px;
        }

        .field-wrapper i {
            position: absolute;
            top: 50%;
            right: 5px;
            font-size: 18px;
            transform: translateY(-50%);
            color: #fff;
        }

        .field-wrapper input:focus~i,
        .field-wrapper input:valid~i {
            color: #82C12D;
        }

        .submit-button {
            position: relative;
            width: 100%;
            height: 50px;
            background: transparent;
            border-radius: 40px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 700;
            border: 2px solid #82C12D;
            color: #fff;
            overflow: hidden;
            z-index: 1;
            margin-top: 40px;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: .4s;
        }

        .submit-button:hover {
            background: #82C12D;
            color: #1a1a2e;
            box-shadow: 0 0 20px #82C12D;
        }

        .switch-link {
            font-size: 14px;
            text-align: center;
            margin-top: 25px;
            color: #fff;
        }

        .switch-link a {
            text-decoration: none;
            color: #82C12D;
            font-weight: 700;
            cursor: pointer;
        }

        .switch-link a:hover {
            text-decoration: underline;
        }

        .welcome-section {
            position: absolute;
            top: 0;
            height: 100%;
            width: 50%;
            display: flex;
            justify-content: center;
            flex-direction: column;
            color: #fff;
            z-index: 10;
            transition: .7s ease;
        }

        .welcome-section.signin {
            right: 0;
            text-align: right;
            padding: 0 40px 60px 100px;
        }

        .auth-wrapper.toggled .welcome-section.signin {
            transform: translateX(100%);
            opacity: 0;
        }

        .welcome-section.signup {
            left: 0;
            text-align: left;
            padding: 0 100px 60px 40px;
            transform: translateX(-100%);
            opacity: 0;
        }

        .auth-wrapper.toggled .welcome-section.signup {
            transform: translateX(0%);
            opacity: 1;
        }

        .auth-wrapper .background-shape {
            position: absolute;
            right: 0;
            top: -5px;
            height: 650px;
            width: 900px;
            background: linear-gradient(45deg, #1a1a2e, #82C12D);
            transform: rotate(10deg) skewY(40deg);
            transform-origin: bottom right;
            transition: 1.5s ease;
            z-index: 5;
        }

        .auth-wrapper.toggled .background-shape {
            transform: rotate(0deg) skewY(0deg);
        }

        .auth-wrapper .secondary-shape {
            position: absolute;
            left: 250px;
            top: 100%;
            height: 750px;
            width: 900px;
            background: #1a1a2e;
            border-top: 3px solid #82C12D;
            transform: rotate(0deg) skewY(0deg);
            transform-origin: bottom left;
            transition: 1.5s ease;
            z-index: 6;
        }

        .auth-wrapper.toggled .secondary-shape {
            transform: rotate(-11deg) skewY(-41deg);
        }

        .close-btn {
            position: absolute;
            top: 20px;
            right: 20px;
            color: rgba(255,255,255,0.6);
            z-index: 100;
            cursor: pointer;
            font-size: 24px;
            transition: .3s;
        }
        .close-btn:hover { color: #fff; transform: rotate(90deg); }

        .slide-element {
            transition: .7s ease;
            animation: fadeIn 0.8s ease-out forwards;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className={`auth-wrapper ${isToggled ? 'toggled' : ''}`}>
        <div className="close-btn" onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </div>
        
        <div className="background-shape"></div>
        <div className="secondary-shape"></div>

        {/* ПАНЕЛЬ ВХОДА */}
        <div className="credentials-panel signin">
            <h2 className="slide-element text-white text-4xl font-black mb-2 uppercase italic tracking-tighter">Вход</h2>
            <form onSubmit={handleLoginSubmit}>
                <div className="field-wrapper slide-element">
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <label>Имя пользователя или Email</label>
                    <i className="fa-solid fa-user"></i>
                </div>

                <div className="field-wrapper slide-element">
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <label>Пароль</label>
                    <i className="fa-solid fa-lock"></i>
                </div>

                <div className="slide-element">
                    <button className="submit-button" type="submit">Войти</button>
                </div>

                <div className="switch-link slide-element">
                    <p>Нет аккаунта? <br /> <a onClick={() => setIsToggled(true)}>Зарегистрироваться</a></p>
                </div>
            </form>
        </div>

        <div className="welcome-section signin">
            <h2 className="slide-element text-5xl font-black mb-4 italic leading-none uppercase">С возвращением!</h2>
            <p className="slide-element text-slate-200 text-sm font-medium uppercase tracking-widest opacity-80">Чтобы оставаться на связи, пожалуйста, войдите под своими данными</p>
        </div>

        {/* ПАНЕЛЬ РЕГИСТРАЦИИ */}
        <div className="credentials-panel signup">
            <h2 className="slide-element text-white text-4xl font-black mb-2 uppercase italic tracking-tighter">Регистрация</h2>
            <form onSubmit={handleRegisterSubmit}>
                <div className="field-wrapper slide-element">
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                    <label>Имя пользователя</label>
                    <i className="fa-solid fa-user"></i>
                </div>

                <div className="field-wrapper slide-element">
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <label>Электронная почта</label>
                    <i className="fa-solid fa-envelope"></i>
                </div>

                <div className="field-wrapper slide-element">
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <label>Пароль</label>
                    <i className="fa-solid fa-lock"></i>
                </div>

                <div className="slide-element">
                    <button className="submit-button" type="submit">Создать аккаунт</button>
                </div>

                <div className="switch-link slide-element">
                    <p>Уже есть аккаунт? <br /> <a onClick={() => setIsToggled(false)}>Войти в систему</a></p>
                </div>
            </form>
        </div>

        <div className="welcome-section signup">
            <h2 className="slide-element text-5xl font-black mb-4 italic leading-none uppercase">Добро пожаловать!</h2>
            <p className="slide-element text-slate-200 text-sm font-medium uppercase tracking-widest opacity-80">Введите свои данные и начните путешествие вместе с нами</p>
        </div>
      </div>
    </div>
  );
};
