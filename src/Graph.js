import React, { Component } from "react";
import * as d3 from 'd3';
import ReactDOM from "react-dom";
import { isEqual } from 'underscore';
// Important consts:
export var SVG_HEIGHT = window.innerHeight * 0.65;
export var SVG_WIDTH = (window.innerWidth > 1140 ? window.innerWidth - 15 : window.innerWidth) - 60;
export var MOBILE = (window.innerWidth < 500 || window.innerHeight < 500 ? true : false) // to detect small displays, requiring different render
export var NODE_SIZE = MOBILE ? 20 : 30; // just internal size of node
export var OUTER_STROKE = MOBILE ? 5 : 10;
export var NODE_RADIUS = NODE_SIZE + 1 + (OUTER_STROKE / 2.0); // node size + colored circle
export var AVB_WIDTH = SVG_WIDTH - 2 * NODE_RADIUS;
export var AVB_HEIGHT = SVG_HEIGHT - 2 * NODE_RADIUS;

/*************************************************************************
 * Graph class handling dynamic and static rendering for networks.
 * 
 * References:
 * 
 * d3 API:
 * https://github.com/d3/d3-3.x-api-reference/blob/master/Force-Layout.md
 * 
 * d3 Foci based example:
 * https://bl.ocks.org/mbostock/1021953
 * 
 * d3 & REACT interaction:
 * The class here is very bloated due to all the checks and
 * conditional adaptations necessary to the graph. A much cleaner
 * but slightly outdated example of the interaction between the
 * two frameworks is presented here:
 * http://bl.ocks.org/sxywu/fcef0e6dac231ef2e54b
 * 
 * The reference keeping is discussed here:
 * https://reactjs.org/docs/refs-and-the-dom.html
 * https://stackoverflow.com/questions/43873511/deprecation-warning-using-this-refs
 * 
 **************************************************************************/
class Graph extends Component
{
  constructor(props)
  {
    super(props);
    this.force = d3.layout.force()
      .charge(-1)
      .gravity(0.01)
      .linkDistance(150)
      .linkStrength(MOBILE ? 0.5 : 0.1)
      .size([SVG_WIDTH, SVG_HEIGHT]);
    this.conditionNode = 1;
    this.force.drag()
      .on("dragend", (e) => this.dragCallBack(e))
  }

  /*************************************************************************
 * D3 takes over to render node parts, independet of REACT
 *************************************************************************/
  componentDidMount()
  {
    this.virtualD3 = d3.select(ReactDOM.findDOMNode(this.graphRef));
    this.force.on('tick', (e) =>
    {
      this.virtualD3.call(this.updateVirtualD3, JSON.parse(JSON.stringify(this.props.foci)));
    });
    this.lastClickedNode = 0
    console.log("Mounting Graph", this.props)

    // if (this.props.categories)

  }

  // handleCanvasResize = () =>
  // {
  //   SVG_HEIGHT = window.innerHeight * 1;
  //   SVG_WIDTH = (window.innerWidth > 1140 ? window.innerWidth - 15 : window.innerWidth) - 60;
  //   MOBILE = (window.innerWidth < 500 || window.innerHeight < 500 ? true : false) // to detect small displays, requiring different render
  //   NODE_SIZE = MOBILE ? 20 : 30; // just internal size of node
  //   OUTER_STROKE = MOBILE ? 5 : 10;
  //   NODE_RADIUS = NODE_SIZE + 1 + (OUTER_STROKE / 2.0); // node size + colored circle
  //   AVB_WIDTH = SVG_WIDTH - 2 * NODE_RADIUS;
  //   AVB_HEIGHT = SVG_HEIGHT - 2 * NODE_RADIUS;
  //   console.log("Resizing")
  // }
  /*************************************************************************
   * Handles callbacks for views that allow for node dragging
   * @param {event}: d3.js event
   *************************************************************************/
  dragCallBack = (e) =>
  {
    //for fixed nodes
    if (this.props.fixed)
    {
      let callbackMethod = this.props.callBack[0];
      let callbackKey = this.props.callBack[1];
      callbackMethod(callbackKey, e.key, e.x, e.y);
    }

  }

  /*************************************************************************
   * Handles all remaining callback cases (clicking, connecting, etc.)
   * @param {Node} d:  data object of a node
   *************************************************************************/
  callback = (d) =>
  {
    let nodes = JSON.parse(JSON.stringify(this.force.nodes()));
    this.force.alpha(0.2);
    let callbackKey = this.props.callBack[1];
    if (typeof callbackKey === 'undefined' || callbackKey === null)
    {
      this.props.callBack(d.key, nodes);
    } else
    {
      this.props.callBack[0](callbackKey, d.key);
    }

  }

