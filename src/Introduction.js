import React, { Component } from "react";
import
{
    // Route,
    NavLink,
    HashRouter
} from "react-router-dom";

class Introduction extends Component
{
    /*************************************************************************
     * Calls back to Survey component to store data.
     *************************************************************************/
    transferCallBack()
    {
        if (this.props.transferCallBack)
        {
            this.props.transferCallBack();
        }
    }

    /*************************************************************************
     * Just in case someone never actually used the traditional routing.
     *************************************************************************/
    componentDidMount()
    {
        this.transferCallBack();
    }

    render()
    {
        return (
            <div className="container">
                <div className="ID_Box">
                    {this.props.textDescription}
                </div>
                <div className="usrInput">
                    {this.props.route ? <NavLink exact to={this.props.route}>
                        <button id="confirm_next">Proceed to Survey</button>
                    </NavLink> : <div />}
                </div>
            </div>
        )
    }

}

export default Introduction;
