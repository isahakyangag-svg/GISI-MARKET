
import React, { useState, useMemo } from 'react';
import { User } from '../../types';
import { 
  Search, User as UserIcon, Mail, Phone, Calendar, 
  MapPin, Shield, ShieldAlert, MoreVertical, Trash2, 
  Lock, Unlock, Eye, X, Info, Globe, Hash
} from 'lucide-react';

interface ClientsManagementProps {
  allUsers: User[];
  onUpdateUsers: (users: User[]) => void;
}

export const ClientsManagement: React.FC<ClientsManagementProps> = ({ allUsers, onUpdateUsers }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<User | null>(null);

  const clients = useMemo(() => {
    return allUsers.filter(u => u.role === 'customer');
  }, [allUsers]);

  const filteredClients = useMemo(() => {
    return clients.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.surname || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.phone || '').includes(searchQuery)
    );
  }, [clients, searchQuery]);

  const toggleBlock = (id: string) => {
    onUpdateUsers(allUsers.map(u => u.id === id ? { ...u, isBlocked: !u.isBlocked } : u));
  };

  const deleteClient = (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этого клиента?')) {
      onUpdateUsers(allUsers.filter(u => u.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-slate-900 italic uppercase tracking-tight">Клиенты</h2>
          <p className="text-slate-400 font-bold text-sm mt-2 uppercase tracking-widest">Управление зарегистрированными покупателями</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#6C5DD3] transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Поиск по имени, email..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-14 pr-6 py-4 bg-white border-2 border-slate-100 rounded-[1.5rem] w-[350px] text-sm font-bold outline-none focus:border-[#6C5DD3] transition-all shadow-sm"
            />
          </div>
          
          <div className="bg-white px-6 py-4 rounded-[1.5rem] border-2 border-slate-100 shadow-sm flex items-center gap-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Всего</span>
            <span className="text-xl font-black text-slate-900 italic">{clients.length}</span>
          </div>
        </div>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map(client => (
          <div 
            key={client.id}
            onDoubleClick={() => setSelectedClient(client)}
            className="bg-white rounded-[2.5rem] p-8 border-2 border-slate-100 shadow-sm hover:shadow-xl hover:border-[#6C5DD3]/20 transition-all group cursor-pointer relative overflow-hidden"
          >
            {client.isBlocked && (
              <div className="absolute top-0 right-0 bg-rose-500 text-white px-6 py-2 rounded-bl-[1.5rem] text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <ShieldAlert size={14} />
                Заблокирован
              </div>
            )}

            <div className="flex items-start gap-5">
              <div className="w-20 h-20 rounded-[2rem] bg-slate-50 border-2 border-slate-100 overflow-hidden flex-shrink-0">
                <img src={client.avatar} alt={client.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-grow min-w-0">
                <h3 className="text-xl font-black text-slate-900 italic truncate uppercase tracking-tight">
                  {client.name} {client.surname}
                </h3>
                <p className="text-slate-400 font-bold text-xs truncate mt-1">{client.email}</p>
                
                <div className="flex items-center gap-3 mt-4">
                  <span className="px-3 py-1 bg-slate-50 text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-widest">
                    {new Date(client.joinedDate).toLocaleDateString()}
                  </span>
                  {client.ip && (
                    <span className="px-3 py-1 bg-indigo-50 text-[#6C5DD3] rounded-lg text-[10px] font-black uppercase tracking-widest">
                      {client.ip}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
              <button 
                onClick={(e) => { e.stopPropagation(); setSelectedClient(client); }}
                className="flex items-center gap-2 text-[10px] font-black text-[#6C5DD3] uppercase tracking-widest hover:opacity-70 transition-all"
              >
                <Eye size={16} />
                Подробнее
              </button>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleBlock(client.id); }}
                  className={`p-3 rounded-xl transition-all ${client.isBlocked ? 'bg-emerald-50 text-emerald-500 hover:bg-emerald-500 hover:text-white' : 'bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white'}`}
                  title={client.isBlocked ? 'Разблокировать' : 'Заблокировать'}
                >
                  {client.isBlocked ? <Unlock size={18} /> : <Lock size={18} />}
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteClient(client.id); }}
                  className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredClients.length === 0 && (
        <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-200">
          <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8">
            <UserIcon className="w-12 h-12 text-slate-300" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 italic uppercase">Клиенты не найдены</h3>
          <p className="text-slate-400 font-bold text-sm mt-2 uppercase tracking-widest">Попробуйте изменить параметры поиска</p>
        </div>
      )}

      {/* Detail Modal */}
      {selectedClient && (
        <ClientDetailModal 
          client={selectedClient} 
          onClose={() => setSelectedClient(null)} 
        />
      )}
    </div>
  );
};

const ClientDetailModal: React.FC<{ client: User; onClose: () => void }> = ({ client, onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[4000] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-10 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-[2rem] bg-white border-2 border-slate-200 overflow-hidden shadow-sm">
              <img src={client.avatar} alt={client.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="text-3xl font-black text-slate-900 italic uppercase tracking-tight">
                {client.name} {client.surname}
              </h3>
              <div className="flex items-center gap-3 mt-1">
                <span className="px-3 py-1 bg-[#6C5DD3] text-white rounded-lg text-[10px] font-black uppercase tracking-widest">Клиент</span>
                <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">ID: {client.id}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-4 bg-white rounded-2xl text-slate-400 hover:text-slate-900 shadow-sm border border-slate-100 transition-all">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-10 grid grid-cols-2 gap-8">
          <div className="space-y-6">
            <DetailItem icon={<Mail size={18} />} label="Email / Логин" value={client.email} />
            <DetailItem icon={<Lock size={18} />} label="Пароль" value={client.password || '••••••••'} />
            <DetailItem icon={<Phone size={18} />} label="Телефон" value={client.phone || 'Не указан'} />
            <DetailItem icon={<Calendar size={18} />} label="Дата регистрации" value={new Date(client.joinedDate).toLocaleString()} />
          </div>
          
          <div className="space-y-6">
            <DetailItem icon={<Globe size={18} />} label="IP Адрес" value={client.ip || 'Неизвестен'} />
            <DetailItem icon={<Hash size={18} />} label="Возраст" value={client.age?.toString() || 'Не указан'} />
            <DetailItem icon={<MapPin size={18} />} label="Адрес" value={client.address || 'Не указан'} />
            <DetailItem icon={<Shield size={18} />} label="Статус" value={client.isBlocked ? 'Заблокирован' : 'Активен'} color={client.isBlocked ? 'text-rose-500' : 'text-emerald-500'} />
          </div>
        </div>

        {/* Footer */}
        <div className="p-10 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-10 py-4 bg-slate-900 text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ icon, label, value, color = 'text-slate-900' }: { icon: React.ReactNode; label: string; value: string; color?: string }) => (
  <div className="flex items-start gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
    <div className="text-[#6C5DD3] mt-1">{icon}</div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-sm font-bold ${color} break-all`}>{value}</p>
    </div>
  </div>
);
