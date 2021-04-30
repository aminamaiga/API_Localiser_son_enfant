const { validateChild, Child } = require("../models/child");
const express = require('express');
const routerChild = express.Router();
const auth = require('./middleware/auth');

routerChild.post('/', auth, async (req, res, next) => {
    // First Validate The Request
    console.log(req.body);
    const { error } = validateChild(req.body);
    if (error) {
        return res.status(400).send(error.details);
    }

    // Check if this child already exisits
    let child = await Child.findOne({ code: req.body.code });
    if (child) {
        return res.status(400).send('Ce code est déjà attribué!');
    } else {
        // Insert the new child if they do not exist yet
        child = new Child({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            code: req.body.code,
            age: req.body.age,
            picture: req.body.picture,
            parent: req.body.parent
        });
        child.save().then(
            () => {
                res.status(201).send(child);
            }
        ).catch(
            (error) => {
                res.status(500).json({
                    error: error
                });
            });
    }
});

routerChild.get('/:parentId', async (req, res, next) => {
    console.log(req.body);
    // find all
     await Child.find({ parent: req.params.parentId })
        .then((children) => {
            if (children) {
                return res.status(200).send(children);
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

module.exports = routerChild;
