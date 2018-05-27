//Based on the L-System implementation by Daniel Shiffman

// TREE THINGS

var axiom = "F";
var branchings = axiom; // string for branches
var roots      = axiom; // string for roots
var len = 3;            // standard length of branch
var angle;
var windFactor = 1;
var d = 0;
var char_n = 0;
var root_n = 0;
var GminusRatio = 10;   // ration between 'G' rule and '-' rule.
var maxDepth = 3;
var baseBranchWidth = 30;
var branchWidth;

var branchDepthFactor = 2;
var rootDepthFactor = 3;

var trunkCol, woodCol, rootCol;


var rules = [];
rules[0] = {
  a: "F",
  // b: "FF+[+FGF+F]-[GFGF+F][F-GF+F]"
  b: "FF+[+FGF+F]-"
}


function setup() {


    clearCanvas();

    frameRate(100);
    angle = radians(17);
    len *= 0.45^(maxDepth);

    resetLSystems();
    // print(branchings);

    woodCol  = color(115, 100, 60, 100);
    trunkCol = color(115, 100, 60, 220);
    rootCol  = color(115, 100, 80, 120);

    noiseSeed(42);
    randomSeed(42);

    CircleMask();

// TEXT INPUT

    textField = select("#textbox");
    submit = select("#button");

    submit.mousePressed(forestStory);


}

function draw(){
    clearCanvas();
    resetMatrix();

    // binary background text

    if (hasSubmitted) {
        textAlign(CENTER, CENTER);
        fill(100, 50);
        strokeWeight(0.1);
        text(bintext, 0,0, width, height);
    }


    // mask the text
    fill(255);
    strokeWeight(2);
    stroke(100, 100);
    CircleMask(0.95);


    // update values:
    updateWind();
    // increment_char();
    char_n = branchings.length - 1; // temporary
    root_n = roots.length - 1;      // temporary

    resetMatrix();
    translate(width/2, height - 100);
    sproutBranches(1, len, char_n, branchings, 2, woodCol);
    // hyphae();
}

function keyReleased(){

    print(keyCode);

    if      (keyCode === UP_ARROW)   maxDepth += 1;
    else if (keyCode === DOWN_ARROW) maxDepth -= 1;

    resetLSystems();
}







function updateWind(){
    windFactor = 1 + sin(d)/20;
    d += noise(d)/8;
}

function increment_char(){
    if (char_n < branchings.length) char_n += 1;
    if (root_n < roots.length) root_n += 1;
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
    for (var theta = TWO_PI; theta > 0; theta -= TWO_PI/50){
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


function sproutRoots(){    rhizome(-1, len, root_n, roots,      rootDepthFactor,   rootCol); }
function sproutBranches(){ rhizome( 1, len, char_n, branchings, branchDepthFactor, woodCol); }

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
    // var i = charCount;
    for(var i = 0; i < charCount; i++){
        current = lsystem.charAt(i);

        trunk = (i < 2);
        if (trunk)  stroke(trunkCol);
        else        stroke(mainCol);
        local_len = trunk ? branchLength * 2 : branchLength * (1/4 + noise(3*i));

        growthRules(current,
                    local_len,
                    depthFactor,
                    gravity);
    }
}

function hyphae(){ // draws the roots portion by reversing the growth direction and altering the angle (occurs twice for symmetry).

    resetMatrix();
    translate(width/2, height - 180);
    angle = -2*angle;
    sproutRoots();

    // resetMatrix();
    // translate(width/2, height - 180);
    angle = -angle;
    sproutRoots();

    angle /= 2;

}

function growthRules(letter, branchLength, depthFactor, gravity){

    strokeWeight(branchWidth);

    if (letter == "F")
    {
        line(0,0,0,-branchLength*gravity);
        translate(0,-branchLength*gravity);
    }
    else if (letter == "+") rotate(angle * windFactor);
    else if (letter == "-") rotate(-angle * windFactor);
    else if (letter == "G") rotate(-angle + windFactor/GminusRatio);
    else if (letter == "["){
        push();
        branchWidth /= depthFactor;
    }
    else if (letter == "]"){
        pop();
        branchWidth *= depthFactor;
    }

}

