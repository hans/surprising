import p5 from "p5";
import * as _ from "lodash";
import { csvParse } from "d3-dsv";

import { Transcript } from "./transcript";

const frameRate = 24;
let dataCursor = 0;

const sketch = function (s: any) {
  // GLOBAL VARS & TYPES
  let transcript: Transcript;
  let t = 0;

  let audio: Promise<any>;
  let normedSurprisals: number[];
  let times: number[];
  let minTime: number;

  s.preload = async () => {
    const data = await fetch("/data/resampled.csv")
      .then((resp) => resp.text())
      .then((csv) => csvParse(csv));

    // const tokens = data.map((r) => r.token);

    // parse times; zero out minimum
    times = data.map((r) => parseFloat(r.start));
    // minTime = _.min(times);
    // times = times.map((t) => t - minTime);

    const surprisals = data.map((r) => parseFloat(r.surprisal));

    // transcript = new Transcript(tokens, times, surprisals);

    const maxSurprisal = _.max(surprisals),
      minSurprisal = _.min(surprisals);
    normedSurprisals = surprisals.map(
      (s) => (s - minSurprisal) / (maxSurprisal - minSurprisal)
    );

    ///////

    // Load recording
    s.soundFormats('mp3');
    audio = new Promise((resolve, reject) => {
      s.loadSound('/data/audio.mp3', (f: any) => {
        resolve(f);
      }, (err: any) => reject(err), console.log)
    });
  }

  // P5 WILL AUTOMATICALLY USE GLOBAL MODE IF A DRAW() FUNCTION IS DEFINED
  s.setup = async () => {
    console.log("🚀 - Setup initialized - P5 is running");

    // FULLSCREEN CANVAS
    s.createCanvas(s.windowWidth, s.windowHeight);

    // SETUP SOME OPTIONS
    s.rectMode(s.CENTER).noFill().frameRate(30);

    s.frameRate(frameRate);
  };

  // p5 WILL HANDLE REQUESTING ANIMATION FRAMES FROM THE BROWSER AND WIL RUN DRAW() EACH ANIMATION FROME
  s.draw = () => {
    // Not ready.
    if (!normedSurprisals) return;
    if (t == 0)
      audio.then((a) => a.play());

    // CLEAR BACKGROUND
    s.background(0);
    // TRANSLATE TO CENTER OF SCREEN
    s.translate(s.width / 2, s.height / 2);

    // Update data cursor
    t++;
    let realTime = t / frameRate;
    while (realTime >= times[dataCursor + 1]) {
      dataCursor++;
      realTime = t / frameRate;
    }

    // Compute linear interpolation between data points
    const s1 = normedSurprisals[dataCursor],
      s2 = normedSurprisals[dataCursor + 1];
    const t1 = times[dataCursor],
      t2 = times[dataCursor + 1]
    const surp = s1 + ((realTime - t1) / (t2 - t1) * (s2 - s1));

    s.background(Math.floor(surp * 255));

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
  };

  // p5 WILL AUTO RUN THIS FUNCTION IF THE BROWSER WINDOW SIZE CHANGES
  s.windowResized = () => {
    s.resizeCanvas(s.windowWidth, s.windowHeight);
  };
};

new p5(sketch);
