/*************************************************************************
 * This file contains the majority of customizable settings that can be 
 * manipulated to tweak the survey to your needs. 
 * NOTE: Not all settings are found here, and I have simply pulled out 
 * certain elements from the Utils.js file that are more static exports 
 * than utility functions.
 *************************************************************************/
import React from "react";
// Constant imports
import
{
    SVG_HEIGHT,
    SVG_WIDTH,
    MOBILE,
} from "./Graph";

/*************************************************************************
 * Exporting alerts and Warnings
 *************************************************************************/
export const DELETE_WARNING = "Cannot delete Nodes after linking them in the network stage!";
export const DUPLICATE_WARNING = "You already chose this name. Please modify it to be slightly different!";
export const SLIDER_WARNING = "You provided a value for every person, thank you. Click on a node to change their class!";
export const CATEGORY_WARNING = "You provided the category for every person, thank you. Click on a node to change their category!";
export const CATEGORY_CHANGED = "You have changed the category for an individual. Please ensure that any dependant subcategories are updated as well."

/*************************************************************************
 * Constants for creating alters
 *************************************************************************/
// The maximum number of individuals that participants can add.
export const MAX_ALTERS = 20

// The minimum number of alters that participants can add. Having this value higher than 0 will prevent users from 
//navigating the site and skipping the name generation screen. Participants MUST add 
//<MIN_ALTERS> individuals in order to proceed to subsequent questions.
export const MIN_ALTERS = 20


/*************************************************************************
 * Defining Box Colors to avoid repetition
 *************************************************************************/
export const BOX_COLORS = [
    "#E9621F", "#0795BB", "#F4E401", "#6D3A8A"
]

/*************************************************************************
 * Object contains the settings for Gender. You can add additional values
 * If you would like to incorperate more genders than Male, Female, and 
 * Other.
 *************************************************************************/
export const COLOUR_CYCLE = {
    purple: {
        name: "purple",
        color: "#C8A4DB"
    },
    orange: {
        name: "orange",
        color: "#FECC80"
    },
    green: {
        name: "green",
        color: "#80FED0"
    }
}

export const CLASS_ASSIGNMENT = {
    class1: {
        name: "class1",
        color: BOX_COLORS[0]
    },
    class2: {
        name: "class2",
        color: BOX_COLORS[1]
    },
    none: {
        name: "no",
        color: "#acacac"
    }
}

export const IS_LABMEMBER_SETTINGS = {
    isLabMember: {
        name: "yes",
        color: "#E9621F"
    },
    notLabMember: {
        name: "no",
        color: "#acacac"
    }
}


export const INTRODUCTION_TEXT = <div className="introduction">
    <h3>GENTLE-Adapt can have a landing page before the survey begins. </h3>
    <p>This landing page may include consent forms with a mandatory “click button” for consent, as well as instructions or descriptions</p>
</div>

export const END_OF_SURVEY_STATEMENT = <div className="introduction">
    <h3>Thank you very much for participating!</h3>
</div>
/*************************************************************************
 * A constant object that defines the on-screen questions for the survey.
 * To add additional questions, simply create a new <div></div> containing 
 * the question, and add it to the array. It is important to know the 
 * location of a div when you add it to a route in Survey.
 * For Example, SURVEYQUESTIONS[1] would be the second div in the array, 
 * since arrays are 0 based.
 *************************************************************************/
