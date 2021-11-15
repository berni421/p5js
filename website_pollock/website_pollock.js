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
    // Redraw tree
    doGraph("plotItems");
}

function doItems() {
    print("doItems items.names[0]=", items.names[0]);

    createCanvas(MAXX, MAXY);
    blendMode(DIFFERENCE);

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

    graph = new DisplayPollock(name, data);
    for (var i = 0; i < 512; i++) {
        graph.plot();
        graph.next();
    }

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

class DisplayPollock {
    constructor(name, data) {
        this.point = 0; // current data point
        this.name = name; // the titile for data
        this.type = new Array('SPLAT', 'DRAG', 'SPILL');
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
        let size = 2;
        let dataXArray = dataAsciiOnly.filter((value, index) => dataFilter(index, 0, size));
        let dataYArray = dataAsciiOnly.filter((value, index) => dataFilter(index, 1, size));

        // Store data
        this.dataX = dataXArray.join("");
        this.dataY = dataYArray.join("");

        // reset data counts
        this.start = 0; // Colour data is now stripped of unwanted values
        // minimum size of data
        let xLength = this.dataX.length;
        let yLength = this.dataY.length;
        let sizes = [xLength, yLength];
        this.end = sizes.reduce((min, value) => minFilter(min, value), Infinity);
        print("end =", this.end);

        // Work out ranges of data
        let range = {
            x: [MAXX, 0],
            y: [MAXY, HEADER],
        };

        // Minimum Ranges
        let minXValue = dataXArray.reduce(((min, value) => minFilter(min, value.charCodeAt(0))), MAXX);
        let minYValue = dataYArray.reduce(((min, value) => minFilter(min, value.charCodeAt(0))), MAXY - HEADER);
        range.x[0] = minXValue;
        range.y[0] = minYValue;

        // Maximum Ranges
        let maxXValue = dataXArray.reduce(((max, value) => maxFilter(max, value.charCodeAt(0))), 0);
        let maxYValue = dataYArray.reduce(((max, value) => maxFilter(max, value.charCodeAt(0))), HEADER);
        range.x[1] = maxXValue;
        range.y[1] = maxYValue;

        this.range = range;
        print("Range =", this.range);
    }

    plot() {
        for (let i in this.type) {
            this.doPlot(this.type[i]);
            this.next();
        }
    }

    doPlot(type) {
        // Display splats, spills, and drags 
        let xValue = this.dataX.charCodeAt(this.point);
        let yValue = this.dataY.charCodeAt(this.point);

        let x = map(xValue, this.range.x[0], this.range.x[1], 0, MAXX);
        let y = map(yValue, this.range.y[0], this.range.y[1], HEADER, MAXY);

        let red = random(255);
        let green = random(255);
        let blue = random(255);

        function splat(x, y) {
            // blob of paint
            var width = random(100);
            var height = random(100);
            var seedx = width / 4;
            var seedy = height / 4;
            var dx, dy;
            var dwidth, dheight;

            fill(red, green, blue);
            noStroke();
            for (var i = 0; i < 10; i++) {
                if (y - height > HEADER) {
                    ellipse(x, y, width, height);
                }
                dx = random(0 - seedx, seedx);
                dy = random(0 - seedy, seedy);
                dwidth = random(0 - seedx, seedx);
                dheight = random(0 - seedy, seedy);
                x = x + dx;
                y = y + dy;
                width = width + dwidth;
                height = height + dheight;
            }
        }

        function spill(x, y) {
            // drops of paint
            var width = random(10);
            var height = random(10);
            var spread = 1.5;

            fill(red, green, blue);
            noStroke();
            for (var i = 0; i < 20; i++) {
                if (y - height > HEADER) {
                    ellipse(x, y, width, height);
                }
                var dx = random(-1 * spread * width, spread * width);
                var dy = random(-1 * spread * height, spread * height);
                x = x + dx;
                y = y + dy;
            }
        }

        function drag(x, y) {
            // thin line
            var width;
            var length = random(50);
            var dx, dy;

            stroke(red, green, blue);
            for (var i = 0; i < 10; i++) {
                dx = random(-1 * length, length);
                dy = random(-1 * length, length);
                width = random(1, 4);
                if (y + dy > HEADER) {
                    strokeWeight(width);
                    line(x, y, x + dx, y + dy);
                }
                x = x + dx;
                y = y + dy;
            }
        }
        //print("type=", type, "x=", x, "y=", y);

        switch (type) {
            case 'SPLAT':
                splat(x, y);
                break;
            case 'DRAG':
                drag(x, y);
                break;
            case 'SPILL':
                spill(x, y);
                break;
            default:
                print("case bad");
        }
        this.next();
    }

    next() {
        this.point++;
        if (this.point > this.end) {
            this.point = 0;
        }
    }


} // DisplayPollock