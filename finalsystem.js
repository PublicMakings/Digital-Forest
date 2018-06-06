//Based on the L-System implementation by Daniel Shiffman

//AO Global variables
var intro;
var instructions = ['Welcome.','This Arboretum is a reflection about how we, as humans, tell stories about our relationship to  trees. how we think of them and how they think of us.\n The series of questions asked are intended to evoke memories of encountering trees. This site gathers these narratives into a digital repository propogated with a series of digital trees and text.','From the text you submit a seed of a digital tree is formulated. The seed grows through a process of chance operations and a Lindenmayer system, a type of formal grammar which acts a mechanism for translating lists of characters into geometric structures.\n L-systems were developed by Aristid Lindenmayer, a theoretical biologist and botanist. Lindenmayer used L-systems to describe the behaviour of plant cells and to model the growth processes of plant development.', 'Think about times you have been in forests.'];
// Get input from user
var seedTxt = [];
var seed = '';
var button;

// Keep list of DOM elements for clearing later when reloading
var listItems = [];
var database;
var clicks = 0;
var creating = false;

var sunlight = false;

// add `wander arboretrum` and `create tree` button
// F string background
// if condition on submission
// organize all globals to live up here, or preferably them up into groups and make singleton classes for them

// TREE THINGS

var axiom = "F";
var branchings = axiom; // string for branches
var roots      = axiom; // string for roots
var len = 8;           // length of trunk segment/s
var trunkBranchRatio = 8
var angle;
var windFactor = 1;
var d = 0;
var char_n = 0;
var root_n = 0;
var GminusRatio = 10;   // ratio between 'G' rule and '-' rule.
var maxDepth = 3;
var baseBranchWidth = 15;
var branchWidth;

var branchDepthFactor = 3;
var rootDepthFactor = 3;

var treeLoc = 0.7; // as a fraction of the canvas height
var trunkCol, woodCol, rootCol;
var drawRoots = true;

var rules = [];
rules[0] = {
  a: "F",
  b: "FF+[+FGF+F]-[GFGF+F][F-GF+F]"
  // b: "FF+[+FGF+F]-"
}


function setup() {

    // Initialize Firebase
    var config = {
        apiKey:            "AIzaSyAdEgPM5yVo2CbUc4F7936oM3ZVDjQCbms",
        authDomain:        "digital-forester.firebaseapp.com",
        databaseURL:       "https://digital-forester.firebaseio.com",
        projectId:         "digital-forester",
        storageBucket:     "",
        messagingSenderId: "966863363583"
    }

    firebase.initializeApp(config);
    database = firebase.database();
    // Start loading the data
    loadFirebase();

    // set up DOM
    intro = createP('Welcome.').id('body');
    wanderbutton = createButton('Wander Arboretum');
    treebutton   = createButton('Create Tree');
    wanderbutton.mousePressed(toggleWander);
    treebutton.mousePressed(toggleCreate);

    growthRing();

} //end of setup


function draw(){
    clearCanvas();
    resetMatrix();

    // introduction();

    // if the user has submitted, draw their tree and their binary/string background
    if (hasSubmitted) {

        textFont('Georgia', 15);
        strokeWeight(.5);
        fill(220, 220, 240, 90);
        stroke(220, 220, 240, 90);
        textAlign(CENTER, CENTER);
        text(bintext, 0, 0, width, height);

        fill(220, 220, 200, 90);
        stroke(220, 220, 200, 90);
        text(branchings, 0, 0, width, height);


        /////// mask the text
        fill(255);
        strokeWeight(2);
        stroke(100, 100);
        CircleMask(0.95);
    }

    /////// draw the tree
    // update values:
    updateWind();
    // increment_char();
    fullGrowth(); // temporary so we can see the full tree for rule developement

    resetMatrix();
    translate(width/2, treeLoc*height);
    sproutBranches(1, len, char_n, branchings, 2, woodCol);
    if (drawRoots) hyphae();

    if (!hasSubmitted){
        fill(255, 160);
        noStroke();
        rect(0, 0, width, height);
    }

}


// overall setup function
function growthRing(){
    clearCanvas();

    frameRate(100);
    angle = radians(17);

    resetLSystems();
    setTreeParameters();
    // print(branchings);

    woodCol  = color(105, 100, 60, 100);
    trunkCol = color(115, 100, 60, 220);
    rootCol  = color(115, 100, 80, 120);

    noiseSeed(42);
    randomSeed(42);
}

// the two modes
function toggleWander(){

    hasSubmitted = true;
    wander();

    displayStoredTree(0); // display the first tree

    wanderbutton.remove();
    treebutton.remove();
}
function toggleCreate(){

    creating = true;

    wanderbutton.remove();
    treebutton.remove();
}

//AO bit
// TA: should this run always or just during the "introduction phase"
function introduction(){

    background(255);
    frameRate(20);
    background(60, 255/noise(frameCount%8), 20, 10);

    if(sunlight){
        var dapple = random(noise(frameCount%7))*6;
        background(40, 30*dapple+100+random(15), 30, 6);
        var flicker = floor(random(4));
        if(flicker == 3){
            fill(175, random(200,255), 40, 11);
            noStroke();
            rect(0, 0, width, height);
        }
    }
}

// debugging function. TODO: remember to disable for final
function keyReleased(){

    if (keyCode === UP_ARROW){
        maxDepth += 1;
        resetLSystems();
    }
    else if (keyCode === DOWN_ARROW){
        maxDepth -= 1;
        resetLSystems();
    }
}







