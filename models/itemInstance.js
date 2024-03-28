const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const { Schema } = mongoose;

const ItemInstanceSchema = new Schema({
  item: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
  status: {
    type: String,
    required: true,
    enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'],
    default: 'Maintenance',
  },
  dueBack: { type: Date, default: Date.now },
});

ItemInstanceSchema.virtual('url').get(function () {
  return `/catalog/iteminstance/${this._id}`;
});

module.exports = mongoose.model('ItemInstance', ItemInstanceSchema);
