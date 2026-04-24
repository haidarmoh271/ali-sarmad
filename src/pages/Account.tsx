import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/userService';
import { orderService } from '../services/orderService';
import type { Order } from '../types';
import { formatIQD } from '../lib/formatIQD';

const statusConfig: Record<string, { label: string; color: string; icon: string }> = {
  pending:    { label: 'قيد الانتظار',  color: 'bg-yellow-100 text-yellow-700',  icon: '⏳' },
  processing: { label: 'جاري المعالجة', color: 'bg-blue-100 text-blue-700',    icon: '⚙️' },
  shipped:    { label: 'تم الشحن',       color: 'bg-purple-100 text-purple-700', icon: '🚚' },
  delivered:  { label: 'تم التسليم',     color: 'bg-green-100 text-green-700',  icon: '✅' },
  cancelled:  { label: 'ملغي',           color: 'bg-red-100 text-red-700',      icon: '❌' },
};

const Account: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'العراق',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    setFormData({
      full_name: user.full_name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      city: user.city || '',
      country: user.country || 'العراق',
    });

    if (user.avatar_url) {
      setProfileImage(user.avatar_url);
    }

    loadOrders(user.id);
  }, [user, navigate]);

  const loadOrders = async (userId: string) => {
    setOrdersLoading(true);
    try {
      const data = await orderService.getByUserId(userId);
      setOrders(data);
    } catch (err) {
      console.error('Error loading orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      let avatar_url = user.avatar_url;

      if (imageFile) {
        avatar_url = await userService.uploadAvatar(user.id, imageFile);
      }

      const updatedData = { ...formData, ...(avatar_url ? { avatar_url } : {}) };
      const updatedUser = await userService.update(user.id, updatedData);

      // تحديث localStorage حتى يعكس AuthContext البيانات الجديدة
      localStorage.setItem('user', JSON.stringify(updatedUser));

      alert('✅ تم تحديث بياناتك بنجاح!');
      setIsEditing(false);
      setImageFile(null);
      window.location.reload();
    } catch (error) {
      console.error('Update error:', error);
      alert('❌ حدث خطأ أثناء التحديث. حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
      await signOut();
      navigate('/');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl p-8 mb-8 shadow-lg">
          <h1 className="text-4xl font-bold mb-2">👋 مرحباً، {user.full_name}</h1>
          <p className="text-primary-100">إدارة حسابك وعرض طلباتك السابقة</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary-500 shadow-lg mx-auto">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-4xl font-bold">
                        {user.full_name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-primary-500 hover:bg-primary-600 text-white rounded-full p-2 cursor-pointer shadow-lg transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mt-4">{user.full_name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm text-gray-600">📦 الطلبات</span>
                  <span className="font-bold text-blue-600">{orders.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm text-gray-600">💰 المشتريات</span>
                  <span className="font-bold text-green-600">
                    {formatIQD(orders.reduce((sum, o) => sum + o.total_price, 0))}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm text-gray-600">📅 عضو منذ</span>
                  <span className="font-bold text-purple-600">
                    {new Date(user.created_at).toLocaleDateString('ar-EG', { month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  {isEditing ? '❌ إلغاء التعديل' : '✏️ تعديل البيانات'}
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  🚪 تسجيل الخروج
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <span>👤</span>
                  <span>المعلومات الشخصية</span>
                </h2>
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الاسم الكامل *
                      </label>
                      <input
                        type="text"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        البريد الإلكتروني *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        disabled
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                        dir="ltr"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        رقم الهاتف
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        dir="ltr"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        المدينة
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      العنوان
                    </label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {loading ? '⏳ جاري الحفظ...' : '✅ حفظ التغييرات'}
                  </button>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">👤</span>
                    <div>
                      <p className="text-sm text-gray-600">الاسم</p>
                      <p className="font-semibold text-gray-800">{user.full_name}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📧</span>
                    <div>
                      <p className="text-sm text-gray-600">البريد الإلكتروني</p>
                      <p className="font-semibold text-gray-800" dir="ltr">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📱</span>
                    <div>
                      <p className="text-sm text-gray-600">رقم الهاتف</p>
                      <p className="font-semibold text-gray-800" dir="ltr">{user.phone || 'غير محدد'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🏙️</span>
                    <div>
                      <p className="text-sm text-gray-600">المدينة</p>
                      <p className="font-semibold text-gray-800">{user.city || 'غير محدد'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 md:col-span-2">
                    <span className="text-2xl">📍</span>
                    <div>
                      <p className="text-sm text-gray-600">العنوان</p>
                      <p className="font-semibold text-gray-800">{user.address || 'غير محدد'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>


            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <span>📦</span>
                  <span>طلباتي</span>
                </h2>
                {orders.length > 0 && (
                  <span className="bg-primary-100 text-primary-700 text-sm font-bold px-3 py-1 rounded-full">
                    {orders.length} طلب
                  </span>
                )}
              </div>

              {ordersLoading ? (
                <div className="text-center py-10 text-gray-500">⏳ جاري تحميل الطلبات...</div>
              ) : orders.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🛍️</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">لم تقم بأي طلبات بعد</h3>
                  <p className="text-gray-600 mb-6">ابدأ التسوق الآن واستمتع بأفضل العروض!</p>
                  <button
                    onClick={() => navigate('/shop')}
                    className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
                  >
                    <span>🛒</span>
                    <span>تصفح المتجر</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => {
                    const sc = statusConfig[order.status] ?? statusConfig['pending'];
                    const isExpanded = expandedOrder === order.id;
                    const paymentLabel = order.payment_method === 'cod'
                      ? 'الدفع عند الاستلام'
                      : order.payment_type === 'paypal' ? 'PayPal' : 'MasterCard';
                    const paymentIcon = order.payment_method === 'cod' ? '💵' : order.payment_type === 'paypal' ? '🔵' : '💳';

                    return (
                      <div key={order.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                        {/* Order Header */}
                        <button
                          onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                          className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-right"
                        >
                          <div className="flex items-center gap-3">
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${sc.color}`}>
                              {sc.icon} {sc.label}
                            </span>
                            <span className="text-sm font-medium text-gray-600">
                              {paymentIcon} {paymentLabel}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-primary-600">{formatIQD(order.total_price)}</div>
                            <div className="text-xs text-gray-400">#{order.id.slice(0, 8)}</div>
                          </div>
                        </button>

                        {/* Dates strip */}
                        <div className="grid grid-cols-3 divide-x divide-x-reverse divide-gray-100 border-t border-gray-100 bg-white text-center text-xs">
                          <div className="p-3">
                            <div className="text-gray-400 mb-1">📅 تاريخ الطلب</div>
                            <div className="font-semibold text-gray-700">
                              {new Date(order.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </div>
                          </div>
                          <div className="p-3">
                            <div className="text-gray-400 mb-1">✅ تاريخ التأكيد</div>
                            <div className="font-semibold text-gray-700">
                              {order.completed_at
                                ? new Date(order.completed_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })
                                : '—'}
                            </div>
                          </div>
                          <div className="p-3">
                            <div className="text-gray-400 mb-1">🚚 تاريخ الاستلام</div>
                            <div className="font-semibold text-gray-700">
                              {order.delivered_at
                                ? new Date(order.delivered_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })
                                : '—'}
                            </div>
                          </div>
                        </div>

                        {/* Expandable items */}
                        {isExpanded && order.items && order.items.length > 0 && (
                          <div className="border-t border-gray-100 p-4 space-y-3 bg-white">
                            <h4 className="text-sm font-bold text-gray-700 mb-2">تفاصيل المنتجات:</h4>
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-center gap-3">
                                {item.product?.images?.[0]?.image_url && (
                                  <img
                                    src={item.product.images[0].image_url}
                                    alt={item.product?.name}
                                    className="w-12 h-12 object-cover rounded-lg border"
                                  />
                                )}
                                <div className="flex-1">
                                  <div className="text-sm font-medium text-gray-800">{item.product?.name ?? 'منتج'}</div>
                                  <div className="text-xs text-gray-500">الكمية: {item.quantity} × {formatIQD(item.price)}</div>
                                </div>
                                <div className="text-sm font-bold text-primary-600">
                                  {formatIQD(item.quantity * item.price)}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
