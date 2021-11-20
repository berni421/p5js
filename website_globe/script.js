/*
 *  various plots of data scraped from websites.
 */

const MAXX = 512;
const MAXY = MAXX;
const POINTSIZE = 4;
const TEXTSIZE = 16;
const HEADER = 50;
const FOOTER = 50;

var items; // data
var choices; // options
var myFont;

function preload() {
    // handle asynchronous loading of external files using p5.js load tools in a blocking way
    myFont = loadFont('../fonts/DejaVuSerif.ttf');
}

function setup() {
    createCanvas(MAXX, MAXY, WEBGL);
    textFont(myFont);
    items = new Data();
    items.loadItems()
        .then(_x => doItems());
}

function draw() {
    // Animation here in future
}

function touchEnded() {

    if (touches.length === 0) {
        // laptop screen
        camera(
            map(mouseX, 0, 512, -256, 256), map(mouseY, 0, 512, -256, 256), 512,
            0, 0, 0,
            0, 1, 0);
    } else if (touches.length === 1) {
        // touch screen
        camera(
            map(touches[0].x, 0, 512, 256, -256), map(touches[0].y, 0, 512, 256, -256), 512,
            0, 0, 0,
            0, 1, 0);
    } else if (touches.length === 2) {
        // touch screen and change data
        items.next();
        doGraph("plotItems");
    }
    print("touches=", touches);

    doGraph("plotItems");

}

function keyPressed() {
    // Change data
    if (key === 'd') {
        items.next();
        doGraph("plotItems");
    }
}

function mousePressed() {
}


function doItems() {
    print("doItems items.names[0]=", items.names[0]);

    camera(
        0, 0, 512,
        0, 0, 0,
        0, 1, 0);

    // set first graph
    doGraph("plotItems");
}

function doGraph(type) {
    let graph = {};

    function title() {
        background("black");
        // Title in Center at Top
        textSize(TEXTSIZE);
        fill("white");
        let site = items.site;
        let name = items.names[site];
        text(name, -textWidth(name) / 2, -MAXY / 2 + TEXTSIZE);
        print("title=", name);

    }

    let site = items.site;
    let name = items.names[site];
    let data = items.data[site];
    let start = items.start[site];

    title();
    graph = new Display(name, data);
    graph.plot();

    print(type + " Done");
}


class Data {
    constructor() {
        this.names = []; // array of data names
        this.data = [];  // array of site data
        this.start = [];
        this.sites = 0; // number of sites
        this.site = 0; // current site
    }

    async loadItems(_callback) {
        /*
         * site-names.csv
         * 
         * header: name, filename
         * rows: [www.site,file.name]+
         */
        // load Site Names

        function handleErrors(response) {
            if (!response.ok) throw response.statusText;
            return response;
        }

        const siteNames = await fetch('../data/site-names.csv')
            .then(handleErrors)
            .then(response => response.text())
            .catch(error => console.error("siteNames", error));
        //        print("fetch siteNames success", siteNames);       
        //        print(split(siteNames, "\n"));

        // load Sites
        for (let siteDetails of split(siteNames, "\n")) {
            if ("" !== siteDetails) {
                let site = split(siteDetails, ",");
                name = site[0];
                if ("name" !== name) {
                    // load Site                
                    let fileName = "../data/" + site[1];
                    const siteData = await fetch(fileName)
                        .then(handleErrors)
                        .then(response => response.text())
                        .catch(error => console.error("siteData", fileName, error));
                    //                                     print("fetch siteData success", siteData);
                    let s = this.sites; // starts at zero
                    this.names[s] = name;
                    this.data[s] = siteData;
                    this.sites++;
                }
            }
        }
        print("loadItems this=", this,
            "this.names[0]=", this.names[0]
        );
    }

    next() {
        // change website
        this.site++;
        if (this.site >= this.sites) {
            this.site = 0;
        }
        print("next this.site", this.site);
    }
} // Data

// Various fucntions used by the display classes

function findStart(d) {
    // start at some interesting place
    let tag = "<body";
    let start = d.indexOf(tag) + tag.length;
    return start;
}

function Ascii(c) {
    ;
    return (c >= 0 && c <= 255);
}

function dataFilter(index, pos, mod) {
    return (index + pos) % mod == 0;
}

function minFilter(min, value) {
    if (value < min) {
        return value;
    } else {
        return min;
    }
}

