const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
require("../models/User");
const User = mongoose.model("usersJot");


router.get("/login", (req, res) => {
    res.render('users/login');
});
router.get("/register", (req, res) => {
    res.render("users/register");
});

//register form
router.post('/register', (req, res) => {
    console.log(req.body)
    res.send("registered");
})

module.exports = router;