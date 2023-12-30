// import Express library
const express = require('express');
const { Stash } = require('../models/StashesModel');
const { authenticateJWT } = require('../functions/AuthFunctions');
// const { comparePassword, generateJwt } = require('../functions/AuthFunctions');

// make an instance of a Router
const stashRouter = express.Router();


// find/list all stashes
stashRouter.get("/", authenticateJWT, async (request, response) => {
    try {
        const userRole = request.user.role;

        // Check if the authenticated user has admin privileges
        if (userRole !== "admin") {
            return response.status(403).json({ error: "You are not authorized see this data." });
        }
	let result = await Stash.find({});

	response.json({result});
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: "Internal Server Error" });
        }
})

// GET localhost:3000/stash/someid or get a specific stash id
stashRouter.get("/:id", authenticateJWT, async (request, response) => {
    try {
        const userRole = request.user.role;

        // Check if the authenticated user has admin privileges
        if (userRole !== "admin" && userRole !== "scout" && userRole !== "member") {
            return response.status(403).json({ error: "You are not authorized see this data." });
        }
	let result = await Stash.findOne({_id: request.params.id});

	response.json({result});
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: "Internal Server Error" });
    }
})

// POST localhost:3000/stash/
stashRouter.post("/", authenticateJWT, async (request, response) => {
    try {
        // Assuming you have the user's role information stored in the request object
        const userRole = request.user.role;

        // Check if the authenticated user has admin or scout privileges
        if (userRole !== "admin" && userRole !== "scout") {
            return response.status(403).json({ error: "You are not authorized to create a stash." });
        }

        // Create a new stash
        let newStash = await Stash.create(request.body);

        response.json(newStash);
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: "Internal Server Error" });
    }
});

// PATCH localhost:3000/stashes/:id
// Update a stash by ID
stashRouter.patch("/:id", authenticateJWT, async (request, response) => {
    try {
        // Assuming you have the user's role information stored in the request object
        const userRole = request.user.role;

        // Check if the authenticated user has admin or scout privileges
        if (userRole !== "admin" && userRole !== "scout") {
            return response.status(403).json({ error: "You are not authorized to update a stash." });
        }

        // Find the stash by ID
        const stashToUpdate = await Stash.findById(request.params.id);

        if (!stashToUpdate) {
            return response.status(404).json({ error: "Stash not found." });
        }

        // Log the stash before the update
        console.log('Stash Before Update:', stashToUpdate);

        // Update the stash with the request body
        stashToUpdate.set(request.body);
        await stashToUpdate.save();

        // Log the updated stash
        console.log('Stash After Update:', stashToUpdate);

        response.json({ success: true, stash: stashToUpdate });
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: "Internal Server Error" });
    }
});

// DELETE localhost:3000/stashes/:id
// Delete a stash by ID
stashRouter.delete("/:id", authenticateJWT, async (request, response) => {
    try {
        // Assuming you have the user's role information stored in the request object
        const userRole = request.user.role;

        // Check if the authenticated user has admin or scout privileges
        if (userRole !== "admin" && userRole !== "scout") {
            return response.status(403).json({ error: "You are not authorized to delete a stash." });
        }

        // Find the stash by ID and delete it
        const deletedStash = await Stash.findByIdAndDelete(request.params.id);

        if (!deletedStash) {
            return response.status(404).json({ error: "Stash not found." });
        }

        response.json({ success: true, message: "Stash deleted successfully." });
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = stashRouter;