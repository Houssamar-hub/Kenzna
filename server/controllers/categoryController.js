import asyncHandler from 'express-async-handler';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

// @desc    Get all categories with product counts
// @route   GET /api/categories
// @access  Public
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({}).sort({ createdAt: 1 });

  // Update real-time counts
  const categoriesWithCounts = await Promise.all(
    categories.map(async (cat) => {
      const count = await Product.countDocuments({ category: cat._id });
      return {
        ...cat.toObject(),
        itemCount: count,
      };
    })
  );

  res.json(categoriesWithCounts);
});

// @desc    Get category by slug
// @route   GET /api/categories/:slug
// @access  Public
export const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug });

  if (category) {
    const count = await Product.countDocuments({ category: category._id });
    res.json({
      ...category.toObject(),
      itemCount: count,
    });
  } else {
    res.status(404);
    throw new Error('التصنيف غير موجود');
  }
});

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = asyncHandler(async (req, res) => {
  const { name, slug, description, image, icon } = req.body;

  const generatedSlug = slug || name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u0621-\u064A-]+/g, '');

  const categoryExists = await Category.findOne({
    $or: [{ name }, { slug: generatedSlug }],
  });

  if (categoryExists) {
    res.status(400);
    throw new Error('هذا التصنيف موجود بالفعل');
  }

  const category = await Category.create({
    name,
    slug: generatedSlug,
    description,
    image: image || 'https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?w=800&auto=format&fit=crop&q=80',
    icon: icon || 'Nut',
  });

  res.status(201).json(category);
});

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    category.name = req.body.name ?? category.name;
    category.slug = req.body.slug ?? category.slug;
    category.description = req.body.description ?? category.description;
    category.image = req.body.image ?? category.image;
    category.icon = req.body.icon ?? category.icon;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } else {
    res.status(404);
    throw new Error('التصنيف غير موجود');
  }
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    const productsInCat = await Product.countDocuments({ category: category._id });
    if (productsInCat > 0) {
      res.status(400);
      throw new Error(`لا يمكن حذف التصنيف لأنه يحتوي على ${productsInCat} منتج`);
    }

    await category.deleteOne();
    res.json({ message: 'تم حذف التصنيف بنجاح' });
  } else {
    res.status(404);
    throw new Error('التصنيف غير موجود');
  }
});
