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
		unique: false
	},
	landmarks: {
		type: [String],
		required: false,
	},
    hostileSighting:{
		type: String,
		required: true,
	},
    notes: {
		type: [String],
		required: false,
	}
});


const Stash = mongoose.model('Stash', StashSchema);

module.exports = { Stash }