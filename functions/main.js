const fs = require("fs");
const display = require("./display.js");
const account = require("./account.js");
const deleteRes = require("./delete.js");
const settings = require("./settings.js");
const restaurant = require("./restaurant.js");
const reservation = require("./reservation.js");
const reservationValidate = require("./reservationValidation");
const utilities = require("./utility.js");

let reservations = {}; // Object containing all the info about the reservations
let restaurants = {}; // Object containing all the info about the restaurants
let passwords = {}; // Object containing all the info about the accounts

try { // Verifies if a list of reservations already exists
  reservations = JSON.parse(fs.readFileSync("./functions/JSONobj/reservations.json"));
} catch (err) { }
try { // Verifies if a list of restaurants already exists
  restaurants = JSON.parse(fs.readFileSync("./functions/JSONobj/restaurants.json"));
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
    let restoValid = restaurant.CreateRestoObject(info, restaurants);
    if (restoValid.validation) {
      fs.writeFileSync("./functions/JSONobj/passwords.json", JSON.stringify(register.obj));
      fs.writeFileSync("./functions/JSONobj/restaurants.json", JSON.stringify(restaurant.AddRestaurant(info, restaurants)));
    }
    return restoValid.answer;
  }
  else { return register.answer; }
}

// Verifies if the username and password are valid during user login
function RestaurantLogIn(info) { return account.ValidateLogIn(info, passwords); }

function UserCreateReservation(info) {
  let confirmation = reservationValidate.ValidateUserReservation(info, reservations);
  if (confirmation.validation) {
    let makeReservation = reservation.AddUserReservation(info, reservations);
    fs.writeFileSync("./JSONobj/reservations.json", JSON.stringify(makeReservation.obj));
    return { "speech": makeReservation.answer }
  }
  return confirmation.answer;
}

// Adds a reservation to the reservation object using the clients phone number as the unique ID
// Saves the reservation object in a file
// Returns the confirmation message once everything is made
function CreateReservation(info) {
  switch (info.result.action) {
    // Client confirms if they want to make the reservation or not
    case 'Reservation-Create.Reservation-Confirmation':
      let makeReservation = reservation.AddReservation(info, reservations);
      fs.writeFileSync("./functions/JSONobj/reservations.json", JSON.stringify(makeReservation.obj));
      return { "speech": makeReservation.answer };
    case 'Reservation-Create.Reservation-Options':
      let choice = { 0: info.result.contexts.filter(context => context.name === "reservationoption")[0].parameters.choice[info.result.parameters['number-integer'] - 1] }
      return {
        "speech": "Confirm reservation?" + utilities.Confirmation(choice, 1, false),
        contextOut: [{
          "name": "reservationconfirmation",
          parameters: { choice },
          "lifespan": 1
        }]
      }
    case 'Reservation-Display':
      return { "speech": display.DisplayClientReservations(info, reservations) }
    case 'Reservation-Delete':
      let deleteReservation = deleteRes.DeleteClientReservations(info, reservations);
      if (deleteReservation.validation) { fs.writeFileSync("./functions/JSONobj/reservations.json", JSON.stringify(deleteReservation.obj)); }
      return { "speech": deleteReservation.answer }
    default:
      let confirmation = reservationValidate.ValidateReservation(info, reservations, restaurants);
      if (confirmation.validation === true) { return { "speech": confirmation.answer, contextOut: confirmation.contextOut } }
      else { return { "speech": confirmation.answer, contextOut: confirmation.contextOut } }
  }
}

// Recieves resto number, date and time
function DisplayAllResto(info) { console.log(info); return display.DisplayRestoReservations(info, reservations); }

function ClearAll(info) {
  let clearReservations = deleteRes.CancelAllReservations(info, reservations);
  if (clearReservations.validation) { fs.writeFileSync("./functions/JSONobj/reservations.json", JSON.stringify(clearReservations.obj)); }
  return { "speech": clearReservations.answer }
}

function CancelReservation(info) {
  let cancelReservation = deleteRes.CancelRestoReservations(info, reservations);
  fs.writeFileSync("./functions/JSONobj/reservations.json", JSON.stringify(cancelReservation.obj));
  return { "speech": cancelReservation.answer }
}

function ChangeSettings(info) {
  let change = settings.RestoSettings(info, restaurants);
  if (change.validation) { fs.writeFileSync("./functions/JSONobj/restaurants.json", JSON.stringify(change.obj)); }
  return change.answer;
}
// restoPhone
// tables {tables}

module.exports = {
  CreateReservation,
  RegisterRestaurant,
  RestaurantLogIn,
  DisplayAllResto,
  ClearAll,
  CancelReservation,
  UserCreateReservation,
  ChangeSettings
}