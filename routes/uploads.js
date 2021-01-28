const express = require("express");
const uploadsRouter = express.Router();
const User = require("../models/user")
const multer = require('multer')
const fs = require('fs');
const { path } = require("../app");
const redis = require("redis");
const redisConfig = require("../config/redis");
const { Console } = require("console");

const client = redis.createClient(redisConfig);

const MYME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg'
};

var index = 1;
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("saving uploads")
    var error = new Error("Invalid mime type!");
    if (isValid = MYME_TYPE_MAP[file.mimetype]) {
      error = null
    }
    const id = req.params.id
    const path = './uploads/' + id
    if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });
    return cb(error, path)
  },
  filename: function (req, file, cb) {
    const ext = MYME_TYPE_MAP[file.mimetype];
    const name = (index++) + '.' + ext;
    cb(null, name);
  }
});

var upload = multer({ storage: storage });

uploadsRouter.post('/:id', (req, res, next) => { index = 1; next() }, upload.array('files'), (req, res, next) => {
  const files = req.files;
  if (!files) {
    const error = new Error('No File')
    error.httpStatusCode = 400
    return next(error)
  }
  files.forEach(function (file) {
    const url = req.protocol + '://' + req.get("host");
    file.path = url + '/' + file.path;
    console.log(file.path);
  });
  res.send({ status: 'ok', data: files });
  next();
}, () => {
  console.log("Uploads ReceivedNewData")
  client.publish("Uploads", "ReceivedNewData", function () {
    console.log("Message Published");
  })
})

module.exports = uploadsRouter;