  /*************************************************************************
   * Enter cycle for nodes (see d3.js docs)
   * @param {*} v3d: virtual dom object
   *************************************************************************/
  enterCycleNodes = (v3d) =>
  {
    this.force.start();
    if (this.props.opac === "static")
    {
      v3d.classed('node', true)
        .call(this.force.drag)
        .style("opacity", (d) => (0.65)); //all nodes have 0.7 opacity
    } else if (this.props.opac === "dynamic")
    {
      v3d.classed('node', true)
        .call(this.force.drag)
        .style("opacity", (d) => (d.x / SVG_WIDTH + 0.1)); //opacity depends on x coordinate
    } else if (this.props.opac === "conditional")
    {
      v3d.classed('node', true)
        .call(this.force.drag)
        .style("opacity", (d) => (d.opac ? 1.0 : 0.25)); //all active nodes have an opac of 1
    } else
    {
      v3d.classed('node', true)
        .call(this.force.drag)
        .style("opacity", (d) => (d.key === this.props.counter ? 0.65 : 1)); //current node has 0.65 opacity
    }

    var color;

    v3d.append("circle")
      .attr("class", "Node_center")
      .attr("id", (d) => d.key)
      .attr("r", (d) => d.size)
      .style("fill", (d) => this.props.colorOveride === undefined || this.props.colorOveride === null ? d.color : d[this.props.colorOveride])
      .style("stroke", (d) => d.border)
      .style("stroke-width", "10px")
      //.on("touchstart", function(d){d3.event.preventDefault(); console.log(d)})

      .on("touchstart", (d) => { d3.event.preventDefault(); })
      .on("touchend", (d) => { this.callback(d); })
      .on("click", (d) => { this.callback(d); });

    console.log("Color Overide: ", this.props.colorOveride)

    v3d.append("circle")
      .attr("class", "Node_rel")
      .attr("id", (d) => 'rel_' + d.key)
      .attr("r", (d) => (d.size + 1))
      .style("stroke", (d) => d.categoryColor)
      .style("stroke-width", (d) => (OUTER_STROKE))
      .style("fill", "none");


    v3d.append("text")
      .attr("class", "node_text")
      .attr("text-anchor", "middle")
      .attr("dy", ".3em")
      .attr("pointer-events", "none")
      .text((d) => d.name);

    if (this.props.multiText === true)
    {
      for (var i = 0; i < this.props.textToApply.length; i++)
      {
        v3d.append("text")
          .attr("class", "float_text multi")
          .attr("text-anchor", "middle")
          .attr("dx", (MOBILE ? "1em" : "1.25em"))
          .attr("dy", (MOBILE ? "1.5em" : "1.25em"))
          .attr("pointer-events", "none")
          .attr("y", 10 + (i * 11))
          .text((d) => this.applyTextArray(d, this.props.textToApply, i));
      }
    }
    else
    {
      v3d.append("text")
        .attr("class", "float_text")
        .attr("text-anchor", "middle")
        .attr("dx", (MOBILE ? "1em" : "1.25em"))
        .attr("dy", (MOBILE ? "1.5em" : "1.25em"))
        .attr("pointer-events", "none")
        .text((d) => this.applyText(d, this.props.textToApply, i));
    }
    // v3d.append("text")
    //   .attr("class", "float_text")
    //   .attr("text-anchor", "middle")
    //   .attr("dx", (MOBILE ? "1em" : "1.25em"))
    //   .attr("dy", (MOBILE ? "1.5em" : "1.25em"))
    //   .attr("pointer-events", "none")
    //   .text((d) => this.applyText(d, this.props.textToApply));

  };

  applyTextArray = (d, key = 'number', i) =>
  {
    return d[key][i]
  }
  applyText = (d, key = 'number',) =>
  {
    return d[key]
  }
  /*************************************************************************
   * Enter cycle for links (see d3.js docs)
   * @param {*} v3d: virtual dom object
   *************************************************************************/
  enterCycleLinks = (v3d) =>
  {
    //optional data driven style paramaters can be included here, e.g. stroke-width
    v3d.classed('link', true);
    // v3d.style("stroke", "blue")
  };

