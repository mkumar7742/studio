
const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String, required: true },
  color: { type: String, required: true },
  order: { type: Number, required: true },
  familyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Family', required: true },
});

CategorySchema.virtual('id').get(function(){
    return this._id.toHexString();
});

CategorySchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model('Category', CategorySchema);