export const SURVEY_QUESTIONS = [
    // Question 1 Instructions (appearing in text-box)
    <div>
        <p>GENTLE-Adapt naming tool: </p>
        <p>This tool prompts participants to provide a unique name to each node. 
            The participant should NOT name themselves. Clicking on a node and selecting the 
            “Modify Selected Node” box (bottom, left) will allow participants to rename any node. 
            The default starting colour is grey. 
        </p>
    </div>,

    // Question 2 Instructions (appearing in text-box)
    <>
        <div>
            <p> GENTLE-Adapt “button” tool (Option 1):</p>
            <p>Participants click the node and select the colour that corresponds to their desired choice. 
                Nodes will cycle from grey to purple to yellow to green. </p>
        </div>

        <div className="legend">
            <h3>Legend</h3>
            <div className="legendNode" style={{ backgroundColor: COLOUR_CYCLE.purple.color }}><p>Purple</p></div>
            <div className="legendNode" style={{ backgroundColor: COLOUR_CYCLE.orange.color }}><p>Orange</p></div>
            <div className="legendNode" style={{ backgroundColor: COLOUR_CYCLE.green.color }}><p>Green</p></div>
        </div>
    </>,

    // Question 3 Instructions
    <div>
        <p> GENTLE-Adapt “button” tool (Option 2):  </p>
        <p>Participants click only the nodes that match the question criteria. Nodes will cycle from grey to orange. </p>
        <div className="legend">
        <h3>Legend</h3>
        <div className="legendNode" style={{ backgroundColor: BOX_COLORS[0] }}><p>class 1</p></div>
        <div className="legendNode" style={{ backgroundColor: BOX_COLORS[1] }}><p>class 2</p></div>
        </div>
    </div>,

    // Question 4 Instructions
    <div>
        <p>
            GENTLE-Adapt “list selection” tool (Option 1): 
        </p>
        <p>
            Participants can click on the first node, and then select the desired option from the list below (yellow boxes). These tool can be setup to have only one choice, or multiple choices allowed. Selection will appear in the bottom, right corner of each node.
        </p>
    </div>,


    <div>
        <p>GENTLE-Adapt “list selection” tool (Option 2):</p> 
        <p>Participants can click on the first node, 
            and then select the desired option from the list below (coloured boxes). 
            Selection will appear in the bottom, right corner of each node, 
            and a coloured ring can appear around the node. 
            This ring can be made visible for all subsequent questions.
        </p>
    </div>,
    
    <div>
        <p> GENTLE-Adapt “drag-and-drop” tool: </p>
        <p> Participants can drag each alter into the corresponding box that best suits their choice. 
            Nodes dragged into each box will retain a small coloured ring once placed in each box to confirm the choice.
        </p>
    </div>,
    //Question 5c Instructions message
    <div>
        <p>GENTLE-Adapt network structure tool: </p>
        <p>Participants must click on the centre of one node, and then on the centre of another node, to make a “link” between the two. 
            There is an option to deselect the current node with a button (bottom, left) 
            and there is also a ”link counter” if you require a minimum/maximum number of links for your question.</p>
    </div>,

];

/*************************************************************************
 * Template Node that represents an alter for the survey. The Node 
 * consists of a series of Key-Value pairs that make up both the Node 
 * State as well as the values that will be exported to the database to 
 * gather the survey results. 
 * You can add additional keys or modify existing keys to hold your custom 
 * survey data.
 * @param {number} counter: Esentiall the unique key representing the 
 * node.
 * @param {string} name: The Name of the Alter.
 *************************************************************************/
export function returnTemplateNode(counter, name)
{
    return {
        // State values used to control the node during execution
        key: counter,
        name: name,
        size: (MOBILE ? 20 : 30),
        fixed: false,
        float: false,
        link: false,
        fixedPosX: SVG_WIDTH / 2,
        fixedPosY: SVG_HEIGHT * 0.1 + (Math.random() * (SVG_HEIGHT * 0.8)),
        continuous1: -1,
        continuous2: -1,

        booleanCondition: false,
        x: 250,
        y: 250,
        floatX: 0,
        floatY: 0,
        shouldFloat: false,
        // Values for the purposes of data collection.
        // Name belongs in both locations, but I have chosen to leave it as a control value.
        color: "#acacac",
        class: "",
        number: "",
        // box: "",
        exampleSubCategory: "",
        classassign: -1,
        classassignColor: "#acacac",
        question_example: -1,
        categoryColor: "white",
        border: "#FFFFFF"
    };
}

