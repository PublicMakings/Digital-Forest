
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



// CLEANUP FUNCTIONS:

// order of operations:
// close brackets |> remove excess rotations <|commutative|> remove repeat rotations |> remove empty brackets

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

function removeRepeatRotation(string){ // function to convert things like `+-+-+-+F` into `+F`

    var plus = [];
    var minus = [];


    var letter;
    for (let n = string.length - 1; n >= 0; n--){  // traverse the string backwards
        letter = string.charAt(n);

        if      (letter == "+") plus.push(n);  // remember the position
        else if (letter == "-") minus.push(n); // remember the position

        if (!isAngleCharacter(letter) || n == 0){    // brackets or Fs reset the count

            if (plus.length > 0 && minus.length > 0){
                            print(plus, minus)
                // the lower of the two lengths is the number of rotations that cancel out
                // e.g. plus.length = 3 and minus.length = 2 --> only 2 cancel out
                var cancels = min(plus.length, minus.length)

                // combine the coordinates of however many (e.g. cancels = 2) pluses and minuses
                var indices = concat(plus.slice(0, cancels), minus.slice(0, cancels));
                indices.sort();
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


function stringAnalysis(string){

    // consectives here refers to how many of these characters are encounted up to that point in the string.
    // only close brackets reverse the count

    var consecutives = {"F": [],    "+": [],    "-": []}
    var count        = {"F": 0,     "+": 0,     "-": 0}
    var temp         = {"F": [0],   "+": [0],   "-": [0]}

    var letter;
    for (let n = 0; n < string.length; n++){

        letter = string.charAt(n);

        // remember how many consecutives there were at this point.
        if (letter == "["){

            for (var key in consecutives){
                temp[key].push(count[key])              // store the current count in the stack
            }
        }
        // store how many consecutives there have been and return to the previous layer's amount.
        else if (letter == "]"){

            for (var key in consecutives){
                consecutives[key].push(count[key]);     // store the final count up to this point
                count[key] = temp[key].pop();           // return the count to it's previous amount
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

// NOTE: 0-based indexing. E,g, `deleteChar("this", 1) --> "tis"`
function deleteChar(string, n){
    return string.slice(0, n) + string.slice(n + 1);
}