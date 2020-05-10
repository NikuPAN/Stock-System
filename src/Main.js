import React, { Component } from "react";
import {
    Route, NavLink, HashRouter
} from "react-router-dom"

import Home from "./Home";
import Stock from "./Stock";
import Stock_Detail from "./Stock_Detail"
import Contact from "./Contact";
import "./index.css";

class Main extends Component {
    render() {
        return (
            <HashRouter>
                <div className="container">
                    <div className="img-container">
                        <img src="img/banner.jpg" alt="IFN666 Stock System" /><br/>
                    </div>
                    <ul className="header">
                        <li><NavLink exact to="/">Home</NavLink></li>
                        <li><NavLink to="/stocks">Stocks</NavLink></li>
                        <li><NavLink to="/contact">Contact</NavLink></li>
                        <li><NavLink to="/stocks_detail">Stock History</NavLink></li>
                    </ul>
                    <div className="content">
                        <Route exact path="/" component={Home}/>
                        <Route path="/stocks" component={Stock}/>
                        <Route path="/stocks_detail/:symbol" component={Stock_Detail}/>
                        <Route path="/contact" component={Contact}/>
                    </div>
                    <script src="https://unpkg.com/@ag-grid-enterprise/all-modules@23.1.0/dist/ag-grid-enterprise.min.js"></script>
                </div>
            </HashRouter>
        );
    }
}

export default Main;