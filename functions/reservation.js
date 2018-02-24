/*
    This is the page that manages everything related to the reservation object information
*/
const utilities = require("./utility.js");

// Adds a reservation to the reservation object using the clients phone number as the unique ID
function AddReservation(obj, reservationObject) {
    let phoneNumber = obj.originalRequest.data.From; // This is where the clients phone number is stored when RestoBot is messaged, this will be used as the reservations unique ID if the reservation is valid
    let parameters = obj.result.contexts.filter(context => context.name === "confirmreservation")[0].parameters; // This is where all the information needed to make a reservation is being kept  
    let nbOfPeople = parameters.choice[0].nbPeople === "1" ? "1 person" : parameters.choice[0].nbPeople + " people"; // Not usefull, just good grammar
    let nbSeats = parameters.choice[0].nbSeats; // Number of seats needed
    let date = parameters.date; // We will need it later
    let time = parameters.time.slice(0, -3); // Would usually display HH:MM:SS, now simply displays HH:MM
    let hourIn = utilities.CheckTime(parameters.time); // See the CheckTime function
    let hourOut = hourIn + 1; // Lets us store the hour the reservation should end
    let dateTime = date + "/" + time; // Lets us use a unique key to differenciate every reservation
    let singleReservation = {}; // Object containing all of the sub info
    singleReservation[dateTime] = { // Stores the new reservation into a mini reservation object, could use parameters but we are adding additionnal information
        client: parameters['given-name'], // The client's name
        phoneNumber, // The clients phone number
        restaurant: parameters.name, // The restaurants name
        city: parameters['geo-city'], // The city in which the restaurant is
        nbOfPeople, // The number of people who will be present
        nbSeats, // The number of seats that will be taken
        date, // The date the reservation will take place
        time, // The time the reservation will take place
        hourIn, // The time the reservation begins
        hourOut, // The time the reservation ends
        isCancelled: false // Determines if the reservation has been cancelled, because it has just been create, it is set to false by default
    }
    reservationObject[phoneNumber] = singleReservation; // Stores the new reservation into the reservation object, could use parameters but we are adding additionnal information
    // Returns the confirmation message once everything is made
    return {
        obj: reservationObject,
        subObj: singleReservation,
        answer: "Created a reservation under the name of " + parameters['given-name'] + " at " + parameters['name'] +
            " for " + nbOfPeople + " in " + parameters['geo-city'] + " on " + parameters.date + " at " + time + " with success!"
    };
}

module.exports = {
    AddReservation
}