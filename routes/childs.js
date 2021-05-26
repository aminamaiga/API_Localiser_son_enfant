const { validateChild, Child } = require("../models/child");
const express = require('express');
const routerChild = express.Router();
const auth = require('./middleware/auth');
const mongoose = require('mongoose');
const app = express();
app.use(express.static("public"));

//multer pour upload file
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public')//route qui contient l'immage pour upload
    },
    filename: function (req, file, cb) {//filename uploaded, Date() pour éviter que 2 fichier ayent le meme nom
        cb(null, Date.now() + "-" + file.originalname)
    }
});

var upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        console.log(file);
        if (file.mimetype == "image/bmp" ||
            file.mimetype == "image/png" ||
            file.mimetype == "image/jpg" ||
            file.mimetype == "image/jpeg" ||
            file.mimetype == "image/gif") { //verifier si le type de fichier est bien une image
            cb(null, true)
        } else {
            return cb(new Error('Seulement images autorissée! '))
        }
    }
}).single("image");

routerChild.post('/', async (req, res, next) => {
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

routerChild.get('/child/:code', async (req, res, next) => {
    // find all
    await Child.findOne({ code: req.params.code })
        .then((children) => {
            console.log(children);
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

routerChild.post('/upload/:childId', async (req, res, next) => {
    console.log(req.params);
    // find all
    await Child.findOne({ _id: req.params.childId })
        .then((children) => {
            if (children) {
                upload(req, res, function (err) {
                    if (err instanceof multer.MulterError) {
                        console.log("Multer error while uploading ");
                        return res.status(500).json({ result: 0, "err": err });
                    } else if (err) {
                        console.log("Unknown error while uploading ");
                        return res.status(500).json({ result: 0, "err": err });
                    } else {
                        console.log("Upload successfully");
                        console.log(req.file);
                        //File information after upload
                        //update
                        children.picture = req.file.filename;
                        Child.findByIdAndUpdate(children._id, {$set: children}, { new: true },)
                        return res.status(200).send(children);
                    }
                });
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
