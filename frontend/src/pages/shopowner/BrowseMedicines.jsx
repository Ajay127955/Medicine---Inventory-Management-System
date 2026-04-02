import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Search, Filter, ShoppingCart, Info, Plus, Minus, X } from 'lucide-react';
import toast from 'react-hot-toast';

const BrowseMedicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [medsRes, catsRes] = await Promise.all([
          api.get(`inventory/medicines/?search=${search}&category=${category}`),
          api.get('inventory/categories/')
        ]);
        setMedicines(medsRes.data);
        setCategories(catsRes.data);
      } catch (err) {
        toast.error('Failed to load medicines');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [search, category]);

  const addToCart = (medicine) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === medicine.id);
      if (existing) {
        return prev.map(item => item.id === medicine.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...medicine, quantity: 1 }];
    });
    toast.success(`${medicine.name} added to cart`);
  };

  const updateCartQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price_per_unit * item.quantity), 0);

  const placeOrder = async () => {
    try {
      const items = cart.map(item => ({
        medicine: item.id,
        quantity: item.quantity
      }));
      await api.post('orders/', { items });
      toast.success('Order placed successfully!');
      setCart([]);
    } catch (err) {
      toast.error('Failed to place order');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Medicine Catalog</h1>
          <p className="text-slate-500 font-medium">Browse and procure inventory for your shop</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search medicines..."
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 w-full sm:w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Products Grid */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading ? (
            [1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-2xl"></div>)
          ) : (
            medicines.map(med => (
              <div key={med.id} className="card p-6 flex flex-col justify-between group">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-primary-50 text-primary-700 text-[10px] font-bold uppercase rounded-full">
                      {med.category_name}
                    </span>
                    <span className={`text-[10px] font-bold ${med.stock_quantity > 20 ? 'text-emerald-500' : 'text-orange-500'}`}>
                      {med.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{med.name}</h3>
                  <p className="text-xs text-slate-400 font-medium mb-4">{med.manufacturer}</p>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-2xl font-black text-slate-900">${med.price_per_unit}</span>
                    <span className="text-xs text-slate-400 font-bold uppercase">/ {med.unit}</span>
                  </div>
                </div>
                <button 
                  onClick={() => addToCart(med)}
                  disabled={med.stock_quantity === 0}
                  className="w-full btn btn-primary py-3 rounded-xl gap-2 font-bold shadow-lg shadow-primary-600/10 hover:shadow-primary-600/20 disabled:bg-slate-200"
                >
                  <Plus size={18} />
                  Add to Cart
                </button>
              </div>
            ))
          )}
        </div>

        {/* Shopping Cart Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24 bg-white shadow-xl border-t-4 border-t-primary-600">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <ShoppingCart className="text-primary-600" size={20} />
              Procurement Cart
            </h3>
            
            <div className="space-y-4 mb-8 max-h-[400px] overflow-y-auto pr-2">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <ShoppingCart size={48} className="mx-auto mb-4 opacity-10" />
                  <p className="text-sm font-medium">Your cart is empty</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-3 pb-4 border-b border-slate-50 last:border-0 relative group">
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-800">{item.name}</p>
                      <p className="text-xs text-slate-400">${item.price_per_unit} x {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-1">
                      <button onClick={() => updateCartQuantity(item.id, -1)} className="p-1 hover:text-primary-600"><Minus size={14} /></button>
                      <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateCartQuantity(item.id, 1)} className="p-1 hover:text-primary-600"><Plus size={14} /></button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="absolute -right-2 -top-2 p-1 bg-white border border-slate-100 rounded-full text-slate-300 hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-bold text-sm uppercase">Total</span>
                  <span className="text-2xl font-black text-slate-900">${totalAmount.toFixed(2)}</span>
                </div>
                <button 
                  onClick={placeOrder}
                  className="w-full btn btn-primary py-4 rounded-2xl font-black shadow-xl shadow-primary-600/20"
                >
                  Place Order
                </button>
                <p className="text-[10px] text-center text-slate-400 font-medium leading-relaxed px-4">
                  Tax and shipping calculated according to healthcare procurement protocols.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseMedicines;
