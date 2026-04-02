import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Package, Search, Filter, AlertCircle, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const MyInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInventory = async () => {
    try {
      const res = await api.get('inventory/shop-inventory/');
      setInventory(res.data);
    } catch (err) {
      toast.error('Failed to load your personal stock');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInventory(); }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">My Pharmacy Stock</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Your Private Medication Registry</p>
        </div>
        <Link to="/shop/browse" className="btn btn-primary px-8 py-3 rounded-2xl gap-2 font-black shadow-xl shadow-primary-600/20">
          <ShoppingCart size={20} /> Order More Supplies
        </Link>
      </header>

      {/* Local Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          [1, 2, 3, 4].map(i => <div key={i} className="h-48 bg-slate-100 animate-pulse rounded-3xl"></div>)
        ) : inventory.length === 0 ? (
          <div className="col-span-full py-32 text-center card bg-white rounded-3xl border-dashed border-2 border-slate-200">
            <Package size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-xl font-bold text-slate-400 uppercase tracking-widest">Your Inventory is Empty</p>
            <p className="text-sm text-slate-400 mt-2">Place an order with the Admin to stock your shop.</p>
          </div>
        ) : (
          inventory.map(item => (
            <div key={item.id} className="card p-8 bg-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Package size={80} />
              </div>
              
              <p className="text-[10px] font-black uppercase text-primary-600 tracking-widest mb-2">{item.medicine_details?.category_name}</p>
              <h3 className="text-xl font-black text-slate-900 mb-1">{item.medicine_details?.name}</h3>
              <p className="text-xs text-slate-400 font-bold mb-6">{item.medicine_details?.manufacturer}</p>
              
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">In Stock</p>
                  <p className="text-3xl font-black text-slate-900">{item.quantity} <span className="text-xs font-bold text-slate-400 uppercase">{item.medicine_details?.unit}s</span></p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Last Restocked</p>
                  <p className="text-xs font-bold text-slate-500">{new Date(item.last_restocked).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyInventory;
