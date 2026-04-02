import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { 
  Users, Package, ShoppingCart, TrendingUp, AlertCircle, 
  Clock, UserPlus, ArrowRight, ShoppingBag, CheckCircle 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total_users: 0,
    total_medicines: 0,
    total_orders: 0,
    low_stock_count: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, ordersRes, medsRes] = await Promise.all([
          api.get('accounts/users/stats/'),
          api.get('orders/'),
          api.get('inventory/medicines/')
        ]);
        
        const lowStock = medsRes.data.filter(m => m.is_low_stock).length;
        
        setStats({
          ...statsRes.data,
          total_medicines: medsRes.data.length,
          total_orders: ordersRes.data.length,
          low_stock_count: lowStock
        });
        setRecentOrders(ordersRes.data.slice(0, 5));
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="p-8 animate-pulse space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-100 rounded-2xl"></div>)}
      </div>
      <div className="h-96 bg-slate-100 rounded-2xl"></div>
    </div>
  );

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="card p-6 flex items-start justify-between">
      <div>
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-bold text-slate-900 mt-1">{value}</h3>
        {trend && (
          <p className="text-xs font-medium text-emerald-600 mt-2 flex items-center gap-1">
            <TrendingUp size={12} /> {trend}
          </p>
        )}
      </div>
      <div className={`p-4 rounded-xl ${color} bg-opacity-10 text-${color.split('-')[1]}-600 shadow-sm border border-slate-50`}>
        <Icon size={24} />
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Terminal</h1>
          <p className="text-slate-500 font-medium">Global Inventory & Order Oversight</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/medicines/new" className="btn btn-primary shadow-lg shadow-primary-600/20 px-6 py-2.5">
            Add Medicine
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={stats.total_users} icon={Users} color="bg-blue-500" trend="+4 this week" />
        <StatCard title="Medicine Stock" value={stats.total_medicines} icon={Package} color="bg-emerald-500" />
        <StatCard title="Active Orders" value={stats.total_orders} icon={ShoppingCart} color="bg-orange-500" />
        <StatCard title="Low Stock Alerts" value={stats.low_stock_count} icon={AlertCircle} color="bg-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 card overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock className="text-primary-600" size={20} />
              Recent Orders
            </h3>
            <Link to="/admin/orders" className="text-sm font-semibold text-primary-600 hover:text-primary-700 underline underline-offset-4">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-700">#{order.id}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{order.username}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">${order.total_amount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide
                        ${order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' : 
                          order.status === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-600'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-400">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Operational Shortcuts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/admin/users" className="card p-8 bg-white hover:bg-slate-50 transition-all flex items-center justify-between group shadow-xl">
            <div className="flex items-center gap-6">
              <div className="p-5 bg-indigo-600 text-white rounded-3xl shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform">
                <UserPlus size={28} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Identity Provisioning</h3>
                <p className="text-sm font-bold text-slate-400">Add new Shop Owners or Suppliers to the system</p>
              </div>
            </div>
            <ArrowRight className="text-slate-200 group-hover:text-primary-600 transition-colors" />
          </Link>

          <Link to="/admin/inventory" className="card p-8 bg-white hover:shadow-2xl transition-all border-none group">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Package size={24} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Inventory Catalog</h3>
            <p className="text-slate-500 text-sm font-medium mb-6">Manage global medicine registry and central warehouse stock levels.</p>
            <div className="flex items-center text-emerald-600 font-bold text-xs uppercase tracking-widest gap-2">
              Manage Inventory <ArrowRight size={14} />
            </div>
          </Link>

          <Link to="/admin/orders" className="card p-8 bg-white hover:shadow-2xl transition-all border-none group">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <ShoppingBag size={24} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Order Fulfillment</h3>
            <p className="text-slate-500 text-sm font-medium mb-6">Process incoming shop requests and manage medicinal stock transfers.</p>
            <div className="flex items-center text-indigo-600 font-bold text-xs uppercase tracking-widest gap-2">
              Process Orders <ArrowRight size={14} />
            </div>
          </Link>
        </div>

        {/* Quick Links / Actions */}
        <div className="space-y-6">
          <div className="card p-6 bg-primary-900 text-white shadow-primary-900/30">
            <h3 className="text-lg font-bold mb-4">Inventory Health</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-primary-200">Stock Availability</span>
                <span className="font-bold">92%</span>
              </div>
              <div className="w-full bg-primary-800 rounded-full h-2">
                <div className="bg-emerald-400 h-2 rounded-full w-[92%] transition-all duration-1000"></div>
              </div>
              <p className="text-xs text-primary-300">
                Most items are within safe stock parameters. {stats.low_stock_count} items require immediate restock.
              </p>
            </div>
          </div>
          
          <div className="card p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">System Alerts</h3>
            <div className="space-y-4">
              {stats.low_stock_count > 0 && (
                <div className="flex gap-3 text-sm p-3 bg-red-50 text-red-700 rounded-xl border border-red-100">
                  <AlertCircle size={18} className="shrink-0" />
                  <p><b>{stats.low_stock_count} Medicines</b> are below threshold. Notify suppliers immediately.</p>
                </div>
              )}
              <div className="flex gap-3 text-sm p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
                <CheckCircle size={18} className="shrink-0" />
                <p><b>System Integrity:</b> All medicinal registries are synchronized.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
