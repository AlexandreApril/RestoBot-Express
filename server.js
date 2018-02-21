const functions = require("./functions");
const fs = require("fs");
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.raw({ type: "*/*" }));

app.get("/", (req, res) => { res.sendFile(__dirname + '/views/index.html'); });
app.post("/signup", (req, res) => {
  let json = JSON.parse(req.body);
  res.send(functions.RegisterRestaurant(json));
});
app.post("/login", (req, res) => {
  let json = JSON.parse(req.body);
  res.send(functions.RegisterRestaurant(json));
});
app.post("/message", (req, res) => {
  var json = JSON.parse(req.body);
  res.send(JSON.stringify({ speech: functions.CreateReservationObject(json) }));
});

app.listen(3000);