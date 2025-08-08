/*
 * The main sketch file for the Film Flowers project.
 * this file handles the main p5.js lifecycle (preload, setup, draw)
 * orchstrates the drawing of different layers, and manages user interactions.
*/

import { processData } from "./data.process.js";

// Initialize the p5.js sketch in instance mode.
// create a parameter "p" to receive p5.js instance, containing all its functions and variables. 
const sketch = (p) => {
  let filmData;
  let dataProcessed;
  let bgLayer;
  let legendImage;

  // preload the CSV file and the legend image before the sketch starts
  p.preload = () => {
    filmData = p.loadTable("/dataviz-flim-flower/new_flower_film.csv", "header");
    legendImage = p.loadImage('/dataviz-flim-flower/legend.png');

  }

  p.setup = () => {          
      // process the raw CSV data first to get layout properties
      dataProcessed = processData(filmData, p);      

      // create a main canvas with the calculated height to enable scrolling 
      p.createCanvas(p.windowWidth, dataProcessed.canvasHeight);

      // create a off-screen graphics bufffer to place the flower color
      bgLayer = p.createGraphics(p.windowWidth, dataProcessed.canvasHeight);

      // pre-render the background once for performance 
      drawBackgroundOnce(); 
  };

  // draw on the background canvas
  function drawBackgroundOnce() {
    if (!dataProcessed || !bgLayer) return;  // safety check
    
    // clears the off-screen buffer, draws all flower colors onto it, and applies a blur filter
    bgLayer.clear();
    for (let i = 0; i < dataProcessed.flowerColors.length; i++) {
      dataProcessed.flowerColors[i].display(bgLayer);
    }
    bgLayer.filter(p.BLUR, 3);
  }

  // draw the foreground layer canvas
  function drawFgLayer() {
    if (!dataProcessed) return; // safety check
    
    // draw the font style, content and position of project title
    p.push();
    p.textFont('Chewy');
    p.textSize(96);
    p.fill('#eea6b7');
    p.textAlign(p.CENTER, p.CENTER);
    p.text('Film Flowers', p.width / 2, 150);
    p.pop();

    // place the legend image below the title
    p.push();
    p.imageMode(p.CENTER);
    p.image(legendImage, p.width / 2, 550);
    p.pop();

    // draw the font style, content and position of year labels
    p.push();
    p.fill(0);
    p.textFont('Chewy');
    p.textSize(32);
    p.textAlign(p.LEFT, p.CENTER);
    for (let label of dataProcessed.yearLabels) {
        p.text(label.text, label.x, label.y);
    }
    p.pop();

    // generate flowers on the canvas 
    for (let i = 0; i < dataProcessed.flowers.length; i++) {
      dataProcessed.flowers[i].display(p.mouseX, p.mouseY);    
    }
  }

  
  p.draw = () => {   
    p.background(255);
    p.image(bgLayer, 0, 0); // paste the pre-redered background layer onto the main canvas
    drawFgLayer();  // draw foreground layer on top
  }

  // if detect the mouse pressed, call the function checkClick 
  p.mousePressed = () => {
    for (let i = 0; i < dataProcessed.flowers.length; i++) {
      dataProcessed.flowers[i].checkClick(p.mouseX, p.mouseY);  // 这里增加了mouseX和mouseY
    }
  }

  // make the layout responsive by recalculating everything when the window is resized
  p.windowResized = () => {
    dataProcessed = processData(filmData, p);
    p.resizeCanvas(p.windowWidth, dataProcessed.canvasHeight);
    bgLayer.resizeCanvas(p.windowWidth, dataProcessed.canvasHeight);
    drawBackgroundOnce();
  }  
}

// start the p5.js sketch
new p5(sketch);


