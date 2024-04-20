require('dotenv');
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
  body('description', 'Description must be under 10,000 characters.')
    .trim()
    .isLength({ max: 10000 })
    .escape(),
  body('password', 'Password is incorrect.').equals(
    process.env.INVENTORY_PASSWORD
  ),

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

exports.categoryDeletePost = [
  body('password', 'Password is incorrect.').equals(
    process.env.INVENTORY_PASSWORD
  ),
  asyncHandler(async (req, res) => {
    const [category, allCategoryItems] = await Promise.all([
      Category.findById(req.params.id).exec(),
      Item.find({ category: req.params.id }).sort('asc').exec(),
    ]);
    const errorMsgs = validationResult(req)
      .array()
      .map((err) => err.msg);
    if (errorMsgs.length) {
      res.render('categoryDelete', {
        title: category.name,
        category,
        allCategoryItems,
        errorMsgs,
      });
      return;
    }
    await Promise.all(
      allCategoryItems.map((categoryItem) =>
        ItemInstance.deleteMany({ item: categoryItem._id })
      )
    );
    await Item.deleteMany({ category: req.params.id });
    await Category.deleteOne({ _id: req.params.id });
    res.redirect('/catalog/categories');
  }),
];

exports.categoryUpdateGet = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).exec();

  if (!category) {
    const err = new Error('Category not found');
    err.status = 404;
    return next(err);
  }

  res.render('categoryForm', {
    title: 'Update Category',
    category,
  });
});

exports.categoryUpdatePost = [
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
  body('description', 'Description must be under 10,000 characters.')
    .trim()
    .isLength({ max: 10000 })
    .escape(),
  body('password', 'Password is incorrect.').equals(
    process.env.INVENTORY_PASSWORD
  ),

  // Handle route
  asyncHandler(async (req, res) => {
    // Determine errors
    const errorMsgs = validationResult(req)
      .array()
      .map((error) => error.msg);
    const nameIsTaken =
      (await Category.findOne({
        _id: { $ne: req.params.id },
        name: req.body.name,
      })) !== null;
    if (nameIsTaken) errorMsgs.push('Name must be unique.');

    // Create item
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id,
    });

    // Handle error
    if (errorMsgs.length) {
      res.render('categoryForm', {
        title: 'Update Category',
        category,
        errorMsgs,
      });
      return;
    }

    // Update category
    await Category.findByIdAndUpdate(category._id, category, {});
    res.redirect(category.url);
  }),
];
