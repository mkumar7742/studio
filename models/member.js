
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const SocialSchema = new mongoose.Schema({
  platform: { type: String, required: true },
  url: { type: String, required: true },
}, { _id: false });

const MemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  roleId: { type: String, required: true },
  familyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Family', required: true },
  avatar: { type: String, required: true },
  avatarHint: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  socials: [SocialSchema],
});

// Password complexity validation
const passwordValidator = (password) => {
    // Requires at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char.
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};


// Hash password before saving
MemberSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  // Validate complexity before hashing
  if (!passwordValidator(this.password)) {
      const err = new Error('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
      return next(err);
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password with hashed password
MemberSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

MemberSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

MemberSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
        // IMPORTANT: Ensure hashed password is not sent in responses
        delete ret.password;
    }
});

module.exports = mongoose.model('Member', MemberSchema);
