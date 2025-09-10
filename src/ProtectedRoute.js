import React, { Component } from "react";
import Survey from "./Survey";
import ReactDOM from "react-dom";
import "./css/bootstrap.css";
import "./css/style.css";
import Info from "./Info.js";
import Login from "./Login"
import Register from "./Register"
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { INFORMATION } from "./Settings.js";
import $ from "jquery";

class ProtectedRoute extends Component
{
    protectRoute=()=>{
        console.log("Protecting Route")
        if(this.props.auth === false)
        {
            console.log("Redirecting Home")
            return <Redirect to={this.props.redirectPath} replace/>
        }
        else
        {
            console.log("Render Survey")
            return this.props.children
        }
    }

    render()
    {
        return this.protectRoute()
    }

}
export default ProtectedRoute;
// ProtectedRoute = ({
//     user,
//     redirectPath = '/landing',
//     children,
//   }) => {
//     if (!user) {
//       return <Navigate to={redirectPath} replace />;
//     }
  
//     return children;
//   };