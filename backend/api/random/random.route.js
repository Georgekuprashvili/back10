const express = require("express");
const { randomblock } = require("../../middlewares/random.middleware");

const router = express.Router();

router.get("/", randomblock, (req, res) => {
  const facts = ["giorgi", "ana", "mari", "salome"];
  const randomindex = Math.floor(Math.random() * facts.length);
  const fact = facts[randomindex];

  res.json({ fact });
});

module.exports = router;
