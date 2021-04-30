const { User, validate } = require('../models/user');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth');
const { isValidObjectId, Mongoose } = require('mongoose');


router.post('/signup', async (req, res, next) => {
    // First Validate The Request
    console.log(req.body);
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details);
    }

    // Check if this user already exisits
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).send('Utilisateur existe déjà!');
    } else {
        // Insert the new user if they do not exist yet
        bcrypt.hash(req.body.password, 10).then(
            (hash) => {
                user = new User({
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    password: hash,
                    adresse: req.body.adresse,
                    birthdate: req.body.birthdate
                });
                user.save().then(
                    () => {
                        res.status(201).send(user);
                    }
                ).catch(
                    (error) => {
                        res.status(500).json({
                            error: error
                        });
                    });
            });
    }
});


router.post('/signin', async (req, res) => {
    User.findOne({ email: req.body.email }).then(
        (user) => {
            console.log(req.body);
            if (!user) {
                return res.status(401).json({
                    error: new Error('Compte n\'existe pas!')
                });
            }
            bcrypt.compare(req.body.password, user.password).then(
                (valid) => {
                    if (!valid) {
                        return res.status(401).json({
                            error: new Error('Mot de password incorrect!')
                        });
                    }
                    const token = jwt.sign(
                        {
                            userId: user._id,
                            name: user.firstname + " " + user.lastname,
                            birthdate: user.birthdate,
                            address: user.addresse,
                            expiresIn: '24h'
                        },
                        'RANDOM_TOKEN_SECRET');

                    res.status(200).json({
                        userId: user._id,
                        token: token
                    });
                }
            ).catch(
                (error) => {
                    console.log(error);
                    res.status(500).json({
                        error: error
                    });
                }
            );
        }
    ).catch(
        (error) => {
            res.status(500).json({
                error: error
            });
        }
    );
});


router.get('/parents/:id', async (req, res, next) => {
    // First Validate The Request
    console.log(req.body);
    try {
         // Check if this user already exisits
    let user = await User.findOne({ _id: new Mongoose.Sch(req.params.id )})
    .populate('childs').exec((err, user) => {
        if (user) {
            return res.status(200).send(user);
        } else {
           return res.status(404).json({
                message: "not found"
            });
        }
    });
    } catch (error) {
        return res.status(500).json({
            error: error
        });
    }
});

module.exports = router;

