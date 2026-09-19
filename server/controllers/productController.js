import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

// @desc    Fetch all products with filters, search and sorting
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const {
    keyword,
    category,
    minPrice,
    maxPrice,
    sortBy,
    featured,
    bestSeller,
    isNewArrival,
    limit = 50,
  } = req.query;

  const query = {};

  // Search keyword (name or description)
  if (keyword) {
    query.$or = [
      { name: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } },
      { shortDescription: { $regex: keyword, $options: 'i' } },
    ];
  }

  // Category filter
  if (category && category !== 'all') {
    // Check if category is ID or slug
    if (category.match(/^[0-9a-fA-F]{24}$/)) {
      query.category = category;
    } else {
      const foundCategory = await Category.findOne({ slug: category });
      if (foundCategory) {
        query.category = foundCategory._id;
      }
    }
  }

  // Price range
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // Badges
  if (featured === 'true') query.featured = true;
  if (bestSeller === 'true') query.bestSeller = true;
  if (isNewArrival === 'true') query.isNewArrival = true;

  // Sorting
  let sortOption = { createdAt: -1 }; // default newest
  if (sortBy === 'price-asc') sortOption = { price: 1 };
  if (sortBy === 'price-desc') sortOption = { price: -1 };
  if (sortBy === 'rating') sortOption = { rating: -1 };
  if (sortBy === 'popular' || sortBy === 'bestseller') sortOption = { bestSeller: -1, rating: -1 };

  const products = await Product.find(query)
    .populate('category', 'name slug icon')
    .sort(sortOption)
    .limit(Number(limit));

  const total = await Product.countDocuments(query);

  res.json({
    products,
    total,
  });
});

// @desc    Fetch single product by ID or Slug
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let product;

  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    product = await Product.findById(id).populate('category', 'name slug icon');
  } else {
    product = await Product.findOne({ slug: id }).populate('category', 'name slug icon');
  }

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('المنتج غير موجود');
  }
});

// @desc    Get related products by category
// @route   GET /api/products/:id/related
// @access  Public
export const getRelatedProducts = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('المنتج غير موجود');
  }

  const related = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
  })
    .populate('category', 'name slug')
    .limit(4);

  res.json(related);
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    slug,
    description,
    shortDescription,
    category,
    images,
    price,
    oldPrice,
    weights,
    stock,
    featured,
    bestSeller,
    isNewArrival,
    origin,
    benefits,
  } = req.body;

  const generatedSlug = slug || name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u0621-\u064A-]+/g, '');

  const product = new Product({
    name,
    slug: generatedSlug + '-' + Math.floor(1000 + Math.random() * 9000),
    description,
    shortDescription: shortDescription || description.slice(0, 100),
    category,
    images: images && images.length ? images : ['https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?w=800&auto=format&fit=crop&q=80'],
    price: Number(price),
    oldPrice: oldPrice ? Number(oldPrice) : undefined,
    weights: weights && weights.length ? weights : [
      { weight: '250g', price: Number(price), stock: Number(stock) },
      { weight: '500g', price: Math.round(Number(price) * 1.9), stock: Number(stock) },
      { weight: '1kg', price: Math.round(Number(price) * 3.7), stock: Number(stock) },
    ],
    stock: Number(stock) || 50,
    featured: featured || false,
    bestSeller: bestSeller || false,
    isNewArrival: isNewArrival || false,
    origin: origin || 'المغرب',
    benefits: benefits || [],
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = req.body.name ?? product.name;
    product.description = req.body.description ?? product.description;
    product.shortDescription = req.body.shortDescription ?? product.shortDescription;
    product.category = req.body.category ?? product.category;
    product.images = req.body.images ?? product.images;
    product.price = req.body.price !== undefined ? Number(req.body.price) : product.price;
    product.oldPrice = req.body.oldPrice !== undefined ? Number(req.body.oldPrice) : product.oldPrice;
    product.weights = req.body.weights ?? product.weights;
    product.stock = req.body.stock !== undefined ? Number(req.body.stock) : product.stock;
    product.featured = req.body.featured !== undefined ? req.body.featured : product.featured;
    product.bestSeller = req.body.bestSeller !== undefined ? req.body.bestSeller : product.bestSeller;
    product.isNewArrival = req.body.isNewArrival !== undefined ? req.body.isNewArrival : product.isNewArrival;
    product.origin = req.body.origin ?? product.origin;
    product.benefits = req.body.benefits ?? product.benefits;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('المنتج غير موجود');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne();
    res.json({ message: 'تم حذف المنتج بنجاح' });
  } else {
    res.status(404);
    throw new Error('المنتج غير موجود');
  }
});
