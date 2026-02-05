import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircleIcon, CreditCardIcon, DevicePhoneMobileIcon as SmartphoneIcon, BuildingLibraryIcon as BuildingIcon } from '@heroicons/react/24/outline';

const DemoPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const { order, shippingAddress, paymentMethod } = location.state || {};

  useEffect(() => {
    if (!order) {
      navigate('/cart');
    }
  }, [order, navigate]);

  if (!order) {
    return null;
  }

  const handlePaymentSuccess = () => {
    setIsProcessing(false);
    navigate('/payment-success', {
      state: {
        order,
        paymentResponse: {
          razorpay_payment_id: `demo_pay_${Date.now()}`,
          razorpay_order_id: `demo_order_${order.orderId}`,
          razorpay_signature: 'demo_signature'
        }
      }
    });
  };

  const handlePayment = () => {
    if (selectedMethod === 'card') {
      // Basic validation for demo
      if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
        alert('Please fill in all card details');
        return;
      }
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      handlePaymentSuccess();
    }, 3000);
  };

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCardIcon,
      description: 'Visa, MasterCard, RuPay'
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: SmartphoneIcon,
      description: 'Paytm, Google Pay, PhonePe'
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: BuildingIcon,
      description: 'All major banks'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Demo Payment</h1>
          <p className="text-gray-600 mt-2">Complete your purchase securely</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-medium">{order.orderId}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Items:</span>
                  <span className="font-medium">{order.items?.length || 0}</span>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount:</span>
                    <span className="text-primary-600">₹{order.totalAmount?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Demo Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">Demo Payment</h4>
                <p className="text-xs text-blue-800">
                  This is a demo payment page. No real transaction will be processed.
                  Use test card details to simulate payment.
                </p>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Choose Payment Method</h2>

              {/* Payment Methods */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      selectedMethod === method.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <method.icon className={`h-6 w-6 mb-2 ${
                      selectedMethod === method.id ? 'text-primary-600' : 'text-gray-400'
                    }`} />
                    <div className="text-sm font-medium text-gray-900">{method.name}</div>
                    <div className="text-xs text-gray-500">{method.description}</div>
                  </button>
                ))}
              </div>

              {/* Payment Details */}
              {selectedMethod === 'card' && (
                <div className="space-y-4">
                  <h3 className="text-md font-semibold text-gray-900">Card Details</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails(prev => ({ ...prev, number: e.target.value }))}
                        className="input"
                        maxLength="19"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails(prev => ({ ...prev, expiry: e.target.value }))}
                        className="input"
                        maxLength="5"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails(prev => ({ ...prev, cvv: e.target.value }))}
                        className="input"
                        maxLength="4"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={cardDetails.name}
                        onChange={(e) => setCardDetails(prev => ({ ...prev, name: e.target.value }))}
                        className="input"
                      />
                    </div>
                  </div>

                  {/* Test Card Info */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-yellow-900 mb-2">Test Card Details</h4>
                    <div className="text-xs text-yellow-800 space-y-1">
                      <p><strong>Card Number:</strong> Any 16-digit number (e.g., 4111111111111111)</p>
                      <p><strong>Expiry:</strong> Any future date (e.g., 12/25)</p>
                      <p><strong>CVV:</strong> Any 3-digit number (e.g., 123)</p>
                      <p><strong>Name:</strong> Any name</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedMethod === 'upi' && (
                <div className="space-y-4">
                  <h3 className="text-md font-semibold text-gray-900">UPI Payment</h3>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-800">
                      UPI payment simulation - payment will be processed instantly.
                    </p>
                  </div>
                </div>
              )}

              {selectedMethod === 'netbanking' && (
                <div className="space-y-4">
                  <h3 className="text-md font-semibold text-gray-900">Net Banking</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      Net banking simulation - payment will be processed instantly.
                    </p>
                  </div>
                </div>
              )}

              {/* Pay Button */}
              <div className="mt-8">
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full btn btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing Payment...
                    </div>
                  ) : (
                    `Pay ₹${order.totalAmount?.toLocaleString()}`
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  By completing this payment, you agree to our terms and conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoPayment;
