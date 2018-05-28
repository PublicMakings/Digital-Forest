
// TEXT INPUT

var textField;
var submit;
var txt, bintext;

var hasSubmitted = false;


var delimiters = [" ", ",", "\n", ".", "\t", ":", ";", "?", "!", "'"];


function forestStory(){

    hasSubmitted = true;

    var newRule = "F";

    txt = textField.value();
    bintext = textToBin(txt);
    var words = splitTokens(txt, delimiters);

    // componenets:
    // - semantic rules
    // - Math option creating key value pairs with numbers and then proposing a math operand...
    // - character conversion
    // - word count based rules

    newRule += wordCountRules(words);
    newRule += semanticRules(words);
    newRule += charCountRules(words);
    newRule += charValuesRules(words);
    // protection and sanitization goes here:
    // newRule = closeOpenBrackets(newRule);
    // newRule = removeRepeatRotation(newRule);
    // newRule = removeExcessRotation(newRule);
    // newRule = removeEmptyBrackets(newRule);
    //

    newRule = cleanUp(newRule);
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

    string = closeOpenBrackets(string);
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



// brackets must all be closed for this function to work I think
// function removeUselessBrackets(string){

//     var open = 0;

//     var locright = [];
//     var foundF = [];
//     var foundAny = [];
//     var letter;

//     for (var n = string.length - 1; n >= 0; n++){
//         letter = string.charAt(n);

//         if (letter == "]"){
//             open += 1;
//             foundF.push(false);
//             foundAny.push(false);
//             locright.push(n);
//         }
//         else if (letter == "[") {

//             if !(foundF[foundF.length]){

//             }

//             open -= 1;
//             locright.pop();
//             foundF.pop();
//             foundAny.pop();
//         }
//         else{ //not a bracket
//             foundAny.push(true);
//         }

//         if (open > 0){

//         // when you find an F, all previous (i.e. more "external") layers become true as well
//         // consider [+[F]] for reasoning.
//         // `foundAny` is then necessary to correct the [[F]] case
//         if (letter == "F"){
//             for (var i = 0; i < foundF.length; i++){
//                 foundF[i] = true;
//             }
//         }


//             if !(foundF[foundF.length]){
//                 if (isAngleCharacter(letter)){   // if it's not a drawing character or bracket

//                     string = string.slice(n) + string.slice(n + 1); // remove that character (e.g. n = 0 would remove the first)
//                 }
//             }

//         }

//     }

//     return (left - right);
// }




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

