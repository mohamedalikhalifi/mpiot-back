const express = require("express");
const eventsRouter = express.Router();
const Event = require("../models/event")
const User = require("../models/user")
const mqtt = require("mqtt")
const mongoose = require("mongoose");


const client = mqtt.connect('mqtt://broker.hivemq.com')

function storeEventMessage(message) {
    let event;
    let id;
    try{id = mongoose.Types.ObjectId(message)}
    catch{}
    User.findById(id).then((user)=>{
        if(user){
            event = new Event({
                userId: id,
                firstName:user.firstName,
                lastName:user.lastName,
                access:user.access,
                date: new Date().toUTCString()
            })
        }
        else{
            event = new Event({
                userId: message,
                firstName:'Unknown',
                lastName:'Unknown',
                access:false,
                date: new Date().toUTCString()
            })
        }
        event.save();
    })
    .catch(err => {
        event = new Event({
            userId: message,
            firstName:'Unknown',
            lastName:'Unknown',
            access:false,
            date: new Date().toUTCString()
        })
        event.save();
    })
}

client.on('connect', () => {
    console.log("connected to MQTT broker")
    client.subscribe('AccessRequested')
})

client.on('message', (topic, message) => {
    if (topic === 'AccessRequested') {
        storeEventMessage(message.toString());
        console.log(message.toString())
    }
})

eventsRouter.get("", (req, res, next) => {
    Event.find().then((documents) => {
        console.log(documents);
        res.status(200).json({
            message: "Events fetched successfully",
            events: documents
        });
    });
});

eventsRouter.delete("", (req, res, next) => {
    Event.deleteMany({}).then(result => {
        console.log(result);
        res.status(200).json({ message: "Events deleted!" })
    });
});

module.exports = eventsRouter;
