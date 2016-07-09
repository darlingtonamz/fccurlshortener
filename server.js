'use strict';
//	REFERENCE
// This code was made possible thanks to the insight gotten from https://github.com/beader/fcc-urlshortener

var express = require('express');
var routes = require('./app/routes/index.js');
//var mongoose = require('mongoose');
var mongo = require('mongodb').MongoClient;
var passport = require('passport');
var session = require('express-session');

var app = express();
require('dotenv').load();
//require('./app/config/passport')(passport);

//mongoose.connect(process.env.MONGOLAB_URI);
mongo.connect(process.env.MONGOLAB_URI, function(err, db) {
	if (err) throw err;
	db.createCollection('sites', function(err, collection) {
		if (err) throw err;
		console.log('successfully connect to mongodb and create collection ' + collection.collectionName);
		routes(app, db);
		//api(app, db);
	});
});

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/common', express.static(process.cwd() + '/app/common'));

// app.use(session({
// 	secret: 'secretClementine',
// 	resave: false,
// 	saveUninitialized: true
// }));
//
// app.use(passport.initialize());
// app.use(passport.session());
//
// routes(app, passport);

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});
