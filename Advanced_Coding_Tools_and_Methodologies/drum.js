var k = localStorage.getItem("k");
var m = localStorage.getItem("m");
var p = localStorage.getItem("p");
var t = localStorage.getItem("t");

var guideflag2 = localStorage.getItem("guideflag2");

console.log(guideflag2);

addEventListener("dblclick", () => {easycam.setState(tri)});

ondblclick = () => {};

// DICHIARO LE VARIABILI FUORI DALLA FUNZIONI
// PERCHE' ABBIANO VISIBILITA' ANCHE NELLE ALTRE FUNZIONI
let imgEarth;
let imgSun;
let imgMoon;
var imgSky;
let imgPlanets = [];
let sunDim = 50;
//let planetOrbWidth = [170, 300, 500, 800, 1050, 1300, 1600, 1900];
let planetOrbHeight = [
  sunDim + 14,
  12.5 + sunDim + 27,
  37.5 + sunDim + 37.25,
  45 + sunDim + 56.75,
  sunDim + 147,
  sunDim + 216.625,
  sunDim + 291.5,
  sunDim + 341.5,
];
let planetOrbWidth = planetOrbHeight.map((x) => x * 1.5);
let planetTilt = [0, 0, -25, 0, 0, 0, 0, 0];
let planetRotation = [0.005, 0.01, 0.015, 0.02, 0.025, 0.03, 0.035, 0.04];
let planetDiameter = [6, 12.5, 15.75, 8.25, 35, 29, 12.5, 12];
let bool = false;
let easycam;

//SOUND VARIABLES
let reverb, pingpong;
let playIsOff = true;
let bpm = 20;
//1= MEASURE, 4=BEAT
//---------arp1,arp2,lead,chord4,chord3,chord2,chord1,bass--------------------------------------
let planetRatios = [8, 16, 2, 4, 4, 4, 4, 1];

let chromas = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];
let chromas2 = [
  "C",
  "Db",
  "D",
  "Eb",
  "E",
  "F",
  "Gb",
  "G",
  "Ab",
  "A",
  "Bb",
  "B",
];

let myScale = [];
let majProf = [0, 2, 4, 5, 7, 9, 11];
let minProf = [0, 2, 3, 5, 7, 8, 10];
let maj = Boolean(parseInt(m));
console.log(maj);
let profile = [];
let key = parseInt(k);

for (i = 0; i < 7; i++) {
  if (maj) {
    profile = majProf;
  } else {
    profile = minProf;
  }
  myScale[i] = chromas[key + profile[i]];
}

console.log(myScale);

let tetrad = [1, 3, 5, 7];

let progression1 = [1, 5, 6, 4];
let progression2 = [1, 4, 2, 5];
let progression3 = [1, 4, 6, 5];
let progression4 = [1, 6, 4];
let progression5 = [1, 5];

let progressionNames = [
  "I - V - VI - IV",
  "I - IV - II - V",
  "I - IV - VI - V",
  "I - VI - IV",
  "I - V",
];

//IMAGE PROCESSING
let mean;
let maximum;
let selectedMode = myScale; //-------------------------------------------------------------------------------------------------------------------

switch (parseInt(p)) {
  case 1:
    selectedProgression = progression1;
    break;
  case 2:
    selectedProgression = progression2;
    break;
  case 3:
    selectedProgression = progression3;
    break;
  case 4:
    selectedProgression = progression4;
    break;
  case 5:
    selectedProgression = progression5;
    break;
}

//BASS
let bassEnvelope, bassFilter, bassSynth1, bassSynth2, bassLoop;
let bassNotes = [];
for (i = 0; i < selectedProgression.length; i++) {
  bassNotes[i] = selectedMode[selectedProgression[i] - 1];
}

