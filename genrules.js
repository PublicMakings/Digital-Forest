


/////// *THE* function that puts it all together ///////

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
    newRule = limitLength(newRule, L);

    // Ensure there are brackets if there aren't already
    newRule = ensureBrackets(newRule);

    // Ensure there are rotation characters present, and if not add them in.
    newRule = ensureRotation(newRule);

    newRule = "F" + newRule;      // Add an F in front since it makes things nicer in most cases.
    newRule = addSpaces(newRule); // this is just so the strings can print in the background

    return newRule;
}




var languageForest = {
        tree: "[FF]",
        trees: "[F-F+]",
        rhizome: "F[-F]",
        rhizomes: "F[-F]",
        leaf: "G",
        leaves: "F[GF+F]",
        stem:  "[+F-F]",
        trunk: "FF[+F--F]",
        bark:  "F+[GF-F]+F",
        rings: "[+FGF][-FGF]",
        branch:    "F",
        branching: "F",
        branches:  "F"
    };

var lengthBasedRules = {
        0: ["FG",
            "G",
            "F"],

        10: ["[+F",
             "-[F",
             "[G"],

        20: ["F[+F]F[+F]F",
             "F[-F]F[-F]F",
             "F[+F]F[-F]F"],

        30: ["FF-[-F+F+F]+[+F-F-F]",
             "FF+[+F+F-F]+[-F-F-F]",
             "FF-[+F][-F]+[-F+F-F]"]

    };


/////// RULES (additive) ///////

// Uses languageForest
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

// Uses lengthBasedRules
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
    for (var n = 0; n < words.length; n++)
        string += getChar(words[n].length);

    return string;
}

// Currently this goes through each character.
// Instead, considering first summing the characters of a word.
function charValuesRules(words){
    var string = "";
    var ASCIIchar;
    for (var n = 0; n < words.length; n++){
        for (var m = 0; m < words[n].length; m++){
            ASCIIchar = words[n].charAt(m).charCodeAt();

            string += getChar(ASCIIchar);
        }
    }

    return string;
}


/////// RULES (subtractive) ///////

function cleanUp(string){

    // order of operations:
    // close brackets |> remove excess rotations <|> remove repeat rotations |> remove empty brackets

    string = removeUnpairedBrackets(string);
    string = GsToMinus(string);
    string = removeRepeatRotation(string);
    string = removeExcessRotation(string);
    string = removeEmptyBrackets(string);

    return string;
}

