const keys = require("../config/keys.js");
const shortid = require("shortid");
const aws = require("aws-sdk");
aws.config.region = "us-east-2"; // I don't think you need this anymore but, just in case
aws.config.accessKeyId = keys.awsAccessKeyId;
aws.config.secretAccessKey = keys.awsSecretKeyId;

const express = require("express");
const router = express.Router();

router.get("/", function(req, res, next) {
  res.render("upload");
});

router.get("/upload", (req, res) => {
  res.redirect("/");
});

// Gets the signed s3 request to save a file
router.get("/sign-s3-upload", (req, res) => {
  const s3 = new aws.S3();
  const fileName = req.query["file-name"];
  const fileType = req.query["file-type"];

  // Generate the short id here
  const origFileExtension = fileName.slice(
    ((fileName.lastIndexOf(".") - 1) >>> 0) + 2
  );
  const fileKey = shortid.generate() + "." + origFileExtension;

  const s3Params = {
    Bucket: keys.s3Bucket,
    Key: fileKey,
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
      fileKey: fileKey,
      url: `https://${keys.s3Bucket}.s3.amazonaws.com/${fileKey}`
    };
    res.write(JSON.stringify(returnData));
    res.end();
  });
});

// Get the signed s3 request to download a file
router.get("/sign-s3-download/", (req, res) => {
  const s3 = new aws.S3();
  const url = s3.getSignedUrl("getObject", {
    Bucket: keys.s3Bucket,
    Key: req.query["file-key"],
    Expires: 300
  });
  res.write(JSON.stringify(url));
  res.end();
});

router.get("/download", async (req, res) => {
  res.render("error", {
    error: { status: "404", message: "Need a download key" }
  });
});

router.get("/download/:fileKey", async (req, res) => {
  // Check if the file exists in s3; if it doesn't, 404
  const s3 = new aws.S3();
  const fileKey = req.params.fileKey;
  try {
    const result = await s3
      .headObject({
        Bucket: keys.s3Bucket,
        Key: fileKey
      })
      .promise();

    res.render("download", { fileKey });
  } catch (err) {
    res.render("error", {
      error: { status: err.statusCode, message: err.message }
    });
  }
});

module.exports = router;
