import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { ShoppingBag, CheckCircle, XCircle, Clock, Search, Filter, ArrowRight, Package } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchOrders = async () => {
    try {
      const res = await api.get('orders/');
      setOrders(res.data);
    } catch (err) {
      toast.error('Failed to retrieve order bank');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleAction = async (id, status) => {
    try {
      await api.patch(`orders/${id}/`, { status });
      toast.success(`Order successfully ${status}`);
      fetchOrders();
    } catch (err) {
      toast.error('Action failed. Check inventory levels.');
    }
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Order Fulfillment</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Supply Chain Control Center</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-100">
          {['all', 'pending', 'approved', 'delivered'].map((s) => (
            <button 
              key={s}
              onClick={() => setFilter(s)}
              className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === s ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </header>

      {/* Action Table */}
      <div className="card bg-white rounded-3xl overflow-hidden border-none shadow-2xl shadow-slate-200/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="px-8 py-6">Order Identity</th>
                <th className="px-8 py-6">Fulfillment Request</th>
                <th className="px-8 py-6 text-right">Value</th>
                <th className="px-8 py-6 text-center">Status</th>
                <th className="px-8 py-6 text-center bg-slate-100/50">Approval Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center text-slate-300 font-bold uppercase tracking-widest">No matching orders found</td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="group hover:bg-slate-50/30 transition-colors">
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                          <ShoppingBag size={20} />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 tracking-tight text-lg">#{order.id}</p>
                          <p className="text-xs text-slate-400 font-bold">{order.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <div className="space-y-1">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-600">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary-400"></div>
                            <span>{item.medicine_name} <span className="text-slate-400 font-medium">x {item.quantity}</span></span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-8 py-8 text-right font-black text-slate-900 text-lg">${order.total_amount}</td>
                    <td className="px-8 py-8 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border
                        ${order.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                          order.status === 'approved' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                          order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                          'bg-red-50 text-red-600 border-red-100'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-8 bg-slate-50/30">
                      <div className="flex justify-center gap-3">
                        {order.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleAction(order.id, 'approved')}
                              className="p-3 bg-white text-emerald-600 border border-emerald-100 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm hover:shadow-emerald-200"
                              title="Approve Order"
                            >
                              <CheckCircle size={20} />
                            </button>
                            <button 
                              onClick={() => handleAction(order.id, 'rejected')}
                              className="p-3 bg-white text-red-600 border border-red-100 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm hover:shadow-red-200"
                              title="Remove Order"
                            >
                              <XCircle size={20} />
                            </button>
                          </>
                        )}
                        {order.status === 'approved' && (
                          <button 
                            onClick={() => handleAction(order.id, 'delivered')}
                            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
                          >
                            <Package size={16} /> Mark Delivered
                          </button>
                        )}
                        {order.status === 'delivered' && (
                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Stock Transferred</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageOrders;
