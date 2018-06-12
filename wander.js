var treeStories = [];
var humanStories = [];
var arboretum = [];
var randSeeds = [];

function wander(){

    //make a bunch of clicables for the trees stored in the databse
    createElement('br');
    createP('').id('nursery').parent('footer');
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
}

function specimens(evt){
    //this gets the number of the div and that can index humanstories and treestories
    const num = +evt.target.textContent;
    print(treeStories[num]);

    retrieveStoredTree(num);
}


var labeled = false;    // aren't all trees labeled? TODO: figure out why this is here

function retrieveStoredTree(num){

    branchings = treeStories[num]; // would be better if what we retrieved was the rule, and we recreated the Lsystem
    txt = humanStories[num];
    bintext = textToBin(txt);
    setTreeParameters();

    // it's ok to set these both as the same seed, since they affect vastly different things
    randomSeed(randSeeds[num]);
    noiseSeed(randSeeds[num]);

    if(labeled){caption.remove();}  // aren't all trees captioned?
    caption = createElement('p1',txt).id('caption').parent('captions');
    caption.html(humanStories[num]);
    labeled = true;
}




function promptQuestions(){

    intro.remove();
    for(var i = 0; i < questions.length;i++){
        intro = createP(questions[i][0]).id('instructions');
        seedTxt[i] = createElement('textarea', questions[i][1]).id('corpora');
        seedTxt[i].mousePressed(cleartxt);
    }
}
function cleartxt(){
    for(var i = 0; i < seedTxt.length; i++){
        seedTxt[i].html('');
    }
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

    intro.remove();
    removeElements();
    forestStory(response);  // this creates the tree from the user text reponse
    patterning();

    wander();
}


// sends data to firebase
function patterning() {
    var trees = database.ref('patterns');

    var pattern = {
        // don't change these parameters without letting AO know, the firebase server will need some security rules changed
        tree:   textToRule(response),
        human:  response,
        seed:   random(60),
        fork1:  random(8, 17),
//        fork2:random(pattern.fork1-1,patern.fork1+3,),
        length: random(height/random(8, 14))
    }

    var tree = trees.push(pattern, finished);
    console.log("imagined tree" + tree.key);
}