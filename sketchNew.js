

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

const fps = 30;
let song;
let volume = 1.0;
let fft;
let spectrogramFft;
const smoothing = 0.3;
const numBins = 512;
const spectrogramNumBins = 128;
const spectrogramUsedBins = spectrogramNumBins / 2;

function preload() {
  img = loadImage('assets/KT_Pathway_Avenue.jpg');
  song = loadSound('assets/Rage Against The Machine - Take The Power Back (Audio).mp3');
}

function setup() {
  frameRate(fps)
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.drawingContext.getContextAttributes().willReadFrequently = true;
  angleMode(DEGREES);
  noFill();
  img.resize(width, height);
  img.loadPixels();
  // image(img, 0, 0, width, height);


  // Initialize weave positions
  drawWeaves();

  // Create graphics buffers
  lineImg = createGraphics(width, height);
  threadingWormsImg = createGraphics(width, height);
  spectrogramImg = createGraphics(width, height);

  // Initialize line system
  lineSystem = new LineSystem(weaves);

  const filipinoColours = [color(0, 0, 255, 200), color(255, 0, 0, 200), color(255, 255, 255, 100), color(255, 255, 50)];
  for (let i = 0; i < 4; ++i) {
    threadingWorms.push(new ThreadingWorm(0, height / 4 * (i + 0.5), flowFieldSpacing / 2, i + 1, filipinoColours[i]));
  }


  let button = createButton('Play/Pause');
  fft = new p5.FFT(smoothing, numBins);
  spectrogramFft = new p5.FFT(smoothing, spectrogramNumBins);
  song.connect(spectrogramFft);
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
  background(255);

  const spectrogram = spectrogramFft.analyze();
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
  drawFlowField(spectrogram.slice(0, spectrogramUsedBins), spectrogramImg);
  image(spectrogramImg, 0, 0, width, height);
  noTint();

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
  threadingWormsImg.erase(5, 20);
  threadingWormsImg.rect(0, 0, width, height);
  threadingWormsImg.noErase();
  threadingWormsImg.pop();

  for (let i = 0; i < threadingWorms.length; i++) {
    let avgAmp = 0;
    for (let j = i * spectrogramUsedBins / threadingWorms.length; j < (i + 1) * spectrogramUsedBins / threadingWorms.length; j++) {
      avgAmp += spectrogram[i];
    }
    avgAmp /= spectrogramUsedBins / threadingWorms.length;
    threadingWorms[i].update(avgAmp);
    threadingWorms[i].render(threadingWormsImg);
  }
  pop();
  image(threadingWormsImg, 0, 0, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  img.resize(width, height);

  drawWeaves();
}

