import React, { Component } from "react";
// import { Redirect } from "react-router-dom";
import Graph from "./Graph";
import
{
  NavLink,
  HashRouter
} from "react-router-dom";

/*************************************************************************
 * Screen design to assign some categories to nodes.
 *************************************************************************/
class NodeCategoriesComponent extends Component
{
  constructor(props)
  {
    super(props);
    this.state = { counter: 0 };
    this.counter = 0;
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
   * Set initial component state
   *************************************************************************/
  componentDidMount()
  {
    this.setState(this.state);
    console.log("props nodes", this.props)
    if (this.props.nodes.length === 0)
    {
      document.getElementById("confirm_next").click();
    }
  }

  /*************************************************************************
   * Updates the counter of a node.
   * @param {number} id: the node ID you want to update the counter of
   * @param {string} text: Text string to pass into the callback function
   *************************************************************************/
  updateCounter = (id, text) =>
  {
    let callbackMethod = this.props.callBackButton[0];
    let callbackKey = this.props.callBackButton[1];
    let callbackKeyColor = this.props.callBackButton[2];
    let categories = this.props.callBackButton[3];
    callbackMethod(callbackKey, callbackKeyColor, categories, this.props.counter, id, text);
  }


  render()
  {
    // If there are no nodes, we propt users to navigate to the next question
    if (this.props.nodes.length === 0)
    {
      return (
        <HashRouter>
          <div>
            <div className="textBox">
              You have not assigned any nodes for this question. You can click "Confirm and Next" to proceed to the next question.
            </div>
            <div>
              {this.props.route ? <NavLink exact to={this.props.route} onClick={() => this.transferCallBack}>
                <button id="confirm_next">Confirm & Next</button>
              </NavLink> : <div />}
            </div>
          </div>
        </HashRouter>
      )
    }
    else
    {
      return (
        <HashRouter>
          <div>
            <div className="textBox">
              {this.props.textDescription}
            </div>
            <Graph fixed={this.props.fixed}
              float={(this.props.float ? 1 : 0)}
              opac={(this.props.opac ? 1 : 0)}
              counter={this.props.counter}
              nodes={this.props.nodes}
              prevNodes={this.props.prevNodes}
              links={this.props.links}
              foci={this.props.foci}
              prevFoci={this.props.prevFoci}
              callBack={this.props.callBackNodes}
              collectHistory={this.props.collectHistory}
              categories={[]} 
              textToApply={this.props.textToApply}
              multiText = {this.props.multiText}
              />

            <div className="container" id="userInputStd">
              {this.props.categories.map((category, i) => (
                <button className="categoryButton"
                  key={category.key}
                  type="button"
                  style={{ background: category.color }}
                  value={category.text}
                  onClick={() => this.updateCounter(category.key, category.text)}>
                  {category.text}
                </button>
              ))}
            </div>
            <div className="usrInput">
              {this.props.route ? <NavLink exact to={this.props.route} onClick={() => this.transferCallBack}>
                <button id="confirm_next">Confirm & Next</button>
              </NavLink> : <div />}
            </div>
          </div>
        </HashRouter>
      );
    }
  }
}

export default NodeCategoriesComponent;