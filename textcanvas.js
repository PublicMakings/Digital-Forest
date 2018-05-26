
// TEXT INPUT

var textField;
var submit;
var txt;

var hasSubmitted = false;

    // should be shorter probably
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

    // componenets:
    //   semantic rules
    //   Math option creating key value pairs with numbers and then proposing a math operand...
    //   character conversion
    //   word count based rules

    newRule = wordCountRules(newRule, words);
    newRule = semanticRules(newRule, words);
    newRule = charCountRules(newRule, words);
    newRule = charValuesRules(newRule, words);

    newRule = closeOpenBrackets(newRule);
    // protection and sanitization goes here:

    //



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

function charCountRules(string, words){
    var word;
    var which;
    for (var n = 0; n < words.length; n++){

        word = words[n];
        which = word.length % 6

        if      (which == 0) string += "F"
        else if (which == 1) string += "G"
        else if (which == 2) string += "+"
        else if (which == 3) string += "-"
        else if (which == 4) string += "["
        else if (which == 5) string += "]"
    }

    return string;
}

function charValuesRules(string, words){
    var which, letter;
    var ASCIIchar;
    for (var n = 0; n < words.length; n++){
        for (var m = 0; m < words[n].length; m++){
            letter = words[n].charAt(m).charCodeAt();

            which = letter % 6;

            if      (which == 0) string += "F"
            else if (which == 1) string += "G"
            else if (which == 2) string += "+"
            else if (which == 3) string += "-"
            else if (which == 4) string += "["
            else if (which == 5) string += "]"
        }
    }

    return string;
}

function countOpenBrackets(string){

    var left = 0, right = 0;
    var letter;

    for (var n = 0; n < string.length; n++){
        letter = string.charAt(n);

        if (letter == "[") left += 1;
        if (letter == "]") right += 1;
    }

    return (left - right);
}

function closeOpenBrackets(string){

    var openBrackets = countOpenBrackets(string);

    if (openBrackets > 0){
        return string + Array(openBrackets + 1).join("]");
    }
    else if (openBrackets < 0){
        return Array(-openBrackets + 1).join("[") + string;
    }

    return string;
}


function stringAnalysis(string){

    var consecutives = {"F": [], "+": [], "-": []}
    var count        = {"F": 0, "+": 0, "-": 0}
    var temp         = {"F": [0], "+": [0], "-": [0]}

    var letter;
    for (var n = 0; n < string.length; n++){

        letter = string.charAt(n);

        if (letter == "["){ // remember how many consecutives there were at this point.

            for (var key in consecutives)
                temp[key].push(count[key])
        }
        else if (letter == "]"){ // store how many consucutives there have been and return to the previous layer's amount.

            for (var key in consecutives){
                consecutives[key].push(count[key]);
                count[key] = temp[key].pop();
            }
        }
        // increment the count
        else if (letter == "F") count["F"] += 1;
        else if (letter == "+") count["+"] += 1;
        else if (letter == "-") count["-"] += 1;
        else if (letter == "G") count["-"] += 1/GminusRatio;

    }

    return consecutives;
}