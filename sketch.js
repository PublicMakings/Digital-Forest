//Global variables
var intro;
var instructions = ['Welcome.','This Arboretum is a reflection about how we, as humans, tell stories about our relationship to  trees. how we think of them and how they think of us.\n The series of questions asked are intended to evoke memories of encountering trees. This site gathers these narratives into a digital repository propogated with a series of digital trees and text.','From the text you submit a seed of a digital tree is formulated. The seed grows through a process of chance operations and a Lindenmayer system, a type of formal grammar which acts a mechanism for translating lists of characters into geometric structures.\n L-systems were developed by Aristid Lindenmayer, a theoretical biologist and botanist. Lindenmayer used L-systems to describe the behaviour of plant cells and to model the growth processes of plant development.', 'Think about times you have been in forests.'];
// Get input from user
var seedTxt = [];
var seed = '';
var button;

// Keep list of DOM elements for clearing later when reloading
var listItems = [];
var database;
var clicks = 0;

var sunlight = false;


function setup() {
createCanvas(windowWidth, windowHeight);

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
  // Start loading the data
  loadFirebase();
    
// set up DOM
    intro = createP('Welcome.').id('body');

}

function draw(){
    background(255);
    frameRate(1);
    background(60,255/noise(frameCount%8),20,10);
    if(sunlight){
      var dapple = random(noise(frameCount%7))*6;
      background(40,30*dapple+100+random(15),30,6);
      var flicker = floor(random(4));
      if(flicker == 3){
      fill(175,random(200,255),40,11);
      noStroke();
      rect(0,0,width,height);
      }
    }
}
 
function mousePressed(){
   //could eventually do this with a loop and an array of element types and content
    clicks += 1;
    print('click '+ clicks);
    
    for(var i=0;i<instructions.length;i++){
      if(clicks == i){
        intro.remove();
        intro = createP(instructions[i]).id('body')
      }else if(clicks == instructions.length){
        sunlight = true;
      }
    }
        
    if(clicks == instructions.length+1){
        gatherInput();
        createElement('br')
        button = createButton('submit');
        button.mousePressed(saveText);
    }
   
}

function gatherInput(){
      var questions = [['Think of a specific memory in a forest. <br> What do you remember about the trees?<br>Write about that memory.',"What was the weather?\nWhat color was the light?\nWho was there?\nWhat did you smell?\nWhat were you doing?"],['c','d']];
      intro.remove();
      for(var i = 0; i<questions.length;i++){
      intro = createP(questions[i][0]).id('instructions');
      seedTxt[i] = createElement('textarea',questions[i][1], ).id('corpora');
      seedTxt[i].mouseOver(cleartxt);
      }
}
function cleartxt(){
    for(var i = 0; i<seedTxt.length; i++){
    seedTxt[i].html('');
    }
}

function saveText(){

    for(var i = 0; i<seedTxt.length; i++){
      seed = seed.concat(seedTxt[i].value(),' ');
      print(seed);
      seedTxt[i].remove();
    }
      intro.remove();
      removeElements();
      patterning();
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
        tree: seed, 
        human: 'pip', 
        seed:random(60),
        fork1:random(8,17),
//        fork2:random(pattern.fork1-1,patern.fork1+3,),
        length:random(height/random(8,14))
    }
    
    var tree = trees.push(pattern, finished);
    console.log("imagined tree" + tree.key);
    

////////////////////
//helpers

// error hanlding
 
function finished(err) {
    if (err) {
      console.log("ooops, something went wrong.");
      console.log(err);
    } else {
      console.log('tree is in the preserve.');
    }
  }
}
       
function errData(error) {
  console.log("Something went wrong.");
  console.log(error);
}
