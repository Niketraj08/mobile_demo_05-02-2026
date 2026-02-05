import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  StarIcon,
  HeartIcon,
  ShareIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import {
  StarIcon as StarIconSolid
} from '@heroicons/react/24/solid';

const ProductDetails = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Mock product data for demonstration
  const mockProduct = {
    _id: id,
    name: 'iPhone 15 Pro Max',
    brand: 'Apple',
    model: 'iPhone 15 Pro Max',
    price: 159900,
    originalPrice: 169900,
    images: [
      '/api/placeholder/400/400',
      '/api/placeholder/400/400',
      '/api/placeholder/400/400',
      '/api/placeholder/400/400'
    ],
    rating: 4.8,
    reviewCount: 1247,
    condition: 'new',
    storage: '256GB',
    color: 'Titanium Blue',
    inStock: true,
    warranty: '1 Year Apple Warranty',
    description: 'The iPhone 15 Pro Max features the powerful A17 Pro chip, a titanium design, and an advanced camera system with 5x Telephoto zoom.',
    specifications: {
      display: '6.7-inch Super Retina XDR OLED',
      processor: 'A17 Pro chip with 6-core GPU',
      ram: '8GB',
      storage: '256GB',
      camera: '48MP Main, 12MP Ultra Wide, 12MP Telephoto (5x optical zoom)',
      battery: '4689 mAh, up to 29 hours video playback',
      os: 'iOS 17',
      network: '5G capable',
      dimensions: '159.9 x 76.7 x 8.25 mm',
      weight: '221 grams'
    },
    reviews: [
      {
        id: 1,
        user: {
          name: 'Rahul Sharma',
          avatar: '/api/placeholder/40/40',
          verified: true
        },
        rating: 5,
        date: '2024-01-15',
        title: 'Amazing camera and performance!',
        comment: 'The camera quality is outstanding, especially in low light. The titanium build feels premium and the battery life is excellent. Highly recommended!',
        images: ['/api/placeholder/100/100', '/api/placeholder/100/100'],
        helpful: 24,
        verified: true
      },
      {
        id: 2,
        user: {
          name: 'Priya Patel',
          avatar: '/api/placeholder/40/40',
          verified: true
        },
        rating: 4,
        date: '2024-01-12',
        title: 'Great phone but expensive',
        comment: 'Excellent build quality and camera. The Action Button is a nice addition. Only complaint is the price, but you get what you pay for.',
        images: [],
        helpful: 18,
        verified: true
      },
      {
        id: 3,
        user: {
          name: 'Amit Kumar',
          avatar: '/api/placeholder/40/40',
          verified: false
        },
        rating: 5,
        date: '2024-01-10',
        title: 'Best iPhone yet!',
        comment: 'Upgraded from iPhone 14 Pro and the difference is noticeable. The Dynamic Island works great and the camera improvements are significant.',
        images: ['/api/placeholder/100/100'],
        helpful: 15,
        verified: true
      }
    ],
    ratingBreakdown: {
      5: 892,
      4: 245,
      3: 78,
      2: 22,
      1: 10
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // For demo purposes, use mock data
        // const response = await productsAPI.getProduct(id);
        // setProduct(response.data.data);
        setProduct(mockProduct);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      // Redirect to login
      return;
    }

    try {
      await addToCart(product._id, quantity);
      alert('Added to cart successfully!');
    } catch (error) {
      alert('Failed to add to cart');
    }
  };

  const renderStars = (rating, size = 'w-5 h-5') => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIconSolid
            key={star}
            className={`${size} ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const renderRatingBars = () => {
    const total = Object.values(product.ratingBreakdown).reduce((a, b) => a + b, 0);

    return [5, 4, 3, 2, 1].map((stars) => {
      const count = product.ratingBreakdown[stars] || 0;
      const percentage = total > 0 ? (count / total) * 100 : 0;

      return (
        <div key={stars} className="flex items-center space-x-3 text-sm">
          <span className="flex items-center space-x-1 w-8">
            <span>{stars}</span>
            <StarIconSolid className="w-3 h-3 text-yellow-400" />
          </span>
          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <span className="text-gray-600 dark:text-gray-400 w-8 text-right">
            {count}
          </span>
        </div>
      );
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="bg-gray-300 dark:bg-gray-700 h-96 rounded-lg"></div>
              <div className="flex space-x-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-gray-300 dark:bg-gray-700 h-20 w-20 rounded-lg"></div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-300 dark:bg-gray-700 h-8 rounded w-3/4"></div>
              <div className="bg-gray-300 dark:bg-gray-700 h-6 rounded w-1/2"></div>
              <div className="bg-gray-300 dark:bg-gray-700 h-4 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || 'The product you are looking for does not exist.'}
          </p>
          <Link to="/shop" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
        <Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-primary-600 dark:hover:text-primary-400">Shop</Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            <img
              src={product.images[selectedImage] || '/placeholder-phone.jpg'}
              alt={product.name}
              className="w-full h-96 lg:h-[500px] object-contain"
            />

            {/* Image Navigation */}
            <button
              onClick={() => setSelectedImage(prev =>
                prev > 0 ? prev - 1 : product.images.length - 1
              )}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-700 rounded-full p-2 shadow-md hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setSelectedImage(prev =>
                prev < product.images.length - 1 ? prev + 1 : 0
              )}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-700 rounded-full p-2 shadow-md hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Thumbnail Images */}
          <div className="flex space-x-2 overflow-x-auto">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                  selectedImage === index
                    ? 'border-primary-500'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <img
                  src={image || '/placeholder-phone.jpg'}
                  alt={`View ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {product.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {product.brand} • {product.storage} • {product.color}
            </p>

            {/* Rating */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-2">
                {renderStars(Math.floor(product.rating))}
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {product.rating}
                </span>
              </div>
              <span className="text-gray-600 dark:text-gray-400">
                ({product.reviewCount.toLocaleString()} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xl text-gray-500 dark:text-gray-400 line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
              {product.originalPrice > product.price && (
                <span className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded text-sm font-medium">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2 mb-6">
              {product.inStock ? (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    In Stock
                  </span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-red-600 dark:text-red-400 font-medium">
                    Out of Stock
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="text-gray-700 dark:text-gray-300 font-medium">
                Quantity:
              </label>
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                <button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  -
                </button>
                <span className="px-4 py-2 text-center min-w-[3rem] text-gray-900 dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add to Cart
              </button>
              <button className="flex-1 btn bg-gray-900 dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600">
                Buy Now
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                isWishlisted
                  ? 'border-red-300 bg-red-50 text-red-600 dark:border-red-600 dark:bg-red-900/20 dark:text-red-400'
                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <HeartIcon className="w-5 h-5" />
              <span>{isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              <ShareIcon className="w-5 h-5" />
              <span>Share</span>
            </button>
          </div>

          {/* Key Features */}
          <div className="space-y-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <TruckIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-gray-700 dark:text-gray-300">
                Free delivery on orders above ₹500
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <ShieldCheckIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-gray-700 dark:text-gray-300">
                {product.warranty}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <ArrowPathIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="text-gray-700 dark:text-gray-300">
                7-day return policy
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <nav className="flex space-x-8">
            {['description', 'specifications', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'description' && (
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              {product.description}
            </p>
          </div>
        )}

        {activeTab === 'specifications' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                <span className="font-medium text-gray-900 dark:text-white capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                </span>
                <span className="text-gray-700 dark:text-gray-300">
                  {value}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-8">
            {/* Rating Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
                  {product.rating}
                </div>
                <div className="flex justify-center mb-2">
                  {renderStars(Math.floor(product.rating), 'w-6 h-6')}
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Based on {product.reviewCount.toLocaleString()} reviews
                </p>
              </div>

              <div className="space-y-3">
                {renderRatingBars()}
              </div>
            </div>

            {/* Individual Reviews */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Customer Reviews
              </h3>

              {product.reviews.map((review) => (
                <div key={review.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {review.user.avatar ? (
                        <img
                          src={review.user.avatar}
                          alt={review.user.name}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                          <UserIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {review.user.name}
                          </span>
                          {review.verified && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(review.date).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 mb-3">
                        {renderStars(review.rating, 'w-4 h-4')}
                        {review.title && (
                          <span className="font-medium text-gray-900 dark:text-white">
                            {review.title}
                          </span>
                        )}
                      </div>

                      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                        {review.comment}
                      </p>

                      {review.images && review.images.length > 0 && (
                        <div className="flex space-x-2 mb-4">
                          {review.images.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Review image ${index + 1}`}
                              className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                            />
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <button className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                          👍 Helpful ({review.helpful})
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="text-center pt-6 border-t border-gray-200 dark:border-gray-700">
                <button className="btn btn-secondary">
                  Load More Reviews
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
