# Digital-Forest
p5.js interactive artwork about narratives of trees.

## ToDos'
### *Coding*
- [X] bring buttons into style of site
- [X] add permenant buttons at button
- [X] add a back and next, which adjusts click count during creating
- [x] make create button funtion during wandering
- [x] add axiom stringto binary background
- [x] translucent mask over introductory tree
- [x] display text at the bottom
- [x] clicking on a mode button (wander or create) while html objects are already onscreen doubles them
- [x] clicking on a number more than once may yield different results (rand num issue?)
- [X] wait for firebase (loop/noLoop for example)
- [ ] fix formatting for wander buttons/captions which overlap with other objects often
- [x] add angle selection to setTreeParameters
- [ ] generalize angle selection so it works in every case (possibly by weighting "rot" by "n" in some fashion)
- [ ] add baseBranchWidth selection to setTreeParameters (proportional to deepestLevel)
- [ ] speed up code: start by storing the rotations for each branch the first time it's drawn in an array for less pushing and popping
- [ ] clean up code (remove debugging) + write comments + polish the code so it's beautiful
- [ ] bundle global variables up into groups and make singleton classes for them
- [ ] create "tree" class
- [ ] write sunlight shader
- [ ] add offline creating mode just in case (right now it must go through wander())


- [ ] sanitize filter
- [x] Binary background
- [ ] eventually create a token for writing to the database?

- [x] figure out firebase better, [security  rules](https://gist.github.com/codediodeio/6dbce1305b9556c2136492522e2100f6)
    * more [firebase security stuff](https://www.linkedin.com/pulse/can-cloud-functions-firebase-secure-way-hide-api-keys-mayur-dube)
    * [firebase api refering websites](https://stackoverflow.com/questions/35418143/how-to-restrict-firebase-data-modification)



### *Writing*
- [x] make interview questions
- [x] Credits for index
- [x] Format for Letterpress
- [x] translate core architecture into opaque poetics
- [x] proofread



# References
* [Wind sway](https://github.com/cleziole/l-system)
* [interactives](https://github.com/nylki/lindenmayer)
* [codepen](https://codepen.io/ada-lovecraft/pen/WxbRGM)
* [three.js coordinate generator](http://yuvadm.github.io/lsys.js/)
* [Rule play](http://www.kevs3d.co.uk/dev/lsystems/)
* [l system renederer](https://github.com/piratefsh/p5js-art)
* [algorithmic botany](http://algorithmicbotany.org/papers/abop/abop-ch1.pdf)
<!--- * [student project](https://people.ece.cornell.edu/land/OldStudentProjects/cs490-94to95/hwchen/)--->
* [Creepy tree](https://picandnic.wordpress.com/2018/01/30/creepy-tree/)
* [gentle sway](https://github.com/AdaZhao1211/noc/tree/master/binaryTree)

* [CSS tips](https://css-tricks.com/clipping-masking-css/)
* [Alpha mask](https://forum.processing.org/two/discussion/23886/masking-a-shape-with-another-shape)
