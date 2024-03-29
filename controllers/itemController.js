const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const Item = require('../models/item');
const Category = require('../models/category');
const ItemInstance = require('../models/itemInstance');

exports.index = asyncHandler(async (req, res) => {
  const [numItems, numCategories, numItemInstances, numItemInstancesAvailable] =
    await Promise.all([
      Item.countDocuments({}).exec(),
      Category.countDocuments({}).exec(),
      ItemInstance.countDocuments({}).exec(),
      ItemInstance.countDocuments({ status: 'Available' }).exec(),
    ]);
  res.render('index', {
    title: 'Aperture Inventory Dashboard',
    numItems,
    numCategories,
    numItemInstances,
    numItemInstancesAvailable,
  });
});

exports.itemList = asyncHandler(async (req, res) => {});

exports.itemDetail = asyncHandler(async (req, res) => {});

exports.itemCreateGet = asyncHandler(async (req, res) => {});

exports.itemCreatePost = asyncHandler(async (req, res) => {});

exports.itemDeleteGet = asyncHandler(async (req, res) => {});

exports.itemDeletePost = asyncHandler(async (req, res) => {});

exports.itemUpdateGet = asyncHandler(async (req, res) => {});

exports.itemUpdatePost = asyncHandler(async (req, res) => {});
