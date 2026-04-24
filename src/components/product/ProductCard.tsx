import React, { useState } from 'react';
import type { Product } from '../../types';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../stores/cartStore';
import { useWishlistStore } from '../../stores/wishlistStore';
import { formatIQD } from '../../lib/formatIQD';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { t } = useTranslation();
  const { addItem, removeItem, isInCart } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  
  const name = product.name;
  const discount = product.discount || 0;
  const finalPrice = product.price - (product.price * discount / 100);
  const hasDiscount = discount > 0;
  const imageUrl = product.images?.[0]?.image_url || 'https://via.placeholder.com/300';
  const inCart = isInCart(product.id);
  const inWishlist = isInWishlist(product.id);

  const handleCartClick = () => {
    if (inCart) {
      removeItem(product.id);
    } else {
      addItem(product, 1);
      setShowAddedMessage(true);
      setTimeout(() => setShowAddedMessage(false), 2000);
    }
  };

  const handleWishlistClick = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
      <Link to={`/product/${product.id}`} className="block relative">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {hasDiscount && (
          <span className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            -{discount}%
          </span>
        )}
        {product.is_featured && (
          <span className="absolute top-2 left-2 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {t('featured')}
          </span>
        )}
      </Link>

      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-800 hover:text-primary-500 transition-colors line-clamp-2 mb-2">
            {name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mb-4">
          {hasDiscount && (
            <span className="text-gray-400 line-through text-sm">
              {formatIQD(product.price)}
            </span>
          )}
          <span className="text-xl font-bold text-primary-500">
            {formatIQD(finalPrice)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCartClick}
            disabled={product.stock <= 0}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-all duration-200 font-medium ${
              inCart
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-primary-500 hover:bg-primary-600 text-white'
            } disabled:bg-gray-300 disabled:cursor-not-allowed`}
          >
            {inCart ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {showAddedMessage ? 'تمت الإضافة ✓' : 'في السلة'}
              </>
            ) : (
              t('addToCart')
            )}
          </button>
          <button 
            onClick={handleWishlistClick}
            className={`p-2 border rounded-lg transition-colors ${
              inWishlist
                ? 'border-red-500 bg-red-50 text-red-500'
                : 'border-gray-300 hover:border-red-500 hover:text-red-500'
            }`}
            title={inWishlist ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
          >
            <svg
              className="w-6 h-6"
              fill={inWishlist ? 'currentColor' : 'none'}
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
          </button>
        </div>

        {product.stock <= 0 && (
          <p className="text-red-500 text-sm mt-2 font-medium">{t('outOfStock')}</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
