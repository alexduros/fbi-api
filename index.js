#!/usr/local/bin/node

var program = require("commander");
var FFBBLogin = require("./login");
var FFBBSchedule = require("./schedule");

function credentials(val) {
  var creds = val.split(":");
  return {
    login: creds[0],
    password: creds[1]
  }
}

function dateRange(val) {
  var range = val.split("...");
  return {
    start: creds[0],
    end: creds[1]
  }
}


program
  .version("1.0.0")
  .option("-l, --login <login>:<password>",    "set FFBB extranet credentials", credentials)
  // .option("-s, --schedule <start>...<end>", "get schedule for the given start and end date")
  .option("-s, --schedule ", "get full schedule for whole year")
  .parse(process.argv);

if (program.schedule) {
  FFBBLogin.authenticateFBI(program.login)
    .then(FFBBSchedule.listGames)
    .then(function(games) { console.log("next games", games); })
}

