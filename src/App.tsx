import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Shop from './pages/Shop';
import CategoryPage from './pages/Category';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Wishlist from './pages/Wishlist';
import Orders from './pages/Orders';
import Account from './pages/Account';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import Offers from './pages/Offers';
import './i18n';

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, admin, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!admin && !user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">غير مصرح</h2>
          <p className="text-gray-600 mb-6">ليس لديك صلاحية للوصول إلى لوحة التحكم</p>
          <a
            href="/"
            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-block"
          >
            العودة للصفحة الرئيسية
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <aside className="w-64 bg-gray-800 min-h-screen text-white">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-primary-500">لوحة التحكم</h2>
          </div>
          <nav className="mt-8">
            <a
              href="/admin"
              className="block px-6 py-3 hover:bg-gray-700 transition-colors"
            >
              لوحة التحكم
            </a>
            <a
              href="/admin/products"
              className="block px-6 py-3 hover:bg-gray-700 transition-colors"
            >
              المنتجات
            </a>
            <a
              href="/admin/categories"
              className="block px-6 py-3 hover:bg-gray-700 transition-colors"
            >
              الفئات
            </a>
            <a
              href="/admin/orders"
              className="block px-6 py-3 hover:bg-gray-700 transition-colors"
            >
              الطلبات
            </a>
            <a
              href="/admin/users"
              className="block px-6 py-3 hover:bg-gray-700 transition-colors"
            >
              المستخدمين
            </a>
            <a href="/" className="block px-6 py-3 hover:bg-gray-700 transition-colors">
              العودة للموقع
            </a>
          </nav>
        </aside>

        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <Home />
                <Footer />
              </>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/shop"
            element={
              <>
                <Navbar />
                <Shop />
                <Footer />
              </>
            }
          />
          <Route
            path="/offers"
            element={
              <>
                <Navbar />
                <Offers />
                <Footer />
              </>
            }
          />
          <Route
            path="/category/:id"
            element={
              <>
                <Navbar />
                <CategoryPage />
                <Footer />
              </>
            }
          />
          <Route
            path="/product/:id"
            element={
              <>
                <Navbar />
                <ProductDetail />
                <Footer />
              </>
            }
          />
          <Route
            path="/cart"
            element={
              <>
                <Navbar />
                <Cart />
                <Footer />
              </>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <Checkout />
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <>
                <Navbar />
                <Wishlist />
                <Footer />
              </>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <Orders />
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <Account />
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminProducts />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminCategories />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminOrders />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminUsers />
                </AdminLayout>
              </AdminRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
