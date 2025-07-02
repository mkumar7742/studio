
const mongoose = require('mongoose');

const FamilySchema = new mongoose.Schema({
  name: { type: String, required: true },
});

FamilySchema.virtual('id').get(function(){
    return this._id.toHexString();
});

FamilySchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model('Family', FamilySchema);
