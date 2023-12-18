const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


// const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true,
		unique: false
	},
	role: {
		type: String,
		required: true,
		unique: false
	}
});

// Use instance.save() when modifying a user's password
// to trigger this pre-hook
UserSchema.pre(
	'save',
	async function (next) {
	  const user = this;
	  // If password wasn't changed to plaintext, skip to next function.
	  if (!user.isModified('password')) return next();
	  // If password was changed, assume it was changed to plaintext and hash it.
	  const hash = await bcrypt.hash(this.password, 10);
	  this.password = hash;
	  next();
	}
);

// Custom instance method for updating user information using instance.save()
UserSchema.methods.updateUser = async function (data) {
    try {
        if (data.username) {
            this.username = data.username;
        }

        if (data.password) {
            const hash = await bcrypt.hash(data.password, 10);
            this.password = hash;
        }

        if (data.role) {
            this.role = data.role;
        }

        await this.save(); // Use instance.save() to save the updated user
        return this;
    } catch (error) {
        throw error;
    }
};


const User = mongoose.model('User', UserSchema);

module.exports = { User }