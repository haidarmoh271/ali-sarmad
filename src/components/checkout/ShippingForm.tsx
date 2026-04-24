import React, { useState } from 'react';

interface ShippingFormProps {
  onSubmit: (data: ShippingData) => void;
  initialData?: Partial<ShippingData>;
}

export interface ShippingData {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  gpsLatitude: string;
  gpsLongitude: string;
  notes?: string;
}

const ShippingForm: React.FC<ShippingFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState<ShippingData>({
    fullName: initialData?.fullName ?? '',
    phone: initialData?.phone ?? '',
    address: initialData?.address ?? '',
    city: initialData?.city ?? '',
    postalCode: initialData?.postalCode ?? '',
    gpsLatitude: initialData?.gpsLatitude ?? '',
    gpsLongitude: initialData?.gpsLongitude ?? '',
    notes: initialData?.notes ?? '',
  });

  const [gettingLocation, setGettingLocation] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGetLocation = () => {
    setGettingLocation(true);
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            gpsLatitude: position.coords.latitude.toString(),
            gpsLongitude: position.coords.longitude.toString(),
          });
          setGettingLocation(false);
        },
        (error) => {
          console.error('خطأ في الحصول على الموقع:', error);
          alert('لم نتمكن من الحصول على موقعك. يرجى إدخاله يدوياً.');
          setGettingLocation(false);
        }
      );
    } else {
      alert('المتصفح لا يدعم خاصية تحديد الموقع');
      setGettingLocation(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.phone || !formData.address || !formData.city) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    onSubmit(formData);
  };

  return (
    <form id="shipping-form" onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-bold text-gray-800 mb-4">معلومات الشحن</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          الاسم الكامل <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          رقم الهاتف <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          العنوان <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            المدينة <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            الرمز البريدي
          </label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            الموقع (GPS)
          </label>
          <button
            type="button"
            onClick={handleGetLocation}
            disabled={gettingLocation}
            className="text-sm bg-primary-500 text-white px-3 py-1 rounded hover:bg-primary-600 disabled:bg-gray-400 transition-colors"
          >
            {gettingLocation ? 'جاري الحصول...' : '📍 احصل على موقعي'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <label className="block text-xs text-gray-600 mb-1">خط الطول</label>
            <input
              type="text"
              name="gpsLatitude"
              value={formData.gpsLatitude}
              onChange={handleChange}
              placeholder="Latitude"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">خط العرض</label>
            <input
              type="text"
              name="gpsLongitude"
              value={formData.gpsLongitude}
              onChange={handleChange}
              placeholder="Longitude"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {formData.gpsLatitude && formData.gpsLongitude && (
          <a
            href={`https://www.google.com/maps?q=${formData.gpsLatitude},${formData.gpsLongitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary-500 hover:underline mt-2 inline-block"
          >
            🗺️ عرض على خرائط جوجل
          </a>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ملاحظات إضافية
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="أي تعليمات خاصة بالتسليم..."
        />
      </div>
    </form>
  );
};

export default ShippingForm;
