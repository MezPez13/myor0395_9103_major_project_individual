
function drawFlowField(spectrum, spectrogramImg) {

  let speedFactor = 3; // Increase speed of morph
  let progress = constrain((frameCount * speedFactor) / morphDuration, 0, 1);

  // Fade out image smoothly
  tint(255, 255 * (1 - progress));
  image(img, 0, 0, width, height);

  const dotsPerWidth = width / flowFieldSpacing;
  const spectrumIdx = Math.round((frameCount / 2) % dotsPerWidth); // Slow the rate down

  let avgAmplitude = 0;
  for (const a of spectrum) {
    avgAmplitude += a;
  }

  avgAmplitude /= spectrum.length;

  noTint();
  spectrogramImg.push();
  spectrogramImg.erase(3, 255);
  spectrogramImg.rect(0, 0, width, height);
  spectrogramImg.noErase();
  spectrogramImg.pop();

  // Draw morphing circles
  let yidx = 0;
  for (let y = 0; y < height; y += height / spectrum.length) {
    let idx = 0;
    for (let x = 0; x < width; x += flowFieldSpacing) {
      let index = (x + floor(y) * width) * 4;
      let r = img.pixels[index];
      let g = img.pixels[index + 1];
      let b = img.pixels[index + 2];
      let brightness = (r + g + b) / 3;
      let baseSize = map(brightness, 0, 255, 2, flowFieldSpacing);


      let alpha = lerp(0, 255, progress);

      noStroke();
      if (idx == spectrumIdx) {
        spectrogramImg.colorMode(HSB, 255);
        spectrogramImg.noStroke();
        spectrogramImg.fill(map(yidx, 0, spectrum.length, 0, 255), 255, 255, (spectrum[yidx] - 128) * 2);
        baseSize *= 6 * (spectrum[yidx] - 128) / 128;
        spectrogramImg.colorMode(RGB, 255);
        fill(r, g, b, 0);
      } else {
        fill(r, g, b, alpha);
      }


      let offsetX = map(noise(x * 0.01, y * 0.01, frameCount * 0.1), 0, 1, -3, 3) * avgAmplitude / 128;
      let offsetY = map(noise(x * 0.01 + 100, y * 0.01 + 100, frameCount * 0.1), 0, 1, -3, 3) * avgAmplitude / 128;
      let size = baseSize + sin(frameCount * 0.05 + (x + y) * 0.01) * flowFieldSpacing;

      ellipse(x + offsetX, y + offsetY, size, size);

      if (idx == spectrumIdx) {
        spectrogramImg.ellipse(x + offsetX, y + offsetY, size, size);
      }

      idx++;
    }
    yidx++;
  }
}