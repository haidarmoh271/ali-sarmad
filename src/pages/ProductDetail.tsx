import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { productService } from '../services/productService';
import type { Product } from '../types';
import { useCartStore } from '../stores/cartStore';
import { useAuth } from '../hooks/useAuth';
import { formatIQD } from '../lib/formatIQD';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { user } = useAuth();
  const addItem = useCartStore(state => state.addItem);
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await productService.getById(id!);
        setProduct(data);
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      alert(t('loginRequired'));
      return;
    }

    if (product) {
      addItem(product, quantity);
      alert(t('addedToCart'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">{t('loading')}...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">{t('productNotFound')}</div>
      </div>
    );
  }

  const name = product.name;
  const description = product.description;
  const discount = product.discount || 0;
  const finalPrice = product.price - (product.price * discount / 100);
  const hasDiscount = discount > 0;
  const images = product.images || [];
  const mainImage = images[selectedImage]?.image_url || 'https://via.placeholder.com/600';

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="bg-white rounded-lg overflow-hidden shadow-md mb-4">
              <img
                src={mainImage}
                alt={name}
                className="w-full h-96 object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, index) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(index)}
                    className={`border-2 rounded-lg overflow-hidden ${
                      selectedImage === index
                        ? 'border-primary-500'
                        : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={img.image_url}
                      alt={`${name} ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{name}</h1>

            <div className="flex items-center gap-4 mb-6">
              {hasDiscount && (
                <span className="text-2xl text-gray-400 line-through">
                  {formatIQD(product.price)}
                </span>
              )}
              <span className="text-4xl font-bold text-primary-500">
                {formatIQD(finalPrice)}
              </span>
              {hasDiscount && (
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  -{discount}%
                </span>
              )}
            </div>

            <div className="mb-6">
              {product.stock > 0 ? (
                <span className="text-green-600 font-semibold">
                  {t('inStock')} ({product.stock} {t('available')})
                </span>
              ) : (
                <span className="text-red-600 font-semibold">{t('outOfStock')}</span>
              )}
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-2">{t('description')}</h3>
              <p className="text-gray-600 leading-relaxed">{description}</p>
            </div>

            {product.stock > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="font-semibold">{t('quantity')}:</label>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="px-6 py-2 border-x border-gray-300">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-4 py-2 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors text-lg"
                >
                  {t('addToCart')}
                </button>

                <button className="w-full border border-primary-500 text-primary-500 hover:bg-primary-50 py-3 px-6 rounded-lg font-semibold transition-colors">
                  {t('addToWishlist')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
