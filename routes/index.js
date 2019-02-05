var express = require("express");
var router = express.Router();

router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

// todo: download file with given id
router.get("/download/:id", (req, res) => {
  res.send({ download: req.params.id });
});

// todo: upload file to db and return its download id
router.post("/upload", (req, res) => {
  res.send({ upload: "recieved" });
});

module.exports = router;
