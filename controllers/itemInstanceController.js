const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const ItemInstance = require('../models/itemInstance');

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

exports.itemInstanceCreateGet = asyncHandler(async (req, res) => {});

exports.itemInstanceCreatePost = asyncHandler(async (req, res) => {});

exports.itemInstanceDeleteGet = asyncHandler(async (req, res) => {});

exports.itemInstanceDeletePost = asyncHandler(async (req, res) => {});

exports.itemInstanceUpdateGet = asyncHandler(async (req, res) => {});

exports.itemInstanceUpdatePost = asyncHandler(async (req, res) => {});
