const mongoose = require('mongoose');

const SocialSchema = new mongoose.Schema({
  platform: { type: String, required: true },
  url: { type: String, required: true },
}, { _id: false });

const MemberSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  roleId: { type: String, required: true },
  avatar: { type: String, required: true },
  avatarHint: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  socials: [SocialSchema],
});

module.exports = mongoose.model('Member', MemberSchema);
