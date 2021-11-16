/*
 *  various plots of data scraped from websites.
 */

const MAXX = 512;
const MAXY = MAXX;
const POINTSIZE = 4;
const TEXTSIZE = 18;
const HEADER = 50;
const FOOTER = 50;

var items; // data
var choices; // options

function preload() {
    // handle asynchronous loading of external files in a blocking way
}

function setup() {
    choices = new Input();
    items = new Data();
    items.loadItems()
        .then(_x => doItems());

    function doItems() {
        print("doItems items.names[0]=", items.names[0]);

        createCanvas(MAXX, MAXY);
        resizeCanvas(MAXX, MAXY);

        // buttons
        choices.plotButton(doGraph);
        choices.traceButton(doGraph);
        choices.spiralButton(doGraph);
        choices.nextButton(doGraph);

        // set first graph
        doGraph("spiralItems");
    }

    function doGraph(type) {
        let graph = {};

        function title() {
            background("black");
            // Title in Center at Top
            textSize(TEXTSIZE);
            textAlign(CENTER, TOP);
            fill("white");
            let site = items.site;
            let name = items.names[site];
            text(name, MAXX / 2, 0);
            print("title=", name);
        }

        function nextItem() {
            // Move to next data set  
            items.next();
            if ("plotItems" == choices.lastChoice) {
                doGraph("plotItems");
            } else if ("traceItems" == choices.lastChoice) {
                doGraph("traceItems");
            } else if ("spiralItems" == choices.lastChoice) {
                doGraph("spiralItems");
            }
            print("next Done");
        }

        function plot(graph) {
            // Plot each data point
            while (!graph.IsFinished()) {
                graph.plot();
                graph.next();
            }
        }

        title();
        let site = items.site;
        let name = items.names[site];
        let data = items.data[site];
        let start = items.start[site];

        switch (type) {
            case "plotItems":
                graph = new DisplayPlot(name, data);
                plot(graph);
                choices.lastChoice = type;
                break;
            case "traceItems":
                graph = new DisplayTrace(name, data);
                plot(graph);
                choices.lastChoice = type;
                break;
            case "spiralItems":
                graph = new DisplaySpiral(name, data);
                plot(graph);
                choices.lastChoice = type;
                break;
            case "nextItems":
                nextItem();
                break;
            default:
                exit("plotItems type error");
        }
        print(type + " Done");
    }
}

function draw() {
    // Animation here in future
}

class Input {
    constructor() {
        this.lastChoice = "plotItems";
    }

    plotButton(_callback) {
        this.plot = createButton("Plot Colours");
        this.plot.position(0, HEADER - this.plot.height);
        this.plot.mousePressed(function () { _callback("plotItems"); });
    }
    traceButton(_callback) {
        this.trace = createButton("Show Trace");
        this.trace.position(0, HEADER - this.plot.height + this.trace.height);
        this.trace.mousePressed(function () { _callback("traceItems"); });
    }
    spiralButton(_callback) {
        this.spiral = createButton("Spiral");
        this.spiral.position(0, HEADER - this.plot.height + this.trace.height + this.spiral.height);
        this.spiral.mousePressed(function () { _callback("spiralItems"); });
    }
    nextButton(_callback) {
        this.next = createButton("Next Data Set");
        this.next.position(width - this.next.width, HEADER - this.plot.height);
        this.next.mousePressed(function () { _callback("nextItems"); });
    }
} // Input

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

// Various fucntions used by the Classes

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

