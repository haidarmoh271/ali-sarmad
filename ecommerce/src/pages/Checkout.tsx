import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import ShippingForm, { type ShippingData } from '../components/checkout/ShippingForm';
import PaymentForm, { type PaymentData } from '../components/checkout/PaymentForm';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingData, setShippingData] = useState<ShippingData | null>(null);
  const [processing, setProcessing] = useState(false);

  const totalPrice = getTotalPrice();
  const finalTotal = totalPrice;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">السلة فارغة</h2>
          <p className="text-gray-600 mb-6">أضف منتجات إلى السلة أولاً</p>
          <button
            onClick={() => navigate('/shop')}
            className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
          >
            تصفح المتجر
          </button>
        </div>
      </div>
    );
  }

  const handleShippingSubmit = (data: ShippingData) => {
    setShippingData(data);
    setCurrentStep(2);
  };

  const handlePaymentSubmit = (data: PaymentData) => {
    handleCompleteOrder(data);
  };

  const handleCompleteOrder = async (payment: PaymentData) => {
    setProcessing(true);

    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('Order Details:', {
      items,
      shipping: shippingData,
      payment,
      total: finalTotal,
    });

    alert(`✅ تم إتمام الطلب بنجاح!\n\nالمجموع: ${finalTotal.toFixed(2)} دينار\n\nشكراً لتسوقك معنا!`);

    clearCart();

    navigate('/');
    
    setProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          إتمام الطلب
        </h1>

        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              currentStep >= 1 ? 'bg-primary-500 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              1
            </div>
            <span className="mr-2 text-sm font-medium">معلومات الشحن</span>
          </div>

          <div className={`h-1 w-20 mx-4 ${
            currentStep >= 2 ? 'bg-primary-500' : 'bg-gray-300'
          }`} />

          <div className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              currentStep >= 2 ? 'bg-primary-500 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              2
            </div>
            <span className="mr-2 text-sm font-medium">معلومات الدفع</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              {currentStep === 1 ? (
                <ShippingForm onSubmit={handleShippingSubmit} />
              ) : (
                <PaymentForm onSubmit={handlePaymentSubmit} />
              )}

              <div className="flex justify-between mt-6 pt-6 border-t">
                {currentStep > 1 && (
                  <button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    السابق
                  </button>
                )}

                <button
                  type="submit"
                  form={currentStep === 1 ? 'shipping-form' : 'payment-form'}
                  disabled={processing}
                  className={`px-8 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold ${
                    currentStep === 1 ? 'ml-auto' : ''
                  } disabled:bg-gray-400 disabled:cursor-not-allowed`}
                >
                  {processing ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      جاري المعالجة...
                    </span>
                  ) : currentStep === 1 ? (
                    'التالي'
                  ) : (
                    'إتمام الطلب 🎉'
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-4 text-gray-800">ملخص الطلب</h3>

              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {items.map((item) => {
                  if (!item.product) return null;
                  return (
                  <div key={item.id} className="flex items-center gap-3 pb-3 border-b">
                    <img
                      src={item.product.images?.[0]?.image_url || 'https://via.placeholder.com/60'}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm line-clamp-1">{item.product.name}</h4>
                      <p className="text-sm text-gray-600">الكمية: {item.quantity}</p>
                    </div>
                    <div className="text-primary-600 font-semibold">
                      {(item.product.price * item.quantity).toFixed(2)} د
                    </div>
                  </div>
                  );
                })}
              </div>

              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between text-gray-600">
                  <span>المجموع الفرعي</span>
                  <span>{totalPrice.toFixed(2)} دينار</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>رسوم الشحن</span>
                  <span className="text-green-600 font-semibold">مجاني 🎁</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-800 pt-2 border-t">
                  <span>المجموع الكلي</span>
                  <span className="text-primary-600">{finalTotal.toFixed(2)} دينار</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
