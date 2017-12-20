const mongoose = require('mongoose');
const User = mongoose.model('User');
const jwt = require('jsonwebtoken');


exports.login = async (req, res) => {
    const user = await User.findOne({email: req.body.email}); 
    if (!user) {
        return res.json({
            error_code: 401,
            message: 'Authentication failed. User not found'
        });
    }
    user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
            let token = jwt.sign({id: user._id}, process.env.SECRET, {expiresIn: 3600});
            res.json({
                token: token
            });
        } else {
            res.json({
                error_code: 401,
                message: 'Authentication failed. Wrong password'
            });
        }
    });
};

exports.verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token){
        return res.json({
            error_code: 403,
            message: 'No token provided'
        }); 
    }
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
        if (err) {
            return res.json({
                error_code: 500,
                message: 'Failed to authenticate token'
            });
        }
        req.userId = decoded.id; 
        console.log('hi now i send decoded id ' + req.userId);
        next();
    });
};
