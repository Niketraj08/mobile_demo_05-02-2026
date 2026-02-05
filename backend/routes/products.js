const express = require('express');
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const Category = require('../models/Category');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products with filtering and pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build filter object
    let filter = { isActive: true, isApproved: true };

    // Search functionality
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    // Category filter
    if (req.query.category) {
      filter.category = req.query.category;
    }

    // Brand filter
    if (req.query.brand) {
      filter.brand = req.query.brand;
    }

    // Condition filter
    if (req.query.condition) {
      filter.condition = req.query.condition;
    }

    // Storage filter
    if (req.query.storage) {
      filter.storage = req.query.storage;
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) {
        filter.price.$gte = parseInt(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        filter.price.$lte = parseInt(req.query.maxPrice);
      }
    }

    // Sort options
    let sort = {};
    switch (req.query.sort) {
      case 'price_asc':
        sort = { price: 1 };
        break;
      case 'price_desc':
        sort = { price: -1 };
        break;
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'rating':
        sort = { rating: -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    const products = await Product.find(filter)
      .populate('category', 'name')
      .populate('seller', 'name')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('-__v');

    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name description')
      .populate('seller', 'name phone');

    if (!product || !product.isActive || !product.isApproved) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/products
// @desc    Create new product (Admin only)
// @access  Private/Admin
router.post('/', protect, authorize('admin'), [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('brand').trim().notEmpty().withMessage('Brand is required'),
  body('model').trim().notEmpty().withMessage('Model is required'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be 10-1000 characters'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('category').isMongoId().withMessage('Valid category ID is required'),
  body('condition').isIn(['new', 'like-new', 'good', 'fair', 'poor']).withMessage('Invalid condition'),
  body('storage').isIn(['32GB', '64GB', '128GB', '256GB', '512GB', '1TB']).withMessage('Invalid storage capacity'),
  body('color').trim().notEmpty().withMessage('Color is required'),
  body('images').isArray({ min: 1 }).withMessage('At least one image is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const product = await Product.create({
      ...req.body,
      isApproved: true // Admin products are auto-approved
    });

    await product.populate('category', 'name');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/products/sell
// @desc    User sells their phone (requires admin approval)
// @access  Private
router.post('/sell', protect, [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('brand').trim().notEmpty().withMessage('Brand is required'),
  body('model').trim().notEmpty().withMessage('Model is required'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be 10-1000 characters'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('category').isMongoId().withMessage('Valid category ID is required'),
  body('condition').isIn(['new', 'like-new', 'good', 'fair', 'poor']).withMessage('Invalid condition'),
  body('storage').isIn(['32GB', '64GB', '128GB', '256GB', '512GB', '1TB']).withMessage('Invalid storage capacity'),
  body('color').trim().notEmpty().withMessage('Color is required'),
  body('images').isArray({ min: 1 }).withMessage('At least one image is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const product = await Product.create({
      ...req.body,
      seller: req.user._id,
      isApproved: false // Requires admin approval
    });

    await product.populate('category', 'name');
    await product.populate('seller', 'name');

    res.status(201).json({
      success: true,
      message: 'Phone listed successfully. Waiting for admin approval.',
      data: product
    });
  } catch (error) {
    console.error('Sell phone error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private/Admin or Seller
router.put('/:id', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user is admin or the seller
    if (req.user.role !== 'admin' && product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product'
      });
    }

    // If user is not admin, they can only update unapproved products
    if (req.user.role !== 'admin' && product.isApproved) {
      return res.status(403).json({
        success: false,
        message: 'Cannot update approved products'
      });
    }

    const allowedFields = req.user.role === 'admin'
      ? ['name', 'brand', 'model', 'description', 'price', 'originalPrice', 'category', 'condition', 'storage', 'color', 'images', 'specifications', 'issues', 'warranty', 'isActive', 'isFeatured', 'stock']
      : ['name', 'description', 'price', 'images', 'specifications', 'issues'];

    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('category', 'name').populate('seller', 'name');

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Private/Admin or Seller
router.delete('/:id', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user is admin or the seller
    if (req.user.role !== 'admin' && product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this product'
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/products/categories/all
// @desc    Get all categories
// @access  Public
router.get('/categories/all', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ sortOrder: 1, name: 1 })
      .select('name description image productCount');

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/products/brands/all
// @desc    Get all unique brands
// @access  Public
router.get('/brands/all', async (req, res) => {
  try {
    const brands = await Product.distinct('brand', {
      isActive: true,
      isApproved: true
    });

    res.json({
      success: true,
      data: brands.sort()
    });
  } catch (error) {
    console.error('Get brands error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
