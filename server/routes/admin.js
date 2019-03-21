const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const { ensureAuthenticated, ensureAdmin } = require("../helpers/auth");
const logger = require("../helpers/logs");

// Load User Model
require("../models/User");
const User = mongoose.model("users");
const Style = require("../models/Style");

//Admin Page
router.get("/dash", [ensureAuthenticated, ensureAdmin], (req, res) => {
    res.render("admin/dash");
});

//Styles Page
router.get('/styles', [ensureAuthenticated, ensureAdmin], (req, res) => {
    Style.find().then(styles => {
        res.render("admin/styles", { styles });
    }).catch(err => {
        logger.error(err);
        req.flash("error_msg", err);
        res.redirect("/admin/dash");
    });

});

//User Admin Page
router.get("/users", [ensureAuthenticated, ensureAdmin], (req, res) => {
    User.find()
        .sort([["username", "asc"]])
        .then(employees => {
            res.render("admin/users", {
                employees
            });
        })
        .catch(err => {
            logger.error(err);
            req.flash("error_msg", err);
            res.redirect("/orders");
        });
});



module.exports = router;
