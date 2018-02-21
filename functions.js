const fs = require("fs");
// Objects where all the information will be stored and accessed
let reservationObject = {};
let restoObject = {};

// Generates random number that will be given to each Restaurant in case mulitple restaurants from the same branch enter the system
// Avoids conflict if there are two McDonalds for example
function GenRandID() { return Math.floor(Math.random() * 1000000000000); }

// Adds a reservation to the restaurant object with it's own ID
function CreateReservationObject(obj) {
  let phoneNumber = obj.originalRequest.data.From;
  let parameters = obj.result.parameters;
  let valid = ValidateReservation(phoneNumber, parameters);
  if (valid === true) {
    reservationObject[phoneNumber] = parameters;
    // SAVE reservationObject[phoneNumber] HERE
    let numberOfPeople = parameters['number-integer'] === "1" ? "1 person" : parameters['number-integer'] + " people";
    let time = parameters.time.slice(0, -3);
    return "Created a reservation for " + numberOfPeople + " in " + parameters['geo-city'] + " at " + time + " with success!";
  }
  else return valid;
}

function ValidateReservation(phoneNumber, parameters) {
  console.log(parameters);
  console.log("===========");
  console.log(reservationObject[phoneNumber]);
  if (parameters['number-integer'] === "0") { return "You can't make a reservation for zero people!" }
  if (!reservationObject[phoneNumber]) { return true; }
  if ((reservationObject[phoneNumber].time === parameters.time) && (reservationObject[phoneNumber].date === parameters.date)) { return "You already have a reservation during that day at that time!"; }
  else if (parameters['number-integer'] === "0") { return "You can't make a reservation for zero people!" }
  else if (false) { }
  else { return true; }
}

// Adds a restaurant to the restaurant object with it's own ID
function CreateRestoObject(obj) {
  restoObject[GenRandID()] = obj;
  fs.writeFileSync("restoObject.json", JSON.stringify(restoObject));
}

module.exports = {
  GenRandID,
  CreateReservationObject,
  CreateRestoObject
}