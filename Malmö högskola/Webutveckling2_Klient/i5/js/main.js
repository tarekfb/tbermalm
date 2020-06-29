import React, { Component } from 'react';
 
class app extends Component {
  render() {
    return ( returning whatever here 
  // Ta en titt i webbkonsollen på den data vi har att tillgå 
            console.log(albums);

            var HelloWorld = React.createClass({
                render: function() {
                    return (
                        <h1>Hello World!</h1>
                    );
                }
            });

            // Rendera vårt innehåll
            ReactDOM.render(
                <HelloWorld />,
                document.getElementById("root")
            );