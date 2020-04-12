const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

//bodyParse
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//database control
mongoose
    .connect("mongodb://localhost/vidjot_dev", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("Database Connected"));
require("./models/idea");
const Idea = mongoose.model("ideas");

//adding handlebars connecting templates
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

//routing in static website
app.get("/", (req, res) => {
    res.render("home", {
        title: "Welcome"
    });
});
app.get("/about", (req, res) => {
    res.render("home", {
        title: "About"
    });
});

//add idea form
app.get("/ideas", (req, res) => {
    Idea.find()
        .lean()
        .sort({ date: "desc" })
        .then(ideas => {
            console.log(ideas);
            res.render("ideas/index", {
                ideas: [...ideas]
            });
        });
});

app.get("/ideas/add", (req, res) => {
    res.render("ideas/add");
});

//Process Form
app.post("/ideas", (req, res) => {
    let errors = [];
    if (!req.body.title) {
        errors.push({ text: "Please enter title" });
    }
    if (!req.body.details) {
        errors.push({ text: "Please add some details" });
    }
    if (errors.length > 0) {
        res.render("ideas/add", {
            errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details
        };
        new Idea(newUser).save().then(idea => {
            res.redirect("/ideas");
        });
    }
});

const port = 5000;

app.listen(port, () => console.log(port));
