import React, { useState } from 'react';

export type ElectronicPaymentType = 'paypal' | 'mastercard';

export interface PaymentData {
  paymentType: ElectronicPaymentType;
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
  paypalEmail?: string;
}

interface PaymentFormProps {
  onSubmit: (data: PaymentData) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onSubmit }) => {
  const [paymentType, setPaymentType] = useState<ElectronicPaymentType>('mastercard');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });
  const [paypalEmail, setPaypalEmail] = useState('');

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    const name = e.target.name;

    if (name === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      value = value.slice(0, 19);
    }
    if (name === 'expiryDate') {
      value = value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
    }
    if (name === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 4);
    }

    setCardData({ ...cardData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentType === 'mastercard') {
      const clean = cardData.cardNumber.replace(/\s/g, '');
      if (clean.length !== 16) { alert('رقم البطاقة يجب أن يكون 16 رقمًا'); return; }
      if (!cardData.cardHolder) { alert('يرجى إدخال اسم حامل البطاقة'); return; }
      if (cardData.expiryDate.length !== 5) { alert('يرجى إدخال تاريخ انتهاء صحيح (MM/YY)'); return; }
      if (cardData.cvv.length < 3) { alert('يرجى إدخال رمز CVV صحيح'); return; }
      onSubmit({ paymentType: 'mastercard', ...cardData });
    } else {
      if (!paypalEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paypalEmail)) {
        alert('يرجى إدخال بريد إلكتروني PayPal صحيح');
        return;
      }
      onSubmit({ paymentType: 'paypal', paypalEmail });
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800 mb-2">تفاصيل الدفع الإلكتروني</h3>

      {/* اختيار طريقة الدفع */}
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setPaymentType('mastercard')}
          className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all font-semibold
            ${paymentType === 'mastercard'
              ? 'border-red-500 bg-red-50 text-red-700'
              : 'border-gray-200 hover:border-red-300 text-gray-600'
            }`}
        >
          <div className="flex gap-1 items-center">
            <div className="w-6 h-6 rounded-full bg-red-500" />
            <div className="w-6 h-6 rounded-full bg-yellow-400 -ml-3" />
          </div>
          MasterCard
        </button>

        <button
          type="button"
          onClick={() => setPaymentType('paypal')}
          className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all font-semibold
            ${paymentType === 'paypal'
              ? 'border-blue-600 bg-blue-50 text-blue-700'
              : 'border-gray-200 hover:border-blue-400 text-gray-600'
            }`}
        >
          <span className="text-lg">🅿</span>
          PayPal
        </button>
      </div>

      {/* MasterCard form */}
      {paymentType === 'mastercard' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-5 text-white shadow-xl">
            <div className="flex justify-between items-start mb-6">
              <div className="text-xs opacity-60 uppercase tracking-widest">بطاقة ائتمان</div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-red-500 opacity-90" />
                <div className="w-8 h-8 rounded-full bg-yellow-400 opacity-90 -ml-4" />
              </div>
            </div>
            <div className="text-xl tracking-widest font-mono mb-5">
              {cardData.cardNumber || '•••• •••• •••• ••••'}
            </div>
            <div className="flex justify-between text-sm">
              <div>
                <div className="text-xs opacity-60 mb-1">حامل البطاقة</div>
                <div className="font-semibold uppercase">{cardData.cardHolder || 'YOUR NAME'}</div>
              </div>
              <div className="text-right">
                <div className="text-xs opacity-60 mb-1">تاريخ الانتهاء</div>
                <div className="font-semibold">{cardData.expiryDate || 'MM/YY'}</div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              رقم البطاقة <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="cardNumber"
              value={cardData.cardNumber}
              onChange={handleCardChange}
              placeholder="1234 5678 9012 3456"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              اسم حامل البطاقة <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="cardHolder"
              value={cardData.cardHolder}
              onChange={handleCardChange}
              placeholder="JOHN DOE"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 uppercase"
              dir="ltr"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                تاريخ الانتهاء <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="expiryDate"
                value={cardData.expiryDate}
                onChange={handleCardChange}
                placeholder="MM/YY"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CVV <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="cvv"
                value={cardData.cvv}
                onChange={handleCardChange}
                placeholder="•••"
                maxLength={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
                dir="ltr"
              />
            </div>
          </div>
        </div>
      )}

      {/* PayPal form */}
      {paymentType === 'paypal' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
            <div className="text-4xl mb-2">🔵</div>
            <h4 className="font-bold text-blue-800 text-lg mb-1">الدفع عبر PayPal</h4>
            <p className="text-sm text-blue-600">
              أدخل بريدك الإلكتروني المرتبط بحساب PayPal لإتمام الدفع.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              البريد الإلكتروني لـ PayPal <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={paypalEmail}
              onChange={(e) => setPaypalEmail(e.target.value)}
              placeholder="example@paypal.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              dir="ltr"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
            <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            معاملتك محمية بتشفير PayPal الآمن
          </div>
        </div>
      )}
    </form>
  );
};

export default PaymentForm;
