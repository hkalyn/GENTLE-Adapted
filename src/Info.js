import React, { Component } from "react";
// import ReactDOM from "react-dom";
import { Link } from 'react-router-dom'
// import Welcome from "./Welcome.js";

class Info extends Component
{
    render()
    {
        return (

            <div className="container">
                <div className="ID_Box">
                    <h3>Welcome to the GENTLE questionnaire!</h3>
                    <p>{this.props.textDescription}</p>
                </div>
                <Link to="/"><button id="confirm_next">Back</button></Link>

            </div>

        )
    }
}

export default Info;