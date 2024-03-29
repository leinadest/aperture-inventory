const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const Category = require('../models/category');
const Item = require('../models/item');

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

exports.categoryCreateGet = asyncHandler(async (req, res) => {});

exports.categoryCreatePost = asyncHandler(async (req, res) => {});

exports.categoryDeleteGet = asyncHandler(async (req, res) => {});

exports.categoryDeletePost = asyncHandler(async (req, res) => {});

exports.categoryUpdateGet = asyncHandler(async (req, res) => {});

exports.categoryUpdatePost = asyncHandler(async (req, res) => {});
