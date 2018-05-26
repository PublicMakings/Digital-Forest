
var w = window.innerWidth;
var h = window.innerHeight;
var axiom = "F";
var axiomB = "X";
var len = 135;
var len2 = 305;
var len3 = 4;
var sentence = axiom;
var sentence2 = axiom;
var sentence3 = axiomB;
var angle;

// variables: F+-[]
// axiom: F
// rules: F-> FF+[+F-F-F]-[-F+F+F]

var rules = [];
rules[0] = {
	a: "F",
	b: "FF+[+F-F-F]-[-F+F+F]"
}
var rulesB = [];
rulesB[0] = {
	a: "F",
	b: "FF+[+F]-[-F++]"
}

var rulesC = [];
rulesC[0] = {
	a: "F",
	b: "FF"
}
rulesC[1] = {
	a: "X",
	b: "F-[[X]+X]+F[+FX]-X"
}

function setup() {
  createCanvas(w,h);
	background('#151c19');
	turtle();
	angle = radians(25);
	angle2 = radians(22.5);
	angle3 = radians(45);
	angle4 = radians(15);
	angle5 = radians(24.7);

	for (i = 0; i < 4; i++){
		generate();
	}
	for (p = 0; p < 7; p++){
		generate2();
	}
	for (p = 0; p < 6; p++){
		generate3();
	}
}

function turtle(){
	resetMatrix();
	translate(width/2, height);
	for (var i = 0; i < sentence.length; i++){
		var current = sentence.charAt(i);
		if (current == "F"){
			stroke("#3fb57c");
			line(0, 0, 0, -len);
			translate(0, -len);
		}else if (current == "+"){
			rotate(angle5);
		}else if (current == "-"){
			rotate(-angle);
		}else if (current == "["){
			push();
		}else if (current == "]"){
			pop();
		}
	}
}

function turtle2(){
	resetMatrix();
		translate(width/3, height);
		for (var n = 0; n < sentence2.length; n++){
			var current = sentence2.charAt(n);
			if (current == "F"){
				stroke("#2b8a79");
				line(0, 0, 0, -len2);
				translate(0, -len2);
			}else if (current == "+"){
				rotate(angle4);
			}else if (current == "-"){
				rotate(-angle4);
			}else if (current == "["){
				push();
			}else if (current == "]"){
				pop();
			}
		}
}

function turtle3(){
	resetMatrix();
		translate(width/6, height);
		for (var n = 0; n < sentence3.length; n++){
			var current = sentence3.charAt(n);
			if (current == "F"){
				stroke("#28b232");
				line(0, 0, 0, -len3);
				translate(0, -len3);
			}else if (current == "X"){
				stroke("#024d08");
				line(0, 0, -len3, 0);
				translate(0, -len3);
			}else if (current == "+"){
				rotate(angle2);
			}else if (current == "-"){
				rotate(-angle2);
			}else if (current == "["){
				push();
			}else if (current == "]"){
				pop();
			}
		}
}


function generate(){
	len *= .5;
	var nextSentence = "";
	for (var i = 0; i < sentence.length; i++){
		var current = sentence.charAt(i);
		var found = false;
		for (var j = 0; j < rules.length; j++ ){
			if (current == rules[j].a){
				found = true;
				nextSentence += rules[j].b;
				break;
			}
		}
		if (!found){
			nextSentence += current;
		}
	}
	sentence = nextSentence;
	// createP(sentence);
	turtle();
}

function generate2(){
	len2 *= .5;
	var nextSentence2 = "";
	for (var i = 0; i < sentence2.length; i++){
		var current2 = sentence2.charAt(i);
		var found2 = false;
		for (var j = 0; j < rulesB.length; j++ ){
			if (current2 == rulesB[j].a){
				found2 = true;
				nextSentence2 += rulesB[j].b;
				break;
			}
		}
		if (!found2){
			nextSentence2 += current2;
		}
	}
	sentence2 = nextSentence2;
	turtle2();
}

function generate3(){
	len2 *= .5;
	var nextSentence3 = "";
	for (var i = 0; i < sentence3.length; i++){
		var current3 = sentence3.charAt(i);
		var found3 = false;
		for (var j = 0; j < rulesC.length; j++ ){
			if (current3 == rulesC[j].a){
				found3 = true;
				nextSentence3 += rulesC[j].b;
				break;
			}
		}
		if (!found3){
			nextSentence3 += current3;
		}
	}
	sentence3 = nextSentence3;
	turtle3();
}
