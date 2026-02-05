import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ordersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Checkout = () => {
  const { items, summary, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  const validateForm = () => {
    const newErrors = {};

    if (!shippingAddress.name.trim()) newErrors.name = 'Name is required';
    if (!shippingAddress.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!shippingAddress.street.trim()) newErrors.street = 'Street address is required';
    if (!shippingAddress.city.trim()) newErrors.city = 'City is required';
    if (!shippingAddress.state.trim()) newErrors.state = 'State is required';
    if (!shippingAddress.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';

    const phoneRegex = /^[6-9]\d{9}$/;
    if (shippingAddress.phone && !phoneRegex.test(shippingAddress.phone.replace(/\s+/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    const zipRegex = /^[1-9][0-9]{5}$/;
    if (shippingAddress.zipCode && !zipRegex.test(shippingAddress.zipCode)) {
      newErrors.zipCode = 'Please enter a valid 6-digit ZIP code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddressChange = (field, value) => {
    setShippingAddress(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Create order
      const orderData = {
        items: items.map(item => ({
          product: item.product._id,
          quantity: item.quantity
        })),
        shippingAddress,
        paymentMethod,
        notes
      };

      const response = await ordersAPI.createOrder(orderData);
      const order = response.data.data;

      if (paymentMethod === 'razorpay') {
        // Demo payment - simulate payment process
        navigate('/demo-payment', {
          state: {
            order,
            shippingAddress,
            paymentMethod
          }
        });
      } else {
        // COD - directly go to success
        handlePaymentSuccess(null, order);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert(error.response?.data?.message || 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (razorpayResponse, order) => {
    // Clear cart
    clearCart();

    // Redirect to success page
    navigate('/payment-success', {
      state: {
        order,
        paymentResponse: razorpayResponse
      }
    });
  };

  if (items.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Items & Address Form */}
        <div className="space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product._id} className="flex items-center space-x-4">
                  <img
                    src={item.product.images?.[0] || '/placeholder-phone.jpg'}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-semibold text-primary-600">
                    ₹{item.total.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={shippingAddress.name}
                  onChange={(e) => handleAddressChange('name', e.target.value)}
                  className={`input ${errors.name ? 'border-red-500' : ''}`}
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={shippingAddress.phone}
                  onChange={(e) => handleAddressChange('phone', e.target.value)}
                  className={`input ${errors.phone ? 'border-red-500' : ''}`}
                  placeholder="Enter your phone number"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  value={shippingAddress.street}
                  onChange={(e) => handleAddressChange('street', e.target.value)}
                  className={`input ${errors.street ? 'border-red-500' : ''}`}
                  placeholder="Street address, apartment, etc."
                />
                {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  value={shippingAddress.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  className={`input ${errors.city ? 'border-red-500' : ''}`}
                  placeholder="City"
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  value={shippingAddress.state}
                  onChange={(e) => handleAddressChange('state', e.target.value)}
                  className={`input ${errors.state ? 'border-red-500' : ''}`}
                  placeholder="State"
                />
                {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  value={shippingAddress.zipCode}
                  onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                  className={`input ${errors.zipCode ? 'border-red-500' : ''}`}
                  placeholder="ZIP code"
                />
                {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
              </div>
            </div>
          </div>

          {/* Order Notes */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Notes (Optional)</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input"
              rows="3"
              placeholder="Any special instructions for delivery..."
            />
          </div>
        </div>

        {/* Order Summary & Payment */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
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

            {/* Payment Method */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Method</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="payment"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700">
                    Razorpay (Credit/Debit Card, UPI, Net Banking)
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700">
                    Cash on Delivery
                  </span>
                </label>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full btn btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : `Pay ₹${summary.total.toLocaleString()}`}
            </button>

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

export default Checkout;
