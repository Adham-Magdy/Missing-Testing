const Joi = require('@hapi/joi');

// Register Validation
const registerValidation = data =>{
    const schema = Joi.object({
        fName: Joi.string().min(3).required(),
        lName: Joi.string().min(3).required(),
        phoneNum: Joi.string().required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
        birthDate: Joi.date().required(),
        gender: Joi.string().min(6).required()
    });
    return schema.validate(data);
}

const loginValidation = data =>{
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });
    return schema.validate(data);
}


module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;

