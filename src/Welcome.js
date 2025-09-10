import React, { Component } from "react";
import Survey from "./Survey";
import "./css/bootstrap.css";
import "./css/style.css";
import Info from "./Info.js";
import Login from "./Login"
import Consent from "./Consent"
import Register from "./Register"
import { Route, HashRouter } from 'react-router-dom'
import $ from "jquery";

class Welcome extends Component
{
    collection = null
    constructor(props)
    {
        super(props);
        this.state = { id: "", consent: false, password: "", password_h: "", surveyReady: false, auth: false, data: null, nodes: [], links: [], foci: [] };
        this.updateConsent = this.updateConsent.bind(this);
        this.getConsent = this.getConsent.bind(this);
        // this.handleChange = this.handleChange.bind(this)
        // this.handleSubmit = this.handleSubmit.bind(this)
    }

    updateConsent = (newValue) => {
        console.log("Updating consent from", this.state.consent, " To: ", newValue)
        // this.setState({ consent: newValue });
        this.state.consent = newValue
        console.log(this.state.consent)
        
    }
    getConsent = () =>{
        return this.state.consent
    }

    componentDidMount()
    {
        // TODO: setting the survey ready state to true here solves the issue that occurs when reloading the survey mis way through.
        // We need to do a check here that will look for sessionNodeData/sessionAuthData and if it exists pull it in and set the component state with it.
        // this will pass the existing nodes down the tree into the survey component.
        var isAuthorized = this.reAuthorizeUserSession()
        if (isAuthorized === true)
        {
            var sessionAuthData = JSON.parse(sessionStorage.getItem('authData'));
            var sessionNodeData = JSON.parse(sessionStorage.getItem('nodeData'));
            this.setState({ id: sessionAuthData.id, nodes: sessionNodeData.nodes, links: sessionNodeData.links, foci: sessionNodeData.foci, surveyReady: false })

        }

        // !! IMPORTANT !!
        // Comment this out to skip login for testing. use true to skip login, isAuthorized to use login page

        // this.setState({ surveyReady: isAuthorized })
         this.setState({surveyReady: true})
    }

    reAuthorizeUserSession = () =>
    {
        var sessionAuthData = JSON.parse(sessionStorage.getItem('authData'));
        if (sessionAuthData !== null)
        {
            var authToken = sessionAuthData.auth;
        }

        return authToken;
    }

    /************************************************************************ 
    * The username submit function.
    * Once clicked, the submit function checks if the session already exists, 
    * and if it does, it returns it from session storage. Otherwise a new 
    * session is created and added to storage.
    *************************************************************************/
    handleLoginCallback = (username, password, consent) =>
    {
        if (consent)
        {
            this.login(username, password, consent)
        }
        // this.loginSuccess()
    }

    login = (username, password, data) =>
    {
        //   sessionStorage.setItem("nodeData", JSON.stringify({ nodes: this.state.nodes, links: this.state.links, foci: this.state.foci }));
        $.ajax({
            url: "/login",
            method: "Post",
            data: { "ID": username, "password": password, "data": data },
            res: { status: null },
            success: this.loginSuccess,
            error: this.loginFailure
        })
        // this.resolveLoginAttempt()
    }

