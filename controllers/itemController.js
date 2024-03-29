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

exports.itemList = asyncHandler(async (req, res) => {
  const items = await Item.find({}).exec();
  res.render('itemList', { title: 'Items List', items });
});

exports.itemDetail = asyncHandler(async (req, res, next) => {
  const [item, itemInstances] = await Promise.all([
    Item.findById(req.params.id).populate('category').exec(),
    ItemInstance.find({ item: req.params.id }).exec(),
  ]);

  if (!item) {
    const err = new Error('Item not found');
    err.status = 404;
    return next(err);
  }

  res.render('itemDetail', {
    title: item.name,
    item,
    itemInstances,
  });
});

exports.itemCreateGet = asyncHandler(async (req, res) => {});

exports.itemCreatePost = asyncHandler(async (req, res) => {});

exports.itemDeleteGet = asyncHandler(async (req, res) => {});

exports.itemDeletePost = asyncHandler(async (req, res) => {});

exports.itemUpdateGet = asyncHandler(async (req, res) => {});

exports.itemUpdatePost = asyncHandler(async (req, res) => {});
