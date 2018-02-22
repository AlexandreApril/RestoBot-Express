// Objects where all the information will be stored and accessed
let reservationObject = {};
let restoObject = {};
let passwords = {};

// Adds a restaurant to the restaurant object with it's own ID
function RegisterRestaurant(signupInfo) {
  let isUnique = Object.keys(restoObject).filter(phoneNumber => restoObject[phoneNumber].Phone === signupInfo.phoneNumber);
  if (isUnique.length < 1) { return CreateRestoObject(signupInfo); }
  else { return "This restaurant has already been registered"; }
}

// Adds a restaurant to the restaurant object with it's own ID
function CreateRestoObject(newObj) { // Needs Name, user, pass, email, phone, city, address, email, open, close
  let restoName = newObj.name; // Franchise
  let restoUser = newObj.user; // Accout name
  let restoPass = newObj.pass; // Account password
  let restoEmail = newObj.email;
  let restoPhone = newObj.phoneNumber;
  let restoCity = newObj.city;
  let restoAddress = newObj.address;
  let restoOpen = newObj.openHours;
  let restoClose = newObj.closeHours;
  if (passwords[restoUser]) { return "This username has already been taken!"; }
  passwords[restoUser] = restoPass; // SAVE passwords[restoUser] HERE
  restoObject[restoPhone] = {
    Name: restoName,
    User: restoUser,
    Email: restoEmail,
    City: restoCity,
    Address: restoAddress,
    Phone: restoPhone,
    OpenHours: restoOpen,
    CloseHours: restoClose,
    Nb2Seaters: 10,
    Nb4Seaters: 10,
    Nb6Seaters: 5,
    Nb8Seaters: 2
  } // SAVE restoObject[restoPhone] HERE
  return "This restaurant has successfully been registered!";
}

function RestaurantLogIn(loginInfo) {
  let username = loginInfo.username;
  let password = loginInfo.password;
  if (passwords[username] === password) { return "Login successful!"; }
  else if (!passwords[username]) { return "An account with that username does not exist!"; }
  else { return "Login failed!"; }
}

// Adds a reservation to the restaurant object with it's own ID
function CreateReservationObject(obj) {
  let phoneNumber = obj.originalRequest.data.From;
  let parameters = obj.result.parameters;
  let valid = ValidateReservation(phoneNumber, parameters);
  if (valid === true) {
    reservationObject[phoneNumber] = parameters; // SAVE reservationObject[phoneNumber] HERE
    //reservationObject[phoneNumber].parameters.can
    let numberOfPeople = parameters['number-integer'] === "1" ? "1 person" : parameters['number-integer'] + " people";
    let time = parameters.time.slice(0, -3);
    return { "speech": "Created a reservation at " + parameters.any + " for " + numberOfPeople + " in " + parameters['geo-city'] + " on " + parameters.date + " at " + time + " with success!" };
  }
  else return valid;
}

// Validates the reservation request. If the request is invalid, returns a string describing the reason as to why the request failed.
// In case of a failure, whatever is returned is what RestoBot will say to the user.
function ValidateReservation(phoneNumber, parameters) {
  if (JSON.stringify(restoObject) === "{}") { return "We're sorry, it would seem that our database does not contain any restaurants in it as of now."; }
  
  let restoName = parameters.name;
  let clientName = parameters['given-name'];
  let clientAmount = parameters['number-integer'];
  let clientCity = parameters['geo-city'];
  let reservationDate = parameters.date;
  let reservationTime = parameters.time;

  if (parameters['number-integer'] === "0") { return "You can't make a reservation for zero people!"; }

  let restoFound = Object.keys(restoObject).filter(restoID => restoObject[restoID].Name.toLowerCase() === parameters.name.toLowerCase() && restoObject[restoID].City.toLowerCase() === parameters['geo-city'].toLowerCase());
  if (restoFound.length < 1) { return "Our database does not containt a " + parameters.name + " in " + parameters['geo-city'] + ". Maybe they don't take reservations?"; }
  
  let restoOpenTime = restoFound;
  let restoCloseTime = restoFound;
  
  let reservationTime = parameters.time.split(":");
  let hours = parseInt(reservationTime[0]);
  let minutes = parseInt(reservationTime[1]);
  console.log("Reservations are from ", hours, ":", minutes, " to ", hours + 1, ":", minutes);

  switch (parseInt(parameters['number-integer'])) {
    case 1:
    case 2:
      let nbOf2Seaters = restoFound.filter(restoID => restoObject[restoID].Nb2Seaters > 1);
      if (nbOf2Seaters < 1) { return "There are no seats available at the desired time."; }
      break;
    case 3:
    case 4:
      let nbOf4Seaters = restoFound.filter(restoID => restoObject[restoID].Nb4Seaters > 1);
      if (nbOf4Seaters < 1) { return "There are no seats available at the desired time."; }
      break;
    case 5:
    case 6:
      let nbOf6Seaters = restoFound.filter(restoID => restoObject[restoID].Nb6Seaters > 1);
      if (nbOf6Seaters < 1) { return "There are no seats available at the desired time."; }
      break;
    case 7:
    case 8:
      let nbOf8Seaters = restoFound.filter(restoID => restoObject[restoID].Nb8Seaters > 1);
      if (nbOf8Seaters < 1) { return "There are no seats available at the desired time."; }
      break;
    default: return "I cannot make reservations for more than 8 people, in order to make such a big reservation, " +
      "please call the restaurant you are trying to go to.";
  }

  if (!reservationObject[phoneNumber]) { return true; }
  else if ((reservationObject[phoneNumber].time === parameters.time) &&
    (reservationObject[phoneNumber].date === parameters.date)) { return "You already have a reservation during that day at that time!"; }
  else if (false) { }
  else { return true; }


  if(restoFound.length >= 2) {
    var parameters = {};
    restoFound.map((x, i) => parameters[i] = x.address);
    return({
      "speech": "There are more than one restaurant which meet the criteria, please enter the number of the one you wish to make a reservation at.",
      contextOut: [
        {
          "name": "availableRestaurants",
          parameters,
          "lifespan": 5
        }]
    });
  }
}

module.exports = {
  //GenRandID,
  CreateReservationObject,
  CreateRestoObject,
  RegisterRestaurant,
  RestaurantLogIn
}