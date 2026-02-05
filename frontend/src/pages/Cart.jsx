import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { TrashIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';

const Cart = () => {
  const {
    items,
    summary,
    loading,
    updateQuantity,
    removeFromCart,
    clearCart
  } = useCart();

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    await updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = async (productId) => {
    await removeFromCart(productId);
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      await clearCart();
    }
  };

  if (loading && items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-48 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-4 flex space-x-4">
                  <div className="w-20 h-20 bg-gray-300 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-lg p-4 space-y-4">
              <div className="h-6 bg-gray-300 rounded w-32"></div>
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-4 bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="text-center py-16">
          <div className="bg-gray-100 rounded-lg p-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">Add some products to get started</p>
            <Link to="/shop" className="btn btn-primary px-8 py-3">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <button
          onClick={handleClearCart}
          className="text-red-600 hover:text-red-700 text-sm font-medium"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.product._id} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex space-x-4">
                {/* Product Image */}
                <div className="w-20 h-20 flex-shrink-0">
                  <img
                    src={item.product.images?.[0] || '/placeholder-phone.jpg'}
                    alt={item.product.name}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = '/placeholder-phone.jpg';
                    }}
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/product/${item.product._id}`}
                    className="text-lg font-semibold text-gray-900 hover:text-primary-600 line-clamp-2"
                  >
                    {item.product.name}
                  </Link>

                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-gray-600">{item.product.brand}</span>
                    <span className="text-sm text-gray-600">{item.product.storage}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      item.product.condition === 'new' ? 'bg-green-100 text-green-800' :
                      item.product.condition === 'like-new' ? 'bg-blue-100 text-blue-800' :
                      item.product.condition === 'good' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.product.condition.replace('-', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="p-1 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>

                      <span className="font-medium w-8 text-center">{item.quantity}</span>

                      <button
                        onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="p-1 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className="text-lg font-bold text-primary-600">
                        ₹{item.total.toLocaleString()}
                      </span>

                      <button
                        onClick={() => handleRemoveItem(item.product._id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                <span className="font-medium">₹{summary.subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax (18% GST)</span>
                <span className="font-medium">₹{summary.tax.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {summary.shipping === 0 ? 'Free' : `₹${summary.shipping.toLocaleString()}`}
                </span>
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary-600">₹{summary.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <Link
              to="/checkout"
              className="w-full btn btn-primary py-3 text-center block"
            >
              Proceed to Checkout
            </Link>

            <Link
              to="/shop"
              className="w-full btn btn-secondary py-2 text-center block mt-3"
            >
              Continue Shopping
            </Link>

            {summary.subtotal < 500 && (
              <p className="text-xs text-gray-500 mt-3 text-center">
                Add ₹{(500 - summary.subtotal).toLocaleString()} more for free shipping
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
