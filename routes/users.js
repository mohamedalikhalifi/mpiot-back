const express = require("express");
const router = express.Router();
const User = require("../models/user")
const multer = require('multer')

const MYME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg'
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let error = new Error("Invalid mime type!");
        if (isValid = MYME_TYPE_MAP[file.mimetype]){
            error = null
        }
        cb(error, "storage/profile-images")
    },
    filename: (res, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MYME_TYPE_MAP[file.mimetype]
        cb(null, name + '.' + ext)
    }
})

router.post("", multer({storage:storage}).single("image"), (req, res, next) => {
    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        access: Boolean(req.body.access),
        dateCreated: (new Date()).toUTCString(),
        imagePath:url+'/images/'+ req.file.filename
    });
    user.save().then(createdUser => {
        res.status(201).json({
            message: "User Added Successfully",
            user:{
                id: createdUser._id,
                firstName: createdUser.firstName,
                lastName:createdUser.lastName,
                access:createdUser.access,
                dateCreated: createdUser.dateCreated,
                imagePath: createdUser.imagePath
            }
            
        })
    });
});

router.put("/:id", (req, res, next) => {
    const user = new User({
        _id: req.body.id,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        access: Boolean(req.body.access),
        dateCreated: req.body.dateCreated
    });
    User.updateOne({ _id: req.params.id }, user).then(result => {
        console.log(result);
        res.status(200).json({ message: "Update successful!" });
    });
});

router.get("", (req, res, next) => {
    User.find().then((documents) => {
        console.log(documents);
        res.status(200).json({
            message: "users fetched successfully",
            users: documents
        });
    });
});

router.get("/:id", (req, res, next) => {
    User.findById(req.params.id).then((user) => {
        if (user) {
            res.status(200).json(user);
        }
        else {
            res.status(404).json({ message: "User Not Found!" })
        }
    });
});

router.delete("/:id", (req, res, next) => {
    console.log(req.params.id)
    User.deleteOne({ _id: req.params.id }).then(result => {
        console.log(result);
        res.status(200).json({ message: "user deleted!" })
    });
})


module.exports = router;
