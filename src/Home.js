import React, { Component } from "react";
import "./index.css";

class Home extends Component {
    render() {
        return (
            <div className="container">
                <h2>Welcome!</h2>
                <p>This is IFN666 Assignment 1 - Stock System developed by <b>Tai Pang (n9862773)</b>.<br/><br/>
                    Usage:<br/>
                    Click on <b>"Stocks"</b> on the navigation bar navigate to the stocks page.<br/>
                    Click on each stock to browse for the history information.<br/>
                    Click on <b>"Contact"</b> to send me an email if you have any questions!<br/>

                    Thank you!
                </p>
            </div>
        );
    }
}

export default Home;