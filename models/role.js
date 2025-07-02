
const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    permissions: [{ type: String }],
    familyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Family', required: true },
});

// Ensure role names are unique within a single family
RoleSchema.index({ name: 1, familyId: 1 }, { unique: true });

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
