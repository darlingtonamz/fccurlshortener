'use strict';

var path = process.cwd();

var site = require("../controllers/userController.client.js")
var webex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
var webRegex = new RegExp(webex);

module.exports = function (app, db) {

	app.route('/')
		.get(function (req, res) {
			res.sendFile(path + '/public/index.html');
		});

	app.route('/new')
    .get(function(req, res) {
        res.send('{"Error": "You need to add a proper url"}');
    });

	app.route('/new/:url*')
		.get(function (req, res) {
			var url = req.url.slice(5);
			// var extra = req.params.extra;
			// console.log(JSON.stringify(req.params));
			site.handleNewURL(req, res, db);
		});

	app.route('/:id*')
		.get(function (req, res) {
			//var extra = req.params.extra;
			site.handleRedirect(req, res, db);
		});
};
