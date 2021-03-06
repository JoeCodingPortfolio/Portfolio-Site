const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

//load input Validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

//load user model
const User = require("../../models/user");

//@route  GET api/users/test
//@desc   test the users route
//@access Public Route!!
router.get("/test", (req, res) => res.json({ msg: "Users Works!!" }));

//@route  GET api/users/register
//@desc   register users
//@access Public Route!!
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  //check the validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email Already Exists";
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200",
        r: "pg",
        d: "mm"
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

//@route  POST api/users/login
//@desc   Login User / Return the JWT token
//@access Public Route!!
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  //check the validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  //find user via email.
  User.findOne({ email }).then(user => {
    if (!user) {
      errors.email = "User Not Found";
      return res.status(404).json(errors);
    }
    const email = req.body.email;
    const password = req.body.password;

    //checking the password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //user matched

        const payload = { id: user.id, name: user.name, avatar: user.avatar };

        //sign token
        jwt.sign(payload, keys.secret, { expiresIn: 3600 }, (err, token) => {
          res.json({
            sucess: true,
            token: "Bearer " + token
          });
        });
      } else {
        errors.password = " Password Incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});
//@route  GET api/users/current
//@desc   Returns The Current User
//@access Private Route!!
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);
module.exports = router;
