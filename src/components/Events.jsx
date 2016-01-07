var React = require('../js/react')
, moment = require('../js/moment')
, $ = require('../js/jquery');

Events = React.createClass({
	getInitialState : function() {
		return {
			events : []
		}
	},
	getEvents : function() {
		$.get('/calendar', function(data) {
			return this.setState({
				events : data
			});
		}.bind(this));
	},
	componentDidMount: function(){
		this.getEvents();
		window.setInterval(function () {
			this.getEvents();
		}.bind(this), 60000);
	},
	render : function() {
		return (
			<ul>
			{this.state.events.map(function(ev, i) {
				return (
					<li key={ev.uid}>{ev.summary} {moment(ev.start).format('MMM D h:mm a')}</li>
				)
			}
			)}
			</ul>
		)
	}
});

module.exports = Events;