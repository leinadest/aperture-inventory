const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const Category = require('../models/category');
const Item = require('../models/item');
const ItemInstance = require('../models/itemInstance');

exports.categoryList = asyncHandler(async (req, res) => {
  const categories = await Category.find({}).exec();
  res.render('categoryList', { title: 'Category List', categories });
});

exports.categoryDetail = asyncHandler(async (req, res, next) => {
  const [category, categoryItems] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }, { name: 1 }).exec(),
  ]);

  if (!category) {
    const err = new Error('Category is not found.');
    err.status = 404;
    return next(err);
  }

  res.render('categoryDetail', {
    title: category.name,
    category,
    categoryItems,
  });
});

exports.categoryCreateGet = asyncHandler(async (req, res) => {
  res.render('categoryForm', { title: 'Create category' });
});

exports.categoryCreatePost = [
  // Sanitize and validate request data
  body('name', 'Name must not be empty.').trim().notEmpty().escape(),
  body('name', 'Name must be under 100 characters.')
    .trim()
    .isLength({ max: 100 })
    .escape(),
  body('description', 'Description must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Handle route
  asyncHandler(async (req, res) => {
    // Determine errors
    const errorMsgs = validationResult(req)
      .array()
      .map((error) => error.msg);
    const nameIsTaken =
      (await Category.findOne({ name: req.body.name })) !== null;
    if (nameIsTaken) errorMsgs.push('Name must be original.');

    // Create sanitized category
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    });

    // Handle errors
    if (errorMsgs.length) {
      res.render('categoryForm', {
        title: 'Create category',
        category,
        errorMsgs,
      });
      return;
    }

    // Save category
    await category.save();
    res.redirect(category.url);
  }),
];

exports.categoryDeleteGet = asyncHandler(async (req, res, next) => {
  const [category, allCategoryItems] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }).sort('asc').exec(),
  ]);

  if (!category) {
    const err = new Error('Category not found');
    err.status = 404;
    return next(err);
  }

  res.render('categoryDelete', {
    title: category.name,
    category,
    allCategoryItems,
  });
});

exports.categoryDeletePost = asyncHandler(async (req, res) => {
  const allCategoryItems = await Item.find({ category: req.params.id }, 'name')
    .sort('asc')
    .exec();
  await Promise.all(
    allCategoryItems.map((categoryItem) =>
      ItemInstance.deleteMany({ item: categoryItem._id })
    )
  );
  await Item.deleteMany({ category: req.params.id });
  await Category.deleteOne({ _id: req.params.id });
  res.redirect('/catalog/categories');
});

exports.categoryUpdateGet = asyncHandler(async (req, res) => {});

exports.categoryUpdatePost = asyncHandler(async (req, res) => {});
