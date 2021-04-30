const Joi = require('joi');
const mongoose = require('mongoose');

const User = mongoose.model('User', new mongoose.Schema({
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
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 1024
    },
    adresse: {
        type: String,
        required: false,
        minlength: 2,
        maxlength: 1024
    },
    birthdate: {
        type: Date,
        required: false,
    },
    childs:[{type: mongoose.Schema.Types.ObjectId, ref: "Child"}]
}));

function validateUser(user) {
    const schema = Joi.object({
        firstname: Joi.string().min(5).max(50).required(),
        lastname: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
        adresse: Joi.string(),
        birthdate: Joi.date().default(() => moment().format(), 'date created'),
        childs: Joi.array()
    });
    const validation = schema.validate(user);
    return validation;
}

exports.User = User;
exports.validate = validateUser;
