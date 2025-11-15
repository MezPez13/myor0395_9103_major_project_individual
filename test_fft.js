// Let's make a variable to hold the audio file
let song;

// Let's make a variable to hold the FFT object
let fft;

// Let's make a variable for the number of bins in the FFT object
// This is how many frequency bands we will have
// The number of bins must be a power of 2 between 16 and 1024 
// Try changing this value
let numBins = 512;

// We will also have a variable for the smoothing of the FFT
// This averages the values of the frequency bands over time so it doesn't jump around too much
// Smoothing can be a value between 0 and 1
// Try changing this value
let smoothing = 0.3;

// This time we will make a global variable for the button so we can access it in the windowResized function
let button;

// Load sound file before setup() function runs
function preload() {
  // Audio file from freesound https://freesound.org/people/multitonbits/sounds/383935/?
  song = loadSound("assets/Rage Against The Machine - Take The Power Back (Audio).mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Create a new instance of p5.FFT() object
  fft = new p5.FFT(smoothing, numBins);

  song.connect(fft);

  // Add a button for play/pause
  // We cannot play sound automatically in p5.js, so we need to add a button to start the sound
  button = createButton("Play/Pause");

  // Set the position of the button to the bottom centre
  button.position((width - button.width) / 2, height - button.height - 2);

  // We set the action of the button by choosing what action and then a function to run
  // In this case, we want to run the function play_pause when the button is pressed
  button.mousePressed(playPause);

  // Set the colour mode to HSB
  colorMode(HSB, 255);
  console.log(song.sampleRate())
}

function draw() {
  background(0);

  // analyze() method returns an array of amplitude values across the frequency spectrum
  // Amplitude values range between 0 and 255, where at 0, the sound at the specific frequency band is silent
  // and at 255, the sound at the specific frequency band is at its loudest
  let spectrum = fft.analyze();

  // Calculate width of rectangles
  let size = width / spectrum.length;

  // Loop through the spectrum array to draw a rectangle per frequency band
  for (let i = 0; i < spectrum.length; i++) {
    /* 
      We will set the fill color of the rectangle based on its frequency band
      We will use the map function to map the value of i (which frequency band) to the hue value
      The map function takes 5 arguments: 
        1. Value to be remapped
        2. Minimum value of the input range
        3. Maximum value of the input range
        4. Minimum value of the output range
        5. Maximum value of the output range
    */
    fill(map(i, 0, spectrum.length, 0, 255), 255, 255);

    // We will use map again to set the x-location of the rectangle based on the frequency band
    // i can be between 0 and the length of the spectrum array
    // We will map this to a value between 0 and the width of the canvas
    let x = map(i, 0, spectrum.length, 0, width);

    // Map the y-location of the rectangle using amplitude at the specific frequency band
    // Now we use the power of each frequency band to set the height of the rectangle
    let y = map(spectrum[i], 0, 255, height, 0);

    // Becuase p5.js draws rectangles from the top left corner, we need to adjust the y value
    // to be height - y
    rect(x, y, size, height - y);
  }
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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  // Reset the position of the button
  button.position((width - button.width) / 2, height - button.height - 2);
}