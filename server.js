const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");
const home = require("./routes/api/home");

const app = express();

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//DB Configuration
const db = require("./config/keys").mongouri;

//Connect to mongo db
mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

//^^using ES7 Javascript split onto seperate lines to make it more readable!!!

//Set The APP To Use The Below Routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);
app.use("/api/home", home);

//Port For Local host and MLAB!
const port = process.env.PORT || 5000;

//Passport setup
app.use(passport.initialize());

//Passport Configs
require("./config/passport")(passport);

app.listen(port, () => console.log(`Server Running On Port ${port}`));
