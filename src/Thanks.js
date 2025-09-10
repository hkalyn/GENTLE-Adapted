import React, { Component } from "react";

class Thanks extends Component
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
            </div>
        )
    }

}

export default Thanks;
