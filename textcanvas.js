
// TEXT INPUT

var textField;
var submit;
var txt, bintext;

var hasSubmitted = false;


var delimiters = [" ", ",", "\n", ".", "\t", ":", ";", "?", "!", "'"];

var caption
function forestStory(txt){


    hasSubmitted = true;

    var newRule = "";

//    txt = seed;
  caption = createElement('p1',txt).id('caption').parent('captions');
//
    bintext = textToBin(txt);
    var words = splitTokens(txt, delimiters);

    // componenets:
    // - semantic rules
    // - Math option creating key value pairs with numbers and then proposing a math operand...
    // - character conversion
    // - word count based rules

    // at the moment, each of the items produces what is essentially an independent rule and then we tack all those rules together.
    // instead, consider a system where each of these layers are convolutions to an input rule
    newRule += wordCountRules(words);
    newRule += semanticRules(words);
    newRule += charCountRules(words);
    newRule += charValuesRules(words);

    // protection and sanitization goes here:
    newRule = "F" + cleanUp(newRule);   // Add an F in front since it makes things nicer in most cases.
    //

    // rules[0].b = newRule;
    rules[0].b = newRule;

    resetLSystems();
    setTreeParameters();

    print(textToBin(txt));
//
    print("new rule: F -> ", newRule);
    print(branchings);
    print(txt);
}


function cleanUp(string){

    string = removeUnpairedBrackets(string);
    string = removeRepeatRotation(string);
    string = removeExcessRotation(string);
    string = removeEmptyBrackets(string);

    return string;
}



function textToBin(text) {
  var length = text.length,
      output = [];
  for (var i = 0;i < length; i++) {
    var bin = text[i].charCodeAt().toString(2);
    var leftPadding = 8-bin.length+1
    output.push(Array(leftPadding).join("0") + bin);
  }
  return output.join(" ");
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

    if      (levels < 3)  branchDepthFactor = 3.5;
    else if (levels < 10) branchDepthFactor = map(levels, 3, 10, 3, 1.4);
    else if (levels < 30) branchDepthFactor = map(levels, 10, 30, 1.4, 1.1);
    else                  branchDepthFactor = 1.05;

    var baseLength = setLen(max(analysis["F"]));

    len = random(0.8*baseLength, 1.3*baseLength);
}

// redo this to include rotation also (i.e. effective length).
function setLen(n_Fs){
    return len = 0.9 * height/(2*n_Fs);
}


function deepestLevel(string){

    var maxLevel = 0;

    var level = 0;
    var letter;
    for (var n = 0; n < string.length; n++){
        letter = string.charAt(n);

        if (letter == "[") level += 1;
        if (letter == "]") level -= 1;

        if (level > maxLevel){
            maxLevel = level;
        }
    }
    return maxLevel;
}


if (false){

    div = []
    s = stringAnalysis(branchings)
    for (var i = 0; i < s["+"].length; i++){

        div.push(s["+"][i] - s["-"][i]);
    }

}

