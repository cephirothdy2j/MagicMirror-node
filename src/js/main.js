var React = require('react');
var ReactDOM = require('react-dom');

// require all the modules
require('../components/Weather.jsx');
require('../components/Time.jsx');
require('../components/Events.jsx');

var HelloWorld = React.createClass({
  render: function() {
    return (
    	<div>
      <Time />
      </div>
    );
  }
});

ReactDOM.render(
  <div>
    <Time />
    <Events />
    <Weather />
  </div>,
  document.getElementById('example')
);
