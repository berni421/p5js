var myFont;
var dateTime;
var dayName = [];
var dayPeriod = [];
var dayMonth = [];

function preload() {}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(1);
  textAlign(CENTER, CENTER);
  fill('white');
  dayName[0] = "Sunday";
  dayName[1] = "Monday";
  dayName[2] = "Tuesday";
  dayName[3] = "Wednesday";
  dayName[4] = "Thursday";
  dayName[5] = "Friday";
  dayName[6] = "Saturday";
  for (var i = 0; i < 12; i++) {
    dayPeriod[i] = "Morning";
  }
  for (var i = 12; i < 18; i++) {
    dayPeriod[i] = "Afternoon";
  }
  for (var i = 18; i < 24; i++) {
    dayPeriod[i] = "Evening";
  }
  dayMonth[0] = "January";
  dayMonth[1] = "Febuary";
  dayMonth[2] = "March";
  dayMonth[3] = "April";
  dayMonth[4] = "May";
  dayMonth[5] = "June";
  dayMonth[6] = "July";
  dayMonth[7] = "August";
  dayMonth[8] = "September";
  dayMonth[9] = "October";
  dayMonth[10] = "November";
  dayMonth[11] = "December";
}

function draw() {
  background(0);
  const dateTime = new Date();
  const dayOfWeek = dateTime.getDay(); // Sunday - Saturday : 0 - 6
  const month = dateTime.getMonth();
  const year = dateTime.getFullYear();
  const day = dateTime.getDate();
  var hour = dateTime.getHours();
  const hours = hour;
  var dayAMPM = "AM";
  if (hour > 11) {
    dayAMPM = "PM";
  }
  if (hour > 12) {
    hour = hour - 12;
  }
  const minute = dateTime.getMinutes();
  const second = dateTime.getSeconds();
  var hourPad = "";
  var minutePad = "";
  var secondPad = "";
  var dayPad = "";
  var monthPad = "";
  //    if (hour < 10) { hourPad = "0"; }
  if (minute < 10) {
    minutePad = "0";
  }
  if (second < 10) {
    secondPad = "0";
  }
  if (day < 10) {
    dayPad = "0";
  }
  var time = hourPad + hour + ":" +
    minutePad + minute + ":" +
    secondPad + second + " " + dayAMPM;
  var date = dayPad + day + " " +
    monthPad + dayMonth[month] + " " +
    year;
  textSize(width * 0.1);
  text(time, width / 2, height * 0.25);
  textSize(width * 0.075);
  text(dayName[dayOfWeek] + " " + dayPeriod[hours], width / 2, height * 0.5);
  text(date, width / 2, height * 0.75);
}