// fix bracket hygiene. self explanatory.
function removeUnpairedBrackets(string){

    var letter;
    var left = [], right = [];

    for (let n = string.length - 1; n >= 0; n--){

        letter = string.charAt(n);

        if      (letter == "[") left.push(n);
        else if (letter == "]") right.push(n);

        if (left.length > right.length)
            string = deleteChar(string,  left.pop());

    }

    var dif = right.length - left.length;

    for (var n = 0; n < dif; n++){ // effectively works as an if condition for right > left
        string = deleteChar(string, right.pop());
        right = right.map( i => i-1 );  //once you've deleted, lower all the indices accordingly

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

        if      (letter == "]")                         foundF = false;
        else if (letter == "F")                         foundF = true;
        else if (isAngleCharacter(letter) && !foundF)   string = deleteChar(string, n);

    }
    return string;
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
        else counter = 0;


        if (counter == GminusRatio){ // the problem with this is that GminusRatio is subject to change
            string = string.slice(0, n) + "-" + string.slice(loc+1) // n is smaller than loc because counting backwards
            counter = 0;
        }

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

// returns positive for too many opens and negative for to many closes
countOpenBrackets = function(string){

    var left = 0, right = 0;
    var letter;

    for (let n = 0; n < string.length; n++){
        letter = string.charAt(n);

        if (letter == "[") left += 1;
        if (letter == "]") right += 1;
    }

    return (left - right);
}


/////// FUNCTIONS FOR MORE PLEASANT RULES ///////

function allowedCharLength(words){

    var base = 8 + 40*smoothstep(1, 100, words.length);

    var rando = random(0.8, 1.2);

    return abs(round(base*rando)) + 1; // absolute  value of 80-120% of the baseline value (+1 so that it's never 0)
}


function ensureBrackets(string){

    var count = 0;

    // the evaluating function
    hasBracket = function(s){
        for (let n = 0; n < s.length; n++){
            if (s.charAt(n) == "[")
                return true;
        }
        return false;
    }

    while (!hasBracket(string)){

        // add N (a random number) sets of random brackets
        var N = round(random(1, 4));
        for (var i = 0; i < N; i++){

            var openpos  = floor(random(0, string.length - 2));
            var closepos = ceil(random(openpos, string.length - 1));

            string = addBracketSet(string, openpos, closepos);
        }

        string = cleanUp(string)
    }

    return string; // cleanup in case there are broken bracket sets
}

function ensureRotation(string){

    // the evaluating function
    hasRotation = function(s){
        for (let n = 0; n < s.length; n++){
            if ( isAngleCharacter(s.charAt(n)) )
                return true
        }
        return false;
    }


    while (!hasRotation(string)){

        // add N (a random number) sets of random rotation
        var N = round(random(1, 4));
        for (var i = 0; i < N; i++)
            string = addRandomRotation(string);

        string = cleanUp(string);
    }

    return string;
}

function limitLength(string, L){

    var n = round(random(1, 5));
    while (string.length > L){

        [string, n] = hoppingTruncate(string, n);

        if (n == 0) n = round(random(1, 5));
    }
    return cleanUp(string)
}

function hoppingTruncate(string, interval){

    var loc = interval;

    while (loc < string.length){

        string = deleteChar(string, loc);
        loc += interval;
    }

    return [string, loc % string.length] // return both the new string and a potential next starting spot
}


// With each F, record how many consecutive F's there have been thus far, the overall rotation, and the position in the string
function stringAnalysis(string){

    var consecutives = {"rot": [], "pos": [],   "n": []}
    var count        = {"rot": 0,   "n": 0}
    var temp         = {"rot": [0], "n": [0]}

    var letter;
    for (let i = 0; i < string.length; i++){

        switch(string.charAt(i))
        {
            case "[":

                for (var key in temp)
                    temp[key].push(count[key]);

                break;

            case "]":

                for (var key in temp)
                  count[key] = temp[key].pop();

                break;

            case "F":

                consecutives["pos"].push(i);
                consecutives["rot"].push(count["rot"]);
                consecutives["n"].push(count["n"]);

                count["n"] += 1;

                break;


            case "+":
                count["rot"] += 1;
                break;
            case "-":
                count["rot"] -= 1;
                break;
            case "G":
                count["rot"] -= 1/GminusRatio;
        }
    }

    return consecutives;
}



////// CONVENCIENCE FUNCTIONS //////

getChar = function(num){
    num %= 6; // mod 6

    if      (num == 0) return "F";
    else if (num == 1) return "G";
    else if (num == 2) return "+";
    else if (num == 3) return "-";
    else if (num == 4) return "[";
    else if (num == 5) return "]";
}

// convenience functions.
isAngleCharacter = function(letter){

    if (letter == "+") return true;
    if (letter == "-") return true;
    if (letter == "G") return true;

    return false;
}

isBracket          = (letter) => (letter == "[" || letter == "]") ? true : false;
isDrawingCharacter = (letter) => (letter == "F");

addBracketSet = (s, open, close) => s.slice(0, open) + "[" + s.slice(open, close) + "]" + s.slice(close);

addRandomRotation = function (str){

    var selector = random();

    var rot = "G";
    if      (selector < 0.33) rot = "+";
    else if (selector < 0.66) rot = "-";

    var loc = floor(random(0, str.length - 2)); // rotation can't be the last character;

    return str.slice(0, loc) + rot + str.slice(loc);
}

// NOTE: `deleteChar("this", 1) == "tis"` because 0-based indexing
deleteChar    = (s, n)           => s.slice(0, n) + s.slice(n + 1);

clamp         = (num, min, max)  => (num <= min) ? min : (num >= max) ? max : num;

smoothstep = function(low, high, x) {
  // Scale, and clamp x to 0..1 range
  x = clamp((x - low) / (high - low), 0.0, 1.0);
  // Evaluate polynomial
  return x * x * x * (x * (x * 6 - 15) + 10); // 6x^5 - 15x^4 + 10x^3 quintic spline
}

// add spaces around brackets to allow text wrapping for the background
addSpaces = function(nospace){

    var letter, next;
    var string = "";

    for (var n = 0; n < nospace.length - 1; n++){

        letter = nospace.charAt(n);
        next   = nospace.charAt(n + 1);

        if  (!isBracket(next)){

            if      (letter == "[") letter = " " + letter;
            else if (letter == "]") letter += " ";
        }

        string += letter;
    }

    string += nospace[nospace.length - 1];

    return string;
}
