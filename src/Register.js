import React, { Component } from "react";
import { Link } from 'react-router-dom'
import ReactDOM from "react-dom";
import "./css/bootstrap.css";
import "./css/style.css";
import Info from "./Info.js";
import { INFORMATION } from "./Settings.js";
import { Redirect } from 'react-router-dom';

class Welcome extends Component
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
        this.state = { id: "", consent: false, password: "", passwordConfirm: "" };
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
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

    /************************************************************************ 
     * Renders informed consent page.
    *************************************************************************/
    renderIFC = () =>
    {
        ReactDOM.render(<Info textDescription={INFORMATION} />,
            document.getElementById("root"))
    }

    /************************************************************************ 
    * The username submit function.
    * Once clicked, the submit function checks if the session already exists, 
    * and if it does, it returns it from session storage. Otherwise a new 
    * session is created and added to starage.
    *************************************************************************/
    handleSubmit = (e) =>
    {
         e.preventDefault();
        // Adding some password restriction rules.
            if (this.props.getConsent() === true)
            {
                console.log("Registering")
                this.props.handleRegisterCallback(this.state.id, this.state.password, this.state.passwordConfirm, this.props.getConsent())
            } 
            else
            {
                alert("Please provide consent.")
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
                    <h1>Register</h1>
                    <input
                        className="loginInput"
                        type="email"
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
                    <input
                        className="loginInput"
                        type="password"
                        name="passwordConfirm"
                        secureTextEntry={true}
                        placeholder="Confirm Password"
                        value={this.state.passwordConfirm}
                        onChange={this.handleChange}
                        required
                    />
                    <label style={{ textAlign: "left" }}>
                        I consent to my data being stored and confirm that I have read the <a style={{ color: "blue", textDecoration: "underline" }} href="/">informed consent sheet</a>.
                        <input
                            name="consent"
                            type="checkbox"
                            checked={this.props.getConsent()}
                            onChange={this.handleChange} />
                    </label>
                    <input className="loginInput" type="submit" value="Complete Registration" />
                    <p>Already a participant? Please <Link to="/Login">login</Link>.</p>
                </form>
            </div>
        );
    }
}
export default Welcome;