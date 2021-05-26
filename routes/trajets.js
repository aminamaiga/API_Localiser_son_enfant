const { validateTrajet, Trajet } = require("../models/trajet");
const express = require('express');
const fcm = require("./fcm3");
const { Token } = require("../models/token");
const { Notification } = require("../models/notification");
const { number } = require("joi");
const { Zone } = require("../models/zone");
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
        child: req.body.child,
        parent: req.body.parent,
    });
    trajet.save().then(
        () => {
            const notifications = {
                "notification": {
                    "title": "Localiser mon Enfant",
                    "body": "Vous venez de recevoir une notification sur les déplacements de votre enfant",
                },
                "registration_ids": []
            }
            Token.find().then((tokens) => {
                notifications.registration_ids = tokens.map(tok => {
                    return tok.token;
                });
            });
            /// data['registration_ids'] = ['c6OPaxX7SBS7H1z9bmcQ7E:APA91bGSbHQ4CQrxdemomUBgXP-2jSanq7lyTqDM4gj95LhNDCpLs602A8-zWw5HHJYUAEGY2Pqy6RpKsQF62lY774zmxfM9KTOSZdUR1OgRI5BQKJ3UvGMoAeLGGQCyTDmlwOczdenM'];
            Token.find().then((tokens) => {
                notifications.registration_ids = tokens.map(tok => {
                    return tok.token;
                });
            });
             Zone.find().then((zones) => {
                 zones.map(zone =>{
                    distanceBetween = distance(zone.latitude, zone.longitude, req.body.latitude, req.body.longitude, 'M');
                    console.log("==== distance " + distanceBetween);
                    if(distanceBetween <= 500){
                        fcm.sendNotifications(notifications);
                        notification = new Notification({
                            latitude: req.body.latitude,
                            longitude: req.body.longitude,
                            adress: req.body.adress,
                            locality: req.body.locality,
                            cityName: req.body.cityName,
                            postalCode: req.body.postalCode,
                            firstname: req.body.firstname,
                            lastname: req.body.lastname,
                            parent: req.body.parent,
                            dateT: req.body.dateT,
                            distance: distanceBetween,
                            type: zone.type
                        });
                        notification.save().then(() => {
                            console.log('notification enregistrée');
                        });
                     }
                 });
             });
            res.status(201).send(trajet);
        }
    )/*.catch(
        (error) => {
            res.status(500).json({
                error: error
            });
        });*/
});

routerTrajet.get('/:childId', async (req, res, next) => {
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

routerTrajet.get('/last/:childId', async (req, res, next) => {
    console.log(req.body);
    // find trajets
    await Trajet.find({ child: req.params.childId }).sort({ field: 'asc', _id: -1 }).limit(1)
        .then((trajets) => {
            if (trajets) {
                return res.status(200).send(trajets[0]);
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

function distance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1 / 180
    var radlat2 = Math.PI * lat2 / 180
    var theta = lon1 - lon2
    var radtheta = Math.PI * theta / 180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    if (unit == "K") { dist = dist * 1.609344 }
    if (unit == "N") { dist = dist * 0.8684 }
    return dist
}


module.exports = routerTrajet;
