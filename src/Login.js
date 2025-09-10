import React, { Component } from "react";
// import Survey from "./Survey";
// import { NavLink, Link, Navigate } from 'react-router-dom'
import {Link} from 'react-router-dom'
// import ReactDOM from "react-dom";
import "./css/bootstrap.css";
import "./css/style.css";
import { Redirect } from 'react-router-dom';
// import Info from "./Info.js";
// import { INFORMATION } from "./Settings.js";
// import $ from "jquery";

class Login extends Component
{
    /************************************************************************ 
     * Screen design that involves a simple form where users can insert an 
     * identifier. This identifier is used to store the data.
     * 
     * References:
     * For further information on forms in React check:
     * https://reactjs.org/docs/forms.html
    *************************************************************************/
    collection = null
    constructor(props)
    {
        super(props);
        this.state = { id: "",  password: "" };
    }

    /************************************************************************
     * Handles the checkbox change when the element is clicked. 
     * @param {event} event: A click event.
    *************************************************************************/
    handleChange = (event) =>
    {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        const name = event.target.name;

        this.setState({
            [name]: value
        });
    }

    // /************************************************************************ 
    // * The username submit function.
    // * Once clicked, the submit function checks if the session already exists, 
    // * and if it does, it returns it from session storage. Otherwise a new 
    // * session is created and added to starage.
    // *************************************************************************/
    handleSubmit = (e) =>
    {   
        console.log("Logging in with consent:", this.props.getConsent())
        e.preventDefault()
        if(this.props.getConsent() === true)
        {
            console.log("Submitting")
            this.props.handleLoginCallback(this.state.id, this.state.password, this.props.getConsent())
        }
        else{
            alert("Please provide consent by checking the box.")
        }
    }

    render()
    {
        if (!this.props.getConsent()) {
            return <Redirect to="/" />;
          }
        return (

            <div className="container">
                
                <form onSubmit={this.handleSubmit} className="loginForm">
                    <h1>Login</h1>
                    <input
                        className="loginInput"
                        type="text"
                        name="id"
                        placeholder="Enter Email"
                        value={this.state.id}
                        onChange={this.handleChange}
                        required
                    />
                    <input
                        className="loginInput"
                        type="password"
                        name="password"
                        secureTextEntry={true}
                        placeholder="Enter Password"
                        value={this.state.password}
                        onChange={this.handleChange}
                        required
                    />
                    {/* <label style={{ textAlign: "left" }}>
                        I consent to my data being stored and confirm that I have read the <Link to="/consent">informed consent sheet</Link>.
                        <input
                            name="consent"
                            type="checkbox"
                            checked={this.state.consent}
                            onChange={this.handleChange} />
                    </label> */}
                    <input className="loginInput" value="Submit" type="submit" />
                    <p>New participant? Please <Link to="/register">register here</Link>.</p>
                </form>

            </div>
        );
    }
}
export default Login;