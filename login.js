var Promise = require("bluebird");
var http = require("http");

function authenticateFBI(options) {
  options = options || {};
  var login = options.login,
      password = options.password;

  return new Promise(function(resolve, reject) {
    var post = "identificationBean.identifiant=" + login + "&identificationBean.mdp=" + password + "&userName=359770414357595";

    var options = {
      hostname: 'extranet.ffbb.com',
      port: 80,
      path: '/fbi/identification.do',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': post.length
      }
    };

    var req = http.request(options, function(res) {
      res.setEncoding('utf8');
      resolve({ cookie: res.headers["set-cookie"] });
    });

    req.on('error', function(e) {
      reject(e.message);
    });

    req.write(post);
    req.end();
  })
}

module.exports = {
  authenticateFBI
};