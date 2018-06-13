
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



function semanticRules(words){

    var string = "";
    var keyword, rule;
    for(var x = 0; x < words.length; x++){

        keyword = words[x];
        rule = languageForest[keyword];

        if (rule != undefined) string += rule;
    }

    return string;
}

function wordCountRules(words){

    var string = "";
    var lengths = Object.keys(lengthBasedRules);
    var potentialRules = Object.values(lengthBasedRules);

    for (var n = 0; n < lengths.length; n++){

        if (words.length > lengths[n]){
            string += random(potentialRules[n])
        }
    }

    return string;
}

function charCountRules(words){
    var string = "";
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

function charValuesRules(words){
    var string = "";
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



function cleanUp(string){

    string = removeUnpairedBrackets(string);
    string = GsToMinus(string);
    string = removeRepeatRotation(string);
    string = removeExcessRotation(string);
    string = removeEmptyBrackets(string);

    return string;
}

// CLEANUP FUNCTIONS:

// order of operations:
// close brackets |> remove excess rotations <|> remove repeat rotations |> remove empty brackets

function countOpenBrackets(string){

    var left = 0, right = 0;
    var letter;

    for (let n = 0; n < string.length; n++){
        letter = string.charAt(n);

        if (letter == "[") left += 1;
        if (letter == "]") right += 1;
    }

    return (left - right);
}

// fix bracket hygiene. self explanatory.
function removeUnpairedBrackets(string){

    var letter;
    var left = [], right = [];

    for (let n = string.length - 1; n >= 0; n--){

        letter = string.charAt(n);

        if      (letter == "[") left.push(n);
        else if (letter == "]") right.push(n);

        if (left.length > right.length){
            string = deleteChar(string,  left.pop());
        }
    }

    var dif = right.length - left.length;

    for (var n = 0; n < dif; n++){ // effectively works as an if condition for right > left
        string = deleteChar(string, right.pop());
        right = right.map( i => i-1 );

    }

    return string;
}

// no longer used (removeUnpairedBrackets is instead)
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

// performs: `[]F -> F` and `[[F]] -> F`, etc.
function removeEmptyBrackets(string){

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
                string = deleteChar(string, closing);
                string = deleteChar(string, n);

                if (closeSide.length > 0) {
                    closeSide = closeSide.map( i => i-2 ); // lower each remaining element's location
                }
            }
        }
        else{
            content[content.length] = true;
        }
    }

    return string;
}

 // converts things like `+-+-+-+F` into `+F`
function removeRepeatRotation(string){

    var plus = [];
    var minus = [];


    var letter;
    for (let n = string.length - 1; n >= 0; n--){  // traverse the string backwards
        letter = string.charAt(n);

        if      (letter == "+") plus.push(n);  // remember the position
        else if (letter == "-") minus.push(n); // remember the position

        if (!isAngleCharacter(letter) || n == 0){    // brackets or Fs reset the count

            if (plus.length > 0 && minus.length > 0){
                // the lower of the two lengths is the number of rotations that cancel out
                // e.g. plus.length = 3 and minus.length = 2 --> only 2 cancel out
                var cancels = min(plus.length, minus.length)

                // combine the coordinates of however many (e.g. cancels = 2) pluses and minuses
                var indices = concat(plus.slice(0, cancels), minus.slice(0, cancels));
                indices.sort( (a,b) => a-b );
                indices.reverse(); // now the indices are arranged largest to smallest (important for deletions to occur correctly).

                for (var i = 0; i < indices.length; i++){
                    string = deleteChar(string, indices[i]);
                }
            }

            // reset counter
            plus = [];
            minus = [];
        }
    }

    return string;
}


// F++- becomes F, since the excess ++- do not affect anything
function removeExcessRotation(string){

    var foundF = false;

    var letter;
    for (let n = string.length - 1; n >= 0; n--){
        letter = string.charAt(n);

        if (letter == "]"){
            foundF = false;
        } else if (letter == "F"){
            foundF = true;
        } else if (letter != "[" && !foundF){
            string = deleteChar(string, n);
        }
    }
    return string;
}


function hoppingTruncate(string, interval){

    var loc = interval;

    while (loc < string.length){

        string = deleteChar(string, loc);
        loc += interval;
    }

    return [string, loc % string.length] // return both the new string and the potential next starting spot
}

function GsToMinus(string){

    var loc = 0;
    var counter = 0;

    var letter;
    for (let n = string.length - 1; n >= 0; n--){ // count backwards
        letter = string.charAt(n);

        if (letter == "G")
        {
            if (counter == 0) loc = n;  // remember the location

            counter += 1;
        }
        else {



            counter = 0
        }

        if (counter == GminusRatio){
            string = string.slice(0, n) + "-" + string.slice(loc+1) // n is smaller than loc because counting backwards
            counter = 0;
        }

    }
    return string;
}

function allowedCharLength(words){

    var base = 8 + 40*smoothstep(1, 100, words.length);

    var rando = random(-0.2*base, 0.2*base);

    return abs(round(base + rando)) + 1; // absolute  value of 80-120% of the baseline value (+1 so that it's never 0)
}

// counts rotations and Fs at each bracket level
function stringAnalysis(string){

    // consectives here refers to how many of these characters are encounted up to that point in the string.
    // only close brackets revert the count

    var consecutives = {"F": [],    "+": [],    "-": []}
    var count        = {"F": 0,     "+": 0,     "-": 0}
    var temp         = {"F": [0],   "+": [0],   "-": [0]}

    var letter;
    for (let n = 0; n < string.length; n++){

        letter = string.charAt(n);

        // remember how many consecutives there were at this point.
        if (letter == "["){

            for (var key in consecutives){
                temp[key].push(count[key]);
            }
        }
        // store how many consecutives there have been and return to the previous layer's amount.
        else if (letter == "]"){

            for (var key in consecutives){
                consecutives[key].push(count[key]);
                count[key] = temp[key].pop();
            }
        }
        // increment the count of whichever one
        else if (letter == "F") count["F"] += 1;
        else if (letter == "+") count["+"] += 1;
        else if (letter == "-") count["-"] += 1;
        else if (letter == "G") count["-"] += 1/GminusRatio;

    }

    return consecutives;
}


// convenience functions. May not be necessary
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

// NOTE: 0-based indexing.
// E,g, `deleteChar("this", 1) == "tis"`
function deleteChar(string, n){
    return string.slice(0, n) + string.slice(n + 1);
}


function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num;
}

function smoothstep(low, high, x) {
  // Scale, and clamp x to 0..1 range
  x = clamp((x - low) / (high - low), 0.0, 1.0);
  // Evaluate polynomial
  return x * x * x * (x * (x * 6 - 15) + 10); // 6x^5 - 15x^4 + 10x^3
}