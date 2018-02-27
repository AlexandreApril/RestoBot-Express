/*
    This page manages everything related to the restaurants settings
*/

const utilities = require("./utility.js");

function RestoSettings(info, restaurants) {
    console.log(info);
    console.log(restaurants);

    restaurants[info.restoPhone][Nb2Seaters] = info.tables.nb2Seat;
    restaurants[info.restoPhone][Nb4Seaters] = info.tables.nb4Seat;
    restaurants[info.restoPhone][Nb6Seaters] = info.tables.nb6Seat;
    restaurants[info.restoPhone][Nb8Seaters] = info.tables.nb8Seat;
    console.log(restaurants);
    return restaurants;
}

module.exports = {
    RestoSettings
}