var treeStories = [];
var humanStories = [];
var arboretum = [];

function wander(){

    //make a bunch of clicables

    createP('').id('nursery').parent('footer');
    for(var i = 0; i<keys.length; i++){

        //get data
        var k = keys[i]
        treeStories[i] = lSystem[k].tree;
        humanStories[i] = lSystem[k].human;

        //make some <divs> to call that data
        arboretum[i] = createDiv(i).parent('nursery').id('saplings');

        //this is supposed to call the old tree files
        arboretum[i].mouseClicked(specimens);
    }
}

function specimens(evt){
    //this gets the number of the div and that can index humanstories and treestories
    const num = +evt.target.textContent;
    print(treeStories[num]);

    displayStoredTree(num);
}

function displayStoredTree(num){

    branchings = treeStories[num];
    txt = humanStories[num];
    bintext = textToBin(txt);
    setTreeParameters();

    caption.html(humanStories[num]);
}