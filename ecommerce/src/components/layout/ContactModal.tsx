import React, { useState } from 'react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailData, setEmailData] = useState({
    email: '',
    message: '',
  });
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    alert('✅ تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.');
    setEmailData({ email: '', message: '' });
    setShowEmailForm(false);
    setIsSending(false);
  };

  const contactInfo = [
    {
      icon: '📱',
      title: 'الهاتف',
      items: ['+9647800000000', '+9647811111111'],
      links: ['tel:+9647800000000', 'tel:+9647811111111']
    },
    {
      icon: '📧',
      title: 'البريد الإلكتروني',
      items: ['info@miswaki.com', 'support@miswaki.com'],
      links: ['mailto:info@miswaki.com', 'mailto:support@miswaki.com']
    },
    {
      icon: '📍',
      title: 'العنوان',
      items: ['بغداد، العراق', 'شارع الكرادة، مجمع التسوق الكبير'],
      links: ['#', '#']
    }
  ];

  const socialMedia = [
    {
      name: 'Instagram',
      icon: '📷',
      link: 'https://instagram.com/miswaki_store',
      username: '@miswaki_store',
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Facebook',
      icon: '📘',
      link: 'https://facebook.com/miswakistore',
      username: 'Miswaki Store',
      color: 'from-blue-500 to-blue-700'
    },
    {
      name: 'Twitter',
      icon: '🐦',
      link: 'https://twitter.com/miswaki_iq',
      username: '@miswaki_iq',
      color: 'from-sky-400 to-blue-500'
    },
    {
      name: 'WhatsApp',
      icon: '💬',
      link: 'https://wa.me/9647800000000',
      username: '+964 780 000 0000',
      color: 'from-green-400 to-green-600'
    },
    {
      name: 'Telegram',
      icon: '✈️',
      link: 'https://t.me/miswaki_support',
      username: '@miswaki_support',
      color: 'from-blue-400 to-blue-500'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary-500 to-primary-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold">📞 تواصل معنا</h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-primary-100 mt-2">نسعد بتواصلك معنا! اختر الطريقة المناسبة لك</p>
        </div>

        <div className="p-6">
          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {contactInfo.map((info, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                <div className="text-3xl mb-2">{info.icon}</div>
                <h3 className="font-bold text-gray-800 mb-2">{info.title}</h3>
                <div className="space-y-1">
                  {info.items.map((item, idx) => (
                    <a
                      key={idx}
                      href={info.links[idx]}
                      className="block text-sm text-gray-600 hover:text-primary-500 transition-colors"
                      target={info.links[idx].startsWith('http') ? '_blank' : undefined}
                      rel={info.links[idx].startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      {item}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Social Media */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>🌐</span>
              <span>تابعنا على مواقع التواصل الاجتماعي</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {socialMedia.map((social, index) => (
                <a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`bg-gradient-to-r ${social.color} text-white rounded-xl p-4 hover:scale-105 transition-transform shadow-md hover:shadow-xl`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{social.icon}</span>
                    <div>
                      <div className="font-bold">{social.name}</div>
                      <div className="text-sm opacity-90">{social.username}</div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>


          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <span>✉️</span>
                <span>تواصل عبر البريد الإلكتروني</span>
              </h3>
              {!showEmailForm && (
                <button
                  onClick={() => setShowEmailForm(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-md"
                >
                  📝 أرسل رسالة
                </button>
              )}
            </div>

            {/* Email Form */}
            {showEmailForm && (
              <form onSubmit={handleSendEmail} className="space-y-4 animate-slideDown">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📧 البريد الإلكتروني الخاص بك *
                  </label>
                  <input
                    type="email"
                    value={emailData.email}
                    onChange={(e) => setEmailData({ ...emailData, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    placeholder="example@email.com"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    💬 رسالتك *
                  </label>
                  <textarea
                    value={emailData.message}
                    onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none transition-all"
                    placeholder="اكتب رسالتك هنا..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isSending}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                  >
                    {isSending ? '⏳ جاري الإرسال...' : '✅ إرسال الرسالة'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEmailForm(false);
                      setEmailData({ email: '', message: '' });
                    }}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-all"
                  >
                    ❌ إلغاء
                  </button>
                </div>
              </form>
            )}

            {!showEmailForm && (
              <p className="text-gray-600 text-center">
                اضغط على الزر أعلاه لإرسال رسالة مباشرة إلى فريق الدعم
              </p>
            )}
          </div>

          {/* Working Hours */}
          <div className="mt-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⏰</span>
              <div>
                <h4 className="font-bold text-gray-800 mb-2">أوقات العمل</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>📅 السبت - الخميس: 9:00 صباحاً - 9:00 مساءً</p>
                  <p>📅 الجمعة: 2:00 ظهراً - 10:00 مساءً</p>
                  <p>⚡ نستجيب للرسائل خلال 24 ساعة</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
