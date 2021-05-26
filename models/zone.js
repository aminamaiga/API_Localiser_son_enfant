const Joi = require('joi');
const mongoose = require('mongoose');

const Zone = mongoose.model('Zone', new mongoose.Schema({
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    dateT: {
        type: Date,
        require: false
    },
    type: {
        type: Number,
        required: true
    },
    diametre: {
        type: Number,
        required: true
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId, ref: "Parent",
        required: false
    }
}));

function validateZone(zone) {
    const schema = Joi.object({
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        type: Joi.number().required(),
        diametre: Joi.number().required(),
        dateT: Joi.date(),
        parent: Joi.allow()
    });
    const validation = schema.validate(zone, {allowUnknown: true});
    return validation;
}

exports.Zone = Zone;
exports.validateZone = validateZone;