    loginSuccess = (res) =>
    {
        window.location.reload();
        sessionStorage.setItem("authData", JSON.stringify({ id: res.ID, auth: true }))

        var sessionNodeData = JSON.parse(sessionStorage.getItem('nodeData'));
        var sessionAuthData = JSON.parse(sessionStorage.getItem('authData'));
        console.log("sessionNodeData: ", sessionNodeData)
        console.log("sessionAuthData: ", sessionAuthData)

        if (sessionNodeData === null)
        {
            console.log("sessionNodeData == null")
            if (res.data === null)
            {
                console.log("res.data == null")
                sessionStorage.setItem("nodeData", JSON.stringify({ nodes: this.state.nodes, links: this.state.links, foci: this.state.foci }));
                // this.setState({ id: res.id, consent: this.state.consent, password_h: res.password, auth: true, data: null, nodes: [], links: [], foci: [] })
            }
            //there are values in the DB to use
            else
            {
                var f_array = [];
                console.log("res.data is not null")
                for (var i = 0; i < res.data.nodes.length; i++)
                {
                    var f = {
                        key: i,
                        x: 0,
                        y: 0
                    }
                    f_array.push(f)
                }
                this.setState({ foci: f_array })
                sessionStorage.setItem("nodeData", JSON.stringify({ nodes: res.data.nodes, links: res.data.links, foci: this.state.foci }));
            }
        }
        sessionNodeData = JSON.parse(sessionStorage.getItem('nodeData'));
        sessionAuthData = JSON.parse(sessionStorage.getItem('authData'));
        console.log("sessionNodeData 2: ", sessionNodeData)
        console.log("sessionAuthData 2: ", sessionAuthData)
        this.setState({ id: sessionAuthData.id, consent: this.state.consent, password_h: sessionAuthData.password, auth: true, data: sessionNodeData, nodes: sessionNodeData.nodes, links: sessionNodeData.links, foci: sessionNodeData.foci, surveyReady: false })
        console.log("State: ", this.state)
        this.setState({ surveyReady: true })

    }

    loginFailure = (res) =>
    {
        var failureMessage = res.responseJSON.status
        console.log("Login Failure", failureMessage)
        if (failureMessage === 'password mismatch')
        {
            alert("The password you entered is incorrect. Please enter the correct password.")
        }
        else if (failureMessage === "User Not Found")
        {
            alert("The account you are trying to access does not exist. Please check the email address you entered and try again, or register below.")
        }
    }

    handleRegisterCallback = (username, password, passwordConfirm, consent) => 
    {
        if (consent)
        {
            console.log("Consent passed")
            if (password === passwordConfirm)
            {
                console.log("Passwords match")
                this.register(username, password, passwordConfirm, consent)
            }
            else
            {
                alert("The passwords you have entered do not match. Please check them and try again.")
            }

        }
        else{
            console.log("Failed Consent with handleRegisterCallback")
        }
    }

    register = (username, password, passwordConfirm, data) =>
    {
        $.ajax({
            url: "/register",
            method: "Post",
            data: { "ID": username, "password": password, "passwordConfirm": passwordConfirm, "data": data },
            res: { status: null },
            success: this.registerSuccess,
            error: this.registerFailure,
        })
    }

    registerSuccess = (res) =>
    {
        console.log("register success handler triggered: ", res)
        // window.location = '/'
        window.location.hash = '#Login';
    }

    registerFailure = (res) =>
    {
        var failureMessage = res.responseJSON.status;
        if (failureMessage === "User exists")
        {
            alert("There is already a participant using this email address.")
        }
        else if (failureMessage === "password mismatch")
        {
            alert("The passwords you have entered do not match. Please check them and try again.")
        }
        else
        {
            alert(failureMessage)
        }
        console.log("register failure handler triggered: ", res)
    }

    conditionalRender = () =>
    {
        if (this.state.surveyReady === true)
        {
            return <Survey ID={this.state.id} nodes={this.state.nodes} links={this.state.links} foci={this.state.foci} />
        }
        else
        {
            return <HashRouter>
                
                <Route exact path="/" render={(props) => (
                    <Consent updateConsent={this.updateConsent} getConsent={this.getConsent}  />
                )} />
                <Route exact path="/Login" render={(props) => (
                    <Login getConsent={this.getConsent} handleLoginCallback={this.handleLoginCallback} />
                )} />
                <Route exact path="/register" render={(props) => (
                    <Register getConsent={this.getConsent} handleRegisterCallback={this.handleRegisterCallback} />
                )} />

            </HashRouter>
        }
    }

    render()
    {
        return this.conditionalRender()
    }
}
export default Welcome;