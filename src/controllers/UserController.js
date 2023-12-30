// import Express library
const express = require('express');
const { User } = require('../models/UserModel');
const { comparePassword, generateJwt, authenticateJWT } = require('../functions/AuthFunctions');

// make an instance of a Router
const userRouter = express.Router();

userRouter.get("/", authenticateJWT, async (request, response) => {
    try {
        const userRole = request.user.role;

        // Check if the authenticated user has admin privileges
        if (userRole !== "admin") {
            return response.status(403).json({ error: "You are not authorized see this data." });
        }
        let result = await User.find({});
        response.json({ result });
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: "Internal Server Error" });
    }
});

// GET localhost:3000/users/someid
userRouter.get("/:id", authenticateJWT, async (request, response) => {
    try {
        const userRole = request.user.role;

        // Check if the authenticated user has admin privileges
        if (userRole !== "admin") {
            return response.status(403).json({ error: "You are not authorized see this data." });
        }
	let result = await User.findOne({_id: request.params.id});

	response.json({result});
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: "Internal Server Error" });
    }
});


// POST localhost:3000/users/create
userRouter.post("/create", authenticateJWT, async (request, response) => {
    try {
        // Assuming you have the user's role information stored in the JWT payload
        const userRole = request.user.role;

        // Check if the authenticated user has admin privileges
        if (userRole !== "admin") {
            return response.status(403).json({ error: "You are not authorized to create users." });
        }

        // Extract relevant data from the request body
        const { username, password, role } = request.body;

        // Validate required fields
        if (!username || !password || !role) {
            return response.status(400).json({ error: "Please provide username, password, and role." });
        }

        // Proceed with user creation
        const newUser = await User.create({
            username,
            password, // UserShema.pre should be hashing the password before saving to the db
            role            
        }).catch(error => error);

        if (newUser instanceof Error) {
            return response.status(400).json({ error: "User creation failed.", details: newUser.message });
        }

        response.json({ success: true, message: "User created successfully.", user: newUser });

		// to fix this later!!
		// console.log("User"+response.body.username+" created successfully."); 


    } catch (error) {
        console.error(error);
        response.status(500).json({ error: "Internal Server Error" });
    }
});


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
	let token = generateJwt(targetUser._id.toString(), targetUser.role);
	console.log("User: " +request.body.username+" has logged in.");

	// respond with the JWT 
	response.json({
		jwt: token,
        userId: targetUser._id,
        username: targetUser.username        
	});

});

// DELETE localhost:3000/users/someid
userRouter.delete("/:id", authenticateJWT, async (request, response) => {
    try {
        // Assuming you have the user's role information stored in the request object
        let userRole = request.user.role; // Use request.user instead of request.body

        // Check if the authenticated user has admin privileges
        if (userRole !== "admin") {
            return response.status(403).json({ error: "You are not authorized to delete users." });
        }

        // Proceed with user deletion
        let deletedUser = await User.findByIdAndDelete(request.params.id);

        if (!deletedUser) {
            return response.status(404).json({ error: "User not found." });
        }

        response.json({ success: true, message: "User deleted successfully." });
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: "Internal Server Error" });
    }
});




// Patch localhost:3000/users/:id
// Allow users to update their information
userRouter.patch("/:id", authenticateJWT, async (request, response) => {
    try {
        // Assuming you have the user's role information stored in the request object
        const userRole = request.user.role;

        // Check if the authenticated user is the owner or has admin privileges
        if (userRole !== "admin" && request.user._id.toString() !== request.params.id) {
            return response.status(403).json({ error: "You are not authorized to update this user's information." });
        }

        // Find the user by ID
        const userToUpdate = await User.findById(request.params.id);

        if (!userToUpdate) {
            return response.status(404).json({ error: "User not found." });
        }

		// Log the user information before the update
		console.log("Before Update:", userToUpdate);

		// Use the updateUser method for flexible updates
		await userToUpdate.updateUser(request.body);

		// Log the user information after the update
		console.log("After Update:", userToUpdate);

        response.json({ success: true, user: userToUpdate });
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = userRouter;