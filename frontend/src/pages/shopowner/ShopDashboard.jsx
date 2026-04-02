import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { ShoppingBag, Package, ClipboardList, TrendingUp, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

const ShopDashboard = () => {
  const [recentOrders, setRecentOrders] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, medsRes] = await Promise.all([
          api.get('orders/'),
          api.get('inventory/medicines/')
        ]);
        setRecentOrders(ordersRes.data.slice(0, 5));
        setMedicines(medsRes.data.slice(0, 4));
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 animate-pulse bg-slate-50 min-h-screen">Loading...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 bg-slate-50 min-h-screen">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Shop Console</h1>
          <p className="text-slate-500 font-medium tracking-wide">Manage your inventory and track procurement</p>
        </div>
        <Link to="/shop/browse" className="btn btn-primary shadow-lg shadow-primary-600/20 px-8 py-3 rounded-2xl">
          Order New Batch
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Orders and Actions */}
        <div className="md:col-span-2 space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="card p-6 border-l-4 border-l-primary-500">
              <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Total Orders</h4>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-slate-800">{recentOrders.length}</span>
                <span className="text-xs text-emerald-600 font-bold mb-1 mb-1">+2 this week</span>
              </div>
            </div>
            <div className="card p-6 border-l-4 border-l-medical-green">
              <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Pending Shipments</h4>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-slate-800">
                  {recentOrders.filter(o => o.status === 'pending').length}
                </span>
                <span className="text-xs text-slate-400 font-bold mb-1 mb-1">Awaiting Admin</span>
              </div>
            </div>
          </div>

          {/* Recent Orders List */}
          <div className="card overflow-hidden rounded-2xl">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
              <h3 className="text-lg font-bold text-slate-900">Procurement History</h3>
              <Link to="/shop/my-orders" className="text-sm font-bold text-primary-600 hover:text-primary-700">View History</Link>
            </div>
            <div className="divide-y divide-slate-100">
              {recentOrders.map(order => (
                <div key={order.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors bg-white">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-100 rounded-xl text-slate-500">
                      <ShoppingBag size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">Order #{order.id}</p>
                      <p className="text-xs text-slate-500">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-slate-900 text-sm">${order.total_amount}</p>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      order.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Featured Medicines */}
        <div className="space-y-6">
          <div className="card p-6 bg-medical-blue text-white shadow-xl shadow-medical-blue/20">
            <h3 className="text-lg font-bold mb-4">Stock Insights</h3>
            <p className="text-sm text-blue-50 opacity-90 mb-6">Restock these fast-moving items to avoid shortages during peak demand.</p>
            <div className="space-y-4">
              {medicines.map(med => (
                <div key={med.id} className="flex items-center justify-between bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                  <div>
                    <p className="text-xs font-bold">{med.name}</p>
                    <p className="text-[10px] opacity-70">{med.manufacturer}</p>
                  </div>
                  <span className="text-xs font-black">{med.stock_quantity} {med.unit}s</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="card p-6 border-dashed border-2 border-slate-200 bg-transparent flex flex-col items-center justify-center text-center">
            <div className="p-4 bg-slate-100 rounded-full text-slate-400 mb-4">
              <Filter size={32} />
            </div>
            <h3 className="font-bold text-slate-800">Advanced Procurement</h3>
            <p className="text-xs text-slate-400 mt-1 mb-6">Filter by category or manufacturer to find exact medicinal precursors.</p>
            <Link to="/shop/browse" className="w-full btn bg-slate-800 text-white hover:bg-slate-900 py-3 rounded-xl">
              Start Search
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDashboard;
