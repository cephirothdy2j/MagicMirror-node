var React = require('react');
var ReactDOM = require('react-dom');

// require all the modules
require('../components/Time.jsx');

var HelloWorld = React.createClass({
  render: function() {
    return (
    	<div>
      <Time />
      </div>
    );
  }
});

setInterval(function() {
  ReactDOM.render(
    <HelloWorld />,
    document.getElementById('example')
  );
}, 500);