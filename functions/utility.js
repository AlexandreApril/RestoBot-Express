/*
    This file contains every utility function we might need
*/

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

function Confirmation(choice, nbItems) {
    let string = "\n";
    for (let i = 0; i < nbItems; i++) {
      let x = i + 1;
        string = string + "\n" +
            "Number : " + x + "\n" +
            "Name : " + choice[i].name + "\n" +
            "City : " + choice[i].city + "\n" +
            "Address : " + choice[i].address + "\n" +
            "Phone : " + choice[i].phone + "\n";
    }
    return string;
}

module.exports = {
    CheckTime,
    CheckSeats,
    Confirmation
}