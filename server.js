const functions = require("./functions");
const fs = require("fs");
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.raw({ type: "*/*" }));

app.post("/message", (req, res) => {
  let json = JSON.parse(req.body);
  console.log(json); 
  console.log(json.Body);
  console.log(json.From);
  res.send("<Response><Message>" + json.Body + "</Message></Response>");
});


app.get("/", (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});