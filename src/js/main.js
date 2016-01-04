var React = require('react');
var ReactDOM = require('react-dom');

// require all the modules
require('../components/child-react.jsx');

var HelloWorld = React.createClass({
  render: function() {
    return (
    	<div>
    	<ChildReact />
      <p>
        Hello, <input type="text" placeholder="Your name here" />!
        It is {this.props.date.toTimeString()}
      </p>
      </div>
    );
  }
});

setInterval(function() {
  ReactDOM.render(
    <HelloWorld date={new Date()} />,
    document.getElementById('example')
  );
}, 500);