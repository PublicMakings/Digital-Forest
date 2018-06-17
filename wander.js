var treeStories = [];
var humanStories = [];
var arboretum = [];
var randSeeds = [];

var labeled = false;


function wander(){

    //make a bunch of clicables for the trees stored in the databse
    for(var i = 0; i<keys.length; i++){

        //get data
        var k = keys[i]
        treeStories[i]  = lSystem[k].tree;
        humanStories[i] = lSystem[k].human;
        randSeeds[i]    = lSystem[k].seed;

        //make some <divs> to call that data
        arboretum[i] = createDiv(i).parent('captions').id('saplings');

        //this is supposed to call the old tree files
        arboretum[i].mouseClicked(specimens);
    }

    wandering = true;
}

function specimens(evt){
    //this gets the number of the div and that can index humanstories and treestories
    const num = +evt.target.textContent;

    lookingAt = num;
    retrieveStoredTree(num);
}


function retrieveStoredTree(num){

    // it's ok to set these both as the same seed, since they affect vastly different things
    // make sure to set the seeds first!!
    randomSeed(randSeeds[num]);
    noiseSeed(randSeeds[num]);

    txt = humanStories[num];
    rules[0].b = textToRule(txt);
    bintext = textToBin(txt);

    resetLSystems();
    setTreeParameters();

    captionTree(humanStories[num]);
}

function captionTree(text){

    if (labeled) caption.remove();

    caption = createElement('p1', text).id('caption').parent('captions');
    labeled = true;
}

function toggleWander(){

    intro.remove()
    if (creating)  disableCreating();
    if (wandering) disableWandering();

    wander();
    retrieveStoredTree(lookingAt); // display the first tree

    wanderbutton.parent('navigation');
    treebutton.parent('navigation');
}

function disableWandering(){

    // if it's off do nothing
    if (!wandering)
        return;

    for(var i = 0; i<arboretum.length; i++)
        arboretum[i].remove();

    if (labeled)
        caption.remove();

    wandering = false;
}

function enableWander(){
    wanderbutton.mousePressed(toggleWander);
    wanderbutton.style('color', treebutton.style("color"));
}


//= ideally, this function will set all the parameters necessary to draw the tree correctly including:
// - branch length,
// - angle
// - trunk thickness
// - depth-associated branch width factor
// using only the brachings string (or the rule) as a guide.
function setTreeParameters(){

    var analysis = stringAnalysis(branchings);
    var levels = deepestLevel(branchings);

    var baseLength = setLen(max(analysis["n"]));

    // function for finding the index of the absolute max
    IndOfAbsMax = (iMax, x, i, arr) => abs(x) > abs(arr[iMax]) ? i : iMax;

    var i = analysis["rot"].reduce(IndOfAbsMax);

    var maxRot        = abs(analysis["rot"][i]),
        depthOfMaxRot = analysis["n"][i]

    branchDepthFactor = setBranchDepthFactor(levels);
    len = random(0.8*baseLength, 1.2*baseLength);
    angle = setAngle(maxRot * pow(0.995,depthOfMaxRot));
}


setLen   = (n_Fs) => 0.95 * height/(2*n_Fs); // redo this to include rotation also (i.e. effective length).
setAngle = (rot)  => radians(60 / rot); // max rotation is not enough. Must be weighted by distance
setBranchDepthFactor = function(levels){
    // weird numbers here are all magic constants. They "just work" in nearly every case
    if      (levels < 3)  return height / 143;
    else if (levels < 10) return map(levels, 3, 10, height/166.66, height/357);
    else if (levels < 30) return map(levels, 10, 30, height/357, height/454.5);
    else                  return height/476.2;
}

// deepest set of nested brackets
deepestLevel = function(string){

    var maxLevel = 0, level = 0, letter;

    for (var n = 0; n < string.length; n++){
        letter = string.charAt(n);

        if      (letter == "[") level += 1;
        else if (letter == "]") level -= 1;

        if (level > maxLevel) maxLevel = level;

    }
    return maxLevel;
}



