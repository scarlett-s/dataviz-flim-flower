// for testing: console.log("正在运行最新的 data.process.js - 最终修复版");

/* This file handles data processing and flower generation.
 * It reads raw film data from the CSV, caculates all layout properties for a 
 * responsive grid, and creates Flower and FlowerColor objects.
*/
import { Flower } from './flower.js';
import { FlowerColor } from './flower.color.js';

export function processData(data, p) {
    let flowers = [];
    let flowerColors = [];
    let yearLabels = [];
    let indexOfYear = {};
    const filmRowNum = data.getRowCount();
    const filmYears = data.getColumn('year');

    // Iterate through the dataset to group all film row indices by their year
    for (let i = 0; i < filmRowNum; i++) {
        const year = filmYears[i];
        if (year) {
            if (!indexOfYear[year]) indexOfYear[year] = [];
            indexOfYear[year].push(i);
        }        
    }

    // sorting the year labels from the closest date to the furthest
    const years = Object.keys(indexOfYear).sort((a, b) => b - a);

    const COUNTRY_TO_TYPE = {
        "中国大陆": "petal1",
        "中国香港": "petal3",
        "美国": "petal2"
    };

    // design the layout of flowers
    const sideMargin = 100; // the minimun left and right margin for the content
    const marginTop = 1000; // the top margin of the grid
    const marginBottom = 100; // the botton margin of the grid
    const rowHeight = 200; // the height of each line
    const colWidth = 180;  // the width of each column

    const contentWidth = colWidth * 6;  // the whole width of grid
    let marginX = Math.max(sideMargin, (p.windowWidth - contentWidth) / 2);  // design a responsive layout, make sure the content is always in the center of the window.
    const canvasHeight = marginTop + marginBottom + years.length * rowHeight;  // calculate the total required canvas height to enable scrolling

    // the outer loop is to extract the film which were produced in the same year
    for (let n = 0; n < years.length; n++) {
        const year = years[n];
        const filmIndex = indexOfYear[year];

        // calculate the Y-coordinate of the given year
        const yPos = marginTop + n * rowHeight;

        // add a year label at the left side of the grid
        const labelX = marginX;
        yearLabels.push({ text: year, x: labelX, y: yPos });

        // the inner loop deals with each film (flower) in one year
        for (let m = 0; m < filmIndex.length; m++) {
            
            // limit the number of flowers to a maximum of 5 per year (according to the data check beforehand)
            if (m >= 5) {
                break; // if reached five, break the inner loop
            }

            const r = filmIndex[m];
            const rowObject = data.getRow(r);
            const filmObject = rowObject.obj;
            const score = filmObject.score;
            const country = filmObject.country;
            const box_office = filmObject.box_office;

            // calculate flower's x-coordinate
            // the 0 column is the year label, so the flower starts from (m + 1) 
            const flowerX = marginX + (m + 1) * colWidth;
            
            const rawCategory = filmObject.category || '';  // The original category format is "Action|Comedy", so we split it by "|" to get an array.
            const category = rawCategory.split('|');

            let petalCount;
            let flowerSize;

            // map the film score to the flower's size
            if (score > 9) { flowerSize = 1; }
            else if (score > 8) { flowerSize = 0.8; }
            else if (score >= 7) { flowerSize = 0.6; }
            else if (score >= 6) { flowerSize = 0.4; }
            else { flowerSize = 0.25; }
            
            // map the box office revenue to the number of petals
            if (box_office > 50) { petalCount = 9; }
            else if (box_office > 30) { petalCount = 8; }
            else if (box_office > 16) { petalCount = 7; }
            else if (box_office > 8) { petalCount = 6; }
            else { petalCount = 5; }

            const petalType = COUNTRY_TO_TYPE[country] || 'petal1';
        
            // generate flower instances and flower color instances
            let flower = new Flower(p, flowerX, yPos, petalType, petalCount, flowerSize, filmObject);
            flowers.push(flower);

            let flowerColor = new FlowerColor(p, flowerX, yPos, category, flowerSize);
            flowerColors.push(flowerColor);
        }
    }

    // return the processed data object to the main sketch
    return {
        flowers: flowers,
        flowerColors: flowerColors,
        yearLabels: yearLabels,
        canvasHeight: canvasHeight
    };
}