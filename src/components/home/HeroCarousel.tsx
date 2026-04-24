import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types';

interface HeroCarouselProps {
  products: Product[];
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || products.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, products.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? products.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  };

  const goToNext = () => {
    const newIndex = (currentIndex + 1) % products.length;
    goToSlide(newIndex);
  };

  if (products.length === 0) {
    return null;
  }

  const currentProduct = products[currentIndex];
  const productImage = currentProduct.images?.[0]?.image_url || '/placeholder-product.jpg';
  const discountedPrice = currentProduct.discount > 0 
    ? currentProduct.price * (1 - currentProduct.discount / 100) 
    : null;

  return (
    <div className="relative h-full flex items-center justify-center">
      {/* Product Display */}
      <div className="relative w-full max-w-md">
        <Link
          to={`/product/${currentProduct.id}`}
          className="block group"
        >
          {/* Product Image with Zoom Effect */}
          <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl bg-white">
            <img
              src={productImage}
              alt={currentProduct.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Featured Badge */}
            {currentProduct.is_featured && (
              <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-bounce">
                ⭐ مميز
              </div>
            )}

            {/* Discount Badge */}
            {currentProduct.discount > 0 && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                🔥 خصم {currentProduct.discount}%
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="mt-6 text-center">
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-primary-100 transition-colors">
              {currentProduct.name}
            </h3>
            <p className="text-white/80 mb-4 line-clamp-2">
              {currentProduct.description}
            </p>
            <div className="flex items-center justify-center gap-3">
              {discountedPrice ? (
                <>
                  <span className="text-3xl font-bold text-yellow-300">
                    {Math.round(discountedPrice).toLocaleString()} د.ع
                  </span>
                  <span className="text-xl text-white/60 line-through">
                    {currentProduct.price.toLocaleString()} د.ع
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-white">
                  {currentProduct.price.toLocaleString()} د.ع
                </span>
              )}
            </div>
            
            {/* View Details Button */}
            <div className="mt-6">
              <span className="inline-flex items-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors shadow-lg">
                <span>عرض التفاصيل</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </span>
            </div>
          </div>
        </Link>

        {/* Navigation Arrows */}
        <button
          onClick={(e) => {
            e.preventDefault();
            goToPrevious();
          }}
          className="absolute left-0 top-1/3 -translate-y-1/2 -translate-x-4 bg-white/90 hover:bg-white text-primary-600 w-12 h-12 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 z-10"
          aria-label="Previous product"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={(e) => {
            e.preventDefault();
            goToNext();
          }}
          className="absolute right-0 top-1/3 -translate-y-1/2 translate-x-4 bg-white/90 hover:bg-white text-primary-600 w-12 h-12 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 z-10"
          aria-label="Next product"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Dots Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? 'bg-white w-8 h-3'
                : 'bg-white/50 hover:bg-white/75 w-3 h-3'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Product Counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold">
        {currentIndex + 1} / {products.length}
      </div>
    </div>
  );
};

export default HeroCarousel;
