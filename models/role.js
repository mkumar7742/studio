
const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    permissions: [{ type: String }],
    familyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Family' },
});

// Ensure role names are unique within a single family, if familyId exists
RoleSchema.index({ name: 1, familyId: 1 }, { unique: true, partialFilterExpression: { familyId: { $exists: true } } });
// Ensure system-wide role name is unique
RoleSchema.index({ name: 1 }, { unique: true, partialFilterExpression: { familyId: { $exists: false } } });


RoleSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

RoleSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model('Role', RoleSchema);