function maxFilter(max, value) {
    if (value > max) {
        return value;
    } else {
        return max;
    }
}

class Display {
    constructor(name, data) {
        this.point = 0; // current data point
        this.name = name; // the titile for data
        this.globe = [];
        this.r = 256 - HEADER;
        this.total = 32;
        this.prepare(data);
    }

    prepare(data) {
        // Locate a useful start of data
        let start = findStart(data);
        let end = data.length;
        let dataInteresting = data.substring(start, end);
        let dataInterestingString = dataInteresting.split("");

        // discard non ascii characters
        let dataAsciiOnly = dataInterestingString.filter(value => Ascii(value.charCodeAt(0)));
        print("dataAsciiOnly =", dataAsciiOnly);

        // Extract data and colour channels
        let size = 3;
        let dataRedArray = dataAsciiOnly.filter((value, index) => dataFilter(index, 0, size));
        let dataGreenArray = dataAsciiOnly.filter((value, index) => dataFilter(index, 1, size));
        let dataBlueArray = dataAsciiOnly.filter((value, index) => dataFilter(index, 2, size));

        // Store data
        this.dataRed = dataRedArray.join("");
        this.dataGreen = dataGreenArray.join("");
        this.dataBlue = dataBlueArray.join("");

        // reset data counts
        this.start = 0; // Colour data is now stripped of unwanted values
        // minimum size of data
        let redLength = this.dataRed.length;
        let greenLength = this.dataGreen.length;
        let blueLength = this.dataBlue.length;
        let sizes = [redLength, greenLength, blueLength];
        this.end = sizes.reduce((min, value) => minFilter(min, value), Infinity);
        print("end =", this.end);

        // Work out ranges of data
        let range = {
            red: [255, 0],
            green: [255, 0],
            blue: [255, 0]
        };

        // Minimum Ranges
        let minRedValue = dataRedArray.reduce(((min, value) => minFilter(min, value.charCodeAt(0))), 255);
        let minGreenValue = dataGreenArray.reduce(((min, value) => minFilter(min, value.charCodeAt(0))), 255);
        let minBlueValue = dataBlueArray.reduce(((min, value) => minFilter(min, value.charCodeAt(0))), 255);
        range.red[0] = minRedValue;
        range.green[0] = minGreenValue;
        range.blue[0] = minBlueValue;

        // Maximum Ranges
        let maxRedValue = dataRedArray.reduce(((max, value) => maxFilter(max, value.charCodeAt(0))), 0);
        let maxGreenValue = dataGreenArray.reduce(((max, value) => maxFilter(max, value.charCodeAt(0))), 0);
        let maxBlueValue = dataBlueArray.reduce(((max, value) => maxFilter(max, value.charCodeAt(0))), 0);
        range.red[1] = maxRedValue;
        range.green[1] = maxGreenValue;
        range.blue[1] = maxBlueValue;

        this.range = range;
        print("Range =", this.range);

        for (let i = 0; i < this.total + 1; i++) {
            this.globe[i] = [];
            const lat = map(i, 0, this.total, 0, PI);
            for (let j = 0; j < this.total + 1; j++) {
                const lon = map(j, 0, this.total, 0, TWO_PI);
                const x = this.r * sin(lat) * cos(lon);
                const y = this.r * sin(lat) * sin(lon);
                const z = this.r * cos(lat);
                this.globe[i][j] = createVector(x, y, z);
            }
        }
    }

    plot() {
        noFill();
        noStroke();
        for (let i = 0; i < this.total; i++) {
            beginShape(TRIANGLE_STRIP);
            for (let j = 0; j < this.total + 1; j++) {
                let redValue = this.dataRed.charCodeAt(this.point);
                let greenValue = this.dataGreen.charCodeAt(this.point);
                let blueValue = this.dataBlue.charCodeAt(this.point);

                let red = map(redValue, this.range.red[0], this.range.red[1], 0, 255);
                let green = map(greenValue, this.range.green[0], this.range.green[1], 0, 255);
                let blue = map(blueValue, this.range.blue[0], this.range.blue[1], 0, 255);

                fill(red, green, blue);

                const v1 = this.globe[i][j];
                vertex(v1.x, v1.y, v1.z);
                const v2 = this.globe[i + 1][j];
                vertex(v2.x, v2.y, v2.z);
            }
            endShape();
            this.next();
        }
    }

    next() {
        this.point++;
        if (this.point > this.end) {
            this.point = 0;
        }
    }


} // Display