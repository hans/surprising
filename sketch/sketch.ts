import p5 from 'p5';
import * as _ from 'lodash';

import { Transcript } from './transcript';

const sketch = function(s: any) {
  // GLOBAL VARS & TYPES
  let transcript: Transcript;
  let t = 0;
  let normedSurprisals: number[];

  // P5 WILL AUTOMATICALLY USE GLOBAL MODE IF A DRAW() FUNCTION IS DEFINED
  s.setup = () => {
    console.log("🚀 - Setup initialized - P5 is running");


    const tokens = ['this', 'is', 'a', 'test'];
    const times = [1, 2, 3, 5];
    const surprisals = [0.1, 0.4, 1, 0.3];

    transcript = new Transcript(tokens, times, surprisals);

    const maxSurprisal = _.max(surprisals),
      minSurprisal = _.min(surprisals);
    normedSurprisals = surprisals.map((s) => (s - minSurprisal) / (maxSurprisal - minSurprisal));

    // TODO calculate moving-average surprisal

    // FULLSCREEN CANVAS
    s.createCanvas(s.windowWidth, s.windowHeight);

    // SETUP SOME OPTIONS
    s.rectMode(s.CENTER).noFill().frameRate(30);
  }

  // p5 WILL HANDLE REQUESTING ANIMATION FRAMES FROM THE BROWSER AND WIL RUN DRAW() EACH ANIMATION FROME
  s.draw = () => {
    // CLEAR BACKGROUND
    s.background(0);
    // TRANSLATE TO CENTER OF SCREEN
    s.translate(s.width / 2, s.height / 2);

    const surp = normedSurprisals[t];
    s.background(Math.floor(surp * 255));
    t++;
    console.log(t, surp);

    // const colorsArr = ColorHelper.getColorsArray(numberOfShapes);
    // const baseSpeed = (frameCount / 500) * <number>speed.value();
    // for (var i = 0; i < numberOfShapes; i++) {
    //   const npoints = 3 + i;
    //   const radius = 20 * i;
    //   const angle = TWO_PI / npoints;
    //   const spin = baseSpeed * (numberOfShapes - i);
    //
    //   strokeWeight(3 + i).stroke(colorsArr[i]);
    //
    //   push();
    //   rotate(spin);
    //   // DRAW
    //   beginShape();
    //   for (let a = 0; a < TWO_PI; a += angle) {
    //     let sx = cos(a) * radius;
    //     let sy = sin(a) * radius;
    //     vertex(sx, sy);
    //   }
    //   endShape(CLOSE);
    //   // END:DRAW
    //   pop();
    // }
  }

  // p5 WILL AUTO RUN THIS FUNCTION IF THE BROWSER WINDOW SIZE CHANGES
  s.windowResized = () => {
    s.resizeCanvas(s.windowWidth, s.windowHeight);
  }
}

new p5(sketch);
