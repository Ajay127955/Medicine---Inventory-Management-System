import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import ShopDashboard from './pages/shopowner/ShopDashboard';
import BrowseMedicines from './pages/shopowner/BrowseMedicines';
import ManageUsers from './pages/admin/ManageUsers';
import ManageMedicines from './pages/admin/ManageMedicines';
import ManageOrders from './pages/admin/ManageOrders';
import MyInventory from './pages/shopowner/MyInventory';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import { useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Toaster position="top-right" />
      {user && <Navbar />}
      
      <main className={user ? "pt-0" : ""}>
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={
              user?.role === 'admin' ? <AdminDashboard /> : <ShopDashboard />
            } />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/medicines" element={<ManageMedicines />} />
            <Route path="/admin/orders" element={<ManageOrders />} />
          </Route>

          {/* Shop Owner Routes */}
          <Route element={<ProtectedRoute allowedRoles={['shop_owner']} />}>
            <Route path="/shop" element={<ShopDashboard />} />
            <Route path="/shop/browse" element={<BrowseMedicines />} />
            <Route path="/shop/inventory" element={<MyInventory />} />
          </Route>


          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
