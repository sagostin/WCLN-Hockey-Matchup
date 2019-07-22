/**
 * WCLN.ca
 * Hockey Matchup
 * @author Shaun Agostinho (shaunagostinho@gmail.com)
 * July 2019
 */

let FPS = 24;
let gameStarted = false;
let STAGE_WIDTH, STAGE_HEIGHT;
let score;
let level;
let question;
let numbers = [];
let stage = new createjs.Stage("gameCanvas"); // canvas id is gameCanvas

/*
 * Called by body onload
 */
function init() {
    STAGE_WIDTH = parseInt(document.getElementById("gameCanvas").getAttribute("width"));
    STAGE_HEIGHT = parseInt(document.getElementById("gameCanvas").getAttribute("height"));

    // init state object
    stage.mouseEventsEnabled = true;
    stage.enableMouseOver(); // Default, checks the mouse 20 times/second for hovering cursor changes

    setupManifest(); // preloadJS
    startPreload();

    score = 0; // reset game score
    level = 0;
    question = 0;

    stage.update();
}

/*
 * Displays the end game screen and score.
 */
function endGame() {
    gameStarted = false;
}

function imageClickHandler(event) {
    event.target.x = event.stageX;
    event.target.y = event.stageY;

    console.log("test");
}

// bitmap letiables
let background;
let logo;
let pylons = [];
let pylonText = [];
let numberBoxes = [];
let pylonContainer = [];

function setupManifest() {
    manifest = [
        {
            src: "img/bg.png",
            id: "background"
        },
        {
            src: "img/logo.png",
            id: "logo"
        },
        {
            src: "img/pylon.png",
            id: "pylon"
        },
        {
            src: "img/number-box.png",
            id: "number-box"
        }
    ];
}

function startPreload() {
    let preload = new createjs.LoadQueue(true);
    preload.installPlugin(createjs.Sound);
    preload.on("fileload", handleFileLoad);
    preload.on("progress", handleFileProgress);
    preload.on("complete", loadComplete);
    preload.on("error", loadError);
    preload.loadManifest(manifest);
}

function update(event) {

    stage.update(event);
}

// not currently used as load time is short
function handleFileProgress(event) {
    /*progressText.text = (preload.progress*100|0) + " % Loaded";
    progressText.x = STAGE_WIDTH/2 - progressText.getMeasuredWidth() / 2;
    stage.update();*/
}

function handleFileLoad(event) {
    console.log("A file has loaded of type: " + event.item.type);
    // create bitmaps of images
    if (event.item.id == "background") {
        background = new createjs.Bitmap(event.result);
    }
    if (event.item.id == "logo") {
        logo = new createjs.Bitmap(event.result);
    }
    if (event.item.id == "pylon") {
        for (let i = 0; i < 5; i++) {
            pylons.push(new createjs.Bitmap(event.result));
        }
    }
    if (event.item.id == "number-box") {
        for (let i = 0; i < 5; i++) {
            numberBoxes.push(new createjs.Bitmap(event.result));
        }
    }
}

function loadError(evt) {
    console.log("Error!", evt.text);
}

/*
 * Displays the start screen.
 */
