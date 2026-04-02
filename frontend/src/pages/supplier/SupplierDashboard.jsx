import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Truck, Package, AlertTriangle, CheckCircle, BarChart3, Pill } from 'lucide-react';

const SupplierDashboard = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await api.get('inventory/medicines/');
        setMedicines(res.data);
      } catch (err) {
        console.error('Failed to fetch assigned medicines', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMedicines();
  }, []);

  if (loading) return <div className="p-8 bg-slate-50 min-h-screen">Loading dynamic inventory...</div>;

  const lowStock = medicines.filter(m => m.is_low_stock);
  const healthItems = medicines.filter(m => !m.is_low_stock);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 bg-slate-50 min-h-screen">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-orange-600 rounded-2xl text-white shadow-xl shadow-orange-600/20">
            <Truck size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Supply Hub</h1>
            <p className="text-slate-500 font-medium font-medium">Logistics & Assigned Inventory Management</p>
          </div>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200">
          <button className="px-6 py-2 text-sm font-bold bg-slate-900 text-white rounded-xl">Inventory</button>
          <button className="px-6 py-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">Shipments</button>
        </div>
      </header>

      {/* Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 bg-white overflow-hidden relative group">
          <div className="absolute right-[-20px] top-[-20px] text-slate-50 group-hover:text-slate-100 transition-colors">
            <Package size={120} strokeWidth={1} />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest relative">Assigned Units</p>
          <h3 className="text-4xl font-black text-slate-900 mt-2 relative">{medicines.length}</h3>
          <p className="text-xs text-slate-500 mt-4 relative flex items-center gap-2">
            <CheckCircle className="text-emerald-500" size={14} /> Tracking in real-time
          </p>
        </div>

        <div className="card p-6 bg-white overflow-hidden relative group">
          <div className="absolute right-[-20px] top-[-20px] text-orange-50 group-hover:text-orange-100 transition-colors">
            <AlertTriangle size={120} strokeWidth={1} />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest relative">Restock Alerts</p>
          <h3 className="text-4xl font-black text-orange-600 mt-2 relative">{lowStock.length}</h3>
          <p className="text-xs text-slate-500 mt-4 relative flex items-center gap-2">
            <AlertTriangle className="text-orange-500" size={14} /> Immediate attention required
          </p>
        </div>

        <div className="card p-6 bg-slate-900 overflow-hidden relative group h-full">
          <div className="absolute right-[-10px] bottom-[-10px] text-white/5">
            <BarChart3 size={150} strokeWidth={1} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Supply Integrity</h3>
          <p className="text-sm text-slate-400 mb-6 font-medium">98.4% fulfillment rate in current quarter.</p>
          <div className="flex gap-1 h-3 bg-white/10 rounded-full overflow-hidden">
            <div className="bg-orange-500 w-[60%]" />
            <div className="bg-emerald-500 w-[30%]" />
            <div className="bg-blue-500 w-[10%]" />
          </div>
          <div className="mt-4 flex justify-between text-[10px] font-bold uppercase text-slate-300">
            <span>Critical</span>
            <span>Stable</span>
            <span>Overstocked</span>
          </div>
        </div>
      </div>

      {/* Main Inventory List */}
      <div className="card bg-white rounded-3xl shadow-xl overflow-hidden border-none">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
            <Pill className="text-orange-600" size={24} />
            Inventory Tracking Registry
          </h3>
          <button className="text-sm font-bold text-orange-600 hover:text-orange-700 bg-orange-50 px-4 py-2 rounded-xl transition-all">
            Download Report
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100">
                <th className="px-8 py-5">Medicine ID</th>
                <th className="px-8 py-5">Product Details</th>
                <th className="px-8 py-5">Category</th>
                <th className="px-8 py-5 text-center">Status</th>
                <th className="px-8 py-5 text-right">Quantity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {medicines.map(med => (
                <tr key={med.id} className="group hover:bg-slate-50/80 transition-all">
                  <td className="px-8 py-6 text-sm font-black text-slate-400 group-hover:text-slate-900">#{med.id.toString().padStart(4, '0')}</td>
                  <td className="px-8 py-6">
                    <p className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors">{med.name}</p>
                    <p className="text-xs text-slate-400 font-medium">{med.manufacturer}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                      {med.category_name}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center">
                      {med.is_low_stock ? (
                        <div className="flex items-center gap-2 text-orange-600 bg-orange-50 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider animate-pulse">
                          <AlertTriangle size={12} /> CRITICAL
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                          <CheckCircle size={12} /> STABLE
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <p className="text-base font-black text-slate-900">{med.stock_quantity.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{med.unit}s</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SupplierDashboard;
