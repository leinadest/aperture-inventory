const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const ItemInstance = require('../models/itemInstance');
const Item = require('../models/item');

exports.itemInstanceList = asyncHandler(async (req, res) => {
  const itemInstances = await ItemInstance.find({}).populate('item').exec();
  res.render('itemInstanceList', {
    title: 'Item Instance List',
    itemInstances,
  });
});

exports.itemInstanceDetail = asyncHandler(async (req, res, next) => {
  const itemInstance = await ItemInstance.findById(req.params.id)
    .populate('item')
    .exec();

  if (!itemInstance) {
    const err = new Error('Item instance not found');
    err.status = 404;
    return next(err);
  }

  res.render('itemInstanceDetail', {
    title: itemInstance.name,
    itemInstance,
  });
});

exports.itemInstanceCreateGet = asyncHandler(async (req, res) => {
  const allItems = await Item.find({}, 'name').sort({ name: 1 }).exec();
  res.render('itemInstanceForm', { title: 'Create Item Instance', allItems });
});

exports.itemInstanceCreatePost = [
  // Sanitize and validate request data
  body('item', 'Item must be specified.').trim().isLength({ min: 1 }).escape(),
  body('status').escape(),
  body('dueBack', 'Invalid date')
    .optional({ values: 'falsy' })
    .isISO8601()
    .toDate(),

  // Handle route
  asyncHandler(async (req, res) => {
    // Determine errors
    const errorMsgs = validationResult(req)
      .array()
      .map((error) => error.msg);

    // Create sanitized item instance
    const itemInstance = new ItemInstance({
      item: req.body.item,
      status: req.body.status,
      dueBack: req.body.dueBack,
    });

    // Handle errors
    if (errorMsgs.length) {
      const allItems = await Item.find({}, 'name').sort({ name: 1 }).exec();
      res.render('itemInstanceForm', {
        title: 'Create Item Instance',
        allItems,
        itemInstance,
        errorMsgs,
      });
      return;
    }

    // Save item instance
    await itemInstance.save();
    res.redirect(itemInstance.url);
  }),
];

exports.itemInstanceDeleteGet = asyncHandler(async (req, res) => {});

exports.itemInstanceDeletePost = asyncHandler(async (req, res) => {});

exports.itemInstanceUpdateGet = asyncHandler(async (req, res) => {});

exports.itemInstanceUpdatePost = asyncHandler(async (req, res) => {});
