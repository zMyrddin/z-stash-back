// import Express library
const express = require('express');
const { Stash } = require('../models/StashModel');
const { comparePassword, generateJwt } = require('../functions/userAuthFunctions');

// make an instance of a Router
const router = express.Router();

// customise the router instance 

// GET localhost:3000/stashes/
// Expect a response of ALL stashes in DB: 
/*
	[
		{
			id:
			stashName:
			whateverOtherStashData: 
		},
{
			id:
			stashName:
			whateverOtherStashData: 
		},
{
			id:
			stashName:
			whateverOtherStashData: 
		}
	]
*/
router.get("/", async (request, response) => {
	let result = await Stash.find({});

	response.json({result});
})

// GET localhost:3000/stash/someid
router.get("/:id", async (request, response) => {
	let result = await Stash.findOne({_id: request.params.id});

	response.json({result});
})

// POST localhost:3000/stash/
router.post("/", async (request, response) => {
	let newUser = await User.create(request.body).catch(error => error);

	response.json(newStash);
})

// POST localhost:3000/users/login
// request.body = {username: "admin", password: "Password1"}
// respond with {jwt: "laskdnalksfdnal;fgvkmsngb;sklnmb", valid: true}
router.post("/login", async (request, response) => {
	// Find user by provided username 
	let targetUser = await User.findOne({username: request.body.username}).catch(error => error);

	// Check if user provided the correct password
	let isPasswordCorrect = await comparePassword(request.body.password, targetUser.password);

	if (!isPasswordCorrect){
		response.status(403).json({error:"You are not authorised to do this!"});
	}

	// If they provided the correct, generate a JWT
	let freshJwt = generateJwt(targetUser._id.toString());

	// respond with the JWT 
	response.json({
		jwt: freshJwt
	});

});


module.exports = router;