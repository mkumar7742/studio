
const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
  name: { type: String, required: true },
  balance: { type: Number, required: true },
  currency: { type: String, required: true },
  icon: { type: String, required: true },
});

AccountSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

AccountSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model('Account', AccountSchema);
