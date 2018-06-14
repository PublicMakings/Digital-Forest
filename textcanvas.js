
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

    caption = createElement('p1',txt).id('caption').parent('captions');
    labeled = true;

    bintext = textToBin(txt);
    var words = splitTokens(txt, delimiters);

    var newRule = textToRule(words);

    rules[0].b = newRule;

    // resetLSystems();
    // setTreeParameters();

    print(textToBin(txt));
    print("new rule: F -> ", newRule);
    print(branchings);
    print(txt);
}


function textToRule(words){

    var newRule = "";

    newRule += wordCountRules(words);
    newRule += semanticRules(words);
    newRule += charCountRules(words);
    newRule += charValuesRules(words);

    // Do an initial cleanup of the result from above, then start fixing it if it isn't robust enough
    newRule = cleanUp(newRule);

    // Shorten the string if it's too long
    var L = allowedCharLength(words);
    var n = round(random(1, 5));
    while (newRule.length > L){

        [newRule, n] = hoppingTruncate(newRule, n);

        if (n == 0) n = round(random(1, 5));
    }

    // Ensure there are brackets if there aren't already
    newRule = ensureBrackets(newRule);

    // Ensure there are rotation characters present, and if not add them in.
    newRule = ensureRotation(newRule);

    newRule = "F" + cleanUp(newRule);   // Add an F in front since it makes things nicer in most cases.
    newRule = addSpaces(newRule); // this is just so the strings can print in the background

    return newRule;
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


// add spaces around brackets to allow text wrapping for the background
function addSpaces(text){

    var letter, next;
    var string = "";

    for (var n = 0; n < text.length - 1; n++){

        letter = text.charAt(n);
        next = text.charAt(n + 1);

        if  (!isBracket(next)){

            if      (letter == "[") letter = " " + letter;
            else if (letter == "]") letter += " ";
        }

        string += letter;
    }

    string += text[text.length - 1];

    return string;
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
    return len = 0.95 * height/(2*n_Fs);
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



