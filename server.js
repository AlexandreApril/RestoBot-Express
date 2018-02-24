const main = require("./functions/main.js");
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.raw({ type: "*/*" }));

//app.get("/", (req, res) => { res.sendFile(__dirname + '/views/index.html'); });
// Let's a restaurant create an account
app.post("/signup", (req, res) => {
  let json = JSON.parse(req.body);
  res.send(JSON.stringify(main.RegisterRestaurant(json)));
});
// Let's a restaurant log into their account, they can then manage their reservations
app.post("/login", (req, res) => {
  let json = JSON.parse(req.body);
  res.send(JSON.stringify(main.RestaurantLogIn(json)));
});
// Let's a restaurant change the settings of their restaurant for example the number of Nb2Seaters, Nb3Seaters, etc.
app.post("/settings", (req, res) => {
  let json = JSON.parse(req.body);
  res.send(JSON.stringify(main.ChangeSettings(json)));
});
// Reservations cancelled by either the user of the restaurant
app.post("/cancelReservation", (req, res) => {
  let json = JSON.parse(req.body);
  res.send("");
});
// Lets the restaurant delete all of their reservations for the day
app.get("/clearAll", (req, res) => {
  let json = JSON.parse(req.body);
  res.send(JSON.stringify(main.ClearAll()));
});
// Reservations confirmed by the restaurant
app.get("/userConfirm", (req, res) => {
  res.send("");
});
// Takes the text the user sends to RestoBot and sends RestoBots response
app.post("/message", (req, res) => {
  let json = JSON.parse(req.body);
  res.send(JSON.stringify(main.CreateReservation(json)));
});
app.listen(3000);