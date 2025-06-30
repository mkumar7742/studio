
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const SocialSchema = new mongoose.Schema({
  platform: { type: String, required: true },
  url: { type: String, required: true },
}, { _id: false });

const MemberSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  roleId: { type: String, required: true },
  avatar: { type: String, required: true },
  avatarHint: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  socials: [SocialSchema],
});

// Hash password before saving
MemberSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password with hashed password
MemberSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Member', MemberSchema);
