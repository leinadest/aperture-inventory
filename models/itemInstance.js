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
  return `/catalog/item-instance/${this._id}`;
});

ItemInstanceSchema.virtual('dueBackFormatted').get(function () {
  return DateTime.fromJSDate(this.dueBack).toISODate(DateTime.DATE_MED);
});

module.exports = mongoose.model('ItemInstance', ItemInstanceSchema);
