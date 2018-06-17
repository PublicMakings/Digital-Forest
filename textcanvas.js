
// TEXT INPUT

var textField;
var submit, wanderbutton, treebutton;
var back, next;
var txt, bintext;

var hasSubmitted = false;


var delimiters = [" ", ",", "\n", ".", "\t", ":", ";", "?", "!", "'"];

var caption
function forestStory(txt){

    hasSubmitted = true;

    bintext = textToBin(txt);
    var words = splitTokens(txt, delimiters);

    var newRule = textToRule(words);

    rules[0].b = newRule;
}


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

        clicks += 1;

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
        seedTxt[i] = createElement('textarea', questions[i][1]).id('corpora');
        seedTxt[i].mousePressed( cleartxt(seedTxt[i]) );
    }
}

// function that returns a function
cleartxt = (box) =>  () => box.value('');


function toggleCreate(){

    if (wandering) disableWandering();
    if (creating) {
        clicks = 0;
        return;
    }

    hasSubmitted = false;
    creating = true;
    clicks = 0

    back = createP('back').id('choices')
                          .style('display','inline-flex')
                          .style('margin','0');

    next = createP('next').id('choices')
                          .style('display','inline-flex')
                          .style('margin','0');

    back.mousePressed( () => clicks -= 1 );
    next.mousePressed( () => clicks += 1 );

    wanderbutton.parent('navigation');
    treebutton.parent('navigation');
}

function disableCreating(){

    // If it's off do nothing
    if (!creating)
        return;


    intro.remove();
    next.remove();
    back.remove();
    if (button != undefined) button.remove();

    for(var i = 0; i < seedTxt.length; i++){
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

    forestStory(response);  // this creates the tree from the user text reponse
    sendData(response);     // send the tree to the database

    lookingAt = keys.length -1
    togglewander();           // wander() disables creating mode

}


textToBin = function(text) {
  var length = text.length,
      output = [];
  for (var i = 0; i < length; i++) {
    var bin = text[i].charCodeAt().toString(2);
    var leftPadding = 8-bin.length+1
    output.push(Array(leftPadding).join("0") + bin);
  }
  return output.join(" ");
}