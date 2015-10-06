var Promise = require("bluebird");
var http = require("http");
var _ = require("lodash");

var fields = [ "resume", "date", "hour", "division", "id", "home", "visitors", "place", "address" ];

function parseGames(blob) {
  var res = JSON.parse(blob);
  var items = res.aaData;
  var games = _.map(items, function(game) {
    return _.reduce(fields, function(cur, next, i) {
      var regex = /<a href='#' onclick='return afficherDesignation\(0\)'' style='' title=''>(.*)<\/a><\/div>/ig;
      var value = regex.exec(game[i]);
      var nextProp = {};
      nextProp[next] = value && value[1];
      if (!_.isObject(cur)) { cur = {}; }
      _.assign(cur, nextProp);
      return cur;
    });
  })
  return { count: res.iTotalRecords, games: games };
}

function listGames(options) {
  var start = options.start,
      end = options.end,
      cookie = options.cookie;

  return new Promise(function(resolve, reject) {
    var options = {
      hostname: 'extranet.ffbb.com',
      port: 80,
      path: '/fbi/rechercherRepartitionSaisieOfficiel.do?action=executeRecherche&rechercherRepartitionSaisieOfficielsBean.dateDebutPeriode=02%2F10%2F2015&rechercherRepartitionSaisieOfficielsBean.dateFinPeriode=30%2F06%2F2016&sEcho=1&iColumns=9&sColumns=&iDisplayStart=0&iDisplayLength=20&mDataProp_0=0&mDataProp_1=1&mDataProp_2=2&mDataProp_3=3&mDataProp_4=4&mDataProp_5=5&mDataProp_6=6&mDataProp_7=7&mDataProp_8=8&iSortingCols=0&bSortable_0=true&bSortable_1=true&bSortable_2=true&bSortable_3=true&bSortable_4=true&bSortable_5=true&bSortable_6=true&bSortable_7=true&bSortable_8=true&_=1444138254003',
      method: 'GET',
      headers: {
        'Cookie': cookie,
      }
    };

    var req = http.request(options, function(res) {
      var body = "";
      res.setEncoding('utf8');

      res.on('data', function (chunk) {
        body += chunk;
      });
      res.on('end', function() {
        try {
          resolve(parseGames(body))
        } catch (e) {
          reject(e.message);
        }
      })

    });

    req.on('error', function(e) {
      reject(e.message);
    });

    req.end();
  })
}

module.exports = {
  listGames,
  parseGames
};