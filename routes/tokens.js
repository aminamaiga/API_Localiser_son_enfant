const { validateToken, Token } = require("../models/token");
const express = require('express');
const routerToken = express.Router();

routerToken.post('/', async (req, res, next) => {
    // First Validate The Request
    console.log(req.body);
    const { error } = validateToken(req.body);
    if (error) {
        return res.status(400).send(error.details);
    }
    let token = new Token({
        dateT: req.body.dateT,
        token: req.body.token,
        parent: req.body.parent
    });
    token.save().then(
        () => {
            res.status(201).send(token);
        }
    ).catch(
        (error) => {
            console.log(error);
            res.status(500).json({
                error: error
            });
        });
});

module.exports = routerToken;