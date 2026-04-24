import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlistStore } from '../stores/wishlistStore';
import { useCartStore } from '../stores/cartStore';
import { formatIQD } from '../lib/formatIQD';

const Wishlist: React.FC = () => {
  const { items, removeItem } = useWishlistStore();
  const { addItem: addToCart, isInCart } = useCartStore();

  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
  };

  if (items.length === 0) {
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
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">قائمة الأمنيات فارغة</h2>
        <p className="text-gray-600 mb-6">لم تقم بإضافة أي منتجات إلى قائمة الأمنيات بعد</p>
        <Link
          to="/shop"
          className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          تصفح المنتجات
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            قائمة الأمنيات ({items.length})
          </h1>
          <Link
            to="/shop"
            className="text-primary-500 hover:text-primary-600 font-medium"
          >
            مواصلة التسوق
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((product) => {
            const discount = product.discount || 0;
            const finalPrice = product.price - (product.price * discount / 100);
            const imageUrl = product.images?.[0]?.image_url || 'https://via.placeholder.com/300';
            const inCart = isInCart(product.id);

            return (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="relative">
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  {discount > 0 && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      -{discount}%
                    </span>
                  )}
                  <button
                    onClick={() => removeItem(product.id)}
                    className="absolute top-2 left-2 bg-white rounded-full p-2 shadow-md hover:bg-red-50 hover:text-red-500 transition-colors"
                    title="إزالة من المفضلة"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
                    </svg>
                  </button>
                </div>

                <div className="p-4">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="text-lg font-semibold text-gray-800 hover:text-primary-500 transition-colors line-clamp-2 mb-2">
                      {product.name}
                    </h3>
                  </Link>

                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      {discount > 0 && (
                        <span className="text-gray-400 line-through text-sm block">
                          {formatIQD(product.price)}
                        </span>
                      )}
                      <span className="text-xl font-bold text-primary-500">
                        {formatIQD(finalPrice)}
                      </span>
                    </div>
                    {product.stock > 0 ? (
                      <span className="text-sm text-green-600 font-medium">
                        متوفر ({product.stock})
                      </span>
                    ) : (
                      <span className="text-sm text-red-600 font-medium">
                        نفذت الكمية
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock <= 0 || inCart}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                        inCart
                          ? 'bg-green-500 text-white cursor-default'
                          : 'bg-primary-500 hover:bg-primary-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed'
                      }`}
                    >
                      {inCart ? 'في السلة ✓' : 'أضف للسلة'}
                    </button>
                    <Link
                      to={`/product/${product.id}`}
                      className="px-4 py-2 border border-primary-500 text-primary-500 rounded-lg hover:bg-primary-50 transition-colors"
                      title="عرض التفاصيل"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
