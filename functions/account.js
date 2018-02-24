/*
    This is the page that manages everything related to the restaurants user accounts
*/

// Verifies if the username is taken or not
// signupInfo => information of the account
// accountInfo => passwords object
function ValidateRegistration(signupInfo, accountObj) {
    if (!accountObj[signupInfo.username]) {
        accountObj[signupInfo.username] = signupInfo.pass;
        return { validation: true, obj: accountObj };
    }
    else { return { validation: false, answer: "This username has already been taken!" } }
}

// Verifies if the username and password are valid during user login
function ValidateLogIn(loginInfo, accountObj) {
    if (accountObj[loginInfo.username] === loginInfo.password) { return true; } // Verifies if the password is correct 
    else { return false; } // If the password if incorrect, the login request fails
}

module.exports = {
    ValidateRegistration,
    ValidateLogIn
}