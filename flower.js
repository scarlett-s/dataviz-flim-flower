/* define a single flower
 * @param {number}x - x coordinate of flower's center
 * @param {number}y - y coordinate of flower's center
 * @param {string}petalType - the shape of petals, determined by the film's country of origin
 * @param {number}petalCount - the number of petals in one flower based on the box-office revenue
 * @param {number}flowerSize - adjust the flower's size based on the film's score
*/

export class Flower {
    constructor(p, x, y, petalType, petalCount, flowerSize, filmObject) {
        this.p = p;
        this.x = x;
        this.y = y;
        this.petalType = petalType;
        this.petalCount = petalCount;
        this.flowerSize = flowerSize;
        this.angle = 0;
        this.hoverRadius = 40;  // defines the interactive radius for hover detection
        this.filmObject = filmObject;
        this.isTitleVisible = false;  // at the beginning, all film titles are invisible
    }

    /* draws a single flower and its title, score and box-office revenue, and handles the hover animation
     * the flower spins on mouse hover, and its title is displayed permanently once hovered 
     * @param {number}mx - current x-coordinate of mouse
     * @param {number}my - current y-coordinate of mouse
    */
    display(mx, my) {
        // interaction logic - if hovered, update the angle for rotation and reveal the title permanently
        if (this.isHovered(mx, my)) {
            this.angle += 2;
            this.isTitleVisible = true;
        }

        // draw the flower 
        // use push/pop to isolate transformations (scale, rotate), ensuring they don't affect other drawings
        this.p.push();
        this.p.noFill();

        // translate the origin to the center point of flower, so scaling and rotation occur around the point
        this.p.translate(this.x, this.y);

        this.p.scale(this.flowerSize);

        this.p.rotate(this.p.radians(this.angle));

        const angleStep = 360 / this.petalCount;
        
        for (let i = 0; i < this.petalCount; i++) {
            this.p.rotate(this.p.radians(angleStep));
            this.drawPetal();
        }
        this.p.pop(); 

        // check whether the mouse is hovering or hovered on the flower, if yes, show the title, score and box-office
        if (this.isTitleVisible) {
            this.p.push();
            this.p.fill(0);
            
            this.p.textSize(12);
            this.p.textFont('sans-serif'); 

            this.p.rectMode(this.p.CENTER);  // set recMode to CENTER, so the text box is centered on the flower's x-coordinate
            this.p.textAlign(this.p.CENTER, this.p.CENTER);
            this.p.textWrap(this.p.WORD);  // enable text wrapping to handle long titles within the defined text box width

            
            const textYOffset = 80; // use a fixed y-offset to ensure all titles in the same row align on the same baseline
            const textBoxWidth = 80;
            const displayText = `${this.filmObject.title}\n${this.filmObject.box_office}亿\n${this.filmObject.score}/10`;
            this.p.text(displayText, this.x, this.y + textYOffset, textBoxWidth); 
            
            this.p.pop();
        }
        
        
    }

    // draw three different shapes of petal
    drawPetal() {
        this.p.stroke(0);
        this.p.strokeWeight(1);
        switch (this.petalType) {
        case 'petal1':
            this.p.beginShape();
            this.p.vertex(0,0);
            this.p.bezierVertex(-20, -20, -30, -40, -10, -60);
            this.p.vertex(0, -50);
            this.p.vertex(10, -60);
            this.p.bezierVertex(30, -40, 20, -20, 0, 0);
            this.p.endShape(this.p.CLOSE);
            break;
        case 'petal2':
            this.p.beginShape();
            this.p.vertex(0, 0);
            this.p.bezierVertex(40, -25, 4, -32, 0, -60);
            this.p.bezierVertex(-4, -32, -40, -25, 0, 0);
            this.p.endShape(this.p.CLOSE);
            break;
        case 'petal3':
            this.p.bezier(0, 0, -60, -80, 60, -80, 0, 0);
            break;
        default:
            this.p.beginShape();
            this.p.vertex(0,0);
            this.p.bezierVertex(-20, -20, -30, -40, -10, -60);
            this.p.vertex(0, -50);
            this.p.vertex(10, -60);
            this.p.bezierVertex(30, -40, 20, -20, 0, 0);
            this.p.endShape(this.p.CLOSE);
        }    
    }

    // check if the given coordinates (mx, my) are within the flower's hover radius
    isHovered(mx, my) {
        const d = this.p.dist(mx, my, this.x, this.y);
        return d <= this.hoverRadius;        
    }

    checkClick(mx, my) {
        if (this.isHovered(mx, my)) {
            if (this.filmObject.link) {
                window.open(this.filmObject.link, '_blank');
            }
        }
    }
}