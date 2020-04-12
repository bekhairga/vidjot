const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const mongoURI =
	"mongodb+srv://Klaun:7408449da7@react-app-jzdkz.mongodb.net/test?retryWrites=true&w=majority";
// methodoverriding for putting data and deleting
app.use(methodOverride("_method"));

//bodyParse
app.use(
	bodyParser.urlencoded({
		extended: false,
	})
);
app.use(bodyParser.json());

//database control
mongoose
	.connect(mongoURI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("Database Connected"));



//adding handlebars connecting templates
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

//express session
app.use(
	session({
		secret: "secret",
		resave: true,
		saveUninitialized: true,
	})
);

//flash
app.use(flash());

app.use(function (req, res, next) {
	res.locals.success_msg = req.flash("success_msg");
	res.locals.error_msg = req.flash("error_msg");
	res.locals.error = req.flash("error");
	next();
});

//routing in static website
app.get("/", (req, res) => {
	res.render("home", {
		title: "Welcome",
	});
});
app.get("/about", (req, res) => {
	res.render("home", {
		title: "About",
	});
});


const ideas = require('./routes/ideas');
const users = require('./routes/users');
app.use('/ideas', ideas);
app.use('/users', users);


const port = 5000;

app.listen(port, () => console.log(port));