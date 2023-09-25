//jshint esversion:6
require('dotenv').config();
const express = require("express");

const bodyparser = require("body-parser");
const ejs = require("ejs");
const { default: mongoose } = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(bodyparser.urlencoded({
    extended: true
}));



mongoose.connect(
    process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);


const userSchema = new mongoose.Schema( {
    email: String, 
     password: String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema, "users");



app.get("/", function (req, res) {
    res.render("home");
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/register", function (req, res) {
    res.render("register");
});

app.post("/register", function (req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save().then(() => {
        res.render("secrets");
    })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Internal server error");
        });
});


app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username }).then((foundUser) => {
        if (foundUser && foundUser.password === password) {
            res.render("secrets");
        }
    })
    .catch ((err) => {
        console.log(err);
        res.status(500).send("internal server error");
    })
});












app.listen(3000, function () {
    console.log("server is running on port 3000");
});
