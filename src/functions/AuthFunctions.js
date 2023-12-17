const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

async function comparePassword(plaintextPassword, hashedPassword) { 
	let doesPasswordMatch = false;

	doesPasswordMatch = await bcrypt.compare(plaintextPassword, hashedPassword);

	return doesPasswordMatch;
}

function generateJwt(userId, role){

	let newJwt = jwt.sign(
		// Payload
		{userId, role}, 

		// Secret key for server-only verification
		process.env.JWT_KEY,

		// Options
		{
			expiresIn: "7d"
		}

	);

	return newJwt;
}

async function authenticateJWT(request, response, next) {
    const token = request.header('Authorization');

    if (!token) {
        return response.status(401).json({ error: 'Unauthorized: Missing token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return response.status(401).json({ error: 'Unauthorized: Invalid token' });
        }

        // Attach user information to the request object
        request.user = user;
        console.log('Decoded Token:', decoded); // Log the decoded token
        next();
    } catch (error) {
        console.error(error);
        return response.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
}

module.exports = {
	comparePassword, generateJwt, authenticateJWT
}