/* this is a function to draw the background color of flowers
 * it relates to the category of films
 * the genre defines the color
 * and number of genre decide the number of circles
*/ 

const CAT_TO_COLOR_MAP = {
    "剧情": "#cb152d",
    "喜剧": "#fbda41",
    "动作": "#eea6b7", //"#815c94"
    "悬疑": "#96c24e",
    "动画": "#1781b5",
    "其它": "#815c94"
};

// colorList is an array of colors of one single film
export class FlowerColor {
    constructor(p, x, y, colorList, flowerSize) {
        this.p = p;
        this.x = x;
        this.y = y;
        this.flowerSize = flowerSize || 1;  // if the size has not been defined, set it to 1
        this.colorNum = colorList.length;
        this.colors = [];

        for (let i = 0; i < this.colorNum; i++) {
            const categoryName = colorList[i];
            const hexColor = CAT_TO_COLOR_MAP[categoryName] || CAT_TO_COLOR_MAP["其它"];
            
            const c = this.p.color(hexColor);
            c.setAlpha(130);
            this.colors.push(c);
            }
        }    
    

    display(bgLayer) {
        bgLayer.push();
        bgLayer.blendMode(this.p.MULTIPLY);
        bgLayer.translate(this.x, this.y);
        bgLayer.noStroke();

        // costomize the size of color circles based on the size of flowers
        const baseSize = 100;
        const finalSize = baseSize * this.flowerSize;

        if (this.colorNum === 1) {  // if there is only one circle, move it to the center of flower
            bgLayer.fill(this.colors[0]);
            bgLayer.ellipse(0, 0, finalSize, finalSize);
        } else {
            const colorAngle = 360 / this.colorNum;
            for (let n = 0; n < this.colorNum; n++) {
                bgLayer.fill(this.colors[n]);
                bgLayer.rotate(this.p.radians(colorAngle));
                bgLayer.ellipse(-25 * this.flowerSize, 0, 90 * this.flowerSize, 90 * this.flowerSize);  // make the multiple circles overlap a bit
            }
        }
        
        bgLayer.pop();
    }
}
