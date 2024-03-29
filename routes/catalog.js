const express = require('express');

const itemController = require('../controllers/itemController');
const categoryController = require('../controllers/categoryController');
const itemInstanceController = require('../controllers/itemInstanceController');

const router = express.Router();

/// INDEX ROUTE ///

// GET request from index page
router.get('/', itemController.index);

/// ITEM ROUTES ///

// GET request from items page
router.get('/items', itemController.itemList);

// GET request from item create page
router.get('/item/create', itemController.itemCreateGet);

// GET request from item delete page
router.get('/item/:id/delete', itemController.itemDeleteGet);

// GET request from item update page
router.get('/item/:id/update', itemController.itemUpdateGet);

// POST request from item create page
router.post('/item/create', itemController.itemCreatePost);

// POST request from item delete page
router.post('/item/:id/delete', itemController.itemDeletePost);

// POST request from item update page
router.post('/item/:id/update', itemController.itemUpdatePost);

/// CATEGORY ROUTES ///

// GET request from categories page
router.get('/categories', categoryController.categoryListGet);

// GET request from category create page
router.get('/category/create', categoryController.categoryCreateGet);

// GET request from category delete page
router.get('/category/:id/delete', categoryController.categoryDeleteGet);

// GET request from category update page
router.get('/category/:id/update', categoryController.categoryUpdateGet);

// POST request from category create page
router.post('/category/create', categoryController.categoryCreatePost);

// POST request from category delete page
router.post('/category/:id/delete', categoryController.categoryDeletePost);

// POST request from category update page
router.post('/category/:id/update', categoryController.categoryUpdatePost);

/// ITEM INSTANCE ROUTES ///

// GET request from item instances page
router.get('/item-instances', itemInstanceController.itemInstanceListGet);

// GET request from item instance create page
router.get(
  '/item-instance/create',
  itemInstanceController.itemInstanceCreateGet
);

// GET request from item instance delete page
router.get(
  '/item-instance/:id/delete',
  itemInstanceController.itemInstanceDeleteGet
);

// GET request from item instance update page
router.get(
  '/item-instance/:id/update',
  itemInstanceController.itemInstanceUpdateGet
);

// POST request from item instance create page
router.post(
  '/item-instance/create',
  itemInstanceController.itemInstanceCreatePost
);

// POST request from item instance delete page
router.post(
  '/item-instance/:id/delete',
  itemInstanceController.itemInstanceDeletePost
);

// POST request from item instance update page
router.post(
  '/item-instance/:id/update',
  itemInstanceController.itemInstanceUpdatePost
);

module.exports = router;
