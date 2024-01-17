var video;
var vScale = 1;
var captureWidth, captureHeight;
var prevFrame;
var threshold = 30;
var frameCounter = 0;
var drawEllipses = false;
var w = 10;
var dots = []; // Array to store the dots

function setup() {
  captureWidth = windowWidth / vScale;
  captureHeight = windowHeight / vScale;
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  video = createCapture(VIDEO);
  video.size(captureWidth, captureHeight);
  video.hide();
  prevFrame = createImage(captureWidth, captureHeight);
  frameRate(10); // Limit the frame rate to 10 frames per second
}

function draw() {
  background(0);
  video.loadPixels();
  prevFrame.loadPixels();

  // Calculate motion and add ellipses where movement is detected
  for (var y = 0; y < captureHeight; y += w) {
    for (var x = 0; x < captureWidth; x += w) {
      var index = (x + y * captureWidth) * 4;
      var r1 = prevFrame.pixels[index + 0];
      var g1 = prevFrame.pixels[index + 1];
      var b1 = prevFrame.pixels[index + 2];
      var r2 = video.pixels[index + 0];
      var g2 = video.pixels[index + 1];
      var b2 = video.pixels[index + 2];
      var diff = dist(r1, g1, b1, r2, g2, b2);

      if (diff > threshold) {
        dots.push({ x: x * vScale, y: y * vScale, lifetime: 3 }); // Add the dot
      }
    }
  }

  // Draw the dots and update their lifetimes
  for (var i = dots.length - 1; i >= 0; i--) {
    var dot = dots[i];
    fill(255);
    rectMode(CENTER);
    rect(dot.x, dot.y, w, w);
    dot.lifetime--;

    if (dot.lifetime <= 0) {
      dots.splice(i, 1); // Remove dots with no lifetime remaining
    }
  }

  // Update the previous frame with the current frame every 3 frames
  if (frameCounter % 3 == 0) {
    prevFrame.copy(video, 0, 0, captureWidth, captureHeight, 0, 0, captureWidth, captureHeight);
  }

  // Toggle ellipse drawing every 5 frames
  if (frameCounter % 5 == 0) {
    drawEllipses = !drawEllipses;
  }

  frameCounter++;
}

window.onresize = function () {
  location.reload();
};