//CHORD
let chordSynths = [];
let chordFilters = [];
let chordEnvelopes = [];
let chordLoops = [];
let chordNotes = [];
for (i = 0; i < 4; i++) {
  chordNotes[i] = [];
  for (j = 0; j < selectedProgression.length; j++) {
    if (selectedProgression[j] - 1 + (tetrad[i] - 1) < selectedMode.length) {
      chordNotes[i][j] =
        selectedMode[selectedProgression[j] - 1 + (tetrad[i] - 1)];
    } else {
      chordNotes[i][j] =
        selectedMode[selectedProgression[j] - 1 + (tetrad[i] - 1) - 7];
    }
  }
}
//LEAD
let leadEnvelope, leadFilter, leadSynth, leadLoop;
let leadNotes = [];
for (i = 0; i < selectedProgression.length; i++) {
  leadNotes[i] = selectedMode[selectedProgression[i] - 1];
}
//ARP1
let arp1Envelope, arp1Filter, arp1Synth, arp1Loop;
//ARP2
let arp2Envelope, arp2Filter, arp2Synth, arp2Loop;

//Planets menus
let tempVol = [];
let muted = false;
let tendina = [];
let slidVol = [];
let volumes = [-16, -23, -23, -23, -23, -19, -26, -50];
let lista = ["1", "2", "3", "4", "5", "8", "16", "24", "32"];
let refreshed = false;
let idVol = [
  "instr1",
  "instr2",
  "instr3",
  "instr4",
  "instr5",
  "instr6",
  "instr7",
  "instr8",
];
let idTend = ["pl1", "pl2", "pl3", "pl4", "pl5", "pl6", "pl7", "pl8"];

/* //SOUNDLINE WOBBLING
let lineWobble = 0;
let wobbleArray = []; */

