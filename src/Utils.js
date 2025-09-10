// Constant imports
import
{
  SVG_HEIGHT,
  SVG_WIDTH,
  MOBILE,
  NODE_SIZE,
  NODE_RADIUS,
  AVB_WIDTH,
  AVB_HEIGHT
} from "./Graph";

/**
 * Layout calculations
 */

/*************************************************************************
 * Calculates rectangular layout position
 * for a given index
 * @param {number} counter the index of a node
 *************************************************************************/
export function rect_layout(counter)
{
  let adjC = counter - 1;

  let y = NODE_RADIUS + (AVB_HEIGHT * 0.15) * Math.floor(adjC / 4);
  let x = NODE_RADIUS + (AVB_WIDTH * 0.33) * (adjC % 4);
  return [x, y];
}

/*************************************************************************
 * Calculates box layout position for a given index
 * @param {number} counter: the index of a node.
 *************************************************************************/
export function box_layout(counter)
{
  let n = 25;
  // start x & y
  var x = NODE_RADIUS;
  var y = NODE_RADIUS;

  let ints = n / 4; // Interval
  let x_ints = Math.floor(MOBILE ? ints - 2 : ints + 2);
  let y_ints = Math.floor(MOBILE ? ints + 3 : ints - 1);
  let avb_width_ratio = AVB_WIDTH / x_ints;
  let avb_height_ratio = AVB_HEIGHT / y_ints;
  let corrected_counter = counter - 1;

  if (corrected_counter < x_ints)
  {
    return [x + corrected_counter * avb_width_ratio, y];
  } else if (corrected_counter < (x_ints + y_ints))
  {
    return [AVB_WIDTH, y + (corrected_counter - x_ints) * avb_height_ratio];
  } else if (corrected_counter < (2 * x_ints + y_ints))
  {
    return [AVB_WIDTH - (corrected_counter - (x_ints + y_ints)) * avb_width_ratio, AVB_HEIGHT];
  }
  return [x, AVB_HEIGHT - (corrected_counter - (2 * x_ints + y_ints)) * avb_height_ratio];
}

/*************************************************************************
 * Adapts foci to work with different screen sizes.
 * @param {[foci]} foci: The foci points of all nodes
 *************************************************************************/
export function recalculate_foci(foci)
{
  let recalculated_f = [];
  for (let f = 0; f < foci.length; f++)
  {
    if (foci[f].key === 0)
    {
      //console.log("f==0")
      recalculated_f.push({
        key: foci[f].key,
        x: SVG_WIDTH / 2,
        y: SVG_HEIGHT / 2
      })
    } else
    {
      let coords = rect_layout(f);

      recalculated_f.push({
        key: foci[f].key,
        x: coords[0],
        y: coords[1]
      })
    }
  }
  return recalculated_f;
}

/*************************************************************************
 * recalculate nodes to work with different screen sizes.
 * @param {[nodes]} nodes nodes existing in network
 * @param {[foci]} foci foci of nodes
 * @returns the recalculated nodes.
 *************************************************************************/
export function recalculate_nodes(nodes, foci)
{
  for (let n = 0; n < nodes.length; n++)
  {
    if (nodes[n].key === 0)
    {
      // set position of new node if device was changed
      nodes[n].floatX = SVG_WIDTH / 2;
      nodes[n].floatY = SVG_HEIGHT / 2;
      continue;
    }
    nodes[n].size = NODE_SIZE;
    nodes[n].fixedPosY = SVG_HEIGHT * 0.1 + (Math.random() * (SVG_HEIGHT * 0.8))

    if (nodes[n].link && n !== 0)
    {
      continue;
    } else
    {

      nodes[n].floatX = 0;
      nodes[n].floatY = 0;
      nodes[n].shouldFloat = false;

    }

  }
  return nodes;
}

/*************************************************************************
 * Network rendering utility functions
 *************************************************************************/

/*************************************************************************
 * Checks whether there exists a link between two nodes. 
 * @param {[links]} links 
 * @param {number} source 
 * @param {number} current 
 * @returns {boolean} whether there exists a link between two nodes
 **************************************************************************/
