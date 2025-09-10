import React, { Component } from "react";
import Graph from "./Graph";
import
{
  // Route,
  NavLink,
  HashRouter
} from "react-router-dom";

/*************************************************************************
 * Screen design that is used when only nodes are to be depicted.
 *************************************************************************/
class NodeComponent extends Component
{
  constructor(props)
  {
    super(props);
    this.state = { counter: 0 };
    this.linkcounter = 0;
  }

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
   * Sets initial state when component is mounted.
   *************************************************************************/
  componentDidMount()
  {
    this.setState(this.state);
  }

  renderNextButton()
  {
    if (this.props.finalQuestion === true)
    {
      return this.props.route ? <NavLink exact to={this.props.route} onClick={() => this.transferCallBack}>
        <button id="confirm_next">Confirm & Finish</button>
      </NavLink> : <div />
    }
    else
    {
      return this.props.route ? <NavLink exact to={this.props.route} onClick={() => this.transferCallBack}>
        <button id="confirm_next">Confirm & Next</button>
      </NavLink> : <div />
    }
  }

  handleDeselectCurrentNode()
  {
    var node0 = document.getElementById("0")
    console.log("Deselecting current node", node0)
    this.props.resetSourceCallback()
  }

  renderEdgeCounter(){
    if (this.props.finalQuestion){
      if (document.getElementsByClassName("link").length !== 0){
         this.linkcounter = document.getElementsByClassName("link").length
         console.log("LINKCOUNTER", this.linkcounter)
      }
      return <div id="linkdisplaybox">
              <p id="linknumber"> Number of Links: {this.linkcounter}</p>
              </div>
      
    }
  }
  
  renderDeselectButton()
  {
    if (this.props.finalQuestion)
    {
      return <button style={{ marginBottom: "50px", marginTop: "0px" }} className={"modifyButton"} onClick={() => this.handleDeselectCurrentNode()}>Deselect Current Node</button>
    }
  }

  render()
  {
    return (
      <HashRouter>
        <div>
          <div className="textBox">
            {this.props.textDescription}
          </div>
          <Graph fixed={this.props.fixed}
            lastClickedNodeCallback={this.props.lastClickedNodeCallback.bind(this)}
            lastClickedNode={this.props.lastClickedNode}
            float={(this.props.float ? 1 : 0)}
            opac={(this.props.opac)}
            counter={this.props.counter}
            nodes={this.props.nodes}
            prevNodes={this.props.prevNodes}
            colorOveride={this.props.colorOveride}
            links={this.props.links}
            foci={this.props.foci}
            prevFoci={this.props.prevFoci}
            callBack={this.props.callBackNodes}
            collectHistory={this.props.collectHistory}
            categories={(this.props.categories ? this.props.categories : [])}
            extraHeight={this.props.extraHeight}
          />
          <div className="usrInput">
            {this.renderNextButton()}
            {this.renderDeselectButton()}
            {this.renderEdgeCounter()}
            {/* {this.props.route ? <NavLink exact to={this.props.route} onClick={() => this.transferCallBack}>
              <button id="confirm_next">Confirm & Next</button>
            </NavLink> : <div />} */}
          </div>
        </div>
      </HashRouter>
    );
  }
}

export default NodeComponent;