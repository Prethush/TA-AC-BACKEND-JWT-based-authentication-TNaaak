let jwt = require('jsonwebtoken');

require("dotenv").config();

module.exports = {
    varifyToken: async (req, res, next) => {
        let token = req.headers.authorization;
        try {
            if(token) {
                let payload = await jwt.verify(token, process.env.SECRET);
                req.user = payload;
                return next();
            } else {
                return res.status(400).json({error: "Token Required"});
            }
        } catch(error) {
            next(error);
        }
        
    }
}