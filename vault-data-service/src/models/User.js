// auth-audit-service/src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true, minlength: 8 }
}, { timestamps: true });

// 🛡️ PRE-SAVE HOOK: Automatically hash plain text inputs before database injection
UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// 🔬 CRYPTO METHOD: Evaluate text entry parameters against our cloud database hash
UserSchema.methods.comparePassword = async function (incomingPassword) {
    return await bcrypt.compare(incomingPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
