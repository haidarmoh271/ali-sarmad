import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import type { Product } from '../../types';
import { formatIQD } from '../../lib/formatIQD';

const SearchBar: React.FC = () => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchProducts = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        setShowResults(false);
        return;
      }

      setLoading(true);
      setShowResults(true);

      try {
        const allProducts = await productService.getAll();
        
        const filtered = allProducts
          .filter(product => 
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            (product.description?.toLowerCase().includes(query.toLowerCase()))
          )
          .sort((a, b) => {
            if (a.stock > 0 && b.stock === 0) return -1;
            if (a.stock === 0 && b.stock > 0) return 1;
            
            const aStartsWith = a.name.toLowerCase().startsWith(query.toLowerCase());
            const bStartsWith = b.name.toLowerCase().startsWith(query.toLowerCase());
            if (aStartsWith && !bStartsWith) return -1;
            if (!aStartsWith && bStartsWith) return 1;
            
            return 0;
          })
          .slice(0, 8);

        setResults(filtered);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      searchProducts();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleResultClick = () => {
    setShowResults(false);
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim().length >= 2) {
      window.location.href = `/shop?search=${encodeURIComponent(query)}`;
      setShowResults(false);
    } else if (e.key === 'Escape') {
      setShowResults(false);
    }
  };

  const calculateFinalPrice = (product: Product) => {
    if (product.discount > 0) {
      return product.price - (product.price * product.discount) / 100;
    }
    return product.price;
  };

  return (
    <div ref={searchRef} className="relative flex-1 max-w-2xl">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setShowResults(true)}
          onKeyDown={handleKeyDown}
          placeholder={t('search')}
          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg className="animate-spin h-5 w-5 text-primary-500" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-2xl max-h-[500px] overflow-y-auto z-50 animate-fadeIn">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-2"></div>
              جاري البحث...
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="p-3 bg-gray-50 border-b border-gray-200 sticky top-0">
                <p className="text-sm text-gray-600">
                  🔍 تم العثور على <span className="font-bold text-primary-600">{results.length}</span> نتيجة
                </p>
              </div>
              <div className="divide-y divide-gray-100">
                {results.map((product) => {
                  const finalPrice = calculateFinalPrice(product);
                  
                  return (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      onClick={handleResultClick}
                      className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors group"
                    >
                      {/* Product Image */}
                      <div className="relative flex-shrink-0">
                        <img
                          src={product.images?.[0]?.image_url || 'https://via.placeholder.com/80'}
                          alt={product.name}
                          className="w-20 h-20 object-cover rounded-lg border border-gray-200 group-hover:border-primary-500 transition-colors"
                        />
                        {product.discount > 0 && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                            -{product.discount}%
                          </span>
                        )}
                        {product.stock === 0 && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xs font-bold">نفذت الكمية</span>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 group-hover:text-primary-600 transition-colors line-clamp-1 mb-1">
                          {product.name}
                        </h4>
                        {product.description && (
                          <p className="text-sm text-gray-500 line-clamp-1 mb-2">
                            {product.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-primary-600">
                            {formatIQD(finalPrice)}
                          </span>
                          {product.discount > 0 && (
                            <span className="text-sm text-gray-400 line-through">
                              {formatIQD(product.price)}
                            </span>
                          )}
                          {product.stock > 0 && product.stock < 10 && (
                            <span className="text-xs text-orange-600 font-semibold">
                              ⚠️ {product.stock} متبقي فقط
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Arrow Icon */}
                      <svg
                        className="w-5 h-5 text-gray-400 group-hover:text-primary-500 transition-colors flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </Link>
                  );
                })}
              </div>
              
              {results.length >= 8 && (
                <Link
                  to={`/shop?search=${encodeURIComponent(query)}`}
                  onClick={handleResultClick}
                  className="block p-4 text-center bg-gray-50 hover:bg-gray-100 text-primary-600 font-semibold transition-colors border-t border-gray-200"
                >
                  عرض جميع النتائج 🔍
                </Link>
              )}
            </>
          ) : (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-600 font-semibold mb-2">
                لا توجد نتائج لـ "{query}"
              </p>
              <p className="text-sm text-gray-500">
                جرب كلمات أخرى أو تصفح الفئات
              </p>
              <Link
                to="/shop"
                onClick={handleResultClick}
                className="inline-block mt-4 px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                تصفح المتجر
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
