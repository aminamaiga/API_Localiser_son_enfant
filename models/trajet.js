const Joi = require('joi');
const mongoose = require('mongoose');

const Trajet = mongoose.model('Trajet', new mongoose.Schema({
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
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
    child: {
        type: mongoose.Schema.Types.ObjectId, ref: "Child",
        required: false
    },
}));

function validateTrajet(trajet) {
    const schema = Joi.object({
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        adress: Joi.string().min(0).allow('').allow(null),
        locality: Joi.string().min(0).allow('').allow(null),
        cityName: Joi.string().min(0).allow('').allow(null),
        postalCode: Joi.string().min(0).allow('').allow(null),
        dateT: Joi.date(),
        child: Joi.allow()
    });
    const validation = schema.validate(trajet, {allowUnknown: true});
    return validation;
}

exports.Trajet = Trajet;
exports.validateTrajet = validateTrajet;
