// based on code by Daniel Shiffman
// https://github.com/shiffman/A2Z-F16

// Get input from user
var treeTxt;
var humanTxt;

// Keep list of DOM elements for clearing later when reloading
var listItems = [];
var database;

function setup() {    
    
//credentials    
 // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAdEgPM5yVo2CbUc4F7936oM3ZVDjQCbms",
    authDomain: "digital-forester.firebaseapp.com",
    databaseURL: "https://digital-forester.firebaseio.com",
    projectId: "digital-forester",
    storageBucket: "",
    messagingSenderId: "966863363583"
  };
  
    
  firebase.initializeApp(config);
  database = firebase.database();

  // Input fields
  treeTxt = select('#tree');
  humanTxt = select('#human');

  // Submit button
  var submit = select('#submit');
  submit.mousePressed(patterning);

  // Start loading the data
  loadFirebase();
}

function loadFirebase() {
  var ref = database.ref("patterns");
    //ping when there is new data.
  ref.on("value", gotData, errData);
}

// The data comes back as an object
function gotData(data) {
  var lSystem = data.val();
  var keys = Object.keys(lSystem);
  console.log(lSystem);
  
  console.log(keys);
//    pick a random key
  console.log(keys[floor(random(keys.length))]);    
//    how to get that data?
    
    
}

// sends data to firebase
function patterning() {
    var trees = database.ref('patterns');
    
    var pattern = {
        tree: treeTxt.value(), 
        human: humanTxt.value(), 
        seed:random(60),
        fork1:random(8,17),
//        fork2:random(pattern.fork1-1,patern.fork1+3,),
        length:random(height/random(8,14))
    }
    
    var tree = trees.push(pattern, finished);
    console.log("imagined tree" + tree.key);
    
//error handling    
  function finished(err) {
    if (err) {
      console.log("ooops, something went wrong.");
      console.log(err);
    } else {
      console.log('tree is in the preserve.');
    }
  }
}

////////////////////
//helpers

// error hanlding
function errData(error) {
  console.log("Something went wrong.");
  console.log(error);
}
