
function drawWeaves() {

  let colWeaves = weaveSpacing;
  let rowWeaves = Math.floor(weaveSpacing * (height / width));

  let spacingX = width / colWeaves;
  let spacingY = height / rowWeaves;
  let radius = (min(spacingX, spacingY) / 2);

  push();
  translate(width / 2, height / 2);
  rotate(PI / 4);

  // Draw bass weaves as corners of a square positioned at the centre of the screen
  bassWeaves.push(new Weave(width / 4, height / 4, radius * random(0.8, 1.2), color(255, 0, 0), color(0, 255, 100)));
  bassWeaves.push(new Weave(3 * width / 4, height / 4, radius * random(0.8, 1.2), color(255, 0, 0), color(0, 255, 100)));
  bassWeaves.push(new Weave(width / 4, 3 * height / 4, radius * random(0.8, 1.2), color(255, 0, 0), color(0, 255, 100)));
  bassWeaves.push(new Weave(3 * width / 4, 3 * height / 4, radius * random(0.8, 1.2), color(255, 0, 0), color(0, 255, 100)));

  // Draw vocal weave at the centre of the screen
  rotate(3 * PI / 4);
  vocalWeave = new Weave(width / 2, height / 2, 1.5 * radius * random(0.8, 1.2), color(0, 0, 255), color(255, 0, 100));

  pop();
}

class Weave {
  // Initialise weave
  constructor(centreX, centreY, weaveRadius, overColour, underColour) {
    this.centreX = centreX;
    this.centreY = centreY;
    this.weaveRadius = weaveRadius;
    this.strokewidth = 2;
    this.pointsOnCircle = 20;
    this.wovenLayers = 9;
    this.scale = 1;

    this.waveAmplitude = this.weaveRadius * 0.09;
    this.waveSpeed = 0.02;
    this.rotationSpeed = 0.05;
    this.time = 0;

    this.overColour = overColour;
    this.underColour = underColour;
  }

  update(amplitude) {
    this.time += this.waveSpeed;
    // Scale the weave relative to the input amplitude
    this.scale = max(2 * (amplitude - 128), 0) / 128;
  }

  display() {
    push();
    translate(this.centreX, this.centreY);
    noFill();
    rotate(frameCount * this.rotationSpeed);

    for (let n = 0; n < this.wovenLayers; n++) {

      push();
      this.drawCircularWeave(this.scale * this.weaveRadius * (1 * (n / 10)), this.overColour, -1);
      this.drawCircularWeave(this.scale * this.weaveRadius * 1.05 * (n / 10), this.underColour, -1);
      pop();
    }

    pop();
  }

  drawCircularWeave(radiusBase, colour) {
    stroke(colour);
    strokeWeight(this.strokewidth);

    for (let i = 0; i < this.pointsOnCircle; i++) {
      let angle1 = (i / this.pointsOnCircle) * 360;
      let angle2 = ((i + 1) / this.pointsOnCircle) * 360;

      let wave1 = sin(angle1 * 2 + this.time * 200) * this.waveAmplitude;
      let wave2 = sin(angle2 * 2 + this.time * 200) * this.waveAmplitude;

      let r1 = (radiusBase - wave1);
      let r2 = (radiusBase - wave2);

      let x1 = r1 * cos(angle1);
      let y1 = r1 * sin(angle1);
      let x2 = r2 * cos(angle2);
      let y2 = r2 * sin(angle2);

      let cx1 = (r1 - this.waveAmplitude) * cos(angle1 - 2);
      let cy1 = (r1 + this.waveAmplitude) * sin(angle1 + 2);
      let cx2 = (r2 - this.waveAmplitude) * cos(angle2 - 2);
      let cy2 = (r2 + this.waveAmplitude) * sin(angle2 + 2);

      let cx3 = (r1 + this.waveAmplitude) * cos(angle1 - 2);
      let cy3 = (r1 - this.waveAmplitude) * sin(angle1 + 2);
      let cx4 = (r2 + this.waveAmplitude) * cos(angle2 - 2);
      let cy4 = (r2 - this.waveAmplitude) * sin(angle2 + 2);

      bezier(x1, y1, cx1, cy1, cx2, cy2, x2, y2);

      bezier(x1, y1, cx3, cy3, cx4, cy4, x2, y2);
    }
  }
}