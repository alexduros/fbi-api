var Promise = require("bluebird");
var https = require("https");

const JSESSIONID_REGEX = /(JSESSIONID=\w+)/;

const getSessionFromCookie = (cookie) => {
  const sessionIdMatch = cookie.join('').match(JSESSIONID_REGEX);
  return sessionIdMatch ? sessionIdMatch[1] : null;
}

/**
 * Creates a JSESSIONID on FBI Application
 * Returns a Promise<String> with Cookie containing JSESSIONID
 */
function createFBISession() {
  return new Promise(function(resolve, reject) {
    https.get('https://extranet.ffbb.com/fbi/identification.do', function(res) {
      resolve({ sessionId: getSessionFromCookie(res.headers["set-cookie"]) });
    });
  })
}

/**
 * Creates a session on FBI Application set
 * the user into the session and returns a promise
 * with the cookie containing a JSESSIONID of the
 * authenticated user
 * Returns a Promise<String> with Cookie containing JESSIONID
 */
function authenticateFBISession(options) {
  options = options || {};
  var username = options.username,
      password = options.password;

  return new Promise(function(resolve, reject) {
    createFBISession().then(function({ sessionId }) {
      var post = "identificationBean.identifiant=" + username + "&identificationBean.mdp=" + password + "&userName=359770414357595";

      var options = {
        hostname: 'extranet.ffbb.com',
        port: 443,
        path: '/fbi/identification.do',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': post.length,
          'Cookie': sessionId
        }
      };

      /**
       * If login is success
       */
      var req = https.request(options, function(res) {
        (res.statusCode === 302 && !res.headers['set-cookie']) ? resolve({ sessionId }) : reject({
          statusCode: res.statusCode,
          errorMessage: 'not redirected to home after login'
        })
      });

      req.on('error', function(e) {
        reject(e.message);
      });

      req.write(post);
      req.end();
    });
  })
}

module.exports = {
  createFBISession,
  authenticateFBISession
};
