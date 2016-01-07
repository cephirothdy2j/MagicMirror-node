var express = require('express')
	, http = require('http')
	, Forecast = require("forecast.io")
	, moment = require('moment')
	, ical = require('ical')
	, RSVP = require('rsvp')
	, _ = require('lodash')
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
	var currentTime = new Date().getTime();
	// promisify the calendar retrieval
	var getCalendar = function(url) {
		var promise = new RSVP.Promise(function(resolve, reject) {
		    ical.fromURL(url, {}, function(err, data) {
		    	if(err) {
		    		reject(err);
		    	} else {
			    	// let's only return current / future events
			    	var currentTime = new Date();
			    	var futureEvents = [];
			    	// TO DO - handle recurring events. This is a problem now.

			    	// if the end date is in the future, push the event
			    	_.forIn(data, function(val, key) {
			    		if(val.end >= currentTime) {
			    			futureEvents.push(val);
			    		}
			    	})
			    	// then, let's sort those future events from closest to farthest in the future
			    	futureEvents.sort(function(a,b) {
						// Turn your strings into dates, and then subtract them
						// to get a value that is either negative, positive, or zero.
						return new Date(a.start) - new Date(b.start);
			    	});
			    	// finally, let's only return the first 10
			    	resolve(futureEvents.slice(0,10));
		    	}
		    });
		});
		return promise;
	};
	var promises = config.calendars.map(function(cal) {
		return getCalendar(cal);
	});
	RSVP.all(promises).then(function(data) {
		// let's flatten the results into one array
		var events = _.flatten(data);
		// now, let's de-dupe by event name AND start time (dangerous, I know ...)
		events = _.uniq(events, function(ev) {
			return JSON.stringify(_.pick(ev, ['summary', 'start']));
		});
		// we need to sort the calendar events by date
		// TO DO - DRY this out (using the same above)
    	events.sort(function(a,b) {
			// Turn your strings into dates, and then subtract them
			// to get a value that is either negative, positive, or zero.
			return new Date(a.start) - new Date(b.start);
    	});
		// then we need to return the next upcoming 10 events to the front end
		events.slice(0,10);
		// only return what we need to the front end
		_.each(events, function(ev, i) {
			events[i] = {
				summary : ev.summary,
				start : ev.start,
				end : ev.end,
				location : ev.location
			}
		})
		return res.json(events);
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