function loadComplete(event) {
    console.log("Finished Loading Assets");

    createjs.Ticker.setFPS(FPS);
    createjs.Ticker.addEventListener("tick", update); // call update function

    stage.addChild(background);
    stage.addChild(logo);

    generateNumbers();
    initGraphics();
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function generateNumbers() {
    for (let i = 0; i < 5; i++) {
        numbers.push(getRandomInt(10));
    }
}

function initGraphics() {

    for (let i = 0; i < numberBoxes.length; i++) {
        numberBoxes[i].scaleX = 2;
        numberBoxes[i].scaleY = 2;
        numberBoxes[i].y = 425;

        switch (i) {
            case 0:
                numberBoxes[i].x = (STAGE_WIDTH / 2) - (numberBoxes[i].image.width * (6));
                break;
            case 1:
                numberBoxes[i].x = (STAGE_WIDTH / 2) - (numberBoxes[i].image.width * (4)) + (numberBoxes[i].image.width / 1.5);
                break;
            case 2:
                //CENTER
                numberBoxes[i].x = (STAGE_WIDTH / 2) - (numberBoxes[i].image.width);
                break;
            case 3:
                numberBoxes[i].x = (STAGE_WIDTH / 2) + (numberBoxes[i].image.width * (2)) - (numberBoxes[i].image.width / 1.5);
                break;
            case 4:
                numberBoxes[i].x = (STAGE_WIDTH / 2) + (numberBoxes[i].image.width * (4));
                break;
        }

        stage.addChild(numberBoxes[i]);

        console.log("numberBoxes" + i);
    }

    for (let i = 0; i < pylons.length; i++) {
        pylons[i].scaleX = 0.2;
        pylons[i].scaleY = 0.2;

        pylonText[i] = new createjs.Text(numbers[i] + "", "50px Arial", "#FFFFFF");
        pylonText[i].textBaseline = "alphabetic";

        switch (i) {
            case 0:
                pylons[i].x = (STAGE_WIDTH / 2) - ((pylons[i].image.width * pylons[i].scaleX / 2) * (6)) + ((pylons[i].image.width * pylons[i].scaleX / 2) / 1.5);
                pylons[i].y = 250;

                pylonText[i].x = (STAGE_WIDTH / 2) - (72 / 6) - ((pylons[i].image.width * pylons[i].scaleX / 2) * (4)) - 20;
                pylonText[i].y = 350 + 60;

                break;
            case 1:
                pylons[i].x = (STAGE_WIDTH / 2) - ((pylons[i].image.width * pylons[i].scaleX / 2) * (4)) + ((pylons[i].image.width * pylons[i].scaleX / 2) / 1.5);
                pylons[i].y = 225;

                pylonText[i].x = (STAGE_WIDTH / 2) - (72 / 6) - ((pylons[i].image.width * pylons[i].scaleX / 2) * (2)) - 20;
                pylonText[i].y = 325 + 60;

                break;
            case 2:
                //CENTER
                pylons[i].x = (STAGE_WIDTH / 2) - (pylons[i].image.width * pylons[i].scaleX / 2);
                pylons[i].y = 200;

                pylonText[i].x = (STAGE_WIDTH / 2) - (72 / 6);
                pylonText[i].y = 300 + 60;

                break;
            case 3:
                pylons[i].x = (STAGE_WIDTH / 2) + ((pylons[i].image.width * pylons[i].scaleX / 2) * (2)) - ((pylons[i].image.width * pylons[i].scaleX / 2) / 1.5);
                pylons[i].y = 225;

                pylonText[i].x = (STAGE_WIDTH / 2) - (72 / 6) + ((pylons[i].image.width * pylons[i].scaleX / 2) * (2)) + 20;
                pylonText[i].y = 325 + 60;

                break;
            case 4:
                pylons[i].x = (STAGE_WIDTH / 2) + ((pylons[i].image.width * pylons[i].scaleX / 2) * (4)) - ((pylons[i].image.width * pylons[i].scaleX / 2) / 1.5);
                pylons[i].y = 250;

                pylonText[i].x = (STAGE_WIDTH / 2) - (72 / 6) + ((pylons[i].image.width * pylons[i].scaleX / 2) * (4)) + 20;
                pylonText[i].y = 350 + 60;

                break;
        }

        pylonContainer.push(new createjs.Container());

        pylonContainer[i].on("click", function (event) {
            imageClickHandler(event);
        });

        pylonContainer[i].addChild(pylons[i], pylonText[i]);

        stage.addChild(pylonContainer[i]);
    }

    gameStarted = true;
}

/**
 pylon.x = 50;
 pylon.y = 50;
 pylon.scaleX = 0.2;
 pylon.scaleY = 0.2;
 */