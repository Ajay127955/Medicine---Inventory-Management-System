import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { UserPlus, Mail, Shield, Smartphone, MapPin, Trash2, Edit2, Search, X, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'shop_owner',
    phone_number: '',
    address: ''
  });

  const fetchUsers = async () => {
    try {
      const res = await api.get('accounts/users/');
      setUsers(res.data);
    } catch (err) {
      toast.error('Failed to retrieve user registry');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Edit logic (excluding password for simplicity)
        const { password, ...updateData } = formData;
        await api.put(`accounts/users/${editingId}/`, updateData);
        toast.success('User profile updated');
      } else {
        await api.post('accounts/users/', formData);
        toast.success('New user provisioned successfully');
      }
      setShowModal(false);
      resetForm();
      fetchUsers();
    } catch (err) {
      const errorMsg = err.response?.data?.username ? "Username already exists" : 
                       err.response?.data?.email ? "Email already exists" : 
                       "Identity management operation failed";
      toast.error(errorMsg);
    }
  };

  const handleEdit = (user) => {
    setFormData({
      username: user.username,
      email: user.email,
      password: '', // Password not prefilled
      role: user.role,
      phone_number: user.phone_number || '',
      address: user.address || ''
    });
    setEditingId(user.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('IRREVERSIBLE: Delete this user account?')) {
      try {
        await api.delete(`accounts/users/${id}/`);
        toast.success('Identity removed from system');
        fetchUsers();
      } catch (err) {
        toast.error('Deletion restricted');
      }
    }
  };

  const resetForm = () => {
    setFormData({ username: '', email: '', password: '', role: 'shop_owner', phone_number: '', address: '' });
    setEditingId(null);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Identity Suite</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Access Control & Provisioning</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="btn btn-primary shadow-2xl shadow-primary-600/30 gap-3 px-10 py-4 rounded-[2rem] font-black"
        >
          <UserPlus size={20} />
          Provision Access
        </button>
      </header>

      {/* Identity Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-3xl"></div>)
        ) : (
          users.map(user => (
            <div key={user.id} className="card p-8 bg-white relative group border-none shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className={`absolute top-0 right-12 w-16 h-1 bg-gradient-to-r ${user.role === 'admin' ? 'from-indigo-600 to-indigo-400' : user.role === 'supplier' ? 'from-orange-500 to-amber-400' : 'from-emerald-500 to-teal-400'} rounded-b-full`}></div>
              
              <div className="flex items-start justify-between mb-8">
                <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-primary-50 transition-colors">
                  <Shield size={32} className={user.role === 'admin' ? 'text-indigo-600' : user.role === 'supplier' ? 'text-orange-600' : 'text-emerald-600'} />
                </div>
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border ${user.role === 'admin' ? 'text-indigo-600 bg-indigo-50 border-indigo-100' : user.role === 'supplier' ? 'text-orange-600 bg-orange-50 border-orange-100' : 'text-emerald-600 bg-emerald-50 border-emerald-100'}`}>
                  {user.role}
                </span>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-black text-slate-900 truncate">{user.username}</h3>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 text-slate-400 font-bold text-xs">
                    <Mail size={14} className="text-slate-300" />
                    {user.email || 'No email attached'}
                  </div>
                  <div className="flex items-center gap-3 text-slate-400 font-bold text-xs">
                    <Smartphone size={14} className="text-slate-300" />
                    {user.phone_number || 'N/A'}
                  </div>
                  <div className="flex items-center gap-3 text-slate-400 font-bold text-xs">
                    <MapPin size={14} className="text-slate-300" />
                    <span className="truncate">{user.address || 'Global Access'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-50 flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(user)} className="p-3 bg-primary-50 text-primary-600 rounded-xl hover:bg-primary-100 transition-colors"><Edit2 size={18} /></button>
                {user.role !== 'admin' && (
                  <button onClick={() => handleDelete(user.id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"><Trash2 size={18} /></button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Identity Provisioning Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
              <div>
                <h2 className="text-2xl font-black text-slate-900">{editingId ? 'Modify Credentials' : 'Provision New Account'}</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Identity Management Protocol</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-3 text-slate-300 hover:text-slate-600 rounded-2xl hover:bg-slate-50 transition-all"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <label className="block">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</span>
                  <input required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} type="text" className="w-full mt-2 px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-primary-500/10 font-bold placeholder:text-slate-300" placeholder="j.doe" />
                </label>
                <label className="block">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">System Role</span>
                  <select required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full mt-2 px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-primary-500/10 font-bold">
                    <option value="shop_owner">Shop Owner</option>
                  </select>
                </label>
              </div>

              {!editingId && (
                <label className="block">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Password</span>
                  <input required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} type="password" className="w-full mt-2 px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-primary-500/10 font-bold" />
                </label>
              )}

              <div className="grid grid-cols-2 gap-6">
                <label className="block">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Official Email</span>
                  <input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} type="email" className="w-full mt-2 px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-primary-500/10 font-bold placeholder:text-slate-300" placeholder="contact@shop.com" />
                </label>
                <label className="block">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Line</span>
                  <input value={formData.phone_number} onChange={e => setFormData({...formData, phone_number: e.target.value})} type="text" className="w-full mt-2 px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-primary-500/10 font-bold placeholder:text-slate-300" placeholder="+1..." />
                </label>
              </div>

              <button type="submit" className="w-full btn btn-primary py-5 rounded-[2rem] font-black text-lg shadow-2xl shadow-primary-600/30 group">
                <CheckCircle size={24} className="mr-3 transition-transform group-hover:scale-110" />
                {editingId ? 'Authorize Profile Changes' : 'Execute User Provisioning'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
