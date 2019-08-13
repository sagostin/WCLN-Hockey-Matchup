/**
 * WCLN.ca
 * Hockey Matchup
 * @author Shaun Agostinho (shaunagostinho@gmail.com)
 * July 2019
 */

let FPS = 24;
let gameStarted = false;
let STAGE_WIDTH, STAGE_HEIGHT;
let stage = new createjs.Stage("gameCanvas"); // canvas id is gameCanvas

let json = {
    "levels" : [
        //LEVEL 1
        [
            //QUESTION 1
            [
                0,
                1,
                2,
                3,
                4
            ],
            //QUESTION 2
            [
                0.15,
                0.25,
                0.3,
                0.5,
                0.7
            ]
        ],
        //LEVEL 2
        [
            //QUESTION 1
            [
                0,
                1,
                2,
                3,
                4
            ],
            //QUESTION 2
            [
                0.15,
                0.25,
                0.3,
                0.5,
                0.7
            ]
        ]
    ]
};

let score = 0;
let level = 0;
let question = 0;
let numbers = [];
let numbersOrder = [];
let clickedPylon;

let levelText;
let questionText;
let scoreText;
let correctText;
let incorrectText;

// bitmap letiables
let background;
let logo;
let pylons = [];
let pylonText = [];
let numberBoxes = [];
let hockeypuck;
let checkbutton;
let howto;
let winscreen;
let firstLevel;
let muted;

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
    gameStarted = false;
    firstLevel = true;
    muted = false;

    stage.update();
}

/*
 * Displays the end game screen and score.
 */
function endGame() {
    gameStarted = false;
}

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
        },
        {
            src: "img/hockey-puck.png",
            id: "hockey-puck"
        },
        {
            src: "img/check-button.png",
            id: "check-button"
        },
        {
            src: "img/win-screen.png",
            id: "win-screen"
        }
        ,
        {
            src: "img/howto.png",
            id: "howto"
        },
        {
            src: "img/unmute.png",
            id: "mute"
        },
        {
            src: "img/mute.png",
            id: "unmute"
        },
        {
            src: "sounds/slapshot.mp3",
            id: "slapshot"
        },
        {
            src: "sounds/goalcheer.mp3",
            id: "goalcheer"
        },
        {
            src: "sounds/goalaww.wav",
            id: "goalaww"
        },
        {
            src: "sounds/winhorn.mp3",
            id: "winhorn"
        }
    ];
}

