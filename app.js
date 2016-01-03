var express = require('express')
	, http = require('http')
	, weather = require("Openweather-Node")
	, config = require('./server/config');

// create our server
var app = express();
//Store all HTML files in /views folder.
app.use(express.static(__dirname + '/build'));


// let's set our weather config
weather.setAPPID(config.openWeather.appId);
weather.setCulture("en");
weather.setForecastType("daily");

app.get('/weather', function(req, res) {
	weather.now(config.openWeather.locationId, function(err, data) {
		if(err) {
			console.log(err);
		  	return res.json({
		  		"error" : true
		  	});
		} else {
			return res.json(data);
		}
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


app.get('/', function(req, res) {
	res.sendFile('index.html');

});

var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});