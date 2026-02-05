import { Link } from 'react-router-dom';
import { PhoneIcon, ShieldCheckIcon, TruckIcon, CurrencyRupeeIcon } from '@heroicons/react/24/outline';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Buy & Sell Mobile Phones
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Find the perfect phone or sell your old one with confidence
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/shop" className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                Shop Now
              </Link>
              <Link to="/sell-phone" className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 text-lg font-semibold">
                Sell Your Phone
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose MobileHub?
            </h2>
            <p className="text-lg text-gray-600">
              We make buying and selling phones simple, secure, and reliable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <ShieldCheckIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Secure Transactions
              </h3>
              <p className="text-gray-600">
                All payments are processed securely with industry-standard encryption
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TruckIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Fast Delivery
              </h3>
              <p className="text-gray-600">
                Quick and reliable shipping to get your phone to you as soon as possible
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CurrencyRupeeIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Best Prices
              </h3>
              <p className="text-gray-600">
                Competitive pricing on new and used phones with transparent deals
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of satisfied customers buying and selling phones
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop" className="btn btn-primary px-8 py-3 text-lg">
              Browse Phones
            </Link>
            <Link to="/register" className="btn btn-secondary px-8 py-3 text-lg">
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
