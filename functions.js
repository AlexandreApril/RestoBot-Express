const fs = require("fs");

let globalObject = {};

function GenRandID() {
  return Math.random() * 10000000000;
}

module.exports = {
  GenRandID
}