// import Express library
const express = require('express');
const { Stash } = require('../models/StashesModel');
// const { comparePassword, generateJwt } = require('../functions/AuthFunctions');

// make an instance of a Router
const stashRouter = express.Router();

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

// find/list all stashes
stashRouter.get("/", async (request, response) => {
	let result = await Stash.find({});

	response.json({result});
})

// GET localhost:3000/stash/someid or get a specific stash id
stashRouter.get("/:id", async (request, response) => {
	let result = await Stash.findOne({_id: request.params.id});

	response.json({result});
})

// POST localhost:3000/stash/
stashRouter.post("/", async (request, response) => {
	let newStash = await Stash.create(request.body).catch(error => error);

	response.json(newStash);
})


module.exports = stashRouter;