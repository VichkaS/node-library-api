const User = require('../models/User');
const jwt = require('jsonwebtoken');
const validator = require('validator');

exports.login = async (req, res) => {
    const user = await User.findOne({email: req.body.email}); 
    if (!user) {
        return res.status(401).json({
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
            res.status(401).json({
                error_code: 401,
                message: 'Authentication failed. Wrong password'
            });
        }
    });
};

exports.verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token){
        return res.status(403).json({
            error_code: 403,
            message: 'No token provided'
        }); 
    }
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
        if (err) {
            return res.status(500).json({
                error_code: 500,
                message: 'Failed to authenticate token'
            });
        }
        req.userId = decoded.id;
        next();
    });
};

exports.stubForVerifyToken = (req, res) => {
  res.json({
     message: 'Verify completed'
  });
};

exports.validateRegister = (req, res, next) => {
    if (validator.isEmpty(req.body.email) || validator.isEmpty(req.body.name)
        || validator.isEmpty(req.body.password) || validator.isEmpty(req.body.passwordConfirm)){
            return res.status(409).json({
                error_code: 409,
                message: 'All fields must be filled'
            });
    }
    if (!validator.isEmail(req.body.email.toString())){
        return res.status(409).json({
            error_code: 409,
            message: 'Invalid email'
        });
    }
    if (!validator.equals(req.body.password, req.body.passwordConfirm)){
        return res.status(409).json({
            error_code: 409,
            message: 'Your passwords do not match'
        });
    }
    next();
};
