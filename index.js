#!/usr/local/bin/node

var program = require("commander");
var _ = require("lodash");

var Table = require("cli-table");

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
    start: range[0],
    end: range[1]
  }
}


program
  .version("1.0.0")
  .option("-l, --login <login>:<password>",    "set FFBB extranet credentials", credentials)
  .option("-s, --schedule <start>...<end>", "get schedule for the given start and end date")
  .parse(process.argv);

if (program.schedule) {
  FFBBLogin.authenticateFBI(program.login)
    .then(FFBBSchedule.listGames)
    .then(function(res) {
      if (res.count <= 0) {
        console.log('no games found.');
        return;
      }

      var games = res.games;
      var head = ["Date", "Heure", "Catégorie", "Numéro", "Équipe 1", "Équipe 2", "Lieu", "Adresse"];
      var table = new Table({ head: head });
      _.each(games, function(game) { return table.push(_.values(game)); });

      console.log(table.toString());
    })
}

