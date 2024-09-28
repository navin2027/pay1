// const {JWT_SECRET} = require("./config");
const JWT_SECRET = "navinsecret";
const jwt = require("jsonwebtoken");

const authMiddleware = (req,res,next) => {
    
    try {
        const token = req.headers['authorization'];

        if (!token) {
            return res.status(401).json({ msg: "Authorization header missing" });
        }

        if (!token.startsWith('Bearer ')) {
            return res.status(401).json({ msg: "Token must start with Bearer" });
        }

        const jwtToken = token.split(" ")[1];
        const decoded = jwt.verify(jwtToken, JWT_SECRET);

        if (decoded.user_Id) {
            req.userId = decoded.user_Id;
            next();  // Call next only if no response has been sent
        } else {
            return res.status(403).json({ error: "Unauthorized" });
        }
    } catch (err) {
        return res.status(403).json({ error: "Invalid token" });
    }
    
};
module.exports = authMiddleware;