function preload() {
  imgEarth = loadImage("Images/plani.jpg");
  imgSun = loadImage("Images/sun.jpg");
  imgMoon = loadImage("Images/moon.jpg");

  environmentSelectedImg = loadImage(localStorage.getItem("environment"));

  for (i = 0; i < 8; i++) {
    imgPlanets[i] = loadImage("Images/" + (i + 1).toString(10) + ".jpg");
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  easycam.setViewport([0, 0, windowWidth, windowHeight]); // adattamento viewport nel caso
  // di resizing per la easycam
  for (i = 0; i < 8; i++) {
    tendina[i].position(windowWidth/50 , windowHeight/8 +  i * windowHeight/10);
    slidVol[i].position(windowWidth/20, (windowHeight/8 + 7 * windowHeight/10) -  i * windowHeight/10);
  }
}

function setup() {
  //CANVAS AND EASY CAM-------------------------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------------------------------------------
  createCanvas(windowWidth, windowHeight, WEBGL);
  easycam = createEasyCam(); // creazione oggetto easycam con distanza iniziale
  easycam.setState(tri); // stato iniziale prospettico
  easycam.setDistanceMax(725);
  easycam.setDistanceMin(sunDim + 50);
  soundDesign();

  frameRate(24);
  setAttributes("antialias", true);
  perspective(PI / 2, width / height, 0.1, 15000);
  textureWrap(CLAMP);

  button1 = createButton("2D"); // creazione bottoni per switching 2D/3D
  //button1.position(windowWidth - 100, 120);
  button1.addClass("style-btn");
  button1.addClass("position2D");

  button2 = createButton("3D");
  //button2.position(windowWidth - 100, 185);
  button2.addClass("style-btn");
  button2.addClass("position3D");

  button1.mouseClicked(set2d); // clickando i bottoni si switchano gli stati della easycamera, dichiarati di seguito
  button2.mouseClicked(set3d);

  function set2d() {
    // setter vista 2d
    easycam.setState(bi, 700);
    easycam.removeMouseListeners();
  }

  function set3d() {
    // setter vista 3d (stato iniziale)
    easycam.attachMouseListeners(p5.renderer);
    easycam.setState(tri, 700);
  }

  //DRUM MACHINE CONTROLS -----------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------

  button3 = createButton("Play");
  //button3.position(windowWidth - 100, 20);
  button3.addClass("style-btn");
  button3.addClass("positionPlayStop");
  button3.mouseClicked(function () {
    if (playIsOff) {
      playIsOff = false;
      button3.html("Stop");
      refreshVolumes();
    } else {
      playIsOff = true;
      button3.html("Play");
    }
  });

  //RATIO SELECTORS
  for (i = 0; i < 8; i++) {
    tendina[i] = createSelect();
    tendina[i].position(windowWidth/50 , windowHeight/8 +  i * windowHeight/10);
    tendina[i].addClass("style-btn");
    tendina[i].addClass("show");
    //tendina[i].addClass("positionMenu");
    tendina[i].id(idTend[i]);
    tendina[i].style("height", "3.8vw");
    tendina[i].style("width", "3.8vw");
    tendina[i].changed(changeRatio);
    for (let j = 0; j < lista.length; j++) {
      tendina[i].option(lista[j]);
    }
    tendina[i].selected(planetRatios[i]);
  }

  //VOLUME SLIDERS
  for (i = 0; i < 8; i++) {
    slidVol[i] = createSlider(-50, -16, volumes[i], 1);

    slidVol[i].position(windowWidth/20, (windowHeight/8 + 7 * windowHeight/10) -  i * windowHeight/10);
    slidVol[i].addClass("slider");
    slidVol[i].addClass("show");
    slidVol[i].addClass("volume");
    slidVol[i].addClass("positionMenu");
    slidVol[i].id(idVol[7 - i]);
    slidVol[i].style("height", "3vw");
    slidVol[i].style("width", "10vw");
    slidVol[i].style("margin")
    //slidVol[i].style('background-color', '#000000');

    slidVol[i].changed(changeVolume);
  }

  //MENU
  menuButton = createButton("Hide");
  let hiddenMenu = false;
  //menuButton.position(20, 20);
  menuButton.addClass("style-btn");
  menuButton.addClass("positionMenu");
  menuButton.style("height", "3vw");
  menuButton.style("width", "6.5vw");
  menuButton.mouseClicked(function () {
    if (hiddenMenu) {
      hiddenMenu = false;
      menuButton.html("Hide");
      for (i = 0; i < 8; i++) {
        tendina[i].addClass("show");
        slidVol[i].addClass("show");
        tendina[i].removeClass("hide");
        slidVol[i].removeClass("hide");
      }
    } else {
      hiddenMenu = true;
      menuButton.html("Menu");
      for (i = 0; i < 8; i++) {
        tendina[i].addClass("hide");
        slidVol[i].addClass("hide");
        tendina[i].removeClass("show");
        slidVol[i].removeClass("show");
      }
    }
  });

  //MUTE
  button4 = createButton("Mute");
  button4.addClass("style-btn");
  button4.addClass("positionMute");
  button4.style("height", "3vw");
  button4.style("width", "6.5vw");
  button4.mouseClicked(function () {
    if (!muted) {
      muted = true;
      button4.html("Unmute");
      for (i = 0; i < 8; i++) {
        tempVol[i] = slidVol[i].value();
        volumes[i] = -50;
        slidVol[i].value(-50);
      }
    } else {
      muted = false;
      button4.html("Mute");
      for (i = 0; i < 8; i++) {
        volumes[i] = tempVol[i];
        slidVol[i].value(tempVol[i]);
      }
    }
    refreshVolumes();
  });

  document.getElementById("key2").textContent =
    "Detected key: " + " " + chromas2[k];

  if (m == 0) {
    document.getElementById("mode2").textContent = "Detected mode: " + "Minor";
  } else {
    document.getElementById("mode2").textContent = "Detected mode: " + "Major";
  }

  document.getElementById("prog2").textContent =
    "Detected progression: " + progressionNames[p - 1];

  if (t == 0) {
    document.getElementById("tetrad2").textContent =
      "Detected chord type: " + "Standard";
  } else {
    document.getElementById("tetrad2").textContent =
      "Detected chord type: " + "Seventh";
  }
}

function changeRatio() {
  console.log("Ratios");
  for (i = 0; i < 8; i++) {
    planetRatios[i] = tendina[i].value();
    console.log(planetRatios[i]);
  }

  Tone.Transport.pause();
  playIsOff = true;
  button3.html("Play");
  bassLoop.cancel();
  for (let i = 0; i < 4; i++) {
    chordLoops[i].cancel();
  }
  leadLoop.cancel();
  arp1Loop.cancel();
  arp2Loop.cancel();
  soundDesign();
}

function refreshVolumes() {
  console.log("Refreshed");
  bassSynth1.volume.value = volumes[0];
  bassSynth2.volume.value = volumes[0];
  bassSynth3.volume.value = volumes[0];
  for (j = 0; j < 4; j++) {
    chordSynths[j].volume.value = volumes[j + 1];
  }
  leadSynth.volume.value = volumes[5];
  arp1Synth.volume.value = volumes[6];
  arp2Synth.volume.value = volumes[7];
}

function changeVolume() {
  muted = false;
  button4.html("Mute");
  console.log("Volumes");
  for (i = 0; i < 8; i++) {
    volumes[i] = slidVol[i].value();
    console.log(volumes[i]);
  }
  refreshVolumes();
}

//Stars variables
let s = 0;
let r_s = 2500;
let x_s,
  y_s,
  z_s,
  c_s = [];
let n_s = 150;
let white = [255, 255, 255];
let yellow = [255, 255, 180];
let cyan = [120, 180, 255];
let red = [255, 180, 180];
let colors = [white, white, white, yellow, cyan, red];

function draw() {
  //BACKGROUND
  background(0, 0, 0, 0);

  //muro invisibile per limiti della sfera
  let currentDist = Math.sqrt(
    easycam.getPosition()[0] ** 2 +
      easycam.getPosition()[1] ** 2 +
      easycam.getPosition()[2] ** 2
  );

  if (currentDist > 3000.0) {
    easycam.setState(tri, 400);
  }

  // SKYBOX
  /*   if(s%20 == 0){
    x_s = [];
    y_s = [];
    z_s = [];  
    for (i=0; i<50; i++){
      x_s.push(random(-4000, 4000));
      y_s.push(random(-4000, 4000));
      z_s.push(random(-4000, 4000));
    }
     /////  push();
    noStroke();
    texture(environmentSelectedImg);
    rotateY(frameCount * 0.0005);
    sphere(4000);
    ///////pop(); 
    s = 0;
  } */

  if (s == 0) {
    s++;
    x_s = [];
    y_s = [];
    z_s = [];
    c_s = [];
    for (i = 0; i < n_s; i++) {
      x_s[i] = random(-r_s * 1.2, r_s * 1.2);
      y_s[i] = random(-r_s, r_s);
      z_s[i] = random(-r_s, r_s);
      c_s[i] = white;
    }
  }

  for (i = 0; i < n_s; i++) {
    if (i % (n_s / 4) == 0) {
      x_s.push(random(-r_s * 1.2, r_s * 1.2));
      y_s.push(random(-r_s, r_s));
      z_s.push(random(-r_s, r_s));
      x_s.shift();
      y_s.shift();
      z_s.shift();
      var col = random([0, 1, 2, 3, 4, 5]);
      c_s.push(colors[col]);
      c_s.shift();
    }

    var d_s = Math.sqrt(x_s[i] ** 2 + y_s[i] ** 2 + z_s[i] ** 2);
    if (d_s > 2900) {
      if (i < n_s / 10 || i > (9 * n_s) / 10) {
        strokeWeight(1);
        stroke(c_s[i], 80);
        fill(c_s[i], 80);
      } else {
        strokeWeight(random([3, 4]));
        stroke(c_s[i]);
        fill(c_s[i]);
      }

      point(x_s[i], y_s[i], z_s[i]);
      if (d_s < 3200) {
        var l = random([12, 13, 14]);
        strokeWeight(1);
        line(
          x_s[i] - l,
          y_s[i] - l,
          z_s[i] - l,
          x_s[i] + l,
          y_s[i] + l,
          z_s[i] + l
        );
        line(
          x_s[i] - l,
          y_s[i] - l,
          z_s[i] + l,
          x_s[i] + l,
          y_s[i] + l,
          z_s[i] - l
        );
        line(
          x_s[i] - l,
          y_s[i] + l,
          z_s[i] + l,
          x_s[i] + l,
          y_s[i] - l,
          z_s[i] - l
        );
      }
    }
  }

  //SUN
  noStroke();
  rotateY(PI);
  rotateY(frameCount * 0.005);
  texture(imgSun);
  sphere(sunDim);
  rotateY(-frameCount * 0.005);
  rotateY(-PI);

  //LIGHT
  ambientLight(60);
  pointLight(255, 255, 255, 0, 0, 0);

  //--------------------------------------------------SET NUM PLANETS DEACTIVATED FOR SOUND DESIGN PURPOSES--------------------------------------------

  //CONTROLS AND DRAW PLANETS
  for (i = 0; i < 8; i++) {
    planet(
      planetOrbWidth[i],
      planetOrbHeight[i],
      planetTilt[i],
      planetRotation[i],
      imgPlanets[i],
      planetDiameter[i],
      planetRatios[i]
    );
    /* if(i==2){   //MOON
          push();
          translate(-sin(2*Math.PI*(((Tone.Transport.seconds)*(Tone.Transport.bpm.value/60/4))*planetRatios[2])+PI)*500, 0, -[cos(2*Math.PI*(((Tone.Transport.seconds)*(Tone.Transport.bpm.value/60/4))*planetRatios[2])+PI)*333]);
          rotateY(-frameCount * 0.015);
          planet(100, 100, 0, 0.005, imgMoon, 15, 6);
          pop();
        } */

    //---------------------------------------------------------MIXER--------------------------------------------------------------------------
    if (!playIsOff) {
      Tone.Transport.start();
      //refreshVolumes();
      //refreshed = true;
    } else {
      Tone.Transport.pause();
      bassSynth1.volume.value = -100;
      bassSynth2.volume.value = -100;
      bassSynth3.volume.value = -100;
      for (j = 0; j < 4; j++) {
        chordSynths[j].volume.value = -100;
      }
      leadSynth.volume.value = -100;
      arp1Synth.volume.value = -100;
      arp2Synth.volume.value = -100;
    }
  }
  /*
      for(i=val; i<8; i++){
        synths[i].volume.value=-100;
      }
       */
  // oscChoice.changed(function(){for(i=0; i<8; i++){synths[i].oscillator.set({type: oscChoice.value().toString()});}});

  /* setBPM.changed(function(){
        Tone.Transport.bpm.value=setBPM.value();
        Tone.Transport.stop();
        Tone.Transport.start();
      }); */

  //text("red", slidVol[1].x + slidVol[1].width);
  //text("green", gSlider.x * 2 + gSlider.width, 65);
  //text("blue", bSlider.x * 2 + bSlider.width, 95);
}

function soundDesign() {
  let bassNotesIndex = 0;
  let chordNotesIndex = 0;
  let leadNotesIndex = 0;
  let arp1NotesIndex = 0;
  let arp2NotesIndex = 0;

  reverb = new Tone.Reverb({
    decay: 5,
    wet: 0.7,
  });

  pingpong = new Tone.PingPongDelay({
    delayTime: "2n",
    feedback: 0.55,
    wet: 0.6,
  });

  //BASSO
  bassFilter = new Tone.Filter(400, "lowpass");

  bassEnvelope = new Tone.FrequencyEnvelope({
    attack: (planetRatios[7] * 4).toString() + "n",
    decay: (planetRatios[7] * 2).toString() + "n",
    sustain: 0,
    release: 0,
    baseFrequency: "C1",
    octaves: 4,
    attackCurve: "sine",
  });

  bassEnvelope.connect(bassFilter.frequency);

  bassSynth1 = new Tone.Synth({
    oscillator: { type: "sawtooth", detune: "-10" },
  });
  bassSynth2 = new Tone.Synth({
    oscillator: { type: "sawtooth", detune: "10" },
  });
  bassSynth3 = new Tone.Synth({ oscillator: { type: "fmsine" } });
  bassSynth1.chain(bassFilter, reverb, Tone.Destination);
  bassSynth2.chain(bassFilter, reverb, Tone.Destination);
  bassSynth3.chain(bassFilter, reverb, Tone.Destination);
  bassSynth1.volume.value = -100;
  bassSynth2.volume.value = -100;
  bassSynth3.volume.value = -100;

  bassLoop = new Tone.Loop((time) => {
    bassSynth1.triggerAttackRelease(
      bassNotes[bassNotesIndex] + "1",
      planetRatios[7].toString() + "n",
      time
    );
    bassSynth2.triggerAttackRelease(
      bassNotes[bassNotesIndex] + "1",
      planetRatios[7].toString() + "n",
      time
    );
    bassSynth3.triggerAttackRelease(
      bassNotes[bassNotesIndex] + "1",
      planetRatios[7].toString() + "n",
      time
    );
    if (bassNotesIndex == bassNotes.length - 1) {
      bassNotesIndex = 0;
      chordNotesIndex = 0;
    } else {
      bassNotesIndex++;
      chordNotesIndex++;
    }
    bassEnvelope.triggerAttackRelease(planetRatios[7].toString() + "n", time);
    console.log(chordNotes);
  }, planetRatios[7].toString() + "n").start(0);

  //TETRADE CHORDS
  for (i = 0; i < 4; i++) {
    chordFilters[i] = new Tone.Filter(400, "lowpass");

    for (j = 6; j > 2; j--) {
      chordEnvelopes[i] = new Tone.FrequencyEnvelope({
        attack: (planetRatios[j] * 2).toString() + "n",
        decay: (planetRatios[j] * 4).toString() + "n",
        sustain: 0,
        release: 0,
        baseFrequency: "C0",
        octaves: 5,
        attackCurve: "sine",
      });
    }
    chordEnvelopes[i].connect(chordFilters[i].frequency);

    chordSynths[i] = new Tone.Synth({ oscillator: { type: "fmsine" } });
    chordSynths[i].chain(chordFilters[i], reverb, Tone.Destination);
    chordSynths[i].volume.value = -100;
  }

  if (Boolean(t)) {
    chordLoops[0] = new Tone.Loop((time) => {
      chordSynths[0].triggerAttackRelease(
        chordNotes[3][chordNotesIndex] + "3",
        planetRatios[6].toString() + "n",
        time
      );
      chordEnvelopes[0].triggerAttackRelease(
        planetRatios[6].toString() + "n",
        time
      );
    }, planetRatios[6].toString() + "n").start(0);
  } else {
    chordLoops[0] = new Tone.Loop((time) => {
      chordSynths[0].triggerAttackRelease(
        chordNotes[0][chordNotesIndex] + "4",
        planetRatios[6].toString() + "n",
        time
      );
      chordEnvelopes[0].triggerAttackRelease(
        planetRatios[6].toString() + "n",
        time
      );
    }, planetRatios[6].toString() + "n").start(0);
  }

  chordLoops[1] = new Tone.Loop((time) => {
    chordSynths[1].triggerAttackRelease(
      chordNotes[2][chordNotesIndex] + "3",
      planetRatios[5].toString() + "n",
      time
    );
    chordEnvelopes[1].triggerAttackRelease(
      planetRatios[5].toString() + "n",
      time
    );
  }, planetRatios[5].toString() + "n").start(0);

  chordLoops[2] = new Tone.Loop((time) => {
    chordSynths[2].triggerAttackRelease(
      chordNotes[1][chordNotesIndex] + "3",
      planetRatios[4].toString() + "n",
      time
    );
    chordEnvelopes[2].triggerAttackRelease(
      planetRatios[4].toString() + "n",
      time
    );
  }, planetRatios[4].toString() + "n").start(0);

  chordLoops[3] = new Tone.Loop((time) => {
    chordSynths[3].triggerAttackRelease(
      chordNotes[0][chordNotesIndex] + "3",
      planetRatios[3].toString() + "n",
      time
    );
    chordEnvelopes[3].triggerAttackRelease(
      planetRatios[3].toString() + "n",
      time
    );
  }, planetRatios[3].toString() + "n").start(0);

  //LEAD
  leadFilter = new Tone.Filter(400, "lowpass");

  leadEnvelope = new Tone.FrequencyEnvelope({
    attack: (planetRatios[2] * 2).toString() + "n",
    decay: (planetRatios[2] * 4).toString() + "n",
    sustain: 0,
    release: 0,
    baseFrequency: "C0",
    octaves: 5,
    attackCurve: "sine",
  });

  leadEnvelope.connect(leadFilter.frequency);

  leadSynth = new Tone.Synth({ oscillator: { type: "fmsine" } });
  leadSynth.chain(leadFilter, reverb, pingpong, Tone.Destination);
  leadSynth.volume.value = -100;

  leadLoop = new Tone.Loop((time) => {
    leadSynth.triggerAttackRelease(
      leadNotes[leadNotesIndex] + "4",
      planetRatios[2].toString() + "n",
      time
    );
    if (leadNotesIndex == leadNotes.length - 1) {
      leadNotesIndex = 0;
    } else {
      leadNotesIndex++;
    }
    leadEnvelope.triggerAttackRelease(planetRatios[2].toString() + "n", time);
  }, planetRatios[2].toString() + "n").start(0);

  //ARPEGGIATOR 1
  arp1Filter = new Tone.Filter(400, "lowpass");

  arp1Envelope = new Tone.FrequencyEnvelope({
    attack: (planetRatios[1] * 30).toString() + "n",
    decay: (planetRatios[1] * 8).toString() + "n",
    sustain: 0,
    release: 0,
    baseFrequency: "C0",
    octaves: 5,
    attackCurve: "sine",
  });

  arp1Envelope.connect(arp1Filter.frequency);

  arp1Synth = new Tone.Synth({ oscillator: { type: "fmsine" } });
  arp1Synth.chain(arp1Filter, pingpong, Tone.Destination);
  arp1Synth.volume.value = -100;

  arp1Loop = new Tone.Loop((time) => {
    arp1Synth.triggerAttackRelease(
      chordNotes[arp1NotesIndex][chordNotesIndex] + "4",
      planetRatios[1].toString() + "n",
      time
    );
    if (arp1NotesIndex == 2) {
      arp1NotesIndex = 0;
    } else {
      arp1NotesIndex++;
    }
    arp1Envelope.triggerAttackRelease(planetRatios[1].toString() + "n", time);
  }, planetRatios[1].toString() + "n").start(0);

  //ARPEGGIATOR 2
  arp2Filter = new Tone.Filter(400, "lowpass");

  arp2Envelope = new Tone.FrequencyEnvelope({
    attack: (planetRatios[0] * 32).toString() + "n",
    decay: (planetRatios[0] * 4).toString() + "n",
    sustain: 0,
    release: 0,
    baseFrequency: "C0",
    octaves: 5,
    attackCurve: "sine",
  });

  arp2Envelope.connect(arp2Filter.frequency);

  arp2Synth = new Tone.Synth({ oscillator: { type: "fmsine" } });
  arp2Synth.chain(arp2Filter, Tone.Destination);
  arp2Synth.volume.value = -100;

  arp2Loop = new Tone.Loop((time) => {
    arp2Synth.triggerAttackRelease(
      selectedMode[arp2NotesIndex] + "4",
      planetRatios[0].toString() + "n",
      time
    );
    //console.log(time);
    if (arp2NotesIndex == selectedMode.length - 1) {
      arp2NotesIndex = 0;
    } else {
      arp2NotesIndex++;
    }
    arp2Envelope.triggerAttackRelease(planetRatios[0].toString() + "n", time);
  }, planetRatios[0].toString() + "n").start(0);

  //Tone.Transport.start();
  Tone.Transport.bpm.value = bpm;
}

function planet(
  orbitWidth,
  orbitHeight,
  tilt,
  rotation,
  skin,
  diameter,
  modifier
) {
  push();

  //ELLIPSE
  rotateX(PI / 2);
  noFill();
  stroke(255, 160);
  strokeWeight(1);
  ellipse(0, 0, orbitWidth * 2, orbitHeight * 2, 50);
  rotateX(-PI / 2);

  //ROTATION
  //Tone.Transport.seconds  TRASCORRERE DEI SECONDI
  //Tone.Transport.bpm.value BPM
  //Tone.Transport.bpm.value/60/4 MEASURES PER SECOND (1n in Tone transport reference)
  //2*Math.PI
  var revolutionRate =
    2 *
    Math.PI *
    (Tone.Transport.seconds * (Tone.Transport.bpm.value / 60 / 4) * modifier);
  translate(
    sin(revolutionRate) * orbitWidth,
    0,
    cos(revolutionRate) * orbitHeight
  );
  rotateZ(tilt);
  rotateY(frameCount * rotation);

  //AXIS
  //fill(255);
  //stroke(255);
  //line(0, 400, 0, 0, -400,  0);

  //TEXTURE
  texture(skin);

  //COLORE ROSSO QUANDO PASSA PER L'AZIMUTH
  /* if(sin(revolutionRate)<=0.2 && sin(revolutionRate)>=-0.2 && cos(revolutionRate)>=0.8){
          emissiveMaterial(255, 50, 50);
          wobbleArray[modifier-1] = 1;
        }
        else{
          wobbleArray[modifier-1] = 0;
        } */
  noStroke();
  sphere(diameter);

  pop();
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let tri = {
  center: [0, 0, 0],
  distance: 600,
  rotation: [1, -0.3, 0, 0],
};

let bi = {
  center: [0, 0, 0],
  distance: 500,
  rotation: [0.2, -0.2, 0, 0],
};

// GUIDE TOUR

const tour = new Shepherd.Tour({
  useModalOverlay: true,
  defaultStepOptions: {
    classes: "shadow-md bg-purple-dark",
    scrollTo: false,
  },
});

// step #3
tour.addStep({
  id: "mixer",
  text: "mix the sounds here!",
  attachTo: {
    element: "#mixer",
    on: "right",
  },
  classes: "",
  buttons: [
    {
      text: "NEXT",
      action: tour.next,
    },
    {
      text: "EXIT",
      action: tour.complete,
      function() {
        localStorage.setItem("guideflag2", 0);
      },
    },
  ],
});

// step #4
tour.addStep({
  id: "step4",
  text: "extracted music parameters from the image",
  attachTo: {
    element: ".param2guide",
    on: "bottom",
  },
  classes: "",
  buttons: [
    {
      text: "NEXT",
      action: tour.next,
    },
    {
      text: "EXIT",
      action: tour.complete,
      function() {
        localStorage.setItem("guideflag2", 0);
      },
    },
  ],
});

// step #5
tour.addStep({
  id: "step5",
  text: "Click here to listen to sound",
  attachTo: {
    element: ".positionPlayStop",
    on: "left",
  },
  classes: "",
  buttons: [
    {
      text: "NEXT",
      action: tour.next,
    },
    {
      text: "EXIT",
      action: tour.complete,
      function() {
        localStorage.setItem("guideflag2", 0);
      },
    },
  ],
});

// step #6
tour.addStep({
  id: "2d",
  text: "Set 2d environment ",
  attachTo: {
    element: ".position2D",
    on: "left",
  },
  classes: "",
  buttons: [
    {
      text: "NEXT",
      action: tour.next,
    },
    {
      text: "EXIT",
      action: tour.complete,
      function() {
        localStorage.setItem("guideflag2", 0);
      },
    },
  ],
});

// step #7
tour.addStep({
  id: "3d",
  text: "Set 3d environment ",
  attachTo: {
    element: ".position3D",
    on: "bottom",
  },
  classes: "",
  buttons: [
    {
      text: "NEXT",
      action: tour.next,
    },
    {
      text: "EXIT",
      action: tour.complete,
    },
  ],
});

// step #8
tour.addStep({
  id: "3d",
  text: "Move in the 3D space using the mouse ",
  attachTo: {
    element: "",
    on: "",
  },
  classes: "",
  buttons: [
    {
      text: "EXIT",
      action: tour.complete,
    },
  ],
});
console.log(guideflag2);

if (guideflag2 == 1) {
  tour.start();
}
