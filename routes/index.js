var express = require("express");
var router = express.Router();

router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

// todo: download file with given id
router.get("/download/:id", (req, res) => {
  res.render("download", { title: "Download", id: req.params.id });
});

// todo: render the upload page, with a file picker
router.get("/upload", (req, res) => {
  res.render("upload", { title: "Upload" });
});

// todo: upload file to db and return its download id
router.post("/upload", (req, res) => {
  res.send({ upload: "recieved" });
});

module.exports = router;
