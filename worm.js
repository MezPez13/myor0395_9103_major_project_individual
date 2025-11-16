// Equation for worm movement
function movementCalculation(x, y, idx, amp, freq, displacement) {
  // Displacement calculation
  const newX = x + idx * displacement;
  // Amplitude calculation
  const newY = y + amp * sin(idx * 360 * freq / fps);
  return { x: newX, y: newY };
}

class ThreadingWorm {
  // Initialise the thread
  constructor(startX, startY, displacement, frequency, colour) {
    this.frequency = frequency;
    this.displacement = displacement; // changed from 4 - kim
    this.reset(startX, startY);
    this.colour = colour;
  }

  // Reset the thread
  reset(startX, startY) {
    this.idx = 0;
    this.startX = startX;
    this.startY = startY;
    this.curX = 0;
    this.curY = 0;
  }

  update(amplitude) {
    if (this.curX < 0 || this.curX > width) {
      this.reset(this.startX, this.startY);
    }

    // Update the amplitude based on the height of the screen
    const baseAmplitude = height / 48;
    const amplitudeRange = height / 8;

    // Update current position
    const newPos = movementCalculation(this.startX, this.startY, this.idx, baseAmplitude + Math.max((amplitude - 128) / 256 * amplitudeRange, 0), this.frequency, this.displacement);
    this.curX = newPos.x;
    this.curY = newPos.y;
    this.idx++;
  }

  render(graphics) {
    const scaling = this.startX * this.startY;

    const baseSize = 10; // changed from 10 - kim


    // pulsating size
    const size = baseSize + sin(this.idx * 3 + scaling * 45) * 2;

    graphics.stroke(0, 100);
    graphics.strokeWeight(2);
    graphics.fill(this.colour);
    graphics.circle(this.curX, this.curY, size);

    // Orbiting red satellite for each dot
    const orbitAngle = this.idx * 5 + scaling * 30;
    const orbitRadius = 10 + sin(this.idx * 2 + scaling * 100) * 5;
    const orbitX = this.curX + cos(orbitAngle) * orbitRadius;
    const orbitY = this.curY + sin(orbitAngle) * orbitRadius;

    graphics.fill(255, 0, 0);
    graphics.circle(orbitX, orbitY, 3);
  }
};