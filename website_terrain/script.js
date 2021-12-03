

/*
 *  various plots of data scraped from websites.
 */

var MAXX;
var MAXY;
var MAXZ;
const POINTSIZE = 4;
const TEXTSIZE = 16;
const HEADER = 50;
const FOOTER = 50;

var items; // raw data
var choices; // options
var myFont; // for WEBGL text
var graph = undefined; // current graph data
var noDraw = true;

function preload() {
    // handle asynchronous loading of external files using p5.js load tools in a blocking way
    myFont = loadFont('../fonts/DejaVuSerif.ttf');
}

function setup() {

    MAXX = windowWidth;
    MAXY = MAXX;
    MAXZ = MAXX;
    
    createCanvas(MAXX, MAXY, WEBGL);
    //frameRate(1);
    
    textFont(myFont);
    items = new Data();
    items.loadItems()
        .then(_x => doItems());
}

function draw() {
    if ( ! noDraw ) {
        doItems();
    }
}

function mousePressed() {
    items.next();
    graph = undefined;
    doItems();
}

function doItems() {
    print("doItems items.names[0]=", items.names[0]);

    // set first graph
    function title() {
        background("black");
        // Title in Center at Top
        textSize(TEXTSIZE);
        fill("white");
        let site = items.site;
        let name = items.names[site];
        push();
            rotateX(-PI/7);
            text(name, -textWidth(name) / 2, -MAXY / 2 + TEXTSIZE);
        pop();
        print("title=", name);
    }

    let site = items.site;
    let name = items.names[site];
    let data = items.data[site];
    
    camera(
        0, MAXY / 2, MAXY / 2,
        0, 0, 0,
        0, 1, 0);

    title();
    
    if (graph === undefined) {
        graph = new Display(name, data);
    }
    doGraph(graph);
    noDraw = false; 
}


function doGraph() {
    var savePoint = graph.point;
    graph.plot();
    graph.point = savePoint;
    graph.prev();
    graph.prev();

}

class Data {
    constructor() {
        this.names = []; // array of data names
        this.data = [];  // array of site data
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
                const name = site[0];
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
        this.scl = 10;
        this.cols = MAXX / this.scl;
        this.rows = MAXY / this.scl;
        this.flying = 0
        this.terrain = [];
        for (var x = 0; x < this.cols; x++) {
            this.terrain[x] = [];
            for (var y = 0; y < this.rows; y++) {
                this.terrain[x][y] = 0; //specify a default value for now
            }
        }
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
    }

    plot() {
        this.flying -= 0.1;
        var yoff = this.flying;
        for (var y = 0; y < this.rows; y++) {
            var xoff = 0;
            for (var x = 0; x < this.cols; x++) {
                this.terrain[x][y] = map(noise(xoff, yoff), 0, 1, -windowHeight, windowHeight);
                xoff += 0.05;
            }
            yoff += 0.05;
        }
        
        translate(-MAXX / 2, -MAXY / 2);
        for (var y = 0; y < this.rows - 1; y++) {
            beginShape(TRIANGLE_STRIP);
            
            let redValue = this.dataRed.charCodeAt(this.point);
            let greenValue = this.dataGreen.charCodeAt(this.point);
            let blueValue = this.dataBlue.charCodeAt(this.point);
            
            let red = map(redValue, this.range.red[0], this.range.red[1], 0, 255);
            let green = map(greenValue, this.range.green[0], this.range.green[1], 0, 255);
            let blue = map(blueValue, this.range.blue[0], this.range.blue[1], 0, 255);
            
            fill(red, green, blue);
            
            for (var x = 0; x < this.cols; x++) {
                vertex(x * this.scl, y * this.scl, this.terrain[x][y]);
                vertex(x * this.scl, (y + 1) * this.scl, this.terrain[x][y + 1]);
            }
            
            endShape();
            this.next();
        }
    }
    
    prev() {
        this.point--;
        if (this.point < 0 ) {
            this.point = this.end;
        }
    }

    next() {
        this.point++;
        if (this.point > this.end) {
            this.point = 0;
        }
    }


} // Display
