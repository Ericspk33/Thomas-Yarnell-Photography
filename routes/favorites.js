// basics imports
var express = require('express');
var router = express.Router();
const ObjectID = require('mongodb').ObjectID;
const dotenv = require('dotenv');
dotenv.config();

// ensures users is logged in, or sends a 401 status
const ensureAuthenticated = (req, res, next) => {

  if (req.isAuthenticated()) {
    return next();
  }
    
  res.sendStatus(401)
};

// post /favorites:id
router.post('/favorites', ensureAuthenticated, (req, res, next) => {

    // grab ids and favorites url to be stored
    const users = req.app.locals.users;
    const userid = req.user.id;
    const url = req.body.id;

    // insert the url into the users favorites array
    users
        .updateOne({ _id: ObjectID(userid) }, { $push: { favorites: url }})
        .then(() => {
            res.sendStatus(200)
        })
        .catch((err) => {
            // req.flash('error', 'We could not update the favorites');
            res.sendStatus(400)
        });
});

// delete /favorites:id
router.delete('/favorites', ensureAuthenticated, (req, res, next) => {
    // grab ids and favorites url to be deleted
    const users = req.app.locals.users;
    const user_id = req.user.id;
    const url = req.body.id;

    // delete the url from the users favorites array
    users
        .updateOne({ _id: ObjectID(user_id)}, { $pull: { favorites: url }})
        .then(() => {
            res.sendStatus(200)
        })
        .catch((err) => {
            res.sendStatus(400)
            // req.flash('error', 'We could not update the favorite');
        });

});


module.exports = router;