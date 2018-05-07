const express = require("express");
const router = express.Router();

router.get("/test", (req, res) => res.send("The Home Page Works!"));

module.exports = router;
