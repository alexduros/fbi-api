var Promise = require("bluebird");
var https = require("https");

/**
 * Creates a JSESSIONID on FBI Application
 * Returns a Promise<String> with Cookie containing JSESSIONID
 */
function createFBISession() {
  return new Promise(function(resolve, reject) {
    https.get('https://extranet.ffbb.com/fbi/identification.do', function(res) {
      resolve({ cookie: res.headers["set-cookie"] });
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
function authenticateFBI(options) {
  options = options || {};
  var login = options.login,
      password = options.password;

  return new Promise(function(resolve, reject) {
    createFBISession().then(function(cookie) {
      var post = "identificationBean.identifiant=" + login + "&identificationBean.mdp=" + password + "&userName=359770414357595";

      var options = {
        hostname: 'extranet.ffbb.com',
        port: 443,
        path: '/fbi/identification.do',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': post.length
        }
      };

      var req = https.request(options, function(res) {
        debugger;
        resolve({ cookie });
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
  authenticateFBI
};
