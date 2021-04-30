const Joi = require('joi');
const mongoose = require('mongoose');

const Child = mongoose.model('Child', new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    lastname: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    code: {
        type: Number,
        required: true,
        unique: true
    },
    birthdate: {
        type: Date,
        required: false
    },
    picture: {
        type: String,
        required: false,
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId, ref: "User",
        required: false,
    },
}));

function validateChild(child) {
    const schema = Joi.object({
        firstname: Joi.string().min(5).max(50).required(),
        lastname: Joi.string().min(5).max(50).required(),
        code: Joi.number().required(),
        birthdate: Joi.date(),
        picture: Joi.string().min(0).allow('').allow(null),
        parent: Joi.allow()
    });
    const validation = schema.validate(child, {allowUnknown: true});
    return validation;
}

exports.Child = Child;
exports.validateChild = validateChild;
