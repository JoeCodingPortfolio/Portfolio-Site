const express = require("express");
const router = express.Router();

//@route  GET api/posts/test
//@desc   test the post route
//@access Public Route!!
router.get("/test", (req, res) => res.json({ msg: "Posts Works!!" }));

module.exports = router;
