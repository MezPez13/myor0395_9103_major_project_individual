

let img;
let weaves = [];
let vocalWeave;
let bassWeaves = [];
let numBassWeaves = 4;
let guitarWeaves = [];
let threadingWorms = [];
let threadingWormsImg;
const weaveSpacing = 6;
const flowFieldSpacing = 6;
const morphDuration = 150;
let lineImg;
let lineSystem;
let trails = [];


let song;
let volume = 1.0;
let fft;
let smoothing = 0.3;
let numBins = 512;

function preload() {
  img = loadImage('assets/KT_Pathway_Avenue.jpg');
  song = loadSound('assets/Rage Against The Machine - Take The Power Back (Audio).mp3');
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.drawingContext.getContextAttributes().willReadFrequently = true;
  angleMode(DEGREES);
  noFill();
  img.resize(width, height);

  // Initialize weave positions
  drawWeaves();

  // Create graphics buffers
  lineImg = createGraphics(width, height);
  threadingWormsImg = createGraphics(width, height);

  // Initialize line system
  lineSystem = new LineSystem(weaves);

  for (const weave of weaves) {
    for (let i = 0; i < 3; ++i) {
      threadingWorms.push(new ThreadingWorm(weave.centreX, weave.centreY));
    }
  }

  for (let i = 0; i < 8; i++) {
    trails.push(new LineTrail(random(width), random(height), 0.5, 150));
  }

  let button = createButton('Play/Pause');
  fft = new p5.FFT(smoothing, numBins);
  song.connect(fft);
  button.position((width - button.width) / 2, height - button.height - 2);
  button.mousePressed(playPause);
  playPause()
}

function playPause() {
  if (song.isPlaying()) {
    song.stop();
  } else {
    // We can use song.play() here if we want the song to play once
    // In this case, we want the song to loop, so we call song.loop()
    song.loop();
  }
}

function mouseMoved() {
  // Map the mouseY to a volume value between 0 and 1 (clamped)
  volume = map(mouseY, 0, height, 1, 0, true);
  song.setVolume(volume);

  // Map the mouseX to a pan value between -1 and 1 (clamped)
  pan = map(mouseX, 0, width, -1, 1, true);
  song.pan(pan);
}

function draw() {
  background(255, 20);

  let spectrum = fft.analyze();
  let bassVolume = 0;
  for (let i = 0; i < 4; ++i) {
    bassVolume += spectrum[i + 2];
  }
  bassVolume /= 4;

  let vocalVolume = 0;
  for (let i = 0; i < 20; ++i) {
    vocalVolume += spectrum[i + 83];
  }
  vocalVolume /= 20;

  // Draw flow field from circular weave logic
  drawFlowField();
  noTint();

  // Render lines using LineSystem
  lineSystem.render(lineImg);

  // Update and display trails
  for (let t of trails) {
    t.update();
    t.display();
  }

  // Draw weaves on top
  push();
  for (const bassWeave of bassWeaves) {
    bassWeave.update(bassVolume);
    bassWeave.display();
  }

  vocalWeave.update(vocalVolume);
  vocalWeave.display();
  pop();

  push();
  threadingWormsImg.push();
  threadingWormsImg.erase(20, 20);
  threadingWormsImg.rect(0, 0, width, height);
  threadingWormsImg.noErase();
  threadingWormsImg.pop();

  for (const worm of threadingWorms) {
    worm.update();
    worm.render(threadingWormsImg);
  }
  image(threadingWormsImg, 0, 0, width, height);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  img.resize(width, height);

  drawWeaves();
}

