
// TEXT INPUT

var textField;
var submit;
var txt;

var hasSubmitted = false;

var languageForest = {
        tree: "[FF]",
        trees: "[F-F+]",
        rhizome: "+",
        rhizomes: "F[-F]",
        leaf: "G",
        leaves: "F[GF+F]"
    };

var delimiters = [" ", ",", "\n", ".", "\t", ":", ";", "?", "!", "'"];

var lengthBasedRules = {
        0: ["FG",
            "G",
            "F"],

        10: ["[+F",
             "-[F",
             "[G"],

        20: ["FG]",
             "F[GF]",
             "FF]G"]
    };

function forestStory(){

    hasSubmitted = true;

    var newRule = "";

    txt = textField.value();
    var words = splitTokens(txt, delimiters);
    // print(words);


    // SEMANTIC RULES


// Math option creating key value pairs with numbers and then proposing a math operand...


// character conversion

    // WORD COUNT BASED RULES

    newRule = wordCountRules(newRule, words);
    newRule = semanticRules(newRule, words);


// protection and sanization


    rules[0].b = newRule;
    resetSystems();

    print(textToBin(txt));
//
    print("new rule: F -> ", newRule);
    print(branchings);
    print(txt);
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


function semanticRules(string, words){

    var keyword, rule;
    for(var x = 0; x < words.length; x++){

        keyword = words[x];
        rule = languageForest[keyword];

        if (rule != undefined) string += rule;
    }

    return string;
}

function wordCountRules(string, words){
    var lengths = Object.keys(lengthBasedRules);
    var potentialRules = Object.values(lengthBasedRules);

    for (var n = 0; n < lengths.length; n++){

        if (words.length > lengths[n]){
            string += random(potentialRules[n])
        }
    }

    return string;
}

function countOpenBrackets(string){

    var left = 0, right = 0;

    var char;
    for (var n = 0; n < string.length; n++){
        char = string.charAt[n];

        if (char == "[") left += 1;
        if (char == "]") right += 1;

    }

    return (left - right);
}

function closeOpenBrackets(string){

    var n = countOpenBrackets(string);

    var closingBrackets = "]" * n

    return string + closingBrackets;
}


function overallCurve(string){

    var plusses = [0];
    var minuses = [0];

    var layer = 0
    var char;
    for (var n = 0; n < string.length; n++){

        char = string[n];

        if (char == "[") layer += 1;
        if (char == "]") layer -= 1;

        if (layer > plusses.length - 1)
        {
            plusses.push(0);
            minuses.push(0);
        }

        if (char == "+") plusses[layer] += 1;
        if (char == "-") minuses[layer] += 1;
        if (char == "G") minuses[layer] += 0.1;
    }


    return {plusses, minuses}
}