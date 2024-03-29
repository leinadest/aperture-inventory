const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const Category = require('../models/category');

exports.categoryList = asyncHandler(async (req, res) => {
  const categories = await Category.find({}).exec();
  res.render('categoryList', { title: 'Category List', categories });
});

exports.categoryDetail = asyncHandler(async (req, res) => {});

exports.categoryCreateGet = asyncHandler(async (req, res) => {});

exports.categoryCreatePost = asyncHandler(async (req, res) => {});

exports.categoryDeleteGet = asyncHandler(async (req, res) => {});

exports.categoryDeletePost = asyncHandler(async (req, res) => {});

exports.categoryUpdateGet = asyncHandler(async (req, res) => {});

exports.categoryUpdatePost = asyncHandler(async (req, res) => {});
