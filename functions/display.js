/*
    This page manages everything related to displaying the reservations on screen
*/

const utilities = require("./utility.js");

function DisplayRestoReservations(info, reservations) {
    console.log("DisplayRestoReservations");
    let dateTime = info.date + "/" + info.time;
    let arr1 = Object.keys(reservations).filter(clientNumber =>
        reservations[clientNumber][dateTime]);
    let arr = arr1.filter(clientNumber =>
        reservations[clientNumber][dateTime].restoNumber === info.restoPhone &&
        reservations[clientNumber][dateTime].isCancelled === false);
    let obj = arr.map((x, i) => reservations[x]);
    return obj;
}

function DisplayClientReservations(info, reservations) {
    console.log("DisplayClientReservations");
    let clientNumber = info.originalRequest.data.From.slice(1); // The clients phone number, used to search the clients reservations
    let clientReservations = reservations[clientNumber];
    let arr = Object.keys(clientReservations).filter(dateTime =>
        clientReservations[dateTime].isOver === false &&
        clientReservations[dateTime].isCancelled === false);
    if (arr.length === 0) { return "You do not have any reservations!"; }
    let string = "\n";
    for (let i = 0; i < arr.length; i++) {
        let dateTime = arr[i];
        string = string + "\n" +
            "Restaurant : " + clientReservations[dateTime].restaurant + "\n" +
            "Phone : " + clientReservations[dateTime].restoNumber + "\n" +
            "City : " + clientReservations[dateTime].city + "\n" +
            "Address : " + clientReservations[dateTime].address + "\n" +
            "Date : " + clientReservations[dateTime].date + "\n" +
            "Time : " + clientReservations[dateTime].time + "\n";
    }
    return string;
}

module.exports = {
    DisplayRestoReservations,
    DisplayClientReservations
}