  nodeClicked = (props) =>
  {
    console.log("clicked node", d3.event.target.id)
    var nodeID = d3.event.target.id
    if (props.lastClickedNodeCallback)
    {
      props.lastClickedNodeCallback(nodeID)
    }
  }
  /*************************************************************************
   * Update positions of nodes using foci and alpha to gradually move nodes 
   * to their designated foci points.
   * @param {*} v3d: virtual dom object
   * @param {*} foci: foci of nodes
   *************************************************************************/
  updateVirtualD3 = (v3d, foci) =>
  {
    //update Node position determined by foci
    var k = this.force.alpha();


    this.force.nodes().forEach(function (d, i)
    {
      if ((!d.fixed && !d.float))
      {
        d.y += (foci[i].y - d.y) * k;
        d.x += (foci[i].x - d.x) * k;
      }

      /**
       * Push-back boundary set-up. Prevents nodes from being
       * pushed outside of the screen.
       */
      if (d.x < 0)
      {
        d.x = NODE_RADIUS;
      } else if (d.x > SVG_WIDTH)
      {
        d.x = SVG_WIDTH - NODE_RADIUS;
      }

      if (d.y < 0)
      {
        d.y = NODE_RADIUS;
      } else if (d.y > SVG_HEIGHT)
      {
        d.y = SVG_HEIGHT - NODE_RADIUS;
      }

    });

    v3d.selectAll('.node')
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("name", (d) => d.name)
      .attr("id", (d) => d.key)
      .attr("transform", (d) => "translate(" + d.x + "," + d.y + ")")
      .attr("class", (d) => d.key === 0 ? "hiddenNode" : "node"); //hide the You node

    v3d.selectAll(".node").on("click", () => this.nodeClicked(this.props))
    // {
    //   elem.on("click", () => this.nodeClicked())
    // })
    v3d.selectAll('.Node_center')
      .attr("stroke", (d) => d.border)
      .attr("stroke-width", "18px")

    // if (d.source === 1)
    // {
    //   v3d.selectAll('.link')
    //     .attr("x1", (d) => d.source.x)
    //     .attr("y1", (d) => d.source.y)
    //     .attr("x2", (d) => d.target.x)
    //     .attr("y2", (d) => d.target.y);
    // }
    // else
    // {
    //   v3d.selectAll('.link')
    //     .attr("x1", (d) => d.source.x)
    //     .attr("y1", (d) => d.source.y)
    //     .attr("x2", (d) => d.target.x)
    //     .attr("y2", (d) => d.target.y)
    //     .attr("stroke", "red");
    // }
    v3d.selectAll('.link')
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y)
      .style("stroke", (d) => d.source.key === this.props.lastClickedNode ||
        d.target.key === this.props.lastClickedNode ? "red" : "#999");
  };

  /*************************************************************************
   * The static render is based on the principle outlined in the link below. 
   * However, since the .tick method is overwritten below, the network needs
   * to be told explicitly how it should advance.
   * 
   * See:
   * https://stackoverflow.com/questions/47510853/how-to-disable-animation-in-a-force-directed-graph/47522074#47522074
   * and:
   * https://github.com/d3/d3/issues/1519
   * 
   * @param {*} foci: foci of nodes
   *************************************************************************/
  staticRender(foci)
  {
    for (let i = 0; i < 100; i++)
    {
      //static rendering prevents "fading in"
      this.virtualD3.call(this.updateVirtualD3, foci);
    }
  }



  /*************************************************************************
   * Checks whether two sequences of objects are equal.
   * @param {array} seq1: a sequence array to compare
   * @param {array} seq2: a sequence array to compare
   * 
   * @returns {true} if seq1 and seq2 are the same. 
   * Otherwise @returns {false}
   *************************************************************************/
  areSequenceObjectsUnEqual(seq1, seq2)
  {
    if (seq1.length !== seq2.length)
    {
      //simple test for equality
      return true;
    } else
    {
      for (let i = 0; i < seq1.length; ++i)
      {
        //more elaborate test
        if (!isEqual(seq1[i], seq2[i]))
        {
          return true;
        }
      }

    }
    return false;
  }

  /*************************************************************************
   * Decision method for rendering. Renders nodes statically 
   * (cools down force in networkif no changes were made) or dynamically 
   * (lets nodes take on positions freely).
   * Additionally assigns individual node properties for the network screen 
   * using properties definded by network callback (see Survey).
   *************************************************************************/
  componentDidUpdate()
  {
    //Props need to remain Pure in React, Force would manipulate props, thus deep copy.

    console.log("Graph Props to check: ", this.props)
    console.log("Graph State to check: ", this.props.lastClickedNode)
    let nodes = JSON.parse(JSON.stringify(this.props.nodes));
    let links = JSON.parse(JSON.stringify(this.props.links));
    let foci = JSON.parse(JSON.stringify(this.props.foci));
    let conditionNode = this.areSequenceObjectsUnEqual(this.props.prevNodes, this.props.nodes);

    // something about the nodes is in-equal - might be data or position
    if (conditionNode)
    {
      this.virtualD3 = d3.select(ReactDOM.findDOMNode(this.graphRef));

      var vd3Nodes = this.virtualD3.selectAll('.node')
        .data(nodes, (node) => node.key);

      //Update & Enter (see: https://www.d3indepth.com/enterexit/ for explanations!)
      vd3Nodes.select(".node_text").text((d) => d.name);
      vd3Nodes.select(".Node").style("fill", (d) => d.color);
      vd3Nodes.select(".Node_rel").style("stroke", (d) => d.categoryColor);
      vd3Nodes.select(".Node_center").style("stroke", (d) => d.border);
      vd3Nodes.select(".Node_center").style("stroke-width", "18px");

      vd3Nodes.enter().append('g').call(this.enterCycleNodes);
      vd3Nodes.exit().remove();

      var vd3Links = this.virtualD3.selectAll('.link')
        .data(links, (link) => link.key);
      vd3Links.enter().insert('line', '.node').call(this.enterCycleLinks);
      vd3Links.exit().remove();

      var n = document.getElementsByClassName("node")
      for (var i = 0; i < n.length; i++)
      {
        console.log("a node", n[i].id)
      }
      //If data changed but positions remained the same use static rendering as well
      //to prevent "fading in"
      let conditionFoci = this.areSequenceObjectsUnEqual(this.props.prevFoci, this.props.foci);

      // For network connection screen we need to further diverge from the static/dynamic distinction.
      // The following lines use the float property set by network callback to
      // decide link strength and charge properties.
      // Additionally, the conditionFoci variable is set to 0
      // since for the network screen we always want a static render first

      if (this.props.float)
      {
        this.force.gravity(0.075);
        conditionFoci = 0;
        this.force.charge((d) => (d.float ? -500 : -30));


        this.force.linkDistance(function (d)
        {
          let link = (d.source.link > d.target.link ?
            d.source.link : d.target.link)
          if (link < 3)
          {
            return MOBILE ? 35 : 50;
          } else if (link < 7)
          {
            return MOBILE ? 45 : 75;
          } else
          {
            return 100
          }
        });
      }

      this.props.collectHistory(nodes, foci);
      this.force.nodes(nodes).links(links);

      // cool down network sufficiently to prevent fading in == static rendering
      // will always take place on the network connection screen.
      if (!conditionFoci)
      {
        this.staticRender(foci);
      } else
      {
        this.virtualD3.call(this.updateVirtualD3, foci);

      }
      this.force.start();

    } else
    {

      //skip update just rerender in case nothing changed (or data only)
      vd3Nodes = this.virtualD3.selectAll('.node')
        .data(nodes);
      vd3Links = this.virtualD3.selectAll('.link')
        .data(links);


      vd3Nodes.enter().append('g').call(this.enterCycleNodes);
      vd3Links.enter().insert('line', '.node').call(this.enterCycleLinks);
      this.force.nodes(nodes).links(links);

      // cool down network sufficiently to prevent fading in == static rendering
      // will always take place on the network connection screen.
      this.staticRender(foci);
      this.force.start();
      this.force.alpha(0.05); //stop unnecessary calculations

    }

  }

  containerClass = () =>
  {
    console.log("ContainerClass: ", this.props.extraHeight)
    if (this.props.extraHeight !== undefined)
    {
      return true;
    }
    if (this.props.categories)
    {
      if (this.props.categories[0] !== undefined)
      {
        if (this.props.categories[0].height !== null)
        {
          return true;
        }
        else
        {
          return false;
        }
      }
    }


  }

  render()
  {
    return (
      <div className={this.containerClass() === true ? "container withBoxes" : "container"}>
        <svg width="100%" height="100%" id="graphCanvas" ref={(e) => this.graphRef = e}>
          <g id="boxes">
            {(this.props.categories ? this.props.categories.map((category, i) => (
              <text key={category.key} x={category.x} y={category.y - 10}>{category.text}</text>
            )) : <g />)}
            {(this.props.categories ? this.props.categories.map((category, i) => (
              <rect className="CategoryBox"
                key={category.key}
                width={category.width}
                height={category.height}
                x={category.x}
                y={category.y}
                fill="transparent"
                stroke={category.color}
                strokeWidth="5">

              </rect>
            )) : <g />)}
          </g>
        </svg>
      </div >
    );
  }
};

export default Graph;
