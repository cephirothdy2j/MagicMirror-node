var React = require('../js/react')
, moment = require('../js/moment')
, $ = require('../js/jquery');

Weather = React.createClass({
	getInitialState : function() {
		return {
			currently : {},
			hourly : []
		}
	},
	getWeather : function() {
		$.get('/weather', function(data) {
			return this.setState({
				currently : data.currently,
				hourly : data.hourly
			});
		}.bind(this));
	},
	componentDidMount: function(){
		this.getWeather();
		window.setInterval(function () {
			this.getWeather();
		}.bind(this), 60000);
	},
	render : function() {
		return (
			<ul>
			{this.state.hourly.map(function(hour, i) {
				return (
					<li key={hour.i}>{hour.temp} {hour.summary} {hour.icon} {hour.time}</li>
				)
			}
			)}
			</ul>
		)
	}
});

module.exports = Weather;