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

    graph = new DisplayTree(name, data);
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

        const siteNames = await fetch('data/site-names.csv')
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
                    let fileName = "data/" + site[1];
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

class DisplayTree {
    constructor(name, data) {
        this.point = 0; // current data point
        this.x = MAXX / 2;     // middle
        this.y = MAXY - FOOTER // bottom and up a bit for footer
        this.name = name; // the titile for data
        this.branchLimit = 1000; // Number of branches
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
        let size = 5;
        let dataBranchNumberArray = dataAsciiOnly.filter((value, index) => dataFilter(index, 0, size));
        let dataBranchSizeArray = dataAsciiOnly.filter((value, index) => dataFilter(index, 1, size));
        let dataRedArray = dataAsciiOnly.filter((value, index) => dataFilter(index, 2, size));
        let dataGreenArray = dataAsciiOnly.filter((value, index) => dataFilter(index, 3, size));
        let dataBlueArray = dataAsciiOnly.filter((value, index) => dataFilter(index, 4, size));

        // Store data
        this.dataBranchNumber = dataBranchNumberArray.join("");
        this.dataBranchSize = dataBranchSizeArray.join("");
        this.dataRed = dataRedArray.join("");
        this.dataGreen = dataGreenArray.join("");
        this.dataBlue = dataBlueArray.join("");

        // reset data counts
        this.start = 0; // Colour data is now stripped of unwanted values
        // minimum size of data
        let branchNumberLength = this.dataBranchNumber.length;
        let branchSizeLength = this.dataBranchSize.length;
        let redLength = this.dataRed.length;
        let greenLength = this.dataGreen.length;
        let blueLength = this.dataBlue.length;
        let sizes = [branchNumberLength, branchSizeLength, redLength, greenLength, blueLength];
        this.end = sizes.reduce((min, value) => minFilter(min, value), Infinity);
        print("end =", this.end);

        // Work out ranges of data
        let range = {
            branchNumber: [255, 0],
            branchSize: [255, 0],
            red: [255, 0],
            green: [255, 0],
            blue: [255, 0]
        };

        // Minimum Ranges
        let minBranchNumber = dataBranchNumberArray.reduce(((min, value) => minFilter(min, value.charCodeAt(0))), 255);
        let minBranchSize = dataBranchSizeArray.reduce(((min, value) => minFilter(min, value.charCodeAt(0))), 255);
        let minRedValue = dataRedArray.reduce(((min, value) => minFilter(min, value.charCodeAt(0))), 255);
        let minGreenValue = dataGreenArray.reduce(((min, value) => minFilter(min, value.charCodeAt(0))), 255);
        let minBlueValue = dataBlueArray.reduce(((min, value) => minFilter(min, value.charCodeAt(0))), 255);
        range.branchNumber[0] = minBranchNumber;
        range.branchSize[0] = minBranchSize;
        range.red[0] = minRedValue;
        range.green[0] = minGreenValue;
        range.blue[0] = minBlueValue;

        // Maximum Ranges
        let maxBranchNumber = dataBranchNumberArray.reduce(((max, value) => maxFilter(max, value.charCodeAt(0))), 0);
        let maxBranchSize = dataBranchSizeArray.reduce(((max, value) => maxFilter(max, value.charCodeAt(0))), 0);
        let maxRedValue = dataRedArray.reduce(((max, value) => maxFilter(max, value.charCodeAt(0))), 0);
        let maxGreenValue = dataGreenArray.reduce(((max, value) => maxFilter(max, value.charCodeAt(0))), 0);
        let maxBlueValue = dataBlueArray.reduce(((max, value) => maxFilter(max, value.charCodeAt(0))), 0);
        range.branchNumber[1] = maxBranchNumber;
        range.branchSize[1] = maxBranchSize;
        range.red[1] = maxRedValue;
        range.green[1] = maxGreenValue;
        range.blue[1] = maxBlueValue;

        this.range = range;
        print("Range =", this.range);
    }

    plot() {
        this.doPlot(0);
    }

    doPlot(level) {
        // Display Branches
        let branchNumberValue = this.dataBranchNumber.charCodeAt(this.point);
        let branchSizeValue = this.dataBranchSize.charCodeAt(this.point);

        let branchNumber = map(branchNumberValue, this.range.branchSize[0], this.range.branchSize[1], 2, 20); // 2 to 10 branches per bunch
        let branchSize = map(branchSizeValue, this.range.branchSize[0], this.range.branchSize[1], 20, 40); // 10 to 30 pixels long

        let redValue = this.dataRed.charCodeAt(this.point);
        let greenValue = this.dataGreen.charCodeAt(this.point);
        let blueValue = this.dataBlue.charCodeAt(this.point);

        let red = map(redValue, this.range.red[0], this.range.red[1], 0, 255);
        let green = map(greenValue, this.range.green[0], this.range.green[1], 0, 255);
        let blue = map(blueValue, this.range.blue[0], this.range.blue[1], 0, 255);

        /*
         * 
         *        branch starts where last branch ended.
         *        suggests recursion ..
         *        depth = bounded by screen
         *        number of branches/angles random 1-6 over 160 degrees upwards fan
         *        plot(FromHere) ->
         *            for branches in random 1-6;
         *            do plotBranch(FromHere, ToBranchHere)
         *                if still on screen then plot(ToBranchHere)
         *                    plot(start) ->
         *                    plot(bottom middle of screen);
         */
        function branchOnScreen(x, y, toX, toY) {
            // check if whole of branch is on screen
            let fromOnScreen = (x >= 0 && x <= MAXX && y >= HEADER && y <= MAXY);
            let toOnScreen = (toX >= 0 && toX <= MAXX && toY >= HEADER && toY <= MAXY);
            return (fromOnScreen && toOnScreen);
        }

        function wantBranch(level, levelLimit) {
            // check on branch hight and random check on branch to allow light through
            if (0 == level) {
                return true;
            } else if (level < levelLimit) {
                return random(1) <= (0.5 / level); // allow some gaps - more gaps in canopy
            }
            return false;
        }

        // Plot branches fanning over 90 degrees
        let branchAngle = 90 / branchNumber;
        let x = this.x;
        let y = this.y;
        for (let b = 0; b < branchNumber; b++) {
            // First level always one branch
            let startAngle = -90;
            if (0 == level) {
                branchNumber = 0; // end loop after one iteration branch
                startAngle = -90;
            } else {
                startAngle = -90 - branchAngle * (branchNumber / 2);
            }
            // draw this branch
            let branch = p5.Vector.fromAngle(radians(startAngle + branchAngle * b), branchSize);
            let toX = x + branch.x;
            let toY = y + branch.y;
            if (wantBranch(level, 12) && branchOnScreen(x, y, toX, toY)) {
                stroke(red, green, blue);
                strokeWeight(4);
                line(x, y, toX, toY);
                // next branch runs from end of this one
                if (0 < this.branchLimit) {
                    this.branchLimit--;
                    this.x = toX;
                    this.y = toY;
                    if (0 !== level) {
                        this.next();
                    }
                    this.doPlot(level + 1);
                }
            }
        }
    }

    next() {
        this.point++;
        if (this.point > this.end) {
            this.point = 0;
        }
    }


} // DisplayTree
