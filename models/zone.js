// const Joi = require('joi');
// const mongoose = require('mongoose');

// const Zone = mongoose.model('Zone', new mongoose.Schema({
//     firstname: {
//         type: String,
//         required: true,
//         minlength: 5,
//         maxlength: 50
//     }
// }));

// function validateUser(zone) {
//     const schema = Joi.object({
//         firstname: Joi.string().min(5).max(50).required(),
//         lastname: Joi.string().min(5).max(50).required(),
//         email: Joi.string().min(5).max(255).required().email(),
//         password: Joi.string().min(5).max(255).required()
//     });
//     const validation = schema.validate(zone);
//     return validation;
// }

// exports.Zone = Zone;
// exports.validate = validateZone;
