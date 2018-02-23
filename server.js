const functions = require("./functions");
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.raw({ type: "*/*" }));

//app.get("/", (req, res) => { res.sendFile(__dirname + '/views/index.html'); });
app.post("/signup", (req, res) => {
  let json = JSON.parse(req.body);
  res.send(JSON.stringify(functions.RegisterRestaurant(json)));
});
app.post("/login", (req, res) => {
  let json = JSON.parse(req.body);
  res.send(JSON.stringify(functions.RestaurantLogIn(json)));
});
app.post("/settings", (req, res) => {
  let json = JSON.parse(req.body);
  res.send(JSON.stringify(functions.ChangeSettings(json)));
});
app.get("/clearAll", (req, res) => {
  let json = JSON.parse(req.body);
  res.send(JSON.stringify(functions.ClearAll()));
});
app.post("/cancelReservation", (req, res) => { res.send(""); }); // Reservations cancelled
app.get("/userConfirm", (req, res) => { res.send(""); }); // Reservations confirmed by the resto

// Takes the text the user sends to RestoBot and sends RestoBots response
app.post("/message", (req, res) => {
  let json = JSON.parse(req.body);
  res.send(JSON.stringify(functions.CreateReservationObject(json)));
});

app.listen(3000);