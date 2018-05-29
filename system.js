//Based on the L-System implementation by Daniel Shiffman

// TREE THINGS

var axiom = "F";
var branchings = axiom;
var roots      = axiom;
var len = 3;
var angle;
var windFactor = 1;
var d = 0;
var char_n = 0;
var root_n = 0;

var maxDepth = 3;

var currentDepth;

var trunkCol, woodCol, rootCol;


var rules = [];
rules[0] = {
  a: "F",
  b: "FF+[+FGF+F]-[GFGF+F][F-GF+F]"
}

var masque
var ring
function setup() {


    clearCanvas();

// circle mask
    masque = createGraphics(width,height);
    ring =  createGraphics(width,height);
   

    
    frameRate(100);
    angle = radians(20);
    len *= 0.45^(maxDepth);

    resetSystems();
    // print(branchings);

    woodCol  = color(105, 100, 60, 100);
    trunkCol = color(115, 100, 60, 220);
    rootCol  = color(115, 100, 80, 120);

    noiseSeed(42);

// TEXT INPUT

    textField = select("#textbox");
    submit = select("#button");

    submit.mousePressed(forestStory);



}

var img

function draw(){
    clearCanvas();
    resetMatrix();


    strokeWeight(2);
    stroke(0, 100);


//JSON
    makeInfo();
    
//binary background    
    
// initial circle
    
    masque.background(50,200,60,1);
    var bkgd = image(masque);
    masque.fill(255,20);
    masque.ellipse(width/2, height/2, width*0.85, height*0.85);
    image(masque,0,0); 
    
// binary font formating
    
    textFont('Georgia',15);
    strokeWeight(.7);
    fill(200, 50);
    textAlign(CENTER,CENTER); //this was weird with size change
    
    if (hasSubmitted){
        
        ring.fill(255,0,0,10);
        ring.ellipse(width/2, height/2, width*0.85, height*0.85)
        image(ring)
//        bkgd.mask(blu);
        
    
        
        text(textToBin(txt), 0,0, width, height);
    
        
//        field = image(ring);
//        masque.rect(0,0,width, height);
//        image(masque, 0,0);
//        ring.;
    }

// TREE?    
    
    windFactor = 1 + sin(d)/20;
    d += noise(d)/8;

    // increment_char();
    char_n = branchings.length - 1;
    root_n = roots.length - 1;

    resetMatrix();
    translate(width/2, height - 100);
    sproutBranches(1, len, char_n, branchings, 2, woodCol);
    // hyphae();
    
}

function keyReleased(){

    print(keyCode);

    if      (keyCode === UP_ARROW)   maxDepth += 1;
    else if (keyCode === DOWN_ARROW) maxDepth -= 1;

    resetSystems();
}









function increment_char(){
    if (char_n < branchings.length) char_n += 1;
    if (root_n < roots.length) root_n += 1;
}
function clearCanvas(){
    var canvas = createCanvas(500, 500);
}


function resetSystems(){
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


function sproutRoots(){    rhizome(-1, len, root_n, roots,      3, rootCol); }
function sproutBranches(){ rhizome( 1, len, char_n, branchings, 2, woodCol); }

function rhizome(gravity, branchLength, charCount, lsystem, depthFactor, mainCol){

    currentDepth = 30;

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

function hyphae(){

    push();

    resetMatrix();
    translate(width/2, height - 180);
    angle = -2*angle;
    sproutRoots();

    resetMatrix();
    translate(width/2, height - 180);
    angle = -angle;
    sproutRoots();

    angle /= 2;


    pop();
}

function growthRules(letter, branchLength, depthFactor, gravity){

    strokeWeight(currentDepth);

    if (letter == "F")
    {
        line(0,0,0,-branchLength*gravity);
        translate(0,-branchLength*gravity);
    }
    else if (letter == "+") rotate(angle * windFactor);
    else if (letter == "-") rotate(-angle * windFactor);
    else if (letter == "G") rotate(-angle + windFactor/10);
    else if (letter == "["){
        push();
        currentDepth /= depthFactor;
    }
    else if (letter == "]"){
        pop();
        currentDepth *= depthFactor;
    }

}
