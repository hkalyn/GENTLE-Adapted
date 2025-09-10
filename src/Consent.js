import React, { Component } from "react";
// import Survey from "./Survey";
// import { NavLink, Link, Navigate } from 'react-router-dom'
import {Link} from 'react-router-dom'
// import ReactDOM from "react-dom";
import "./css/bootstrap.css";
import "./css/style.css";
import logo from './ULethLogo.jpg';
class Consent extends Component
{
    /************************************************************************ 
     *  
     * 
     * 
     * References:
     * For further information on forms in React check:
     * https://reactjs.org/docs/forms.html
    *************************************************************************/
    constructor(props)
    {
        super(props);
        this.state = {
            consent: false // Assigning parent value to child state
          };
        // this.state = {consent: false};
        // this.props = super(props)
        
    }

    handleChange = (event) =>
    {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        const name = event.target.name;

        this.setState({
            [name]: value
        });

        console.log("Handling Change")
        this.state.consent = ! this.state.consent
        this.props.updateConsent(this.state.consent)
    }

    
    render()
    {
        return (

            
            <div className="container">
                <img className="ulethLogo" src={logo} ></img>
                {/* <div className="ID_Box"> */}
                <div className="ConsentPopup">
                        <p>
                            <b>Example Consent Page</b> 	
                            
                            This is an example consent page. You need to accept terms before continuing
                        </p>

                        <footer>
                            <p> Example Footer</p>
                            <p>Example Date: September 8, 2025</p>
                        </footer>

                        <label>
                                <h5>I consent to my data being stored and confirm that I have read the informed consent sheet.  </h5>
                                <input
                                    name="consent"
                                    type="checkbox"
                                    checked={this.props.getConsent()}
                                    onChange={this.handleChange} />
                        </label>
                        <Link to="/Login">
                            <button
                            className={"ConsentPopup"}
                                style={{ opacity: this.props.getConsent() ? 1 : 0.5, cursor: this.props.getConsent() ? 'pointer' : 'not-allowed' }}
                                disabled={!this.props.getConsent()}
                                id="confirm_next">
                                    Continue
                            </button>
                        </Link>
                    </div>
                </div>
            // {/* </div> */}
        );
    }
}
export default Consent;