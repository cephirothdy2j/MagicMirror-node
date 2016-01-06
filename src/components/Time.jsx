var React = require('../js/react');
var moment = require('../js/moment');

Time = React.createClass({
	setTime : function() {
		var currentDate = new Date();
		this.setState({
			date : moment(currentDate).format('ll'),
			time : moment(currentDate).format('h:mm:ss a')
		});
	},
	componentWillMount: function(){
		this.setTime();
	},
	componentDidMount: function(){
		window.setInterval(function () {
			this.setTime();
		}.bind(this), 1000);
	},
	render : function() {
		return (
			<div>
				<div>{this.state.date}</div>
				<div>{this.state.time}</div>
			</div>
		)
	}
});

module.exports = Time;