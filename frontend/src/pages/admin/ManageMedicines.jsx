import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Plus, Edit2, Trash2, Package, Search, Filter, AlertCircle, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageMedicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    manufacturer: '',
    description: '',
    price_per_unit: '',
    stock_quantity: '',
    expiry_date: '',
    unit: 'tablet',
    low_stock_threshold: 10,
    supplier: ''
  });

  const fetchData = async () => {
    try {
      const [medsRes, catsRes] = await Promise.all([
        api.get('inventory/medicines/'),
        api.get('inventory/categories/')
      ]);
      setMedicines(medsRes.data);
      setCategories(catsRes.data);
    } catch (err) {
      toast.error('Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`inventory/medicines/${editingId}/`, formData);
        toast.success('Medicine updated successfully');
      } else {
        await api.post('inventory/medicines/', formData);
        toast.success('Medicine added successfully');
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  const handleEdit = (med) => {
    setFormData({
      name: med.name,
      category: med.category,
      manufacturer: med.manufacturer,
      description: med.description || '',
      price_per_unit: med.price_per_unit,
      stock_quantity: med.stock_quantity,
      expiry_date: med.expiry_date,
      unit: med.unit,
      low_stock_threshold: med.low_stock_threshold
    });
    setEditingId(med.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      try {
        await api.delete(`inventory/medicines/${id}/`);
        toast.success('Deleted successfully');
        fetchData();
      } catch (err) {
        toast.error('Delete failed');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', category: '', manufacturer: '', description: '',
      price_per_unit: '', stock_quantity: '', expiry_date: '',
      unit: 'tablet', low_stock_threshold: 10
    });
    setEditingId(null);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Medicine Vault</h1>
          <p className="text-slate-500 font-medium">Full Lifecycle Inventory Management</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="btn btn-primary shadow-xl shadow-primary-600/20 gap-2 px-8 py-3 rounded-2xl"
        >
          <Plus size={20} />
          New Entry
        </button>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 bg-white flex items-center gap-4">
          <div className="p-4 bg-primary-50 text-primary-600 rounded-2xl"><Package size={24} /></div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Stock</p>
            <p className="text-2xl font-black text-slate-900">{medicines.length} Products</p>
          </div>
        </div>
        <div className="card p-6 bg-white flex items-center gap-4">
          <div className="p-4 bg-red-50 text-red-600 rounded-2xl"><AlertCircle size={24} /></div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Low Stock Alerts</p>
            <p className="text-2xl font-black text-red-600">{medicines.filter(m => m.is_low_stock).length} Flagged</p>
          </div>
        </div>
        <div className="card p-6 bg-slate-900 text-white flex items-center gap-4">
          <div className="p-4 bg-white/10 rounded-2xl text-primary-400"><Filter size={24} /></div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Categories</p>
            <p className="text-2xl font-black">{categories.length} Active</p>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="card bg-white rounded-3xl overflow-hidden border-none shadow-xl shadow-slate-200/50">
        <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search product registry..." className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl w-full text-sm focus:ring-2 focus:ring-primary-500" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="px-8 py-5">Product Details</th>
                <th className="px-8 py-5">Category</th>
                <th className="px-8 py-5 text-center">Status</th>
                <th className="px-8 py-5 text-right">Unit Price</th>
                <th className="px-8 py-5 text-right">Stock</th>
                <th className="px-8 py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {medicines.map(med => (
                <tr key={med.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <p className="font-bold text-slate-900">{med.name}</p>
                    <p className="text-xs text-slate-400 font-medium">{med.manufacturer}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                      {med.category_name}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    {med.is_low_stock ? (
                      <span className="text-[10px] font-black uppercase text-red-600 bg-red-50 px-2 py-1 rounded-full border border-red-100">Low Stock</span>
                    ) : (
                      <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">Healthy</span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right font-black text-slate-900">${med.price_per_unit}</td>
                  <td className="px-8 py-6 text-right">
                    <p className="text-sm font-bold text-slate-700">{med.stock_quantity}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">{med.unit}s</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleEdit(med)} className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(med.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-900">{editingId ? 'Modify Record' : 'New Medicine Entry'}</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="block">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Product Name</span>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} type="text" className="w-full mt-2 px-4 py-3 bg-slate-100/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all font-medium" placeholder="Amoxicillin 500mg" />
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Category</span>
                  <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full mt-2 px-4 py-3 bg-slate-100/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 font-medium">
                    <option value="">Select Category</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Price ($)</span>
                    <input required step="0.01" value={formData.price_per_unit} onChange={e => setFormData({...formData, price_per_unit: e.target.value})} type="number" className="w-full mt-2 px-4 py-3 bg-slate-100/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 font-medium" />
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Stock</span>
                    <input required value={formData.stock_quantity} onChange={e => setFormData({...formData, stock_quantity: e.target.value})} type="number" className="w-full mt-2 px-4 py-3 bg-slate-100/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 font-medium" />
                  </label>
                </div>
              </div>
              <div className="space-y-4">
                <label className="block">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Manufacturer</span>
                  <input required value={formData.manufacturer} onChange={e => setFormData({...formData, manufacturer: e.target.value})} type="text" className="w-full mt-2 px-4 py-3 bg-slate-100/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 font-medium" placeholder="Pfizer / GSK" />
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Expiry Date</span>
                  <input required value={formData.expiry_date} onChange={e => setFormData({...formData, expiry_date: e.target.value})} type="date" className="w-full mt-2 px-4 py-3 bg-slate-100/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 font-medium" />
                </label>
              </div>
              <div className="md:col-span-2 pt-6 flex gap-4">
                <button type="submit" className="flex-1 btn btn-primary py-4 rounded-2xl font-black shadow-lg shadow-primary-600/20">
                  {editingId ? 'Update Medical Registry' : 'Commit Entry to Vault'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="px-8 btn bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-2xl font-bold">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMedicines;
