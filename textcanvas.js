
// TEXT INPUT

var textField;
var submit;
var txt, bintext;

var hasSubmitted = false;


var delimiters = [" ", ",", "\n", ".", "\t", ":", ";", "?", "!", "'"];


function forestStory(){

    hasSubmitted = true;

    var newRule = "";

    txt = textField.value();
    bintext = textToBin(txt);
    var words = splitTokens(txt, delimiters);

    // componenets:
    // - semantic rules
    // - Math option creating key value pairs with numbers and then proposing a math operand...
    // - character conversion
    // - word count based rules

    newRule = wordCountRules(newRule, words);
    newRule = semanticRules(newRule, words);
    newRule = charCountRules(newRule, words);
    newRule = charValuesRules(newRule, words);

    // protection and sanitization goes here:
    newRule = closeOpenBrackets(newRule);
    //



    rules[0].b = newRule;
    resetLSystems();

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

