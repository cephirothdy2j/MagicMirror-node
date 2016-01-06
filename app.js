var express = require('express')
	, http = require('http')
	, Forecast = require("forecast.io")
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
	exclude: 'minutely,hourly,flags'
};

app.get('/weather', function(req, res) {
	forecast.get(config.forecast.lat, config.forecast.lng, forecastOptions, function (err, resp, data) {
		if (err) throw err;
		res.json(data);
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