function updateWind(){
    windFactor = 1 + sin(d)/90;
    d += noise(d)/8;
}

function increment_char(){
    if (char_n < branchings.length) char_n += 1;
    if (root_n < roots.length)      root_n += 1;
}
function resetCharCount(){
    char_n = 0;
    root_n = 0;
}

function fullGrowth(){
    char_n = branchings.length - 1;
    root_n = roots.length - 1;
}


function clearCanvas(){
    var canvas = createCanvas(500, 500);
}

function CircleMask(factor){

    var rx = width/2 * factor;
    var ry = height/2 * factor;

    beginShape();

    // square that is slightly bigger than screen
    vertex(-10, -10);
    vertex(width + 10, -10);
    vertex(width + 10, height + 10);
    vertex(-10, height + 10);

    // circular contour
    beginContour();
    for (var theta = TWO_PI; theta > 0; theta -= TWO_PI/60){
        vertex(rx*cos(theta) + width/2,
               ry*sin(theta) + height/2);
    }
    endContour();

    endShape(CLOSE);
}

function resetLSystems(){
    // creates the lsystem strings for the global `branchings` and `roots`
    branchings = axiom;
    for (var i = 0; i < maxDepth; i++){
        branchings = generate(branchings);
    }

    roots = axiom;
    for (var i = 0; i < maxDepth -1; i++){
        roots = generate(roots);
    }

    resetCharCount();
}


function generate(sentence){

    var current, found;

    var nextSentence = "";
    for(var i = 0; i < sentence.length; i++){
        current = sentence.charAt(i);
        found = false;
        for(j = 0; j < rules.length; j++){
            if(current == rules[j].a){
                nextSentence += rules[j].b;
                found = true;
                break;
            }
        }
        if(!found)
            nextSentence += current;
    }

    return nextSentence
}


// convenience application of the `rhizome` function
function sproutRoots(){
    rhizome(-1, len, root_n, roots,      rootDepthFactor,   rootCol);
}
function sproutBranches(){
    rhizome( 1, len, char_n, branchings, branchDepthFactor, woodCol);
}

function rhizome(gravity,       // grows up (1) or down (-1)
                 branchLength,  // length of a standard branch
                 charCount,     // how many characters deep to draw the tree
                 lsystem,       // the string to draw
                 depthFactor,   // the divisor determining relative branch thicknesses
                 mainCol){      // color of the non-trunk portion

    branchWidth = baseBranchWidth;

    var local_len = branchLength;
    var current;
    var trunk;

    push();
    for(let i = 0; i < charCount; i++){
        current = lsystem.charAt(i);

        trunk = (i < 2);
        if (trunk)  stroke(trunkCol);
        else        stroke(mainCol);
        local_len = trunk ?
                        branchLength :
                        branchLength * (1 + 4*noise(3*i)/trunkBranchRatio);

        growthRules(current,
                    local_len,
                    depthFactor,
                    gravity);
    }

    pop();
}

function hyphae(){ // draws the roots portion by reversing the growth direction and altering the angle (occurs twice for symmetry).

    resetMatrix();
    translate(width/2, treeLoc*height);

    angle = -2*angle;
    sproutRoots();

    resetMatrix();
    translate(width/2, treeLoc*height);
    angle = -angle;
    sproutRoots();
    angle /= 2;

    resetMatrix();
}

function growthRules(letter, branchLength, depthFactor, gravity){

    var local_wind = (gravity > 0) ? windFactor : 1; // roots don't sway


    strokeWeight(branchWidth);

    if (letter == "F")
    {
        line(0,0,0,-branchLength*gravity);
        translate(0,-branchLength*gravity);
    }
    else if (letter == "+") rotate(angle * local_wind);
    else if (letter == "-") rotate(-angle * local_wind);
    else if (letter == "G") rotate(-angle + Math.sign(angle)*(local_wind/GminusRatio));
    else if (letter == "["){
        push();
        branchWidth /= depthFactor;
    }
    else if (letter == "]"){
        pop();
        branchWidth *= depthFactor;
    }
}


// for debugging
function toggleRoots(){ drawRoots = !drawRoots; }


//AO sketch


function mousePressed(){

    if (!hasSubmitted && creating){
        clicks += 1;
    //    print('click '+ clicks);

        for(var i = 0; i < instructions.length; i++){

            if(clicks == i){
                intro.remove();
                intro = createP(instructions[i]).id('body')
            }
            else if(clicks == instructions.length){
                sunlight = true;
            }
        }

        if(clicks == instructions.length+1){
            gatherInput();
            createElement('br')
            button = createButton('submit');
            button.mousePressed(saveText);
        }
    }
}



function loadFirebase() {
    var ref = database.ref("patterns");
    //ping when there is new data.
    ref.on("value", gotData, errData);
}

// The data comes back as an object
var keys, lSystem;
function gotData(data) {

    lSystem = data.val();
    keys = Object.keys(lSystem);

    console.log(lSystem);
    console.log(keys);
    console.log(data);
}

////////////////////
//helpers

// error hanlding

function finished(err) { // used in wander.js
    if (err) {
        console.log("ooops, something went wrong.");
        console.log(err);
    } else {
        console.log('tree is in the preserve.');
    }
}

function errData(error) {
    console.log("Something went wrong.");
    console.log(error);
}