/*************************************************************************
 * You Node template controls the appearance of the 'You' node.
 * Default: 
 * key: 0, name: "You", categoryColor: "green", 
 * color: "green", size: 10, x: SVGWIDTH / 2, y: SVGHEIGHT / 2,
 * floatX: SVGWIDTH / 2, floatY: SVGHEIGHT / 2, fixed: false,
 * float: false, link: false, shouldFloat: false
 *************************************************************************/
export function returnYouTemplate()
{
    return {
        key: 0,
        name: "You",
        categoryColor: "green",
        color: "green",
        size: 10,
        x: SVG_WIDTH / 2,
        y: SVG_HEIGHT / 2,
        floatX: SVG_WIDTH / 2,
        floatY: SVG_HEIGHT / 2,
        fixed: false,
        float: false,
        link: false,
        shouldFloat: false


    }
}

/*************************************************************************
 * The Informed Consent information that survey takers will agree to prior 
 * to taking the survey. 
 * TODO: This text should be replaced with an html block, to have more 
 * control over the appearance of the consent sheet.
 *************************************************************************/
export const INFORMATION = "Place-holder for informed consent sheet.";


/*************************************************************************
 * A category object that is used to define the selectable categories for 
 * a single question. This will assign node properties, colors, and text.
 * To add additional categories to this question, simply follow this 
 * format.
 * To Create another question that uses categories, you need to create 
 * an entirely new Categories object by a different name, and assign it 
 * to a key in the node using a callback function provided.
 *************************************************************************/
// export const CATEGORIES = [
//     { key: 0, text: "Cat1", color: "#E27D60" },
//     { key: 1, text: "Cat2", color: "#85DCBA" },
//     { key: 2, text: "Cat3", color: "#E8A87C" },
//     { key: 3, text: "Cat4", color: "red" }
// ];

export const EXAMPLE_SUBCATEGORIES = [
    { key: 0, text: "SUB_CATEGORY 1", color: "#FEEDB3" },
    { key: 1, text: "SUB_CATEGORY 2", color: "#FDE4B5" },
    { key: 2, text: "SUB_CATEGORY 3", color: "#FBDBB7" },
    { key: 3, text: "SUB_CATEGORY 4", color: "#FAD4B8" },
    { key: 4, text: "SUB_CATEGORY 5", color: "#F8CEB9" },
    { key: 5, text: "SUB_CATEGORY 6", color: "#F7C4BA" },
    { key: 6, text: "SUB_CATEGORY 7", color: "#F6BBBB" },
    { key: 7, text: "SUB_CATEGORY 8", color: "#fEB4E3" },
    { key: 8, text: "SUB_CATEGORY 9", color: "#F2BFEA" },
    { key: 9, text: "Other", color: "#F1B6EC" }

];

export const NUMBER_CATEGORIES = [
    { key: 0, text: "<20", color: "#FFE699" },
    { key: 1, text: "20-24", color: "#FFE699" },
    { key: 2, text: "25-29", color: "#FFE699" },
    { key: 3, text: "30-34", color: "#FFE699" },
    { key: 4, text: "35-39", color: "#FFE699" },
    { key: 5, text: "40-44", color: "#FFE699" },
    { key: 6, text: "45-49", color: "#FFE699" },
    { key: 7, text: "50-59", color: "#FFE699" },
    { key: 8, text: "60+", color: "#FFE699" }

];

