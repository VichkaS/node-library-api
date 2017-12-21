const User = require('../models/User');

exports.register = async (req, res, next) => {
    const isExist = await User.findOne({email: req.body.email});
    if (isExist){
        return res.json({
            error_code: 409,
            message: 'User with this email exists'
        });
    }
    const user = new User({
        email: req.body.email,
        name: req.body.name,
        password: req.body.password
    });
    await user.save();
    next();
};