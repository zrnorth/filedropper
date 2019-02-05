const keys = require("../config/keys.js");
const aws = require("aws-sdk");
aws.config.region = "us-east-2"; // I don't think you need this anymore but, just in case
aws.config.accessKeyId = keys.awsAccessKeyId;
aws.config.secretAccessKey = keys.awsSecretKeyId;

var express = require("express");
var router = express.Router();

router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

// Gets the signed s3 request to save a file
router.get("/sign-s3", (req, res) => {
  const s3 = new aws.S3();
  const fileName = req.query["file-name"];
  const fileType = req.query["file-type"];
  const s3Params = {
    Bucket: keys.s3Bucket,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: "private"
  };

  s3.getSignedUrl("putObject", s3Params, (err, data) => {
    if (err) {
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${keys.s3Bucket}.s3.amazonaws.com/${fileName}`
    };
    res.write(JSON.stringify(returnData));
    res.end();
  });
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