// Boxes for Q6
export const CLASS_ASSIGNMENT_BOXES = (window.innerWidth > 700 ?
    // desktop sized boxes.
    [
        {
            key: 0,
            text: "Class 1:",
            value: "class1",
            color: BOX_COLORS[0],
            x: 15,
            y: (window.innerHeight * 0.63 - window.innerHeight * 0.17 - 30),
            width: ((SVG_WIDTH / 2) - 15),
            height: window.innerHeight * 0.17
        },
        {
            key: 1,
            text: "Class 2:",
            value: "class2",
            color: BOX_COLORS[1],
            x: ((SVG_WIDTH / 2) + 15),
            y: (window.innerHeight * 0.63 - window.innerHeight * 0.17 - 30),
            width: ((SVG_WIDTH / 2) - 30),
            height: window.innerHeight * 0.17
        },
    ] :
    // Mobile Considerations. If the screensize is less than 700px, return the bollowing boxes
    [
        {
            key: 0,
            text: "I am collaborating with:",
            value: "current collaborator",
            color: BOX_COLORS[0],
            x: 15,
            y: (window.innerHeight * 0.9 - 250 - window.innerHeight * 0.20),
            width: window.innerWidth * 0.725,
            height: window.innerHeight * 0.20
        },
        {
            key: 1,
            text: "I would like to collaborate with:",
            value: "I would like to",
            color: BOX_COLORS[1],
            x: 15,
            y: (window.innerHeight * 0.9 - 10 - window.innerHeight * 0.20),
            width: window.innerWidth * 0.725, height: window.innerHeight * 0.20
        },
    ]
)

// Boxes for Question 7
export const QUESTION_EXAMPLE = (window.innerWidth > 700 ?
    // desktop sized boxes.
    [
        {
            key: 0,
            text: "Question 1:",
            value: "answer 1",
            color: BOX_COLORS[0],
            x: 15,
            y: (window.innerHeight * 0.63 - window.innerHeight * 0.17 - 30),
            width: ((SVG_WIDTH / 3) - 30),
            height: window.innerHeight * 0.17
        },
        {
            key: 1,
            text: "Question 2:",
            value: "answer 2",
            color: BOX_COLORS[1],
            x: ((SVG_WIDTH / 3) + 15),
            y: (window.innerHeight * 0.63 - window.innerHeight * 0.17 - 30),
            width: ((SVG_WIDTH / 3) - 30),
            height: window.innerHeight * 0.17
        },
        {
            key: 2,
            text: "Question 3:",
            value: "answer 3",
            color: BOX_COLORS[2],
            x: ((SVG_WIDTH / 3) * 2 + 15),
            y: (window.innerHeight * 0.63 - window.innerHeight * 0.17 - 30),
            width: ((SVG_WIDTH / 3) - 30),
            height: window.innerHeight * 0.17
        }
    ] :
    // Mobile Considerations. If the screensize is less than 700px, return the bollowing boxes
    [
        {
            key: 0,
            text: "Question 1:",
            value: "answer 1",
            color: BOX_COLORS[0],
            x: 15,
            y: (window.innerHeight * 0.9 - 250 - window.innerHeight * 0.20),
            width: window.innerWidth * 0.725,
            height: window.innerHeight * 0.20
        },
        {
            key: 1,
            text: "Question 2:",
            value: "answer 2",
            color: BOX_COLORS[1],
            x: 15,
            y: (window.innerHeight * 0.9 - 10 - window.innerHeight * 0.20),
            width: window.innerWidth * 0.725, height: window.innerHeight * 0.20
        },
        {
            key: 2,
            text: "Question 3:",
            value: "answer 3",
            color: BOX_COLORS[2],
            x: 15,
            y: (window.innerHeight * 0.9 - 10 - window.innerHeight * 0.20),
            width: window.innerWidth * 0.725, height: window.innerHeight * 0.20
        },
    ]
)


/*************************************************************************
 * Separator for showing how the rendering of categories can also be
 * used to create visually seperating elements on screen.
 *************************************************************************/
export const SEPARATOR = [
    {
        key: 0, text: "",
        color: "white",
        x: 1015,
        y: 35,
        width: 0,
        height: 0
    },
    {
        key: 1,
        text: "",
        color: "green",
        x: SVG_WIDTH * 0.5,
        y: 10, width: 2,
        height: SVG_HEIGHT * 0.9
    }
];

