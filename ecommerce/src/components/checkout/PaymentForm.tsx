import React, { useState } from 'react';

interface PaymentFormProps {
  onSubmit: (data: PaymentData) => void;
}

export interface PaymentData {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<PaymentData>({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cardNumberClean = formData.cardNumber.replace(/\s/g, '');
    
    if (cardNumberClean.length !== 16) {
      alert('رقم البطاقة يجب أن يكون 16 رقم');
      return;
    }

    if (!formData.cardHolder) {
      alert('يرجى إدخال اسم حامل البطاقة');
      return;
    }

    if (formData.expiryDate.length !== 5) {
      alert('يرجى إدخال تاريخ انتهاء صحيح (MM/YY)');
      return;
    }

    if (formData.cvv.length < 3) {
      alert('يرجى إدخال رمز CVV صحيح');
      return;
    }

    onSubmit(formData);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-bold text-gray-800 mb-4">معلومات الدفع</h3>

      <div className="bg-gradient-to-br from-primary-500 to-orange-600 rounded-xl p-6 text-white shadow-lg mb-6">
        <div className="flex justify-between items-start mb-8">
          <div className="text-2xl">💳</div>
          <div className="text-sm opacity-80">بطاقة ائتمان</div>
        </div>

        <div className="mb-4">
          <div className="text-2xl tracking-widest font-mono">
            {formData.cardNumber || '•••• •••• •••• ••••'}
          </div>
        </div>

        <div className="flex justify-between items-end">
          <div>
            <div className="text-xs opacity-70 mb-1">حامل البطاقة</div>
            <div className="text-sm font-semibold uppercase">
              {formData.cardHolder || 'YOUR NAME'}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs opacity-70 mb-1">تاريخ الانتهاء</div>
            <div className="text-sm font-semibold">
              {formData.expiryDate || 'MM/YY'}
            </div>
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
          value={formData.cardNumber}
          onChange={handleChange}
          placeholder="1234 5678 9012 3456"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
        />
        <p className="text-xs text-gray-500 mt-1">
          💡 استخدم أي رقم من 16 رقم (وهمي للتجربة)
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          اسم حامل البطاقة <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="cardHolder"
          value={formData.cardHolder}
          onChange={handleChange}
          placeholder="JOHN DOE"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 uppercase"
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
            value={formData.expiryDate}
            onChange={handleChange}
            placeholder="MM/YY"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CVV <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="cvv"
            value={formData.cvv}
            onChange={handleChange}
            placeholder="123"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
          />
        </div>
      </div>
    </form>
  );
};

export default PaymentForm;
