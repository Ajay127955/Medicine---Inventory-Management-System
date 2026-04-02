import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { Bell, LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { unreadCount, notifications, markAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <div className="w-4 h-1 bg-white rounded-full"></div>
                <div className="w-1 h-4 bg-white rounded-full absolute"></div>
              </div>
              <span className="text-xl font-bold text-slate-900 hidden sm:block tracking-tight">MedInv.</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-all relative"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="text-sm font-semibold text-slate-800">Notifications</h3>
                    <span className="text-xs text-slate-500">{unreadCount} Unread</span>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 text-sm">
                        No notifications yet
                      </div>
                    ) : (
                      notifications.slice(0, 5).map((n) => (
                        <div 
                          key={n.id} 
                          className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer ${!n.is_read ? 'bg-primary-50' : ''}`}
                          onClick={() => {
                            if (!n.is_read) markAsRead(n.id);
                          }}
                        >
                          <p className="text-xs font-bold text-primary-700 uppercase mb-1">{n.notification_type.replace('_', ' ')}</p>
                          <p className="text-sm font-semibold text-slate-800">{n.title}</p>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{n.message}</p>
                          <p className="text-[10px] text-slate-400 mt-2">{new Date(n.created_at).toLocaleString()}</p>
                        </div>
                      ))
                    )}
                  </div>
                  <Link 
                    to="/notifications" 
                    className="block p-3 text-center text-xs font-medium text-primary-600 hover:bg-primary-50 border-t border-slate-100"
                    onClick={() => setShowNotifications(false)}
                  >
                    View All Notifications
                  </Link>
                </div>
              )}
            </div>

            {/* Admin Links */}
            {user?.role === 'admin' && (
              <>
                <Link to="/admin" className="text-slate-600 hover:text-primary-600 font-bold transition-colors">Dashboard</Link>
                <Link to="/admin/medicines" className="text-slate-600 hover:text-primary-600 font-bold transition-colors">Inventory</Link>
                <Link to="/admin/orders" className="text-slate-600 hover:text-primary-600 font-bold transition-colors">Orders</Link>
                <Link to="/admin/users" className="text-slate-600 hover:text-primary-600 font-bold transition-colors">Users</Link>
              </>
            )}

            {/* Shop Owner Links */}
            {user?.role === 'shop_owner' && (
              <>
                <Link to="/shop" className="text-slate-600 hover:text-primary-600 font-bold transition-colors">Dashboard</Link>
                <Link to="/shop/inventory" className="text-slate-600 hover:text-primary-600 font-bold transition-colors">My Inventory</Link>
                <Link to="/shop/browse" className="text-slate-600 hover:text-primary-600 font-bold transition-colors">Shop Central</Link>
              </>
            )}

            {/* Profile Dropdown */}
            <div className="flex items-center gap-3 border-l border-slate-200 pl-4 ml-2">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-slate-900">{user?.username}</p>
                <p className="text-[11px] font-medium text-primary-600 uppercase tracking-wider">{user?.role.replace('_', ' ')}</p>
              </div>
              <button 
                onClick={logout}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
