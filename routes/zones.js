// const { validate, zone } = require("../models/zone");

// router.post('/zones', auth, async (req, res, next) => {
//     // First Validate The Request
//     console.log(req.body);
//     const { error } = validateChild(req.body);
//     if (error) {
//         return res.status(400).send(error.details);
//     }

//     // Check if this child already exisits
//     let child = await Child.findOne({ code: req.body.code });
//     if (child) {
//         return res.status(400).send('Utilisateur existe déjà!');
//     } else {
//         // Insert the new child if they do not exist yet
//         child = new Child({
//             firstname: req.body.firstname,
//         });
//         child.save().then(
//             () => {
//                 res.status(201).send(child);
//             }
//         ).catch(
//             (error) => {
//                 res.status(500).json({
//                     error: error
//                 });
//             });
//     }
// });