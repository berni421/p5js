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

function preload() {
    // handle asynchronous loading of external files using p5.js load tools in a blocking way
}

function setup() {
    items = new Data();
    items.loadItems()
        .then(_x => doItems());
}

function draw() {
    // Animation here in future
}

function mousePressed() {
    // Redraw
    items.next();
    doGraph("plotItems");
}

function doItems() {
    print("doItems items.names[0]=", items.names[0]);

    createCanvas(MAXX, MAXY);

    // set first graph
    doGraph("plotItems");
}

function doGraph(type) {
    let graph = {};

    function title() {
        background("black");
        // Title in Center at Top
        textSize(TEXTSIZE);
        textAlign(CENTER, TOP);
        stroke(255);
        strokeWeight(0);
        fill("white");
        let site = items.site;
        let name = items.names[site];
        text(name, MAXX / 2, 0);
        print("title=", name);
    }

    title();
    let site = items.site;
    let name = items.names[site];
    let data = items.data[site];
    let start = items.start[site];

    graph = new Display(name, data);
    graph.plot(graph);

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
        // print("fetch siteNames success", siteNames);
        // print(split(siteNames, "\n"));

        // load Sites
        for (let siteDetails of split(siteNames, "\n")) {
            if ("" !== siteDetails) {
                let site = split(siteDetails, ",");
                let siteName = site[0];
                if ("name" !== siteName) {
                    // load Site                
                    let fileName = "../data/" + site[1];
                    const siteData = await fetch(fileName)
                        .then(handleErrors)
                        .then(response => response.text())
                        .catch(error => console.error("siteData", fileName, error));
                    // print("fetch siteData success", siteData);
                    let s = this.sites; // starts at zero
                    this.names[s] = siteName;
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
        this.name = name; // the titile for data
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
        let size = 7;
        let dataProportionArray = dataAsciiOnly.filter((value, index) => dataFilter(index, 0, size));
        let dataRed1Array = dataAsciiOnly.filter((value, index) => dataFilter(index, 1, size));
        let dataGreen1Array = dataAsciiOnly.filter((value, index) => dataFilter(index, 2, size));
        let dataBlue1Array = dataAsciiOnly.filter((value, index) => dataFilter(index, 3, size));
        let dataRed2Array = dataAsciiOnly.filter((value, index) => dataFilter(index, 4, size));
        let dataGreen2Array = dataAsciiOnly.filter((value, index) => dataFilter(index, 5, size));
        let dataBlue2Array = dataAsciiOnly.filter((value, index) => dataFilter(index, 6, size));

        // Store data
        this.dataProportion = dataProportionArray.join("");
        this.data1Red = dataRed1Array.join("");
        this.data1Green = dataGreen1Array.join("");
        this.data1Blue = dataBlue1Array.join("");
        this.data2Red = dataRed2Array.join("");
        this.data2Green = dataGreen2Array.join("");
        this.data2Blue = dataBlue2Array.join("");


        // minimum size of data
        let proportionLength = this.dataProportion.length;
        let red1Length = this.data1Red.length;
        let green1Length = this.data1Green.length;
        let blue1Length = this.data1Blue.length;
        let red2Length = this.data2Red.length;
        let green2Length = this.data2Green.length;
        let blue2Length = this.data2Blue.length;
        let sizes = [
            proportionLength,
            red1Length,
            green1Length,
            blue1Length,
            red2Length,
            green2Length,
            blue2Length
        ];
        this.end = sizes.reduce((min, value) => minFilter(min, value), Infinity);
        print("end =", this.end);

        // starting data point
        this.start = 0; // data is now stripped of unwanted values
        this.point = random(this.end);


        // Work out ranges of data
        let range = {
            proportion: [255, 0],
            red1: [255, 0],
            green1: [255, 0],
            blue1: [255, 0],
            red2: [255, 0],
            green2: [255, 0],
            blue2: [255, 0]
        };

        // Minimum Ranges
        let minProportion = dataProportionArray.reduce(((min, value) => minFilter(min, value.charCodeAt(0))), 255);
        let minRed1Value = dataRed1Array.reduce(((min, value) => minFilter(min, value.charCodeAt(0))), 255);
        let minGreen1Value = dataGreen1Array.reduce(((min, value) => minFilter(min, value.charCodeAt(0))), 255);
        let minBlue1Value = dataBlue1Array.reduce(((min, value) => minFilter(min, value.charCodeAt(0))), 255);
        let minRed2Value = dataRed2Array.reduce(((min, value) => minFilter(min, value.charCodeAt(0))), 255);
        let minGreen2Value = dataGreen2Array.reduce(((min, value) => minFilter(min, value.charCodeAt(0))), 255);
        let minBlue2Value = dataBlue2Array.reduce(((min, value) => minFilter(min, value.charCodeAt(0))), 255);
        range.proportion[0] = minProportion;
        range.red1[0] = minRed1Value;
        range.green1[0] = minGreen1Value;
        range.blue1[0] = minBlue1Value;
        range.red2[0] = minRed2Value;
        range.green2[0] = minGreen2Value;
        range.blue2[0] = minBlue2Value;

        // Maximum Ranges
        let maxProportion = dataProportionArray.reduce(((max, value) => maxFilter(max, value.charCodeAt(0))), 0);
        let maxRed1Value = dataRed1Array.reduce(((max, value) => maxFilter(max, value.charCodeAt(0))), 0);
        let maxGreen1Value = dataGreen1Array.reduce(((max, value) => maxFilter(max, value.charCodeAt(0))), 0);
        let maxBlue1Value = dataBlue1Array.reduce(((max, value) => maxFilter(max, value.charCodeAt(0))), 0);
        let maxRed2Value = dataRed2Array.reduce(((max, value) => maxFilter(max, value.charCodeAt(0))), 0);
        let maxGreen2Value = dataGreen2Array.reduce(((max, value) => maxFilter(max, value.charCodeAt(0))), 0);
        let maxBlue2Value = dataBlue2Array.reduce(((max, value) => maxFilter(max, value.charCodeAt(0))), 0);
        range.proportion[1] = maxProportion;
        range.red1[1] = maxRed1Value;
        range.green1[1] = maxGreen1Value;
        range.blue1[1] = maxBlue1Value;
        range.red2[1] = maxRed2Value;
        range.green2[1] = maxGreen2Value;
        range.blue2[1] = maxBlue2Value;


        this.range = range;
        print("Range =", this.range);
    }

    plot() {
        // plot the shapes with random depth
        this.doPlot(0, HEADER, MAXX, MAXY - FOOTER, 0, random(3, 6));
    }

    doPlot(x, y, width, height, direction, level) {
        let proportion;
        let red1;
        let green1;
        let blue1;
        let red2;
        let green2;
        let blue2;

        stroke(0);

        function getData(me) {
            let proportionValue = me.dataProportion.charCodeAt(me.point);
            let red1Value = me.data1Red.charCodeAt(me.point);
            let green1Value = me.data1Green.charCodeAt(me.point);
            let blue1Value = me.data1Red.charCodeAt(me.point);
            let red2Value = me.data1Red.charCodeAt(me.point);
            let green2Value = me.data1Green.charCodeAt(me.point);
            let blue2Value = me.data1Red.charCodeAt(me.point);

            proportion = map(proportionValue, me.range.proportion[0], me.range.proportion[1], 0, 1, true); // Value between 0 and 1
            red1 = map(red1Value, me.range.red1[0], me.range.red1[1], 0, 255);
            green1 = map(green1Value, me.range.green1[0], me.range.green1[1], 0, 255);
            blue1 = map(blue1Value, me.range.blue1[0], me.range.blue1[1], 0, 255);
            red2 = map(red2Value, me.range.red2[0], me.range.red2[1], 0, 255);
            green2 = map(green2Value, me.range.green2[0], me.range.green2[1], 0, 255);
            blue2 = map(blue2Value, me.range.blue2[0], me.range.blue2[1], 0, 255);

            // print(proportion, red1, green1, blue1, red2, green2, blue2);
        }

        if (level > 0) {
            switch (direction) {
                case 0:
                    // box to the east
                    getData(this);

                    strokeWeight(4);
                    fill(red1, green1, blue1);
                    fill(red1, 0, 0);
                    // fill(red1, 0, 0);
                    rect(x + width * proportion, y, width - width * proportion, height);
                    this.doPlot(x + width * proportion, y, width - width * proportion, height, 90, level - 1);

                    // box to the west
                    strokeWeight(4);
                    fill(red1, green1, blue1);
                    fill(0, green1, 0);
                    rect(x, y, width * proportion, height);
                    this.doPlot(x, y, width * proportion, height, 90, level - 1);

                    this.next();

                    break;
                case 90:
                    getData(this, this.point);

                    // box to the north
                    strokeWeight(4);
                    fill(red2, green2, blue2);
                    fill(0, 0, blue2);
                    // fill(0, 0, blue2);
                    rect(x, y, width, height * proportion);
                    this.doPlot(x, y, width, height * proportion, 0, level - 1);

                    // box to the souths
                    strokeWeight(4);
                    fill(red2, green2, blue2);
                    rect(x, y + height * proportion, width, height - height * proportion)
                    this.doPlot(x, y + height * proportion, width, height - height * proportion, 0, level - 1);

                    this.next();

                    break;
            }
        }
    }

    next() {
        this.point++;
        if (this.point > this.end) {
            this.point = this.start;
        }
    }
} // DisplayTree
