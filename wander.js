var treeStories = [];
var humanStories = [];
var arboretum = [];
var randSeeds = [];

function wander(){

    if (creating)  disableCreating();
    if (wandering) disableWandering();

    //make a bunch of clicables for the trees stored in the databse

    // createElement('br');
    // createP('').id('nursery').parent('captions');

    for(var i = 0; i<keys.length; i++){

        //get data
        var k = keys[i]
        treeStories[i]  = lSystem[k].tree;
        humanStories[i] = lSystem[k].human;
        randSeeds[i]    = lSystem[k].seed;

        //make some <divs> to call that data

        arboretum[i] = createDiv(i).parent('nursery').id('saplings');

        //this is supposed to call the old tree files
        arboretum[i].mouseClicked(specimens);
    }

    wandering = true;
}

function specimens(evt){
    //this gets the number of the div and that can index humanstories and treestories
    const num = +evt.target.textContent;
    // print(treeStories[num]);

    lookingAt = num;
    retrieveStoredTree(num);
}


var labeled = false;    // aren't all trees labeled? TODO: figure out why this is here

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
    // caption.html(text);
    labeled = true;
}


function disableWandering(){

    for(var i = 0; i<arboretum.length; i++){
        arboretum[i].remove();
    }

    if (labeled) caption.remove();
    wandering = false;
}


function saveText(){

    // if the textbox is empty or if it is the same as the prompt question (i.e. hasn't been addressed at all), do nothing

    for(var i = 0; i < seedTxt.length; i++){

        sdtxt = seedTxt[i].value();

        if (sdtxt.length == 0 ||
            sdtxt == questions[i][1] ||
            sdtxt == 'please type something')
        {
            seedTxt[i].value('please type something');

            return; // do nothing else
        }
    }



    for(var i = 0; i < seedTxt.length; i++){
        response = response.concat(seedTxt[i].value(), ' ');
        print(response);
        seedTxt[i].remove();
    }

    // removeElements();
    forestStory(response);  // this creates the tree from the user text reponse
    sendData(response);     // send the tree to the database

    wander();           // wander() disables creating mode
    retrieveStoredTree(keys.length - 1)
}


// sends data to firebase
function sendData(response) {
    var trees = database.ref('patterns');

    var pattern = patterning(response);

    var tree = trees.push(pattern, finished);
    console.log("imagined tree" + tree.key);
}

function patterning(humantext){

    var pattern = {
        // don't change these parameters without letting AO know, the firebase server will need some security rules changed
        tree:   textToRule(humantext),
        human:  humantext,
        seed:   random(60),
        fork1:  random(8, 17),
//        fork2:random(pattern.fork1-1,patern.fork1+3,),
        length: random(height/random(8, 14))
    }

    return pattern;
}