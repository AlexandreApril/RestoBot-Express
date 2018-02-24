const fs = require("fs");
const account = require("./account.js");
const restaurant = require("./restaurant.js");
const reservation = require("./reservation.js");
const reservationValidate = require("./reservationValidation");
const utilities = require("./utility.js");

let reservationObject = {}; // Object containing all the info about the reservations
let restoObject = {}; // Object containing all the info about the restaurants
let passwords = {}; // Object containing all the info about the accounts

try { // Verifies if a list of reservations already exists
  reservationObject = JSON.parse(fs.readFileSync("./functions/JSONobj/reservationObject.json"));
} catch (err) { }
try { // Verifies if a list of reservations already exists
  singleReservation = JSON.parse(fs.readFileSync("./functions/JSONobj/singleReservation.json"));
} catch (err) { }
try { // Verifies if a list of restaurants already exists
  restoObject = JSON.parse(fs.readFileSync("./functions/JSONobj/restoObject.json"));
} catch (err) { }
try { // Verifies if a list of passwords already exists
  passwords = JSON.parse(fs.readFileSync("./functions/JSONobj/passwords.json"));
} catch (err) { }

// Verifies if the restaurant already exists or not in the restaurant object by comparing the phone numbers
// Validates if the username has not been taken
// Validates if the Restaurant has not already been registered in the database
// Saves the account information and the restaurant object in a file
function RegisterRestaurant(info) {
  let register = account.ValidateRegistration(info, passwords);
  if (register.validation) {
    let restoValid = restaurant.CreateRestoObject(info, restoObject);
    if (restoValid.validation) {
      fs.writeFileSync("./functions/JSONobj/passwords.json", JSON.stringify(register.obj));
      fs.writeFileSync("./functions/JSONobj/restoObject.json", JSON.stringify(restaurant.AddRestaurant(info, restoObject)));
    }
    return restoValid.answer;
  }
  else { return register.answer; }
}

// Verifies if the username and password are valid during user login
function RestaurantLogIn(info) {
  if (account.ValidateLogIn(info, passwords)) { return "Login successful!"; }
  else { return "Your username or password are incorrect!"; }
}

// Adds a reservation to the reservation object using the clients phone number as the unique ID
// Saves the reservation object in a file
// Returns the confirmation message once everything is made
function CreateReservation(info) {
  switch (info.result.action) {
    case 'Reservations.Reservations-Confirmation':
      let reservationObj = reservation.AddReservation(info, reservationObject);
      fs.writeFileSync("./functions/JSONobj/singleReservation.json", JSON.stringify(reservationObj.subObj));
      fs.writeFileSync("./functions/JSONobj/reservationObject.json", JSON.stringify(reservationObj.obj));
      return { "speech": reservationObj.answer };
    case 'Reservations.Reservations-Choice':
      let choice = { 0: info.result.contexts.filter(context => context.name === "availablerestaurants")[0].parameters.choice[info.result.parameters['number-integer'] - 1] }
      return {
        "speech": "Confirm reservation?" + utilities.Confirmation(choice, 1),
        contextOut: [{
          "name": "confirmReservation",
          parameters: { choice },
          "lifespan": 1
        }]
      }
    default:
      let confirmation = reservationValidate.ValidateReservation(info, reservationObject, restoObject);
      if (confirmation.validation === true) {
        return { "speech": confirmation.answer, contextOut: confirmation.contextOut }
      }
      else { return { "speech": confirmation.answer } }
  }
}

module.exports = {
  CreateReservation,
  RegisterRestaurant,
  RestaurantLogIn
}