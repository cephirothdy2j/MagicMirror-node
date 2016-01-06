var express = require('express')
	, http = require('http')
	, Forecast = require("forecast.io")
	, moment = require('moment')
	, ical = require('ical')
	, RSVP = require('rsvp')
	, config = require('./server/config');

// create our server
var app = express();
//Store all HTML files in /views folder.
app.use(express.static(__dirname + '/build'));


// let's set our weather config
var forecast = new Forecast({
	APIKey : config.forecast.apiKey,
});
var forecastOptions = {
	exclude: 'minutely,flags'
};

app.get('/weather', function(req, res) {
	forecast.get(config.forecast.lat, config.forecast.lng, forecastOptions, function (err, resp, data) {

		if (err) throw err;
		var response = {};

		// return the current forecast
		if(data.currently) {
			response.currently = {
				summary : data.currently.summary || null,
				icon : data.currently.icon || null,
				temperature : Math.round(data.currently.temperature) || null
			};
		}
		// return the first 12 hours of the hourly forecast
		response.hourly = [];
		if(data.hourly && data.hourly.data) {
			for(var i = 0; i < 12; i++) {
				var thisHour = {}
				if(data.hourly.data[i]) {
					thisHour = {
						temp : Math.round(data.hourly.data[i].temperature) || null,
						time : moment(data.hourly.data[i].time * 1000).format('h:mma') || null,
						summary : data.hourly.data[i].summary || null,
						icon : data.hourly.data[i].icon || null
					}
					// response.hourly.push(data.hourly.data[i]);
					response.hourly.push(thisHour);
				} else {
					break;
				}
			}
		}

		// send the response
		res.json(response);
	});
});

// top stories from new tork times

var nytTop = require('nyt-top');
nytTop.key(config.nyt.key); // set your Top Stories API developer key

app.get('/news', function(req, res) {
	nytTop.section('home', function (err, data) {
	  if (err) {
	  	console.log(err);
	  	return res.json({
	  		"error" : true
	  	});
	  } else {
	    var results = data.results;
	    var trimmedResults = []
	    for (var i = 0; i < 10; i++) { // top ten most recent stories
	      trimmedResults.push(results[i].title);
	    }
	    return res.json(trimmedResults);
	  }
	});
});

// calendar
app.get('/calendar', function(req, res) {
	var getCalendar = function(url) {
		var promise = new RSVP.Promise(function(resolve, reject) {
		    ical.fromURL(url, {}, function(err, data) {
		    	if(err) reject(err);
		    	resolve(data);
		    });
		});
		return promise;
	};
	getCalendar('https://www.google.com/calendar/ical/dylanschuster.com_ul3v0h981b1buo92nsfo9e28tc%40group.calendar.google.com/private-44c47620d465b52ae2a30f8525c20f18/basic.ics').then(function(data) {
		res.json(data);
	});
});


app.get('/', function(req, res) {
	res.sendFile('index.html');

});

var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});