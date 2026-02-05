# 📱 MobileHub - Phone E-commerce Platform

A full-stack e-commerce platform for buying and selling mobile phones, built with React, Node.js, Express, and MongoDB.

## 🚀 Features

### 👤 User Features
- **User Registration & Authentication** - Secure JWT-based login system
- **Browse Products** - Advanced search, filtering, and sorting capabilities
- **Product Details** - Comprehensive product information with specifications
- **Shopping Cart** - Add, remove, and manage cart items
- **Wishlist** - Save favorite products for later
- **Checkout Process** - Seamless checkout with Razorpay payment integration
- **Order History** - Track and manage past orders
- **Sell Phones** - List used phones for sale with admin approval
- **User Dashboard** - Manage profile, orders, and listings

### 🔧 Admin Features
- **Dashboard Overview** - Key metrics and analytics
- **Product Approvals** - Review and approve user-listed phones
- **Order Management** - Update order status and track deliveries
- **User Management** - Manage user accounts and permissions
- **Category Management** - Organize products into categories

### 💳 Payment Integration
- **Demo Payment System** - Simulated payment processing
- **Multiple Payment Methods** - Card, UPI, Net Banking, COD (Demo)
- **Payment Simulation** - Mock payment confirmation for testing

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Heroicons** - Beautiful hand-crafted SVG icons
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **Bcrypt** - Password hashing
- **Razorpay** - Payment gateway integration

### DevOps & Tools
- **Vite** - Fast build tool for React
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📁 Project Structure

```
mobile-sell-buy/
├── backend/                 # Node.js/Express API
│   ├── controllers/         # Route controllers
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API endpoints
│   ├── middleware/         # Custom middleware
│   ├── utils/              # Utility functions
│   ├── config/             # Configuration files
│   └── server.js           # Main server file
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── context/        # React context providers
│   │   ├── services/       # API service functions
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   └── index.html          # HTML template
└── README.md               # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mobile-sell-buy
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

   Create a `.env` file in the backend directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/mobilecommerce
   JWT_SECRET=your_jwt_secret_key_here
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   ```

   Start the backend server:
   ```bash
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

   Create a `.env` file in the frontend directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
   ```

   Start the frontend development server:
   ```bash
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173 (or the port shown by Vite)
   - Backend API: http://localhost:5000

## 🔐 Default Credentials

### Admin Account
- Email: admin@mobilehub.com (create via MongoDB or add manually)
- Password: admin123

### Sample User
- Email: user@example.com
- Password: password123

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/update-profile` - Update user profile

### Products
- `GET /api/products` - Get all products with filtering
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `POST /api/products/sell` - List phone for sale (User)
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Cart & Wishlist
- `GET /api/users/cart` - Get user cart
- `POST /api/users/cart/:productId` - Add to cart
- `PUT /api/users/cart/:productId` - Update cart quantity
- `DELETE /api/users/cart` - Clear cart
- `GET /api/users/wishlist` - Get user wishlist
- `POST /api/users/wishlist/:productId` - Add to wishlist
- `DELETE /api/users/wishlist/:productId` - Remove from wishlist

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders/:id/cancel` - Cancel order

### Admin
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/products/pending` - Get pending product approvals
- `POST /api/admin/products/:id/approve` - Approve product
- `POST /api/admin/products/:id/reject` - Reject product
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id/status` - Update order status

## 🎨 UI/UX Features

- **Responsive Design** - Works perfectly on mobile, tablet, and desktop
- **Modern UI** - Clean, professional design with Tailwind CSS
- **Dark/Light Mode Ready** - Foundation for theme switching
- **Loading States** - Smooth loading animations and feedback
- **Error Handling** - User-friendly error messages
- **Accessibility** - ARIA labels and keyboard navigation support

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Bcrypt for secure password storage
- **Input Validation** - Comprehensive validation with express-validator
- **CORS Protection** - Cross-origin resource sharing controls
- **Helmet Security** - Security headers and protections
- **Rate Limiting** - Protection against brute force attacks

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB database (local or cloud)
2. Configure environment variables
3. Build and deploy to hosting service (Heroku, Railway, etc.)
4. Set up reverse proxy if needed

### Frontend Deployment
1. Build the production bundle: `npm run build`
2. Deploy to static hosting (Vercel, Netlify, etc.)
3. Configure API base URL for production

### Environment Variables for Production
```env
# Backend
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_secure_jwt_secret
RAZORPAY_KEY_ID=your_live_razorpay_key
RAZORPAY_KEY_SECRET=your_live_razorpay_secret

# Frontend
VITE_API_URL=https://your-api-domain.com/api
VITE_RAZORPAY_KEY_ID=your_live_razorpay_key
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Product browsing and filtering
- [ ] Add to cart and wishlist
- [ ] Checkout process
- [ ] Payment integration
- [ ] Order management
- [ ] Admin dashboard
- [ ] Product approvals
- [ ] Mobile responsiveness

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Express.js](https://expressjs.com/) - Fast, unopinionated, minimalist web framework
- [MongoDB](https://www.mongodb.com/) - A document database


## 📞 Support

For support, email niketrajkvs@gmail.com or join our comapny main info@astracognixsolutions.in .

---

**Made with ❤️ for Niketraj08 **
