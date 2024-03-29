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

exports.itemInstanceDetail = asyncHandler(async (req, res) => {});

exports.itemInstanceCreateGet = asyncHandler(async (req, res) => {});

exports.itemInstanceCreatePost = asyncHandler(async (req, res) => {});

exports.itemInstanceDeleteGet = asyncHandler(async (req, res) => {});

exports.itemInstanceDeletePost = asyncHandler(async (req, res) => {});

exports.itemInstanceUpdateGet = asyncHandler(async (req, res) => {});

exports.itemInstanceUpdatePost = asyncHandler(async (req, res) => {});
