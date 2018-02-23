// LINE 62 ALLOWS YOU TO CHANGE THE DURATION OF EVERY RESERVATION THAT WILL BE CREATED
const fs = require("fs");
let reservationObject = {}; // Object containing all the info about the reservations
let restoObject = {}; // Object containing all the info about the restaurants
let passwords = {}; // Object containing all the info about the accounts
let singleReservation = {};

try { // Verifies if a list of reservations already exists
  reservationObject = JSON.parse(fs.readFileSync("reservationObject.json"));
} catch (err) { }
try { // Verifies if a list of restaurants already exists
  restoObject = JSON.parse(fs.readFileSync("restoObject.json"));
} catch (err) { }
try { // Verifies if a list of passwords already exists
  passwords = JSON.parse(fs.readFileSync("passwords.json"));
} catch (err) { }
try { // Verifies if a list of passwords already exists
  singleReservation = JSON.parse(fs.readFileSync("singleReservation.json"));
} catch (err) { }

// Verifies if the restaurant already exists or not in the restaurant object by comparing the phone numbers
function RegisterRestaurant(signupInfo) {
  let isUnique = Object.keys(restoObject).filter(phoneNumber => restoObject[phoneNumber].Phone === signupInfo.phoneNumber);
  if (isUnique.length < 1) { return CreateRestoObject(signupInfo); } // If none of the numbers match, adds the restaurant to the restaurant object
  else { return "This restaurant has already been registered"; } // If one of the numbers match, the restaurant is not added
}
// Verifies if the username and password are valid during user login
function RestaurantLogIn(loginInfo) {
  if (!passwords[loginInfo.username]) { return "An account with that username does not exist!"; } // Verifies if the requested account exists
  else if (passwords[loginInfo.username] === loginInfo.password) { return "Login successful!"; } // Verifies if the password is correct 
  else { return "Login failed!"; } // If the password if incorrect, the login request fails
}
// Adds a restaurant to the restaurant object using it's phone number as the unique ID
function CreateRestoObject(obj) {
  if (passwords[obj.username]) { return "This username has already been taken!"; } // Verifies if the username is taken or not
  passwords[obj.username] = obj.password;
  fs.writeFileSync("passwords.json", JSON.stringify(passwords)); // Saves the account information
  restoObject[obj.phoneNumber] = { // Creates a new restaurant object with it's phone number as unique ID
    Username: obj.username, // Account username
    Email: obj.email, // Account email
    Name: obj.name, // Name of the restaurant
    City: obj.city, // Name of the city in which the restaurant is
    Address: obj.address, // The address of the restaurant
    Phone: obj.phoneNumber, // The phone number of the restaurant
    OpenHours: obj.openHours, // The hour when the restaurant opens
    CloseHours: obj.closeHours, // The hour when the restaurant closes
    Nb2Seaters: obj.nb2Seaters, // The number of 2 table seats available
    Nb4Seaters: obj.nb4Seaters, // The number of 4 table seats available
    Nb6Seaters: obj.nb6Seaters, // The number of 6 table seats available
    Nb8Seaters: obj.nb8Seaters // The number of 8 table seats available
  }
  fs.writeFileSync("restoObject.json", JSON.stringify(restoObject)); // Saves the restaurant object in a file
  return "This restaurant has successfully been registered!";
}
// Adds a reservation to the reservation object using the clients phone number as the unique ID
function CreateReservationObject(obj) {
  let phoneNumber = obj.originalRequest.data.From; // This is where the clients phone number is stored when RestoBot is messaged, this will be used as the reservations unique ID if the reservation is valid
  let parameters = obj.result.parameters; // This is where all the information needed to make a reservation is being kept
  let valid = ValidateReservation(phoneNumber, parameters); // See the ValidateReservation function, used to validate every reservation request
  if (valid === true) { // If the reservation is accepted, creates the reservation and stores it in the reservation object
    let numberOfPeople = parameters['number-integer'] === "1" ? "1 person" : parameters['number-integer'] + " people"; // Not usefull, just good grammar
    let nbSeats = CheckSeats(parseInt(parameters['number-integer'])); // See the CheckSeats function
    let time = parameters.time.slice(0, -3); // Would usually display HH:MM:SS, now simply displays HH:MM
    let hourIn = CheckTime(parameters.time); // See the CheckTime function
    let hourOut = hourIn + 1; // Lets us store the hour the reservation should end
    let dateTime = parameters.date + "/" + time; // Lets us use a unique key to differenciate every reservation
    singleReservation[dateTime] = { // Stores the new reservation into a mini reservation object, could use parameters but we are adding additionnal information
      client: parameters['given-name'], // The client's name
      phoneNumber, // The clients phone number
      restaurant: parameters['name'], // The restaurants name
      city: parameters['geo-city'], // The city in which the restaurant is
      nbPeople: numberOfPeople, // The number of people who will be present
      nbSeats, // The number of seats that will be taken
      date: parameters.date, // The date the reservation will take place
      time, // The time the reservation will take place
      hourIn, // The time the reservation begins
      hourOut, // The time the reservation ends
      isCancelled: false // Determines if the reservation has been cancelled, because it has just been create, it is set to false by default
    }
    reservationObject[phoneNumber] = singleReservation; // Stores the new reservation into the reservation object, could use parameters but we are adding additionnal information
    fs.writeFileSync("singleReservation.json", JSON.stringify(singleReservation)); // Saves the reservation information
    fs.writeFileSync("reservationObject.json", JSON.stringify(reservationObject)); // Saves the reservation object in a file
    return { // Returns the confirmation message once everything is made
      "speech": "Created a reservation under the name of " + parameters['given-name'] + " at " + parameters['name'] +
        " for " + numberOfPeople + " in " + parameters['geo-city'] + " on " + parameters.date + " at " + time + " with success!"
    };
  }
  else return valid;
}
// Validates every reservation request. If the request is invalid, returns a string describing the reason as to why the request failed.
// In case of a failure, whatever is returned is what RestoBot will say to the user.
function ValidateReservation(phoneNumber, parameters) {
  // No reservations can be made if there are no restaurants to make reservations from
  if (JSON.stringify(restoObject) === "{}") { return "I'm sorry, it would seem that my database does not contain any restaurants."; }

  let restoName = parameters.name; // Needed to find if the desired restaurant exists in the restaurant object
  let restoCity = parameters['geo-city']; // Checks if restaurant exists in that area
  let date = parameters.date; // Needed for when we are going to find the number of available spots
  let time = parameters.time.slice(0, -3); // Needed to figure out when the reservation will take place, would usually display HH:MM:SS, now simply displays HH:MM
  let dateTime = date + "/" + time; // Needed to make sure a client does not make two reservations at the same time
  let hourIn = CheckTime(parameters.time); // See the CheckTime function
  let hourOut = hourIn + 1; // Lets us store the hour the reservation should end
  let nbSeats = CheckSeats(parseInt(parameters['number-integer'])); // See the CheckSeats function

  if (nbSeats === 0) { return "You can't make a reservation for zero people!"; }
  else if (nbSeats === 10) {
    return "I cannot make reservations for more than 8 people, if you wish to make reservations for big groups, " +
      "please contact the restaurant directly.";
  }

  if (reservationObject[phoneNumber]) { // Verifies if an object with that ID (phone number) exists, or else what's inside would cause an error
    // Verifies the client isn't trying to making two reservations at the same time, on the same day
    // Clients cannot make reservations withing half an hour of one another since each reservation lasts one hour
    let test = Object.keys(reservationObject[phoneNumber]).filter(param =>
      reservationObject[phoneNumber][param].date === date &&
      (reservationObject[phoneNumber][param].hourIn === hourIn ||
        reservationObject[phoneNumber][param].hourIn + 0.5 === hourIn ||
        reservationObject[phoneNumber][param].hourIn - 0.5 === hourIn));
    if (test.length >= 1) { return "You've already made a reservation on the " + date + " at " + time; }
  }

  let restoFound = Object.keys(restoObject).filter(restoID => // Verifies if there is the desired Restaurant at the requested city
    restoObject[restoID].Name.toLowerCase() === parameters.name.toLowerCase() && // .toLowerCase is to prevent any possible errors
    restoObject[restoID].City.toLowerCase() === restoCity.toLowerCase());
  if (restoFound.length < 1) { return "Our database does not containt a " + restoName + " in " + parameters['geo-city'] + ". Maybe they don't take reservations?"; }

  let conflictingReservations = Object.keys(reservationObject).filter(reservationID => // Finds every reservation at the same place and time and keeps the total
    reservationObject[reservationID].name === restoName && // Finds reservations at the same restaurant
    reservationObject[reservationID].city === city && // Finds reservations at the same city
    reservationObject[reservationID].nbSeats === nbSeats && // Finds reservations that require the same amount of seats
    reservationObject[reservationID].date === date && // Finds every reservation on the same day as the clients
    (hourIn <= reservationObject[reservationID].hourIn <= hourOut || // Finds every reservation that would begin during the clients reservation
      hourIn <= reservationObject[reservationID].hourOut <= hourOut)); // Finds every reservation that would end during the clients reservation

  let seatsNeeded; // Variable must be declared here
  switch (nbSeats) { // Allows us to determine which 'Nb#Seaters' we need to use when looking for any available reservations
    case 2: seatsNeeded = 'Nb2Seaters'; break; // If nbSeats is 2, we need to look in the Nb2Seaters property
    case 4: seatsNeeded = 'Nb4Seaters'; break; // If nbSeats is 4, we need to look in the Nb4Seaters property
    case 6: seatsNeeded = 'Nb6Seaters'; break; // If nbSeats is 6, we need to look in the Nb6Seaters property
    case 8: seatsNeeded = 'Nb8Seaters'; break; // If nbSeats is 8, we need to look in the Nb8Seaters property
    default: return "You shouldn't be seeing this..."; // nbSeats should only have a value of 2, 4, 6 or 8 due to earlier functions
  }
  let restoAvailable = restoFound.filter(restoID => restoObject[restoID][seatsNeeded] > conflictingReservations.length); // Finds if there are any seats left at the time the clients reservation would take place
  if (restoAvailable.length === 0) { return "There are no seats available at the desired time."; } // If no seats are avaiable, returns to the client
  else if (restoAvailable.length >= 2) { // If there are multiple restaurants that meet the criteria of the client, displays a list to the client and the client is then invited to pick where they wish to go
    let parameters = {};
    restoFound.map((x, i) => parameters[i] = x.address);
    return {
      "speech": "There are more than one restaurant which meet the criteria, please enter the number of the one you wish to make a reservation at.",
      contextOut: [
        {
          "name": "availableRestaurants",
          parameters,
          "lifespan": 5
        }]
    };
  }
  else { return true; } // If there is only one, creates the reservation
}
// Used when creating a reservation, takes the value 'time' recieved and converts it into a number we can use when flitering through the reservation objects
function CheckTime(time) {
  let reservationTime = time.split(":"); // example "15:30:00" =>  [ 15, 30, 00 ]
  let hours = parseInt(reservationTime[0]); // example hours = 15
  let minutes = parseInt(reservationTime[1]); // example minutes = 30
  if (minutes < 30) { minutes = 0; } // Rounds down the minutes so that reservations are only made every half hour
  else if (minutes > 30) { minutes = 30; } // example reservation => 15:00 or 15:30 and nothing else
  if (minutes === 30) { hours = hours + 0.5; } // Converts the time into a value we can use later for our comparisons
  return hours;
}
// Used when creating a reservation, takes the number of people expected to go and finds the numbers of seats needed to seat them all
function CheckSeats(nbPeople) {
  switch (nbPeople) {
    case 0: return 0; // If nbPeople is 0, reservation is declined because you cannot make a reservation for 0 people
    case 1:
    case 2: return 2; // If nbPeople is 1 or 2, the reservation will take up a table that can seat 2 people
    case 3:
    case 4: return 4; // If nbPeople is 3 or 4, the reservation will take up a table that can seat 4 people
    case 5:
    case 6: return 6; // If nbPeople is 5 or 6, the reservation will take up a table that can seat 6 people
    case 7:
    case 8: return 8; // If nbPeople is 7 or 8, the reservation will take up a table that can seat 8 people
    default: return 10; // If the nbPeople is greater than 8, the client is invited to contact the restaurant directly to make the reservation
  }
}

module.exports = {
  CreateReservationObject,
  CreateRestoObject,
  RegisterRestaurant,
  RestaurantLogIn
}