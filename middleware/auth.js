const jwt = require("jsonwebtoken");
const role = require('./role');


const config = "123456";


const verifyToken = (req, res, next) => {
    const token = req.header('x-access-token'); if (!token) return res.status(401).send('Access Denied: No Token Provided!');
    try {
        
        const decoded = jwt.verify(token, config); if (role[decoded.role].find(function (url) { return  url == req.originalUrl })) {
            req.user = decoded            

            next();
        }
        else
            return res.status(401).send('Access Denied: You dont have correct privilege to perform this operation');
    }
    catch (ex) {
        res.status(401).send(ex)
    }
};

module.exports = verifyToken;