function colourFilter(index, pos) {
    return (index + pos) % 3 == 0;
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

class DisplayPlot {
    constructor(name, data) {
        this.point = 0; // initial data point
        this.x = 0;     // current x
        this.y = HEADER;  // position y below the title
        this.name = name; // the titile for data
        this.prepare(data); // Check data and resize
    }

    prepare(data) {
        // Locate a useful start of data
        let start = findStart(data);
        let end = data.length;
        let dataInteresting = data.substring(start, end);
        let dataInterestingString = dataInteresting.split("");

        // discard non ascii characters
        let dataAsciiOnly = dataInterestingString.filter(value => Ascii(value.charCodeAt(0)));

        // Extract colour channels
        let dataRedArray = dataAsciiOnly.filter((value, index) => colourFilter(index, 0));
        let dataGreenArray = dataAsciiOnly.filter((value, index) => colourFilter(index, 1));
        let dataBlueArray = dataAsciiOnly.filter((value, index) => colourFilter(index, 2));

        // Store colour data
        this.dataRed = dataRedArray.join("");
        this.dataGreen = dataGreenArray.join("");
        this.dataBlue = dataBlueArray.join("");

        // reset data counts
        this.start = 0; // Colour data is now stripped of unwanted values
        // minimum size of data
        let redLength = this.dataRed.length;
        let greenLength = this.dataGreen.length;
        let blueLength = this.dataBlue.length;
        this.end = [redLength, greenLength, blueLength].reduce((min, value) => minFilter(min, value), Infinity);
        print("end =", this.end);

        // Work out ranges
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
        // Display data point with red green blue colours, over entire screen
        let redValue = this.dataRed.charCodeAt(this.point);
        let greenValue = this.dataGreen.charCodeAt(this.point);
        let blueValue = this.dataBlue.charCodeAt(this.point);

        let red = map(redValue, this.range.red[0], this.range.red[1], 0, 255);
        let green = map(greenValue, this.range.green[0], this.range.green[1], 0, 255);
        let blue = map(blueValue, this.range.blue[0], this.range.blue[1], 0, 255);

        fill(red, green, blue);
        noStroke();
        circle(this.x + POINTSIZE / 2, this.y + POINTSIZE / 2, POINTSIZE);
        if (0 == this.x && HEADER == this.y) {
            print(
                "point=", this.point,
                "x=", this.x,
                "y=", this.y,
                "red=", redValue,
                "green=", greenValue,
                "blue=", blueValue
            );
        }
        if (isNaN(red)) {
            print("red =", red,
                "point=", this.point
            );
        }
    }

    next() {
        // Move one data point foward
        // one point to right, until end of line
        this.x = this.x + POINTSIZE;
        if (this.x > MAXX - POINTSIZE) {
            // one down, fill screen and stop
            this.x = 0;
            this.y = this.y + POINTSIZE;
        }
        this.point++;
    }

    IsFinished() {
        // Finished when at end of data, or screen
        let dataConsumed = (this.point >= this.end);
        if (dataConsumed) {
            // start again
            this.point = 0;
        }
        let screenFilled = (this.y > MAXY - FOOTER); // leave a gap at bottom for buttons

        return screenFilled;
    }
} // DisplayPlot

class DisplayTrace {
    constructor(name, data) {
        this.point = 0; // current data point
        this.x = 0;     // current x
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
        let dataValueArray = dataAsciiOnly.filter((value, index) => colourFilter(index, 0));
        let dataRedArray = dataAsciiOnly.filter((value, index) => colourFilter(index, 1));
        let dataGreenArray = dataAsciiOnly.filter((value, index) => colourFilter(index, 2));
        let dataBlueArray = dataAsciiOnly.filter((value, index) => colourFilter(index, 3));

        // Store colour data
        this.dataValue = dataValueArray.join("");
        this.dataRed = dataRedArray.join("");
        this.dataGreen = dataGreenArray.join("");
        this.dataBlue = dataBlueArray.join("");

        // reset data counts
        this.start = 0; // Colour data is now stripped of unwanted values
        // minimum size of data
        let valueLength = this.dataValue.length;
        let redLength = this.dataRed.length;
        let greenLength = this.dataGreen.length;
        let blueLength = this.dataBlue.length;
        this.end = [valueLength, redLength, greenLength, blueLength].reduce((min, value) => minFilter(min, value), Infinity);
        print("end =", this.end);

        // Work out ranges of data
        let range = {
            value: [255, 0],
            red: [255, 0],
            green: [255, 0],
            blue: [255, 0]
        };

        // Minimum Ranges
        let minValue = dataValueArray.reduce(((min, value) => minFilter(min, value.charCodeAt(0))), 255);
        let minRedValue = dataRedArray.reduce(((min, value) => minFilter(min, value.charCodeAt(0))), 255);
        let minGreenValue = dataGreenArray.reduce(((min, value) => minFilter(min, value.charCodeAt(0))), 255);
        let minBlueValue = dataBlueArray.reduce(((min, value) => minFilter(min, value.charCodeAt(0))), 255);
        range.value[0] = minValue;
        range.red[0] = minRedValue;
        range.green[0] = minGreenValue;
        range.blue[0] = minBlueValue;

        // Maximum Ranges 
        let maxValue = dataValueArray.reduce(((max, value) => maxFilter(max, value.charCodeAt(0))), 0);
        let maxRedValue = dataRedArray.reduce(((max, value) => maxFilter(max, value.charCodeAt(0))), 0);
        let maxGreenValue = dataGreenArray.reduce(((max, value) => maxFilter(max, value.charCodeAt(0))), 0);
        let maxBlueValue = dataBlueArray.reduce(((max, value) => maxFilter(max, value.charCodeAt(0))), 0);
        range.value[1] = maxValue;
        range.red[1] = maxRedValue;
        range.green[1] = maxGreenValue;
        range.blue[1] = maxBlueValue;

        this.range = range;
        print("Range =", this.range);
    }

    plot() {
        // Display data as a single trace accross the screen middle
        let value = this.dataValue.charCodeAt(this.point);

        let redValue = this.dataRed.charCodeAt(this.point);
        let greenValue = this.dataGreen.charCodeAt(this.point);
        let blueValue = this.dataBlue.charCodeAt(this.point);

        let red = map(redValue, this.range.red[0], this.range.red[1], 0, 255);
        let green = map(greenValue, this.range.green[0], this.range.green[1], 0, 255);
        let blue = map(blueValue, this.range.blue[0], this.range.blue[1], 0, 255);

        let min = this.range.value[0];
        let max = this.range.value[1];
        let midPoint = (min + max) / 2;
        let lineLength = map(value, this.range.value[0], this.range.value[1], -height / 3, height / 3);

        stroke(red, green, blue);
        line(
            this.x,
            height / 2 - lineLength / 2,
            this.x,
            height / 2 + lineLength / 2
        );

        if (0 == this.x) {
            print(
                "point=", this.point,
                "x=", this.x,
                "value=", value,
                "red=", redValue,
                "green=", greenValue,
                "blue=", blueValue
            );
        }
        if (isNaN(red)) {
            print("red =", red,
                "point=", this.point
            );
        }
    }

    next() {
        // Move one pont to right
        this.x++;
        this.point++;
    }

    IsFinished() {
        let screenFilled = (this.x > MAXX);
        let dataConsumed = (this.point >= this.end);
        if (dataConsumed) {
            // start again
            this.point = 0;
        }
        return screenFilled;
    }
} // DisplayTrace


class DisplaySpiral {
    constructor(name, data) {
        this.point = 0; // current data point
        this.x = MAXX / 2;
        this.y = MAXY / 2;
        this.name = name; // the titile for data
        this.angle = 1;
        this.speed = 0.05;
        this.scalar = 3.5;
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

        // Extract colour channels
        let dataRedArray = dataAsciiOnly.filter((value, index) => colourFilter(index, 0));
        let dataGreenArray = dataAsciiOnly.filter((value, index) => colourFilter(index, 1));
        let dataBlueArray = dataAsciiOnly.filter((value, index) => colourFilter(index, 2));

        // Store colour data
        this.dataRed = dataRedArray.join("");
        this.dataGreen = dataGreenArray.join("");
        this.dataBlue = dataBlueArray.join("");

        // reset data counts
        this.start = 0; // Colour data is now stripped of unwanted values
        // minimum size of data
        let redLength = this.dataRed.length;
        let greenLength = this.dataGreen.length;
        let blueLength = this.dataBlue.length;
        this.end = [redLength, greenLength, blueLength].reduce((min, value) => minFilter(min, value), Infinity);
        print("end =", this.end);

        // Work out ranges
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
        // Display data point with red green blue colours, over entire screen
        let redValue = this.dataRed.charCodeAt(this.point);
        let greenValue = this.dataGreen.charCodeAt(this.point);
        let blueValue = this.dataBlue.charCodeAt(this.point);

        let red = map(redValue, this.range.red[0], this.range.red[1], 0, 255);
        let green = map(greenValue, this.range.green[0], this.range.green[1], 0, 255);
        let blue = map(blueValue, this.range.blue[0], this.range.blue[1], 0, 255);

        this.x = MAXX / 2 + cos(this.angle) * this.scalar;
        this.y = MAXY / 2 + sin(this.angle) * this.scalar;

        fill(red, green, blue);
        noStroke();
        ellipse(this.x, this.y, 5, 5);

        if (0 == this.Value) {
            print(
                "point=", this.point,
                "x=", this.x,
                "y=", this.y,
                "red=", redValue,
                "green=", greenValue,
                "blue=", blueValue
            );
        }
    }

    next() {
        // Move one pont to right
        this.angle += this.speed;
        this.scalar += this.speed;
        this.point++;
    }

    IsFinished() {
        let dataConsumed = (this.point > this.end);
        if (dataConsumed) {
            // start again
            this.point = 0;
        }

        let screenFilled = (this.x > MAXX || this.y > MAXY - FOOTER);
        return screenFilled;
    }
} // DisplayTrace
