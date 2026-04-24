import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { useAuth } from '../hooks/useAuth';
import { orderService } from '../services/orderService';
import { formatIQD } from '../lib/formatIQD';
import ShippingForm, { type ShippingData } from '../components/checkout/ShippingForm';
import PaymentForm, { type PaymentData } from '../components/checkout/PaymentForm';
import PaymentMethodSelect, { type PaymentMethodType } from '../components/checkout/PaymentMethodSelect';

// Step 1 = Payment method choice
// Step 2 = Shipping info
// Step 3 = Electronic payment details (only if electronic)

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType | null>(null);
  const [shippingData, setShippingData] = useState<ShippingData | null>(null);
  const [processing, setProcessing] = useState(false);

  const totalPrice = getTotalPrice();

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

  // Determine total steps based on payment method
  const totalSteps = paymentMethod === 'electronic' ? 3 : 2;

  const stepLabels: Record<number, string> = {
    1: 'طريقة الدفع',
    2: 'معلومات الشحن',
    3: 'تفاصيل الدفع',
  };

  const handlePaymentMethodNext = () => {
    if (!paymentMethod) {
      alert('يرجى اختيار طريقة الدفع');
      return;
    }
    setCurrentStep(2);
  };

  const handleShippingSubmit = (data: ShippingData) => {
    setShippingData(data);
    if (paymentMethod === 'cod') {
      handleCompleteOrder(null);
    } else {
      setCurrentStep(3);
    }
  };

  const handlePaymentSubmit = (data: PaymentData) => {
    handleCompleteOrder(data);
  };

  const handleCompleteOrder = async (paymentData: PaymentData | null) => {
    setProcessing(true);
    try {
      if (user) {
        await orderService.create({
          user_id: user.id,
          total_price: totalPrice,
          payment_method: paymentMethod!,
          payment_type: paymentData?.paymentType,
          items: items
            .filter(item => item.product)
            .map(item => ({
              product_id: item.product_id,
              quantity: item.quantity,
              price: item.product!.price,
            })),
        });
      }

      clearCart();

      const message = paymentMethod === 'cod'
        ? `✅ تم إتمام الطلب بنجاح!\n\nسيتم التواصل معك لتحديد موعد التسليم.\n\nالمجموع: ${formatIQD(totalPrice)}`
        : `✅ تم إتمام الطلب بنجاح!\n\nتمت معالجة الدفع الإلكتروني.\n\nالمجموع: ${formatIQD(totalPrice)}`;

      alert(message);
      navigate('/account');
    } catch (err) {
      console.error('Order error:', err);
      alert('❌ حدث خطأ أثناء إتمام الطلب. حاول مرة أخرى.');
    } finally {
      setProcessing(false);
    }
  };

  const stepsToShow = paymentMethod === 'electronic' ? [1, 2, 3] : [1, 2];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">إتمام الطلب</h1>

        {/* Progress Bar */}
        <div className="flex items-center justify-center mb-10">
          {stepsToShow.map((step, index) => (
            <React.Fragment key={step}>
              <div className="flex items-center gap-2">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm transition-all
                  ${currentStep >= step
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'bg-gray-200 text-gray-500'
                  }`}>
                  {currentStep > step ? '✓' : step}
                </div>
                <span className={`text-sm font-medium hidden sm:inline ${currentStep >= step ? 'text-primary-600' : 'text-gray-400'}`}>
                  {stepLabels[step]}
                </span>
              </div>
              {index < stepsToShow.length - 1 && (
                <div className={`h-1 w-16 mx-3 rounded-full transition-all ${currentStep > step ? 'bg-primary-500' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Step 1: Payment method */}
              {currentStep === 1 && (
                <>
                  <PaymentMethodSelect
                    onSelect={setPaymentMethod}
                    selected={paymentMethod}
                  />
                  <div className="flex justify-end mt-8 pt-6 border-t">
                    <button
                      onClick={handlePaymentMethodNext}
                      className="px-8 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold"
                    >
                      التالي ←
                    </button>
                  </div>
                </>
              )}

              {/* Step 2: Shipping */}
              {currentStep === 2 && (
                <>
                  <ShippingForm
                    onSubmit={handleShippingSubmit}
                    initialData={{
                      fullName: user?.full_name ?? '',
                      phone:    user?.phone    ?? '',
                      address:  user?.address  ?? '',
                      city:     user?.city     ?? '',
                    }}
                  />
                  <div className="flex justify-between mt-6 pt-6 border-t">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      → السابق
                    </button>
                    <button
                      type="submit"
                      form="shipping-form"
                      disabled={processing}
                      className="px-8 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {processing ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          جاري المعالجة...
                        </span>
                      ) : paymentMethod === 'cod' ? (
                        'إتمام الطلب 🎉'
                      ) : (
                        'التالي ←'
                      )}
                    </button>
                  </div>
                </>
              )}

              {/* Step 3: Electronic payment details */}
              {currentStep === 3 && (
                <>
                  <PaymentForm onSubmit={handlePaymentSubmit} />
                  <div className="flex justify-between mt-6 pt-6 border-t">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      → السابق
                    </button>
                    <button
                      type="submit"
                      form="payment-form"
                      disabled={processing}
                      className="px-8 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {processing ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          جاري المعالجة...
                        </span>
                      ) : (
                        'إتمام الطلب 🎉'
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-4 text-gray-800">ملخص الطلب</h3>

              {paymentMethod && (
                <div className={`flex items-center gap-2 text-sm font-semibold rounded-lg px-3 py-2 mb-4
                  ${paymentMethod === 'cod' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}>
                  <span>{paymentMethod === 'cod' ? '💵' : '💳'}</span>
                  <span>{paymentMethod === 'cod' ? 'الدفع عند الاستلام' : 'دفع إلكتروني'}</span>
                </div>
              )}

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
                        {formatIQD(item.product.price * item.quantity)}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between text-gray-600">
                  <span>المجموع الفرعي</span>
                  <span>{formatIQD(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>رسوم الشحن</span>
                  <span className="text-green-600 font-semibold">مجاني 🎁</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-800 pt-2 border-t">
                  <span>المجموع الكلي</span>
                  <span className="text-primary-600">{formatIQD(totalPrice)}</span>
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
