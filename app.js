var http = require('http');
var path = require('path');
var express = require('express');
var compress = require('compression');
var app = express();
var port = process.env.PORT || 9000;

//
// Middleware
//
// Needs to go before any routes.
//
app.use(compress());
app.use(express.static(__dirname + '/dist'));
app.set('views', path.join(__dirname, '/dist'));
app.set('view engine', 'jade');

//
// Routes
//
// Usually these would be in a seperate directory
// but we only have like 4 routes.
//
app.get('/about', function(req, res) { res.send('about page') });

//
// 404 route
//
// This must be kept as the last route
// because express has no concept of a 404
// It just runs out of middleware and ends up
// here
//
app.get('*', function(req, res) {
  res.render('index');
});

http.createServer(app).listen(port, function() {
  console.log('Server listening on port ' + port);
});
