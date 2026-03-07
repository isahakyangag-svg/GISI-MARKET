
import React, { useState, useMemo } from 'react';
import { User, AdminRole, AdminPermission } from '../../types';
import { ALL_PERMISSIONS } from '../../src/data/roles';
import { 
  Search, UserPlus, Shield, MoreVertical, Trash2, 
  Lock, Unlock, Check, X, ChevronDown, ChevronUp,
  UserCheck, UserX, Key, Mail, Phone, User as UserIcon
} from 'lucide-react';

interface UsersManagementProps {
  allUsers: User[];
  onUpdateUsers: (users: User[]) => void;
  adminRoles: AdminRole[];
}

export const UsersManagement: React.FC<UsersManagementProps> = ({ 
  allUsers, 
  onUpdateUsers, 
  adminRoles 
}) => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const filteredUsers = useMemo(() => {
    return allUsers.filter(u => 
      u.name.toLowerCase().includes(search.toLowerCase()) || 
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.adminLogin?.toLowerCase().includes(search.toLowerCase())
    );
  }, [allUsers, search]);

  const handleDelete = (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      onUpdateUsers(allUsers.filter(u => u.id !== id));
    }
  };

  const handleToggleBlock = (id: string) => {
    onUpdateUsers(allUsers.map(u => 
      u.id === id ? { ...u, isBlocked: !u.isBlocked } : u
    ));
  };

  const handleSaveUser = (userData: User) => {
    if (editingUser) {
      onUpdateUsers(allUsers.map(u => u.id === editingUser.id ? userData : u));
    } else {
      onUpdateUsers([...allUsers, userData]);
    }
    setIsModalOpen(false);
    setEditingUser(null);
  };

  return (
    <div className="p-10 space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 italic uppercase">Пользователи</h2>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">Управление ролями и доступом</p>
        </div>
        <button 
          onClick={() => {
            setEditingUser(null);
            setIsModalOpen(true);
          }}
          className="px-8 py-3 bg-[#6C5DD3] text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2 hover:bg-[#5b4eb1] transition-colors"
        >
          <UserPlus size={16} /> Добавить пользователя
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-4">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Поиск по имени, email или логину..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#6C5DD3]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[11px] font-black uppercase text-slate-400">
              <tr>
                <th className="py-6 px-10">Пользователь</th>
                <th className="py-6 px-6">Роль</th>
                <th className="py-6 px-6">Дата регистрации</th>
                <th className="py-6 px-6">Статус</th>
                <th className="py-6 px-10 text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map(user => {
                const role = adminRoles.find(r => r.id === user.roleId);
                return (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-6 px-10">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-[#6C5DD3] font-black overflow-hidden">
                          {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user.name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{user.name} {user.surname}</p>
                          <p className="text-xs text-slate-400 font-medium">{user.email}</p>
                          {user.adminLogin && (
                            <p className="text-[10px] text-[#6C5DD3] font-black uppercase mt-1">Логин: {user.adminLogin}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        user.roleId === 'super_admin' ? 'bg-rose-100 text-rose-600' :
                        user.roleId ? 'bg-indigo-100 text-[#6C5DD3]' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {role?.name || 'Клиент'}
                      </span>
                    </td>
                    <td className="py-6 px-6 text-sm font-bold text-slate-500">
                      {new Date(user.joinedDate).toLocaleDateString()}
                    </td>
                    <td className="py-6 px-6">
                      {user.isBlocked ? (
                        <span className="flex items-center gap-2 text-rose-500 text-[10px] font-black uppercase tracking-widest">
                          <div className="w-2 h-2 rounded-full bg-rose-500" /> Заблокирован
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" /> Активен
                        </span>
                      )}
                    </td>
                    <td className="py-6 px-10 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => {
                            setEditingUser(user);
                            setIsModalOpen(true);
                          }}
                          className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900" 
                          title="Редактировать"
                        >
                          <Shield size={18} />
                        </button>
                        <button 
                          onClick={() => handleToggleBlock(user.id)}
                          className={`p-2 rounded-lg transition-colors ${user.isBlocked ? 'hover:bg-emerald-50 text-emerald-400 hover:text-emerald-600' : 'hover:bg-amber-50 text-amber-400 hover:text-amber-600'}`}
                          title={user.isBlocked ? 'Разблокировать' : 'Заблокировать'}
                        >
                          {user.isBlocked ? <Unlock size={18} /> : <Lock size={18} />}
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="p-2 hover:bg-rose-50 rounded-lg text-rose-400 hover:text-rose-600" 
                          title="Удалить"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <UserModal 
          user={editingUser} 
          allUsers={allUsers}
          adminRoles={adminRoles}
          onSave={handleSaveUser}
          onClose={() => {
            setIsModalOpen(false);
            setEditingUser(null);
          }}
        />
      )}
    </div>
  );
};

