import React, { useState } from 'react';

export type PaymentMethodType = 'cod' | 'electronic';

interface PaymentMethodSelectProps {
  onSelect: (method: PaymentMethodType) => void;
  selected: PaymentMethodType | null;
}

const PaymentMethodSelect: React.FC<PaymentMethodSelectProps> = ({ onSelect, selected }) => {
  const [hovered, setHovered] = useState<PaymentMethodType | null>(null);

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-800 mb-6">اختر طريقة الدفع</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* الدفع عند الاستلام */}
        <button
          type="button"
          onClick={() => onSelect('cod')}
          onMouseEnter={() => setHovered('cod')}
          onMouseLeave={() => setHovered(null)}
          className={`relative flex flex-col items-center gap-4 p-6 rounded-2xl border-2 transition-all duration-200 text-right
            ${selected === 'cod'
              ? 'border-green-500 bg-green-50 shadow-lg'
              : hovered === 'cod'
              ? 'border-green-300 bg-green-50/50'
              : 'border-gray-200 bg-white hover:border-green-300'
            }`}
        >
          {selected === 'cod' && (
            <span className="absolute top-3 left-3 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">✓</span>
          )}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-4xl">
            💵
          </div>
          <div className="text-center">
            <h4 className="text-lg font-bold text-gray-800 mb-1">الدفع عند الاستلام</h4>
            <p className="text-sm text-gray-500">ادفع نقداً عند استلام طلبك</p>
          </div>
          <div className="flex items-center gap-2 text-green-600 text-sm font-semibold">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            آمن وموثوق
          </div>
        </button>

        {/* الدفع الإلكتروني */}
        <button
          type="button"
          onClick={() => onSelect('electronic')}
          onMouseEnter={() => setHovered('electronic')}
          onMouseLeave={() => setHovered(null)}
          className={`relative flex flex-col items-center gap-4 p-6 rounded-2xl border-2 transition-all duration-200 text-right
            ${selected === 'electronic'
              ? 'border-primary-500 bg-orange-50 shadow-lg'
              : hovered === 'electronic'
              ? 'border-primary-300 bg-orange-50/50'
              : 'border-gray-200 bg-white hover:border-primary-300'
            }`}
        >
          {selected === 'electronic' && (
            <span className="absolute top-3 left-3 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs font-bold">✓</span>
          )}
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-4xl">
            💳
          </div>
          <div className="text-center">
            <h4 className="text-lg font-bold text-gray-800 mb-1">الدفع الإلكتروني</h4>
            <p className="text-sm text-gray-500">PayPal أو بطاقة ائتمان</p>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">PayPal</span>
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">MasterCard</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default PaymentMethodSelect;
