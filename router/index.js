// routes/index.js
const router = require("express").Router();
const orderspot = require("./orderspot");

router.post("/orderspot", orderspot.orderspotView);

module.exports = router;