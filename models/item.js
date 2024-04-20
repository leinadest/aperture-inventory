const mongoose = require('mongoose');
const Images = require('../api/images');
const ItemInstance = require('./itemInstance');

const { Schema } = mongoose;

const ItemSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  description: { type: String, required: true },
  category: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  price: { type: Number, required: true },
  unit: { type: String, require: true },
  images: { type: [String], default: [] },
});

ItemSchema.virtual('url').get(function () {
  return `/catalog/item/${this._id}`;
});

ItemSchema.virtual('numberInStock').get(async function () {
  return ItemInstance.countDocuments({ item: this._id });
});

ItemSchema.virtual('imagesUrls').get(async function () {
  const imagesUrls = await Promise.all(
    this.images.map((image) => Images.getImageUrl(image))
  );
  return imagesUrls;
});

ItemSchema.virtual('priceTag').get(function () {
  return `${this.price}/${this.unit}`;
});

module.exports = mongoose.model('Item', ItemSchema);
