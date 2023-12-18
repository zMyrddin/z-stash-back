const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/UserModel");

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
			expiresIn: "1h", algorithm: 'HS256'
		}

	);

	return newJwt;
}

async function authenticateJWT(request, response, next) {
    const authHeader = request.header('Authorization');
    console.log('Authorization Header:', authHeader);
    
    // Extract the token (assuming it's in the format "Bearer <token>")
    const token = authHeader ? authHeader.split(' ')[1] : null;
    // Log the token value for inspection
    // console.log('Extracted Token:', token);


    if (!token) {
        return response.status(401).json({ error: 'Unauthorized: Missing token' });
    }

    try {
        const decoded = jwt.verify(token.trim(), process.env.JWT_KEY, { algorithms: ['HS256'] });
        const user = await User.findById(decoded.userId);
        console.log('User:', user);
        
        if (!user) {
            return response.status(401).json({ error: 'Unauthorized: Invalid token' });
        }

        // Attach user information to the request object
        request.user = user;

        next();
        
    } catch (error) {
        console.error('Error during authentication:', error);
        return response.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
}


module.exports = {
	comparePassword, generateJwt, authenticateJWT
}