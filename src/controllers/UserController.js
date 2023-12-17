// import Express library
const express = require('express');
const { User } = require('../models/UserModel');
const { comparePassword, generateJwt, authenticateJWT } = require('../functions/AuthFunctions');
const { Admin } = require('mongodb');

// make an instance of a Router
const userRouter = express.Router();

// customise the router instance 

// GET localhost:3000/users/
// Expect a response of ALL users in DB: 
/*
	[
		{
			id:
			username:
			whateverOtherUserData: 
		},
		{
			id:
			username:
			whateverOtherUserData: 
		},
		{
			id:
			username:
			whateverOtherUserData: 
		}
	]
*/
userRouter.get("/", async (request, response) => {
	let result = await User.find({});

	response.json({result});
})

// GET localhost:3000/users/someid
userRouter.get("/:id", async (request, response) => {
	let result = await User.findOne({_id: request.params.id});

	response.json({result});
})

// POST localhost:3000/users/
userRouter.post("/", async (request, response) => {
	let newUser = await User.create(request.body).catch(error => error);

	response.json(newUser);
})

// POST localhost:3000/users/login
// request.body = {username: "admin", password: "Password1"}
// respond with {jwt: "laskdnalksfdnal;fgvkmsngb;sklnmb", valid: true}
userRouter.post("/login", async (request, response) => {
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

// DELETE localhost:3000/users/someid
userRouter.delete("/:id", authenticateJWT, async (request, response) => {
    try {
        // Assuming you have the user's role information stored in the JWT payload
        const userRole = request.user.role;

        // Check if the authenticated user has admin privileges
        if (userRole !== "admin") {
            return response.status(403).json({ error: "You are not authorized to delete users." });
        }

        // Proceed with user deletion
        const deletedUser = await User.findByIdAndDelete(request.params.id);

        if (!deletedUser) {
            return response.status(404).json({ error: "User not found." });
        }

        response.json({ success: true, message: "User deleted successfully." });
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: "Internal Server Error" });
    }
});
  


module.exports = userRouter;