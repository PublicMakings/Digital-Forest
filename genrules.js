
var languageForest = {
        tree: "[FF]",
        trees: "[F-F+]",
        rhizome: "+",
        rhizomes: "F[-F]",
        leaf: "G",
        leaves: "F[GF+F]"
    };

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



// CLEANUP FUNCTIONS:

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



function removeEmptyBrackets(string){ // performs: `[]F -> F` and `[[F]] -> F`

    var closeSide = [];
    var content = []

    var letter;
    for (var n = string.length - 1; n >= 0; n--){
        letter = string.charAt(n);

        if (letter == "]"){
            closeSide.push(n);
            content.push(false);
        }
        else if (letter == "["){
            if (content.pop() == false){

                var closing = closeSide.pop();
                string = string.slice(0, closing) + string.slice(closing + 1);
                string = string.slice(0,n) + string.slice(n+1)
            }
        }
        else{
            content[content.length] = true;
        }
    }

    return string;
}


function removeRepeatRotation(string){ // function to convert things like `+-+-+-+F` into `+F`

    var plus = [];
    var minus = [];


    var letter;
    for (var n = string.length - 1; n >= 0; n--){
        letter = string.charAt(n);

        if      (letter == "+") plus.push(n);
        else if (letter == "-") minus.push(n);
        else if (letter != "G"){

            if (plus.length > 0 && minus.length > 0){


                var cancels = min(plus.length, minus.length)

                var indices = concat(plus.slice(0, cancels), minus.slice(0, cancels));
                indices.sort();
                indices.reverse(); // now it's largest to smallest

                for (var i = 0; i < indices.length; i++){
                    string = string.slice(0, indices[i]) + string.slice(indices[i] + 1)
                }
            }

            plus = [];
            minus = [];

        }
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
        else if (letter == "]"){ // store how many consecutives there have been and return to the previous layer's amount.

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

function isAngleCharacter(letter){

    if (letter == "+") return true;
    if (letter == "-") return true;
    if (letter == "G") return true;

    return false;
}

function isDrawingCharacter(letter){
    return (letter == "F");
}
function isBracket(letter){

    if (letter == "[") return true;
    if (letter == "]") return true;

    return false;
}