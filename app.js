const express = require("express");
const path = require("path")
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const usersRoutes = require("./routes/users")
const uploadsRoutes = require("./routes/uploads")
const eventsRoutes = require("./routes/events")

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

app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({limit:'50mb',  extended: true }));
app.use("/images",express.static(path.join("storage/images")))
app.use("/uploads",express.static(path.join("../uploads")))


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
app.use("/api/uploads",uploadsRoutes);
app.use("/api/events",eventsRoutes);

module.exports = app;