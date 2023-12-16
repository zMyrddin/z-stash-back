const mongoose = require('mongoose');

const StashSchema = new mongoose.Schema({
	stashName: {
		type: String,
		required: true,
		unique: true
	},
	location: {
		type: String,
		required: true,
		unique: true
	},
	landmarks: {
		type: String,
		required: false,
		unique: false
	},
    hostileSighting:{
		type: Boolean,
		required: true,
		unique: false
	},
    notes: {
		type: String,
		required: false,
		unique: false
	}
});


const Stash = mongoose.model('Stash', StashSchema);

module.exports = { Stash }