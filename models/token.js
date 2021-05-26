const Joi = require('joi');
const mongoose = require('mongoose');

const Token = mongoose.model('Token', new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    dateT: {
        type: Date,
        require: false
    }
}));

function validateToken(token) {
    const schema = Joi.object({
        token: Joi.string().required(),
        dateT: Joi.date(),
        parent: Joi.allow()
    });
    const validation = schema.validate(token, {allowUnknown: true});
    return validation;
}

exports.Token = Token;
exports.validateToken = validateToken;
