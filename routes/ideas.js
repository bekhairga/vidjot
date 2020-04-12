const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Idea");
const Idea = mongoose.model("ideas");


//add idea form
router.get("/", (req, res) => {
    Idea.find()
        .lean()
        .sort({
            date: "desc",
        })
        .then((ideas) => {
            res.render("ideas/index", {
                ideas: [...ideas],
            });
        });
});

router.get("/add", (req, res) => {
    res.render("ideas/add");
});

//Process Form
router.post("/", (req, res) => {
    let errors = [];
    if (!req.body.title) {
        errors.push({
            text: "Please enter title",
        });
    }
    if (!req.body.details) {
        errors.push({
            text: "Please add some details",
        });
    }
    if (errors.length > 0) {
        res.render("ideas/add", {
            errors,
            title: req.body.title,
            details: req.body.details,
        });
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details,
        };
        new Idea(newUser).save().then((idea) => {
            res.redirect("/ideas");
        });
    }
});

// Edit form item call
router.get("/edit/:id", (req, res) => {
    Idea.findOne({
            _id: req.params.id,
        })
        .lean()
        .then((idea) => {
            res.render("ideas/edit", {
                ...idea,
            });
        });
});
//Edit form item action

router.put("/:id", (req, res) => {
    Idea.findOne({
        _id: req.params.id,
    }).then((idea) => {
        idea.title = req.body.title;
        idea.details = req.body.details;
        idea.save().then((idea) => {
            req.flash("success_msg", "Video idea was updated");
            res.redirect("/ideas");
        });
    });
});

router.delete("/delete/:id", (req, res) => {
    Idea.deleteOne({
        _id: req.params.id,
    }).then(() => {
        req.flash("success_msg", "Video idea was removed");
        res.redirect("/ideas");
    });
});


module.exports = router;