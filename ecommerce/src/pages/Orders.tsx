import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

interface Order {
  id: string;
  created_at: string;
  total_price: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address?: string;
  items: Array<{
    product_name: string;
    quantity: number;
    price: number;
  }>;
}

const Orders: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const mockOrders: Order[] = [
      {
        id: '1',
        created_at: new Date().toISOString(),
        total_price: 150.50,
        status: 'delivered',
        shipping_address: 'الرياض، المملكة العربية السعودية',
        items: [
          { product_name: 'منتج تجريبي 1', quantity: 2, price: 50.00 },
          { product_name: 'منتج تجريبي 2', quantity: 1, price: 50.50 },
        ],
      },
      {
        id: '2',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        total_price: 299.99,
        status: 'shipped',
        shipping_address: 'جدة، المملكة العربية السعودية',
        items: [
          { product_name: 'منتج تجريبي 3', quantity: 1, price: 299.99 },
        ],
      },
    ];

    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 500);
  }, [user, navigate]);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'قيد الانتظار';
      case 'processing':
        return 'قيد المعالجة';
      case 'shipped':
        return 'تم الشحن';
      case 'delivered':
        return 'تم التوصيل';
      case 'cancelled':
        return 'ملغي';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'processing':
        return '📦';
      case 'shipped':
        return '🚚';
      case 'delivered':
        return '✅';
      case 'cancelled':
        return '❌';
      default:
        return '📋';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">جاري التحميل...</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-12 bg-gray-50">
        <svg
          className="w-32 h-32 text-gray-300 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">لا توجد طلبات</h2>
        <p className="text-gray-600 mb-6">لم تقم بإجراء أي طلبات بعد</p>
        <Link
          to="/shop"
          className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          ابدأ التسوق
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">طلباتي ({orders.length})</h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Order Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-600">رقم الطلب</p>
                    <p className="font-semibold text-gray-800">#{order.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">تاريخ الطلب</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(order.created_at).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">الإجمالي</p>
                    <p className="font-semibold text-primary-600">
                      {order.total_price.toFixed(2)} دينار
                    </p>
                  </div>
                  <div>
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      <span>{getStatusIcon(order.status)}</span>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Body */}
              <div className="p-6">
                {/* Shipping Address */}
                {order.shipping_address && (
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">عنوان الشحن</h3>
                    <p className="text-gray-600">{order.shipping_address}</p>
                  </div>
                )}

                {/* Order Items */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">المنتجات</h3>
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                    >
                      <div>
                        <p className="font-medium text-gray-800">{item.product_name}</p>
                        <p className="text-sm text-gray-500">الكمية: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-800">
                        {(item.price * item.quantity).toFixed(2)} دينار
                      </p>
                    </div>
                  ))}
                </div>

                {/* Order Tracking */}
                {order.status !== 'cancelled' && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">تتبع الطلب</h3>
                    <div className="relative">
                      <div className="flex items-center justify-between">
                        {/* Pending */}
                        <div className="flex flex-col items-center relative z-10">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              ['pending', 'processing', 'shipped', 'delivered'].includes(
                                order.status
                              )
                                ? 'bg-primary-500 text-white'
                                : 'bg-gray-300 text-gray-600'
                            }`}
                          >
                            ⏳
                          </div>
                          <p className="text-xs mt-2 text-gray-600">قيد الانتظار</p>
                        </div>

                        {/* Line 1 */}
                        <div
                          className={`flex-1 h-1 ${
                            ['processing', 'shipped', 'delivered'].includes(order.status)
                              ? 'bg-primary-500'
                              : 'bg-gray-300'
                          }`}
                          style={{ marginBottom: '32px' }}
                        />

                        {/* Processing */}
                        <div className="flex flex-col items-center relative z-10">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              ['processing', 'shipped', 'delivered'].includes(order.status)
                                ? 'bg-primary-500 text-white'
                                : 'bg-gray-300 text-gray-600'
                            }`}
                          >
                            📦
                          </div>
                          <p className="text-xs mt-2 text-gray-600">قيد المعالجة</p>
                        </div>

                        {/* Line 2 */}
                        <div
                          className={`flex-1 h-1 ${
                            ['shipped', 'delivered'].includes(order.status)
                              ? 'bg-primary-500'
                              : 'bg-gray-300'
                          }`}
                          style={{ marginBottom: '32px' }}
                        />

                        {/* Shipped */}
                        <div className="flex flex-col items-center relative z-10">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              ['shipped', 'delivered'].includes(order.status)
                                ? 'bg-primary-500 text-white'
                                : 'bg-gray-300 text-gray-600'
                            }`}
                          >
                            🚚
                          </div>
                          <p className="text-xs mt-2 text-gray-600">تم الشحن</p>
                        </div>

                        {/* Line 3 */}
                        <div
                          className={`flex-1 h-1 ${
                            order.status === 'delivered' ? 'bg-primary-500' : 'bg-gray-300'
                          }`}
                          style={{ marginBottom: '32px' }}
                        />

                        {/* Delivered */}
                        <div className="flex flex-col items-center relative z-10">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              order.status === 'delivered'
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-300 text-gray-600'
                            }`}
                          >
                            ✅
                          </div>
                          <p className="text-xs mt-2 text-gray-600">تم التوصيل</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
