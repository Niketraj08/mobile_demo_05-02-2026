import { Link } from 'react-router-dom';
import { HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { userAPI } from '../services/api';
import { useState, useEffect } from 'react';

const ProductCard = ({ product }) => {
  const { isAuthenticated } = useAuth();
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);

  // Check if product is in cart
  const quantityInCart = getItemQuantity(product._id);
  const productInCart = isInCart(product._id);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      // Could redirect to login here
      return;
    }

    setWishlistLoading(true);
    try {
      if (isInWishlist) {
        await userAPI.removeFromWishlist(product._id);
        setIsInWishlist(false);
      } else {
        await userAPI.addToWishlist(product._id);
        setIsInWishlist(true);
      }
    } catch (error) {
      console.error('Wishlist toggle error:', error);
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      // Could redirect to login here
      return;
    }

    setCartLoading(true);
    try {
      await addToCart(product._id, 1);
    } catch (error) {
      console.error('Add to cart error:', error);
    } finally {
      setCartLoading(false);
    }
  };

  const getConditionBadgeColor = (condition) => {
    switch (condition) {
      case 'new':
        return 'bg-green-100 text-green-800';
      case 'like-new':
        return 'bg-blue-100 text-blue-800';
      case 'good':
        return 'bg-yellow-100 text-yellow-800';
      case 'fair':
        return 'bg-orange-100 text-orange-800';
      case 'poor':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Link
      to={`/product/${product._id}`}
      className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative">
        {/* Product Image */}
        <div className="aspect-w-1 aspect-h-1 bg-gray-200">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.src = '/placeholder-phone.jpg';
              }}
            />
          ) : (
            <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
        </div>

        {/* Wishlist Button */}
        {isAuthenticated && (
          <button
            onClick={handleWishlistToggle}
            disabled={wishlistLoading}
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {isInWishlist ? (
              <HeartIconSolid className="h-5 w-5 text-red-500" />
            ) : (
              <HeartIcon className="h-5 w-5 text-gray-400 hover:text-red-500" />
            )}
          </button>
        )}

        {/* Condition Badge */}
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-1 text-xs font-medium rounded ${getConditionBadgeColor(product.condition)}`}>
            {product.condition.replace('-', ' ')}
          </span>
        </div>

        {/* Discount Badge */}
        {product.discountPercentage > 0 && (
          <div className="absolute bottom-2 left-2">
            <span className="bg-red-500 text-white px-2 py-1 text-xs font-medium rounded">
              {product.discountPercentage}% OFF
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">{product.brand}</span>
          <span className="text-sm text-gray-600">{product.storage}</span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary-600">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <span className="flex items-center">
              ⭐ {product.rating || 0}
            </span>
            <span className="ml-1">({product.reviewCount || 0})</span>
          </div>
        </div>

        {/* Add to Cart Button */}
        {isAuthenticated && (
          <button
            onClick={handleAddToCart}
            disabled={cartLoading || product.stock === 0}
            className={`w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-medium transition-colors ${
              productInCart
                ? 'bg-green-600 text-white hover:bg-green-700'
                : product.stock === 0
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-primary-600 text-white hover:bg-primary-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <ShoppingCartIcon className="h-4 w-4" />
            <span>
              {product.stock === 0
                ? 'Out of Stock'
                : productInCart
                ? `In Cart (${quantityInCart})`
                : 'Add to Cart'
              }
            </span>
          </button>
        )}

        {/* Seller Badge for User Listings */}
        {product.seller && (
          <div className="mt-2">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              Seller: {product.seller.name}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
