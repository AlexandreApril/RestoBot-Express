/*
    This is the page that manages everything related to the restaurant object information
*/

// Verifies if the restaurant already exists or not in the restaurant object by comparing the phone numbers
// If none of the numbers match, adds the restaurant to the restaurant object
// If one of the numbers match, the restaurant is not added
// signupInfo => information of the account
// restoInfo => restaurant object
function CreateRestoObject(restoInfo, restoObj) {
    if (restoObj[restoInfo.phoneNumber]) { return { validation: false, answer: "This restaurant has already been registered!" } }
    let conflitcs = Object.keys(restoObj).filter(phoneNumber =>
        restoObj[phoneNumber].Address === restoInfo.address &&
        restoObj[phoneNumber].Name === restoInfo.name);

    console.log(conflitcs.length);
    if (conflitcs.length > 0) { return { validation: false, answer: "A " + restoInfo.name + "restaurant has already been registered at this address!" } }
    else { return { validation: true, answer: "You have successfully created a new account and registered your restaurant!" } }
}

// Adds a restaurant to the restaurant object using it's phone number as the unique ID
function AddRestaurant(restoInfo, restoObj) {
    restoObj[restoInfo.phoneNumber] = { // Creates a new restaurant object with it's phone number as unique ID
        Username: restoInfo.username, // Account username
        Email: restoInfo.email, // Account email
        Name: restoInfo.name, // Name of the restaurant
        City: restoInfo.city, // Name of the city in which the restaurant is
        Address: restoInfo.address, // The address of the restaurant
        Phone: restoInfo.phoneNumber, // The phone number of the restaurant
        OpenHours: restoInfo.openHours, // The hour when the restaurant opens
        CloseHours: restoInfo.closeHours, // The hour when the restaurant closes
        Nb2Seaters: restoInfo.nb2Seaters, // The number of 2 table seats available
        Nb4Seaters: restoInfo.nb4Seaters, // The number of 4 table seats available
        Nb6Seaters: restoInfo.nb6Seaters, // The number of 6 table seats available
        Nb8Seaters: restoInfo.nb8Seaters // The number of 8 table seats available
    }
    return restoObj;
}

module.exports = {
    CreateRestoObject,
    AddRestaurant
}