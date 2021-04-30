const { validateTrajet, Trajet } = require("../models/trajet");
const express = require('express');
const routerTrajet = express.Router();

routerTrajet.post('/', async (req, res, next) => {
    // First Validate The Request
    console.log(req.body);
    const { error } = validateTrajet(req.body);
        if (error) {
            return res.status(400).send(error.details);
        }
        // Insert the new child if they do not exist yet
        trajet = new Trajet({
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            adress: req.body.adress,
            locality: req.body.locality,
            cityName: req.body.cityName,
            postalCode: req.body.postalCode,
            dateT: req.body.dateT,
            child: req.body.child
        });
        trajet.save().then(
            () => {
                res.status(201).send(trajet);
            }
        ).catch(
            (error) => {
                res.status(500).json({
                    error: error
                });
            });
});

routerTrajet.post('/:childId', async (req, res, next) => {
    console.log(req.body);
    let startDate = req.query.startDate;
    let endDate = req.query.startDate;
    // find trajets
     await Trajet.find({ child: req.params.childId })
        .then((trajets) => {
            if (trajets) {
                return res.status(200).send(trajets);
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

module.exports = routerTrajet;