export function hasLink(links, source, current)
{
  if (source === -1)
  {
    return false;
  }

  for (let i = 0; i < links.length; ++i)
  {
    if ((links[i].source === source &&
      links[i].target === current) ||
      (links[i].target === source &&
        links[i].source === current))
    {
      return true;
    }
  }
  return false;
}

/*************************************************************************
 * Checks whether a link exists between two nodes and returns the index in 
 * the [links] object corresponding to that connection.
 * @param {[links]} links: node connections 
 * @param {number} source: The source node
 * @param {number} current: the current node in the loop 
 * @returns {{boolean,number || null}} if there is a link
 * @param {}:
 *************************************************************************/
export function hasLinkAt(links, source, current)
{
  for (let i = 0; i < links.length; ++i)
  {
    if ((links[i].source === source &&
      links[i].target === current) ||
      (links[i].target === source &&
        links[i].source === current))
    {
      return {
        hasLink: true,
        linkAt: i
      };
    }
  }
  return {
    hasLink: false,
    linkAt: null
  };
}

/*************************************************************************
 * Recalculates the render-properties for nodes
 * @param {[nodes]} nodes 
 * @param {[nodes]} forceNodes 
 *************************************************************************/
export function updateNodeRenderProps(nodes, forceNodes)
{
  for (let i = 0; i < nodes.length; ++i)
  {
    if (nodes[i].link && i !== 0)
    {
      nodes[i].floatX = forceNodes[i].x;
      nodes[i].floatY = forceNodes[i].y;
      nodes[i].shouldFloat = true;
    } else
    {
      if (i === 0)
      {
        nodes[i].floatX = SVG_WIDTH / 2;
        nodes[i].floatY = SVG_HEIGHT / 2;
        nodes[i].shouldFloat = false;
      } else
      {
        let coords = box_layout(i);
        nodes[i].floatX = coords[0];
        nodes[i].floatY = coords[1];
        nodes[i].shouldFloat = false;
      }
    }
  }
}

/*************************************************************************
 * Misc.
 *************************************************************************/

/*************************************************************************
 * Removes a node at a specific index. Recalculates all render properties 
 * of the nodes.
 * @param {[nodes]} nodes: node array 
 * @param {[foci]} foci: node foci positions
 * @param {number} removeAt which node to remove.
 * @returns {nodes, foci} 
 *************************************************************************/
export function removeNodeAt(nodes, foci, removeAt)
{
  nodes.splice(removeAt, 1);
  foci.splice(removeAt, 1);
  for (let i = 1; i < nodes.length; ++i)
  {
    nodes[i].key = i;
    foci[i].key = i;
  }

  foci = recalculate_foci(foci);
  nodes = recalculate_nodes(nodes, foci);

  return ({
    "nodes": nodes,
    "foci": foci
  })
}

/*************************************************************************
 * Checks whether a name is already in use for an existing node.
 * @param {string} name: The name to check against 
 * @param {[nodes]} nodes: The array of nodes to see if the name is a 
 * duplicate
 * @returns {boolean} whether a name is a duplicate or not
 *************************************************************************/
export function doesNameOverlap(name, nodes)
{
  for (let i = 0; i < nodes.length; ++i)
  {
    if (nodes[i].name === name)
    {
      return true
    }
  }
  return false
}

/*************************************************************************
 * Filters nodes based on some key condition.
 * @param {string} name: The name to check against 
 * @param {[nodes]} nodes: The array of nodes to see if the name is a 
 * duplicate
 * @returns {boolean} whether a name is a duplicate or not
 *************************************************************************/
export function filterNodes(nodes, inKey, value)
{
  var matchingNodes = []
  for (let i = 0; i < nodes.length; ++i)
  {
    console.log(nodes[i][inKey])
    if (nodes[i][inKey] === value)
    {
      matchingNodes.push(nodes[i])
    }
  }
  return matchingNodes
}