import https from 'https';
import {
  compose,
  property,
  map,
  zipObject,
} from 'lodash/fp';

const FIELDS_TO_EXTRACT = [
  'resume',
  'date',
  'hour',
  'division',
  'id',
  'home',
  'visitors',
  'place',
  'address'
];

const FIELD_GAME_ROW_REGEX = /<a href='#' onclick='return afficherDesignation\(\d+\)'' style='' title=''>(.*)<\/a><\/div>/;

const createGameFromHTMLRow = compose(
  zipObject(FIELDS_TO_EXTRACT),
  compose(
    map(match => match && match[1]),
    map(row => FIELD_GAME_ROW_REGEX.exec(row))
  )
);

const extractGamesFromHTML = compose(
  map(createGameFromHTMLRow),
  property('aaData'),
  JSON.parse
);

const getAppointmentsByDate = (sessionId) => ({ startDate, endDate }) => {
  return new Promise(function(resolve, reject) {
    var options = {
      hostname: 'extranet.ffbb.com',
      port: 443,
      path: `/fbi/rechercherRepartitionSaisieOfficiel.do?action=executeRecherche&rechercherRepartitionSaisieOfficielsBean.dateDebutPeriode=${encodeURIComponent(startDate)}&rechercherRepartitionSaisieOfficielsBean.dateFinPeriode=${encodeURIComponent(endDate)}"&sEcho=1&iColumns=9&sColumns=&iDisplayStart=0&iDisplayLength=20&mDataProp_0=0&mDataProp_1=1&mDataProp_2=2&mDataProp_3=3&mDataProp_4=4&mDataProp_5=5&mDataProp_6=6&mDataProp_7=7&mDataProp_8=8&iSortingCols=0&bSortable_0=true&bSortable_1=true&bSortable_2=true&bSortable_3=true&bSortable_4=true&bSortable_5=true&bSortable_6=true&bSortable_7=true&bSortable_8=true`,
      method: 'GET',
      headers: {
        'cookie': sessionId,
      }
    };

    var req = https.request(options, function(res) {
      var body = '';
      res.setEncoding('utf8');

      res.on('data', function (chunk) {
        body += chunk;
      });
      res.on('end', function() {
        try {
          resolve(extractGamesFromHTML(body));
        } catch (e) {
          reject(e.message);
        }
      });
    });

    req.on('error', function(e) {
      reject(e.message);
    });

    req.end();
  });
};

export { getAppointmentsByDate };
