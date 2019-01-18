const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const secretKey = 'privateKey';
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Unauthorized - No token provided.');

    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded; 
        if (decoded.permissions && decoded.permissions[req.baseUrl] && decoded.permissions[req.baseUrl].includes(req.method) ){
            next();
        }
        else {
            res.status(403).send('Forbidden');
        }
    }
    catch (ex) {
        res.status(401).send(`Unauthorized - ${ex}.`);
    }
}