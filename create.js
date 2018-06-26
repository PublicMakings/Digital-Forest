
// TEXT INPUT

var textField;
var submit, wanderbutton, treebutton;
var back, next;
var txt, bintext;
var caption

var delimiters = [" ", ",", "\n", ".", "\t", ":", ";", "?", "!", "'"];


function incrementCreating(){
    // increment instruction text
    if (clicks < instructions.length){
        intro.remove();
        intro = createP(instructions[clicks]).id('body');
    }

    // Place questions/response boxes
    // place submit button
    // remove next/back buttons
    if(clicks == instructions.length){

        clicks += 1; // increment so that clicks exceeds instructions.length

        intro.remove();
        promptQuestions();
        createElement('br') //newline
        button = createButton('submit');
        button.mousePressed(saveText);
        back.remove();
        next.remove();
    }
}


function promptQuestions(){

    for(var i = 0; i < questions.length;i++){
        titles[i] = createP(questions[i][0]).id('instructions');
        seedTxt[i] = createElement('textarea', questions[i][1]).id('corpora')
                                                               .mousePressed( cleartxt(seedTxt[i]) );
    }
}

// function that returns a function that clears the text
cleartxt = (box) =>  () => box.value('');


function toggleCreate(){

    if (wandering) disableWandering();
    if (creating) {
        clicks = 0;
        return;
    }

    creating = true;
    clicks = 0

    back = createP('back').id('choices')
                          .style('display','inline-flex')
                          .style('margin','0');


    next = createP('next').id('choices')
                          .style('display','inline-flex')
                          .style('margin','0');

    back.mousePressed( function(){ clicks -= 1; incrementCreating(); });
    next.mousePressed( function(){ clicks += 1; incrementCreating(); });

    wanderbutton.parent('navigation');
    treebutton.parent('navigation');
}

function disableCreating(){

    // If it's off, do nothing
    if (!creating)
        return;


    intro.remove();
    next.remove();
    back.remove();
    if (button != undefined) button.remove();

    for(let i = 0; i < seedTxt.length; i++){
        titles[i].remove();
        seedTxt[i].remove();
    }

    creating = false;
}


function saveText(){

    // if the textbox is empty or if it is the same as the prompt
    // question (i.e. hasn't been addressed at all), return
    for(var i = 0; i < seedTxt.length; i++){

        sdtxt = seedTxt[i].value();

        if (sdtxt.length == 0 ||
            sdtxt == questions[i][1] ||
            sdtxt == 'please type something before submitting')
        {
            seedTxt[i].value('please type something before submitting');

            return; // do nothing else
        }
    }


    var response = '';
    for(var i = 0; i < seedTxt.length; i++){
        response = response.concat(seedTxt[i].value(), ' ');
        print(response);
        seedTxt[i].remove();
    }


    txt     = response;
    bintext = textToBin(response); //translate to binary

    // set the rule
    var words = splitTokens(response, delimiters);
    setRule(0, textToRule(words))

    // send the tree to the database
    sendData(response);

    lookingAt = keys.length -1
    toggleWander();           // this disables creating mode

}


textToBin = function(text) {
    var length = text.length,
        output = [];
    for (let i = 0; i < length; i++) {
        var bin = text[i].charCodeAt().toString(2);
        var leftPadding = 8-bin.length+1
        output.push(Array(leftPadding).join("0") + bin);
    }
    return output.join(" ");
}