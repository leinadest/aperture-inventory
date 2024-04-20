const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const fs = require('fs');

const Images = require('../api/images');
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
    numberInStock: await item.numberInStock,
    itemInstances,
  });
});

exports.itemCreateGet = asyncHandler(async (req, res) => {
  const allCategories = await Category.find({}, { name: 1 }).exec();
  res.render('itemForm', {
    title: 'Create Item',
    allCategories,
  });
});

exports.itemCreatePost = [
  // Transform request data
  (req, res, next) => {
    if (!Array.isArray(req.body.category)) {
      req.body.category =
        typeof req.body.category === 'undefined' ? [] : [req.body.category];
    }
    next();
  },

  // Sanitize and validate request data
  body('name', 'Name must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('name', 'Name must have at most 100 characters.')
    .trim()
    .isLength({ max: 100 })
    .escape(),
  body('description', 'Description must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('category.*').escape(),
  body('price', 'Price must be a number.').isNumeric().escape(),
  body('unit', 'Unit must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('unit', 'Unit must be in letters.').trim().isAlpha().escape(),

  // Handle route
  asyncHandler(async (req, res) => {
    // Determine validation errors of request data
    const errorMsgs = validationResult(req)
      .array()
      .map((error) => error.msg);

    const matchingItemResult = await Item.findOne({
      name: req.body.name,
    }).exec();

    if (matchingItemResult) {
      errorMsgs.push('Name must be unique.');
      req.body.name = '';
    }

    // Create the new item
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      unit: req.body.unit,
      images: [],
    });

    // Handle validation errors using the new item
    if (errorMsgs.length) {
      const allCategories = await Category.find({}, { name: 1 }).exec();
      res.render('itemForm', {
        title: 'Create Item',
        allCategories,
        item,
        errors: errorMsgs,
      });
      return;
    }

    // Handle image upload
    if (req.file) {
      // Upload image to cloudinary
      item.images = [await Images.uploadImage(req.file.path)];

      // Clean up temp files uploaded to the backend
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error('Error deleting file', err);
        } else {
          console.log('Temporaary file deleted successfully');
        }
      });
    }

    // Save item
    await item.save();
    res.redirect(item.url);
  }),
];

exports.itemDeleteGet = asyncHandler(async (req, res, next) => {
  const [item, allItemInstances] = await Promise.all([
    Item.findById(req.params.id).populate('category').exec(),
    ItemInstance.find({ item: req.params.id }).sort('asc').exec(),
  ]);

  if (!item) {
    const err = new Error('Item not found');
    err.status = 404;
    return next(err);
  }

  res.render('itemDelete', { title: item.name, item, allItemInstances });
});

exports.itemDeletePost = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);
  await Promise.all([
    Images.deleteImages(item.images.map((image) => image.public_id)),
    Item.findByIdAndDelete(req.params.id),
    ItemInstance.deleteMany({ item: req.params.id }),
  ]);
  res.redirect('/catalog/items');
});

exports.itemUpdateGet = asyncHandler(async (req, res, next) => {
  const [item, allCategories] = await Promise.all([
    Item.findById(req.params.id).exec(),
    Category.find({}, { name: 1 }).exec(),
  ]);

  if (!item) {
    const err = new Error('Item not found');
    err.status = 404;
    return next(err);
  }

  res.render('itemForm', {
    title: 'Update Item',
    item,
    allCategories,
  });
});

exports.itemUpdatePost = [
  // Transform request data
  (req, res, next) => {
    if (!Array.isArray(req.body.category)) {
      req.body.category =
        typeof req.body.category === 'undefined' ? [] : [req.body.category];
    }
    next();
  },

  // Sanitize and validate request data
  body('name', 'Name must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('name', 'Name must have at most 100 characters.')
    .trim()
    .isLength({ max: 100 })
    .escape(),
  body('description', 'Description must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('category.*').escape(),
  body('price', 'Price must be a number.').isNumeric().escape(),
  body('unit', 'Unit must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('unit', 'Unit must be in letters.').trim().isAlpha().escape(),

  // Handle route
  asyncHandler(async (req, res) => {
    // Determine errors
    const errorMsgs = validationResult(req)
      .array()
      .map((error) => error.msg);
    const nameIsTaken = await Item.findOne({
      _id: { $ne: req.params.id },
      name: req.body.name,
    });
    if (nameIsTaken) errorMsgs.push('Name must be unique.');

    // Create item
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      unit: req.body.unit,
      images: [],
      _id: req.params.id,
    });

    // Handle errors
    if (errorMsgs.length) {
      const allCategories = await Category.find({}, { name: 1 }).exec();
      res.render('itemForm', {
        title: 'Update Item',
        item,
        allCategories,
        errorMsgs,
      });
    }

    // Handle image upload
    if (req.file) {
      // Delete old images
      const oldImages = (await Item.findById(req.params.id, 'images')).images;
      await Images.deleteImages(
        oldImages.map((oldImage) => oldImage.public_id)
      );

      // Upload new image to cloudinary
      item.images = [await Images.uploadImage(req.file.path)];

      // Clean up temp files uploaded to the backend
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error('Error deleting file', err);
        } else {
          console.log('Temporary file deleted successfully');
        }
      });
    }

    // Update item
    await Item.findByIdAndUpdate(item._id, item, {});
    res.redirect(item.url);
  }),
];
