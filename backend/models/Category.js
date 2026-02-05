const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true,
    maxlength: [50, 'Category name cannot exceed 50 characters']
  },
  description: {
    type: String,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  image: {
    type: String,
    default: ''
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  productCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for better query performance
categorySchema.index({ parent: 1 });
categorySchema.index({ isActive: 1 });

// Update product count when products are added/removed
categorySchema.methods.updateProductCount = async function() {
  const Product = mongoose.model('Product');
  this.productCount = await Product.countDocuments({
    category: this._id,
    isActive: true,
    isApproved: true
  });
  await this.save();
};

module.exports = mongoose.model('Category', categorySchema);
