const main = require("./functions/main.js");
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.raw({ type: "*/*" }));

// Let's a restaurant create an account
app.post("/signup", (req, res) => {
  let json = JSON.parse(req.body);
  return res.send(JSON.stringify(main.RegisterRestaurant(json)));
});
// Let's a restaurant log into their account, they can then manage their reservations
app.post("/login", (req, res) => {
  let json = JSON.parse(req.body);
  return res.send(JSON.stringify(main.RestaurantLogIn(json)));
});
// Let's a restaurant change the settings of their restaurant for example the number of Nb2Seaters, Nb3Seaters, etc.
app.post("/settings", (req, res) => {
  let json = JSON.parse(req.body);
  return res.send(JSON.stringify(main.ChangeSettings(json)));
});
// Reservations cancelled by the restaurant
app.post("/cancelReservation", (req, res) => {
  let json = JSON.parse(req.body);
  return res.send(JSON.stringify(main.CancelReservation(json)));
});
// Lets the restaurant delete all of their reservations for the day
app.post("/clearAll", (req, res) => {
  let json = JSON.parse(req.body);
  return res.send(JSON.stringify(main.ClearAll(json)));
});
// Recieves resto number, date and time
app.post("/displayReservations", (req, res) => {
  let json = JSON.parse(req.body);
  return res.send(JSON.stringify(main.DisplayAllResto(json)));
});
// Reservations confirmed by the restaurant
app.get("/userConfirm", (req, res) => {
  return res.send("");
});
// Takes the text the user sends to RestoBot and sends RestoBots response
app.post("/message", (req, res) => {
  let json = JSON.parse(req.body);
  return res.send(JSON.stringify(main.CreateReservation(json)));
});

app.listen(3000);