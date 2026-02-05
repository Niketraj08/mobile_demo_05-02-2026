const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true
  },
  model: {
    type: String,
    required: [true, 'Model is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    default: 0
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  condition: {
    type: String,
    enum: ['new', 'like-new', 'good', 'fair', 'poor'],
    required: [true, 'Condition is required']
  },
  storage: {
    type: String,
    required: [true, 'Storage capacity is required'],
    enum: ['32GB', '64GB', '128GB', '256GB', '512GB', '1TB']
  },
  color: {
    type: String,
    required: [true, 'Color is required']
  },
  images: [{
    type: String,
    required: [true, 'At least one image is required']
  }],
  specifications: {
    display: String,
    processor: String,
    ram: String,
    battery: String,
    camera: String,
    os: String,
    network: String
  },
  issues: [{
    type: String,
    trim: true
  }],
  warranty: {
    type: String,
    default: 'No warranty'
  },
  // For user-listed phones
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isApproved: {
    type: Boolean,
    default: false // Admin approval required for user-listed phones
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  stock: {
    type: Number,
    default: 1,
    min: [0, 'Stock cannot be negative']
  },
  soldCount: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ brand: 1 });
productSchema.index({ category: 1 });
productSchema.index({ condition: 1 });
productSchema.index({ price: 1 });
productSchema.index({ storage: 1 });
productSchema.index({ isApproved: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ seller: 1 });

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Ensure virtual fields are serialized
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
