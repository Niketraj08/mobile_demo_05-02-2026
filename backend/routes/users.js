const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Product = require('../models/Product');
const { protect, ownerOrAdmin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/wishlist
// @desc    Get user's wishlist
// @access  Private
router.get('/wishlist', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'wishlist',
      match: { isActive: true, isApproved: true },
      select: 'name price originalPrice images brand model condition storage rating reviewCount'
    });

    res.json({
      success: true,
      data: user.wishlist
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/users/wishlist/:productId
// @desc    Add product to wishlist
// @access  Private
router.post('/wishlist/:productId', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product || !product.isActive || !product.isApproved) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const user = await User.findById(req.user._id);

    // Check if product is already in wishlist
    if (user.wishlist.includes(req.params.productId)) {
      return res.status(400).json({
        success: false,
        message: 'Product already in wishlist'
      });
    }

    user.wishlist.push(req.params.productId);
    await user.save();

    res.json({
      success: true,
      message: 'Product added to wishlist'
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/users/wishlist/:productId
// @desc    Remove product from wishlist
// @access  Private
router.delete('/wishlist/:productId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.wishlist = user.wishlist.filter(
      id => id.toString() !== req.params.productId
    );

    await user.save();

    res.json({
      success: true,
      message: 'Product removed from wishlist'
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/users/cart
// @desc    Get user's cart
// @access  Private
router.get('/cart', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'cart.product',
      match: { isActive: true, isApproved: true },
      select: 'name price originalPrice images brand model condition storage'
    });

    // Filter out products that don't exist anymore
    user.cart = user.cart.filter(item => item.product !== null);

    // Calculate totals
    const cartItems = user.cart.map(item => ({
      product: item.product,
      quantity: item.quantity,
      total: item.product ? item.product.price * item.quantity : 0
    }));

    const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
    const tax = Math.round(subtotal * 0.18); // 18% GST
    const shipping = subtotal > 500 ? 0 : 50; // Free shipping over ₹500
    const total = subtotal + tax + shipping;

    res.json({
      success: true,
      data: {
        items: cartItems,
        summary: {
          subtotal,
          tax,
          shipping,
          total
        }
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/users/cart/:productId
// @desc    Add product to cart
// @access  Private
router.post('/cart/:productId', protect, [
  body('quantity').optional().isInt({ min: 1, max: 10 }).withMessage('Quantity must be 1-10')
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

    const product = await Product.findById(req.params.productId);

    if (!product || !product.isActive || !product.isApproved) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.stock < 1) {
      return res.status(400).json({
        success: false,
        message: 'Product out of stock'
      });
    }

    const user = await User.findById(req.user._id);
    const quantity = req.body.quantity || 1;

    // Check if product is already in cart
    const existingItem = user.cart.find(
      item => item.product.toString() === req.params.productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      if (existingItem.quantity > product.stock) {
        existingItem.quantity = product.stock;
      }
    } else {
      user.cart.push({
        product: req.params.productId,
        quantity: quantity
      });
    }

    await user.save();

    res.json({
      success: true,
      message: 'Product added to cart'
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/users/cart/:productId
// @desc    Update cart item quantity
// @access  Private
router.put('/cart/:productId', protect, [
  body('quantity').isInt({ min: 0, max: 10 }).withMessage('Quantity must be 0-10')
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

    const user = await User.findById(req.user._id);
    const { quantity } = req.body;

    const cartItem = user.cart.find(
      item => item.product.toString() === req.params.productId
    );

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in cart'
      });
    }

    if (quantity === 0) {
      // Remove item from cart
      user.cart = user.cart.filter(
        item => item.product.toString() !== req.params.productId
      );
    } else {
      cartItem.quantity = quantity;
    }

    await user.save();

    res.json({
      success: true,
      message: quantity === 0 ? 'Product removed from cart' : 'Cart updated'
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/users/cart
// @desc    Clear cart
// @access  Private
router.delete('/cart', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = [];
    await user.save();

    res.json({
      success: true,
      message: 'Cart cleared'
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/users/profile
// @desc    Get user profile (alias for /api/auth/me)
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/users/my-products
// @desc    Get user's listed products (for sellers)
// @access  Private
router.get('/my-products', protect, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id })
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .select('name brand model price images isApproved isActive condition storage createdAt');

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Get my products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
