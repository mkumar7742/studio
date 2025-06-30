
const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    permissions: [{ type: String }],
}, { _id: false });

module.exports = mongoose.model('Role', RoleSchema);
