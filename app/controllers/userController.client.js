'use strict';
function handleNewURL(req, res, db) {
  var url = req.url.slice(5);
  findURL(url, db, function(result) {
    if (result) {
      res.send(result);
    } else {
      res.send('error');
    }
  });
}

function findURL(url, db, callback){
  // Check to see if the site is already there
  var sites = db.collection('sites');
  // get the url
  sites.findOne({
      "original_url": url
  }, function(err, result) {
    console.log("1")
    if (err) throw err;
    if (result) {
      console.log("2")
        callback({
            "original_url": result.original_url,
            "short_url": result.short_url
        });
    } else {
      console.log("3")
      if (validateURL(url)) {
        console.log("5")
        var urlObj = {
          "original_url": url,
          "short_url": linkGen()
        };
        callback(urlObj);
        save(urlObj, db);
      }else {
        callback("{'error':'bad url'}")
      }
    }
  });
}

function linkGen() {
  // Generates random four digit number for link
  var num = Math.floor(100000 + Math.random() * 900000);
  return process.env.APP_URL + num.toString().substring(0, 6);
}

function save(obj, db) {
        // Save object into db.
    var sites = db.collection('sites');
    sites.save(obj, function(err, result) {
        if (err) throw err;
        console.log('Saved ' + result);
    });
}

function handleRedirect(req, res, db) {
  var urlid = req.params.id;
  var shortURL = process.env.APP_URL + urlid;
  if (shortURL === process.env.APP_URL + 'favicon.ico') {
    return;
  }
  findShortURL(shortURL, db, function(result) {
    if (result) {
      res.redirect(result.original_url);
    } else {
      res.send('Site not Found');
    }
  });
}

function findShortURL(shortURL, db, callback) {
  if (shortURL != process.env.APP_URL + 'favicon.ico') {
    var sites = db.collection('sites');
    sites.findOne({
      "short_url": shortURL
    }, function(err, result) {
      if (err) throw err;
      callback(result);
    });
  }
}

function validateURL(url) {
  var webex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
  var webRegex = new RegExp(webex);
  return webRegex.test(url);
}
module.exports.handleNewURL = handleNewURL;
module.exports.handleRedirect = handleRedirect;
