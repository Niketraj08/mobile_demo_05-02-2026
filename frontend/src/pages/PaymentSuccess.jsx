import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

const PaymentSuccess = () => {
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [paymentResponse, setPaymentResponse] = useState(null);

  useEffect(() => {
    // Get order and payment data from navigation state
    if (location.state) {
      setOrder(location.state.order);
      setPaymentResponse(location.state.paymentResponse);
    }
  }, [location.state]);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Success Header */}
          <div className="bg-green-50 px-6 py-8 text-center">
            <CheckCircleIcon className="mx-auto h-16 w-16 text-green-600 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-lg text-gray-600">
              Your order has been placed successfully.
            </p>
          </div>

          {/* Order Details */}
          <div className="px-6 py-8">
            <div className="border-b border-gray-200 pb-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Order ID:</span>
                  <span className="ml-2 text-gray-900">{order.orderId}</span>
                </div>

                <div>
                  <span className="font-medium text-gray-700">Payment Method:</span>
                  <span className="ml-2 text-gray-900 capitalize">{order.paymentMethod}</span>
                </div>

                <div>
                  <span className="font-medium text-gray-700">Order Status:</span>
                  <span className="ml-2">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                      {order.orderStatus}
                    </span>
                  </span>
                </div>

                <div>
                  <span className="font-medium text-gray-700">Total Amount:</span>
                  <span className="ml-2 text-gray-900 font-semibold">₹{order.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <img
                      src={item.image || '/placeholder-phone.jpg'}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₹{item.price.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium text-gray-900">{order.shippingAddress.name}</p>
                <p className="text-gray-600">{order.shippingAddress.street}</p>
                <p className="text-gray-600">
                  {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}
                </p>
                <p className="text-gray-600">{order.shippingAddress.phone}</p>
              </div>
            </div>

            {/* Payment Details */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                  <span className="font-medium text-green-900">Demo Payment Successful</span>
                </div>
                <p className="text-sm text-green-800">
                  This was a demo payment transaction. No real money was processed.
                </p>
                <div className="mt-3 text-xs text-green-700">
                  <p><strong>Payment Method:</strong> {order.paymentMethod === 'razorpay' ? 'Demo Card/UPI/Net Banking' : 'Cash on Delivery'}</p>
                  <p><strong>Transaction ID:</strong> DEMO_{order.orderId}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <Link
                to="/dashboard"
                className="flex-1 btn btn-primary text-center"
              >
                View My Orders
              </Link>
              <Link
                to="/shop"
                className="flex-1 btn btn-secondary text-center"
              >
                Continue Shopping
              </Link>
            </div>

            {/* Order Notes */}
            {order.notes && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Order Notes</h4>
                <p className="text-blue-800">{order.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">What's Next?</h3>
          <ul className="text-blue-800 space-y-1">
            <li>• You will receive an order confirmation email shortly</li>
            <li>• Our team will process your order within 1-2 business days</li>
            <li>• Track your order status in your dashboard</li>
            <li>• Contact us if you have any questions</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
