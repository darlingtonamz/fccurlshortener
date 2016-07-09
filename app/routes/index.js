'use strict';

var path = process.cwd();

var site = require("../controllers/userController.client.js");

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