interface UserModalProps {
  user: User | null;
  allUsers: User[];
  adminRoles: AdminRole[];
  onSave: (user: User) => void;
  onClose: () => void;
}

const UserModal: React.FC<UserModalProps> = ({ user, allUsers, adminRoles, onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<User>>(user || {
    role: 'customer',
    joinedDate: new Date().toISOString(),
    isBlocked: false,
    customPermissions: []
  });
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPermissions, setShowPermissions] = useState(false);

  // List of users who are NOT already admins (if adding new)
  const availableUsers = useMemo(() => {
    return allUsers.filter(u => !u.roleId || u.id === user?.id);
  }, [allUsers, user]);

  const handleRoleChange = (roleId: string) => {
    const role = adminRoles.find(r => r.id === roleId);
    setFormData({
      ...formData,
      roleId,
      customPermissions: role ? [...role.permissions] : []
    });
  };

  const togglePermission = (permId: AdminPermission) => {
    const current = formData.customPermissions || [];
    if (current.includes(permId)) {
      setFormData({ ...formData, customPermissions: current.filter(p => p !== permId) });
    } else {
      setFormData({ ...formData, customPermissions: [...current, permId] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.adminPassword && formData.adminPassword !== passwordConfirm) {
      alert('Пароли не совпадают');
      return;
    }
    onSave(formData as User);
  };

  const permissionCategories = useMemo(() => {
    const cats: Record<string, typeof ALL_PERMISSIONS> = {};
    ALL_PERMISSIONS.forEach(p => {
      if (!cats[p.category]) cats[p.category] = [];
      cats[p.category].push(p);
    });
    return cats;
  }, []);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[3000] flex items-center justify-center p-6 overflow-y-auto">
      <div className="bg-white rounded-[2.5rem] w-full max-w-4xl my-auto overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-2xl font-black text-slate-900 italic uppercase">
              {user ? 'Редактировать доступ' : 'Добавить пользователя'}
            </h3>
            <p className="text-xs text-slate-400 font-black uppercase tracking-widest mt-1">Настройка ролей и прав</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 transition-colors">
            <X size={32} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-10">
          <div className="grid grid-cols-2 gap-10">
            {/* Left Column: Basic Info */}
            <div className="space-y-8">
              {!user && (
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Выбрать из существующих</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold outline-none focus:ring-2 focus:ring-[#6C5DD3]"
                    onChange={(e) => {
                      const selected = availableUsers.find(u => u.id === e.target.value);
                      if (selected) {
                        setFormData({ ...formData, ...selected });
                      }
                    }}
                  >
                    <option value="">-- Выберите пользователя --</option>
                    {availableUsers.map(u => (
                      <option key={u.id} value={u.id}>{u.name} {u.surname} ({u.email})</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Имя</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name || ''} 
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold outline-none focus:ring-2 focus:ring-[#6C5DD3]" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Фамилия</label>
                  <input 
                    type="text" 
                    value={formData.surname || ''} 
                    onChange={e => setFormData({ ...formData, surname: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold outline-none focus:ring-2 focus:ring-[#6C5DD3]" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Email</label>
                <input 
                  type="email" 
                  required
                  value={formData.email || ''} 
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold outline-none focus:ring-2 focus:ring-[#6C5DD3]" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Роль</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold outline-none focus:ring-2 focus:ring-[#6C5DD3]"
                  value={formData.roleId || ''}
                  onChange={e => handleRoleChange(e.target.value)}
                >
                  <option value="">Без роли (Клиент)</option>
                  {adminRoles.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Статус</label>
                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setFormData({ ...formData, isBlocked: false })}
                    className={`flex-grow p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${!formData.isBlocked ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                  >
                    Активен
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormData({ ...formData, isBlocked: true })}
                    className={`flex-grow p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${formData.isBlocked ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                  >
                    Заблокирован
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Admin Access */}
            <div className="space-y-8 p-8 bg-indigo-50/50 rounded-[2rem] border border-indigo-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#6C5DD3] shadow-sm">
                  <Key size={20} />
                </div>
                <h4 className="font-black text-slate-900 italic uppercase">Доступ в админку</h4>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Логин</label>
                <input 
                  type="text" 
                  value={formData.adminLogin || ''} 
                  onChange={e => setFormData({ ...formData, adminLogin: e.target.value })}
                  placeholder="Придумайте логин"
                  className="w-full bg-white border border-slate-100 rounded-2xl p-5 text-sm font-bold outline-none focus:ring-2 focus:ring-[#6C5DD3]" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Пароль</label>
                <input 
                  type="password" 
                  value={formData.adminPassword || ''} 
                  onChange={e => setFormData({ ...formData, adminPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-white border border-slate-100 rounded-2xl p-5 text-sm font-bold outline-none focus:ring-2 focus:ring-[#6C5DD3]" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Подтверждение пароля</label>
                <input 
                  type="password" 
                  value={passwordConfirm} 
                  onChange={e => setPasswordConfirm(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-slate-100 rounded-2xl p-5 text-sm font-bold outline-none focus:ring-2 focus:ring-[#6C5DD3]" 
                />
              </div>

              <div className="pt-4">
                <button 
                  type="button"
                  onClick={() => setShowPermissions(!showPermissions)}
                  className="w-full p-5 bg-white border border-slate-100 rounded-2xl flex items-center justify-between group hover:border-[#6C5DD3] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Shield size={18} className="text-[#6C5DD3]" />
                    <span className="text-sm font-black text-slate-900 uppercase tracking-tight">Права доступа</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase">{(formData.customPermissions || []).length} выбрано</span>
                    {showPermissions ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Permissions Accordion */}
          {showPermissions && (
            <div className="space-y-10 animate-in slide-in-from-top-4 duration-300">
              {(Object.entries(permissionCategories) as [string, typeof ALL_PERMISSIONS][]).map(([category, perms]) => (
                <div key={category} className="space-y-4">
                  <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-2">{category}</h5>
                  <div className="grid grid-cols-3 gap-4">
                    {perms.map(perm => (
                      <label 
                        key={perm.id} 
                        className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                          (formData.customPermissions || []).includes(perm.id) 
                            ? 'bg-indigo-50 border-indigo-200 text-[#6C5DD3]' 
                            : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${
                          (formData.customPermissions || []).includes(perm.id)
                            ? 'bg-[#6C5DD3] border-[#6C5DD3]'
                            : 'bg-white border-slate-200'
                        }`}>
                          {(formData.customPermissions || []).includes(perm.id) && <Check size={14} className="text-white" />}
                        </div>
                        <input 
                          type="checkbox" 
                          className="hidden" 
                          checked={(formData.customPermissions || []).includes(perm.id)}
                          onChange={() => togglePermission(perm.id)}
                        />
                        <span className="text-xs font-bold">{perm.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-4 pt-10 border-t border-slate-100">
            <button 
              type="button" 
              onClick={onClose}
              className="px-10 py-5 bg-slate-100 text-slate-600 rounded-[1.8rem] font-black text-[11px] uppercase tracking-widest hover:bg-slate-200 transition-colors"
            >
              Отмена
            </button>
            <button 
              type="submit"
              className="px-14 py-5 bg-[#6C5DD3] text-white rounded-[1.8rem] font-black text-[11px] uppercase tracking-widest shadow-xl hover:bg-[#5b4eb1] transition-all transform hover:scale-105 active:scale-95"
            >
              Сохранить пользователя
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
