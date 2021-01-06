const express = require("express");
const path = require("path")
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const usersRoutes = require("./routes/users")

const app = express();
mongoose
    .connect(
        "mongodb+srv://mak:xAmR8K4SxVyiZm5X@mangodbcluster.rgwvb.mongodb.net/mpiot-db?retryWrites=true&w=majority"
    )
    .then(() => {
        console.log("connected to database!");
    })
    .catch(() => {
        console.log("connection to database failed");
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images",express.static(path.join("storage/images")))


app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type,Accept"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET,POST,PATCH,PUT,DELETE,OPTIONS"
    );
    next();
});

app.use("/api/users",usersRoutes);

module.exports = app;