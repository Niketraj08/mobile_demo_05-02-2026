const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold mb-4">MobileHub</h3>
            <p className="text-gray-300 mb-4">
              Your trusted platform for buying and selling mobile phones.
              Find the best deals on new and used smartphones.
            </p>
            <p className="text-gray-300">
              © 2026 MobileHub. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/shop" className="text-gray-300 hover:text-white transition-colors">
                  Shop
                </a>
              </li>
              <li>
                <a href="/sell-phone" className="text-gray-300 hover:text-white transition-colors">
                  Sell Your Phone
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/faq" className="text-gray-300 hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/shipping" className="text-gray-300 hover:text-white transition-colors">
                  Shipping Info
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            Made with ❤️ for mobile enthusiasts
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
