const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');


 const authMiddleware = async function authMiddleware(req, res, next) {

    const token = req.cookies.token || req.header.authorization?.split(' ')[1]
    
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized Access, token is missing', status: "failed" }); 
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.id);
        req.user = user;
        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized Access, Token is invalid', status: "failed" });
    }

}

const userRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).send("Access denied");
    }
    next();
  };
};



module.exports = {authMiddleware, userRoles};
