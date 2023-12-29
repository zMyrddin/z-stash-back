//server configuration happens in server.js

const express = require('express');

// make a server instance
const app = express();

const cors = require('cors');
const corsOptions = {
	//			frontend localhost,  frontend deployed
	origin: ["http://localhost:3000/","http://localhost:3000", "marvelous-sprite-6b2d38.netlify.app"],
	optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

// Enables request.body to be raw JSON data
app.use(express.json());

app.get("/", (request, response) => {
    response.json({
        message:"Labyu Kuya lapit na birthday mo"
    });
});

const userController = require('./controllers/UserController');
app.use("/users", userController);

const stashController = require('./controllers/StashController');
app.use("/stash", stashController);


module.exports = {
    app
}