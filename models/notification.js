const Joi = require('joi');
const mongoose = require('mongoose');
const { validateToken } = require('./token');

const Notification = mongoose.model('Notification', new mongoose.Schema({
    latitude: {
        type: Number,
        required: false
    },
    longitude: {
        type: Number,
        required: false
    },
    adress: {
        type: String,
        required: false
    },
    locality: {
        type: String,
        required: false
    },
    cityName: {
        type: String,
        required: false
    },
    contryName: {
        type: String,
        required: false
    },
    postalCode: {
        type: String,
        required: false
    },
    dateT: {
        type: Date,
        require: false
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId, ref: "User",
        required: false,
    },
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
    distance: {
        type: Number,
        required: false
    },
    type: {
        type: Number,
        required: false
    },
}));

function validateNotification(notification) {
    const schema = Joi.object({
        latitude: Joi.number(),
        longitude: Joi.number(),
        distance: Joi.number(),
        type: Joi.number(),
        adress: Joi.string().min(0).allow('').allow(null),
        locality: Joi.string().min(0).allow('').allow(null),
        cityName: Joi.string().min(0).allow('').allow(null),
        postalCode: Joi.string().min(0).allow('').allow(null),
        firstname: Joi.string().min(2).max(50).required(),
        lastname: Joi.string().min(2).max(50).required(),
        dateT: Joi.date(),
        parent: Joi.allow()
    });
    const validation = schema.validate(notification, {allowUnknown: true});
    return validation;
}

exports.Notification = Notification;
exports.validateNotification = validateToken;