function playSound(id) {
    if (muted == false) {
        createjs.Sound.play(id);
    }
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
    if (event.item.id == "check-button") {
        checkbutton = new createjs.Bitmap(event.result);
    }
    if (event.item.id == "pylon") {
        for (let i = 0; i < 5; i++) {
            pylons.push(new createjs.Bitmap(event.result));
        }
    }
    if (event.item.id == "mute") {
        mute = new createjs.Bitmap(event.result);
    }
    if (event.item.id == "unmute") {
        unmute = new createjs.Bitmap(event.result);
    }
    if (event.item.id == "number-box") {
        for (let i = 0; i < 5; i++) {
            numberBoxes.push(new createjs.Bitmap(event.result));
        }
    }
    if (event.item.id == "hockey-puck") {
        hockeypuck = new createjs.Bitmap(event.result);
    }
    if (event.item.id == "win-screen") {
        winscreen = new createjs.Bitmap(event.result);
    }
    if (event.item.id == "howto") {
        howto = new createjs.Bitmap(event.result);
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

/**
 * Get a random number based on max.
 *
 * @param max
 * @returns {number}
 */

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

/**
 * Generate the random numbers for the
 * game and make sure there isn't duplicates.
 *
 */
function generateNumbers() {
    while (numbers.length < 5) {
        //TODO make it pull from the json config
        console.log("level: " + level + " question: " + question);

        let number = json.levels[level][question][getRandomInt(json.levels[level][question].length)];

        if (!numbers.includes(number)) {
            numbers.push(number);
        }
    }
}


let mute, unmute;

function initMuteUnMute() {
    var hitArea = new createjs.Shape();
    hitArea.graphics.beginFill("#000").drawRect(0, 0, mute.image.width, mute.image.height);
    mute.hitArea = unmute.hitArea = hitArea;

    mute.x = unmute.x = STAGE_WIDTH / 4;
    mute.y = unmute.y = 540;

    mute.cursor = "pointer";
    unmute.cursor = "pointer";

    mute.on("click", toggleMute);
    unmute.on("click", toggleMute);

    stage.addChild(mute);
}

function toggleMute() {

    if (muted == true) {
        muted = false;
    } else {
        muted = true;
    }

    if (muted == true) {
        stage.addChild(unmute);
        stage.removeChild(mute);
    } else {
        stage.addChild(mute);
        stage.removeChild(unmute);
    }
}

/**
 * Respawn all the hockey pucks.
 *
 */
function resetHockeyPuck() {
    hockeypuck.x = 590;
    hockeypuck.y = 510;
    hockeypuck.scaleX = 0.05;
    hockeypuck.scaleY = 0.05;

    stage.addChild(hockeypuck);
}

/**
 * Load the pylons, and boxes (only if not ingame)
 *
 */
function initGraphics() {


    if (firstLevel) {
        initMuteUnMute();
    }

    levelText = new createjs.Text("Level: " + (level + 1), "32px Arial", "#FFFFFF");
    levelText.textBaseline = "alphabetic";
    levelText.align = "center";
    levelText.x = 650;
    levelText.y = 50;

    stage.addChild(levelText);

    questionText = new createjs.Text("Question: " + (question + 1), "32px Arial", "#FFFFFF");
    questionText.align = "center";
    questionText.textBaseline = "alphabetic";
    questionText.x = 625;
    questionText.y = 75;

    stage.addChild(questionText);

    let maxScoreCount = 0;
    for(cc in json.levels){
        maxScoreCount = maxScoreCount + json.levels[cc].length;
    }

    scoreText = new createjs.Text("Score: " + (score) + "/" + maxScoreCount, "32px Arial", "#FFFFFF");
    scoreText.align = "center";
    scoreText.textBaseline = "alphabetic";
    scoreText.x = 25;
    scoreText.y = 575;

    stage.addChild(scoreText);

    correctText = new createjs.Text("Goal!!", "36px Arial", "#FFFFFF");
    correctText.textBaseline = "alphabetic";
    correctText.x = STAGE_WIDTH / 2 - correctText.getMeasuredWidth() / 2;
    correctText.y = 400;

    //incorrect text;
    incorrectText = new createjs.Text("Miss! Try again!", "36px Arial", "#FFFFFF");
    incorrectText.textBaseline = "alphabetic";
    incorrectText.x = STAGE_WIDTH / 2 - incorrectText.getMeasuredWidth() / 2;
    incorrectText.y = 400;

    if (!gameStarted) {
        for (let i = 0; i < numberBoxes.length; i++) {
            numberBoxes[i].scaleX = 2.5;
            numberBoxes[i].scaleY = 2;
            numberBoxes[i].y = 425;

            let center = (STAGE_WIDTH / 2) - (numberBoxes[i].image.width * numberBoxes[i].scaleX / 2);

            switch (i) {
                case 0:
                    numberBoxes[i].x = center - ((numberBoxes[i].image.width * numberBoxes[i].scaleX + 10) * 2);
                    break;
                case 1:
                    numberBoxes[i].x = center - (numberBoxes[i].image.width * numberBoxes[i].scaleX + 10);
                    break;
                case 2:
                    //                     //CENTER
                    numberBoxes[i].x = center;
                    break;
                case 3:
                    numberBoxes[i].x = center + (numberBoxes[i].image.width * numberBoxes[i].scaleX + 10);
                    break;
                case 4:
                    numberBoxes[i].x = center + ((numberBoxes[i].image.width * numberBoxes[i].scaleX + 10) * 2);
                    break;
            }
            stage.addChild(numberBoxes[i]);
        }
    }

    for (let i = 0; i < pylons.length; i++) {
        pylons[i].scaleX = 0.2;
        pylons[i].scaleY = 0.2;
        pylonText[i] = new createjs.Text(numbers[i] + "", "50px Arial", "#FFFFFF");
        pylonText[i].textAlign = "center";
        pylonText[i].textBaseline = "alphabetic";

        switch (i) {
            case 0:
                pylons[i].x = (STAGE_WIDTH / 2) - ((pylons[i].image.width * pylons[i].scaleX / 2) * (6)) + ((pylons[i].image.width * pylons[i].scaleX / 2) / 1.5);
                pylons[i].y = 250;
                pylonText[i].x = (STAGE_WIDTH / 2) - ((pylons[i].image.width * pylons[i].scaleX / 2) * (4)) - 20;
                pylonText[i].y = 350 + 60;
                break;
            case 1:
                pylons[i].x = (STAGE_WIDTH / 2) - ((pylons[i].image.width * pylons[i].scaleX / 2) * (4)) + ((pylons[i].image.width * pylons[i].scaleX / 2) / 1.5);
                pylons[i].y = 225;
                pylonText[i].x = (STAGE_WIDTH / 2) - ((pylons[i].image.width * pylons[i].scaleX / 2) * (2)) - 20;
                pylonText[i].y = 325 + 60;
                break;
            case 2:
                //CENTER
                pylons[i].x = (STAGE_WIDTH / 2) - (pylons[i].image.width * pylons[i].scaleX / 2);
                pylons[i].y = 200;
                pylonText[i].x = (STAGE_WIDTH / 2);
                pylonText[i].y = 300 + 60;
                break;
            case 3:
                pylons[i].x = (STAGE_WIDTH / 2) + ((pylons[i].image.width * pylons[i].scaleX / 2) * (2)) - ((pylons[i].image.width * pylons[i].scaleX / 2) / 1.5);
                pylons[i].y = 225;
                pylonText[i].x = (STAGE_WIDTH / 2) + ((pylons[i].image.width * pylons[i].scaleX / 2) * (2)) + 20;
                pylonText[i].y = 325 + 60;
                break;
            case 4:
                pylons[i].x = (STAGE_WIDTH / 2) + ((pylons[i].image.width * pylons[i].scaleX / 2) * (4)) - ((pylons[i].image.width * pylons[i].scaleX / 2) / 1.5);
                pylons[i].y = 250;
                pylonText[i].x = (STAGE_WIDTH / 2) + ((pylons[i].image.width * pylons[i].scaleX / 2) * (4)) + 20;
                pylonText[i].y = 350 + 60;
                break;
        }
        pylons[i].on("click", function (event) {
            pylonClickHandler(event);
        });
        stage.addChild(pylonText[i]);
        stage.addChild(pylons[i]);
    }

    resetHockeyPuck();

    if (!gameStarted) {
        checkbutton.y = 510;
        checkbutton.x = (STAGE_WIDTH / 2) - (checkbutton.image.width / 2);
        checkbutton.on("click", function (event) {
            checkNumbers(event);
        });

        stage.addChild(checkbutton);
    }

    if (firstLevel) {
        howto.on("click", function (event) {
            howtoClick(event);
        });
        stage.addChild(howto);
    }

    firstLevel = false;

    gameStarted = true;
}

function howtoClick() {
    stage.removeChild(howto);
}

/**
 * Check button (check if numbers are sorted, if they are reload the stage with pylons and add to the question count)
 *
 * @param event
 */
function checkNumbers(event) {
    if (numbersOrder.length >= 5) {
        if (isSorted(numbersOrder)) {

            console.log("numbers are in order.");

            numbersOrder = [];
            numbers = [];
            clickedPylon = null;

            for (let i = 0; i < pylonText.length; i++) {
                stage.removeChild(pylonText[i]);
            }

            stage.removeChild(levelText);
            stage.removeChild(questionText);
            stage.removeChild(scoreText);

            pylonText = [];
            boxCount = 0;

            score++;

            stage.addChild(correctText);
            createjs.Tween.get(correctText).to({alpha: 0}, 3500).call(removeCorrectText);

            playSound("goalcheer");

            if (question < (json.levels[level].length - 1)) {
                question++;
            } else {
                question = 0;
                if (level < json.levels.length - 1) {
                    level++;
                } else {
                    gameStarted = false;
                    winscreen.y = 200;
                    winscreen.x = (STAGE_WIDTH / 2) - (winscreen.image.width / 2);
                    winscreen.on("click", function (event) {
                        removeWinScreen(event);
                    });
                    stage.addChild(winscreen);

                    playSound("winhorn");
                }
            }

            if(gameStarted){
                gameStarted = false;
                generateNumbers();
                initGraphics();
            }
        }
         else {
            console.log("numbers are not in order.");

            numbersOrder = [];
            numbers = [];
            clickedPylon = null;

            for (let i = 0; i < pylonText.length; i++) {
                stage.removeChild(pylonText[i]);
            }

            stage.removeChild(levelText);
            stage.removeChild(questionText);
            stage.removeChild(scoreText);

            pylonText = [];
            boxCount = 0;

            stage.addChild(incorrectText);
            createjs.Tween.get(incorrectText).to({alpha: 0}, 3500).call(removeIncorrectText);

            playSound("goalaww");

            gameStarted = false;
            generateNumbers();
            initGraphics();
        }
    }

    stage.removeChild(hockeypuck);
    resetHockeyPuck();

    //stage.removeChild(event.target);
}

function removeIncorrectText() {
    stage.removeChild(incorrectText);
    //incorrect text;
    incorrectText = new createjs.Text("Miss! Try again!", "36px Arial", "#FFFFFF");
    incorrectText.textBaseline = "alphabetic";
    incorrectText.x = STAGE_WIDTH / 2 - incorrectText.getMeasuredWidth() / 2;
    incorrectText.y = 400;
}

function removeCorrectText() {
    stage.removeChild(correctText);
    //correct text
    correctText = new createjs.Text("Goal!!", "36px Arial", "#FFFFFF");
    correctText.textBaseline = "alphabetic";
    correctText.x = STAGE_WIDTH / 2 - correctText.getMeasuredWidth() / 2;
    correctText.y = 400;
}

function removeWinScreen() {
    gameStarted = false;

    stage.removeChild(winscreen);

    score = 0;
    level = 0;
    question = 0;

    numbersOrder = [];
    numbers = [];
    clickedPylon = null;

    for (let i = 0; i < pylonText.length; i++) {
        stage.removeChild(pylonText[i]);
    }

    stage.removeChild(levelText);
    stage.removeChild(questionText);
    stage.removeChild(scoreText);

    pylonText = [];
    boxCount = 0;

    generateNumbers();
    initGraphics();
}

/**
 * Pylon click handler
 *
 * @param event
 */
function pylonClickHandler(event) {
    //event.target.x = event.stageX;
    //event.target.y = event.stageY;

    if (pylons.includes(event.target)) {
        for (let i = 0; i < pylons.length; i++) {
            if (pylons[i] == event.target) {
                if (clickedPylon == null) {
                    numbersOrder.push(parseFloat(pylonText[i].text.toString()));
                    //stage.removeChild(pylonText[i]);
                    clickedPylon = i;

                    // Move the hockey puck to the pylon which was clicked.
                    createjs.Tween.get(hockeypuck).to({
                        x: pylons[clickedPylon].x,
                        y: pylons[clickedPylon].y
                    }, 500).call(hockeyPuckAnimate);

                    playSound("slapshot");

                    break;
                }
            }
        }
    }
}

/**
 * Update the stage. (Tween Ticker)
 *
 * @param event
 */

function update(event) {
    stage.update(event);
}

/**
 * Animate the hockey puck
 */

let boxCount = 0;

function hockeyPuckAnimate() {

    //TODO fix these errors.
    pylonText[clickedPylon].x = numberBoxes[boxCount].x + (numberBoxes[boxCount].image.width);
    pylonText[clickedPylon].y = numberBoxes[boxCount].y + (numberBoxes[boxCount].image.height * 1.5);
    pylonText[clickedPylon].color = "black";
    stage.removeChild(pylons[clickedPylon]);

    clickedPylon = null;
    boxCount++;

    stage.removeChild(hockeypuck);
    resetHockeyPuck();
    //Tween complete
}

/**
 * Check if an array is sorted by number (lowest to highest)
 *
 * @param arr
 * @returns {boolean}
 */

function isSorted(arr) {
    const limit = arr.length - 1;
    return arr.every((_, i) => (i < limit ? arr[i] <= arr[i + 1] : true));
}