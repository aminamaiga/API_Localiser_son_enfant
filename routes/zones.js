const { validateZone, Zone } = require("../models/zone");
const express = require('express');
const routerZone = express.Router();

routerZone.post('/', async (req, res, next) => {
    // First Validate The Request
    console.log(req.body);
    const { error } = validateZone(req.body);
    if (error) {
        return res.status(400).send(error.details);
    }
    let zone = new Zone({
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        dateT: req.body.dateT,
        type: req.body.type,
        diametre: req.body.diametre,
        parent: req.body.parent,

    });
    zone.save().then(
        () => {
            res.status(201).send(zone);
        }
    ).catch(
        (error) => {
            res.status(500).json({
                error: error
            });
        });
});

routerZone.get('/parent-and-level', async (req, res, next) => {
    console.log(req.query);
    // find trajets
    await Zone.find({ parent: req.query.parentId, type: req.query.type })
        .then((zones) => {
            if (zones) {
                return res.status(200).send(zones);
            } else {
                return res.status(404).json({
                    message: "not found"
                });
            }
        }).catch(err => {
            console.log(err);
            res.status(500).send({
                message:
                    err.message || "erreur"
            });
        });
}
);

routerZone.put('/', async (req, res, next) => {
    // First Validate The Request
    console.log(req.body);
    const { error } = validateZone(req.body);
    if (error) {
        return res.status(400).send(error.details);
    }
    zone = req.body;
    Zone.findByIdAndDelete().then(
        () => {
            res.status(200).send(zone);
        }
    ).catch(
        (error) => {
            res.status(500).json({
                error: error
            });
        });
});

module.exports = routerZone;
