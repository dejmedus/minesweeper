const statusEl = document.getElementById("status");
const secondsEl = document.getElementById("seconds");
const flagsEl = document.getElementById("flags");
const game = document.getElementById("game");

const difficultySelect = document.getElementById("difficulty");

const gameMenuButton = document.getElementById('game-btn');
const helpMenuButton = document.getElementById('help-btn');

const dialog = document.getElementById('dialog');
const closeDialog = document.getElementById('close-dialog');

const help = document.getElementById('help');
const closeHelp = document.getElementById('close-help');

const settings = {
    beginner: {
        flags: 12,
        mines: 10
    },
    intermediate: {
        flags: 10,
        mines: 20
    },
    expert: {
        flags: 8,
        mines: 32
    },
}

let gameStarted = false;
let seconds = 0;
let numberOfTilesFound = 0;
let mineMap = [];
let greyTiles = [];
let gameSettings = settings[difficultySelect.value];
let flags = gameSettings.flags;

// on difficulty setting change
difficultySelect.addEventListener('change', () => {
    gameSettings = settings[difficultySelect.value];
    // reset game
    gameStarted = false;
    setupGame();
})

// bind menu button events
gameMenuButton.addEventListener('click', () => {
    dialog.classList.add('show');
    gameMenuButton.classList.add('clicked');
    dialog.style.zIndex = "3";
})
helpMenuButton.addEventListener('click', () => {
    help.classList.add('show');
    helpMenuButton.classList.add('clicked');
    help.style.zIndex = "3";
})

closeDialog.addEventListener('click', () => {
    dialog.classList.remove('show');
    gameMenuButton.classList.remove('clicked');
})
closeHelp.addEventListener('click', () => {
    help.classList.remove('show');
    helpMenuButton.classList.remove('clicked');
})

// clicking status button resets game
statusEl.addEventListener('click', () => {
    gameStarted = false;
    setupGame();
})


setupGame();

function setupGame() {

    // set initial values
    seconds = 0;
    numberOfTilesFound = 0
    flags = gameSettings.flags;
    mineMap = [];
    greyTiles = [];

    // set initial flags to zero
    setStatusNumbers(flagsEl, flags);

    // set initial seconds count to zero
    setStatusNumbers(secondsEl, seconds);

    // set initial game status to 'playing'
    setStatus("playing", 'smiley face');

    // generate mine map
    for (let i = 0; i < gameSettings.mines; i++) {
        let index = Math.floor(Math.random() * 90 + 1);
        while (mineMap.includes(index)) {
            index = Math.floor(Math.random() * 90 + 1);
        }
        mineMap.push(index);
    }

    // populate sweeper tiles
    game.replaceChildren();
    for (let i = 0; i < 90; i++) {
        const tile = document.createElement("button");
        if (mineMap.includes(i)) {
            tile.classList.add("mine");
        }
        else {
            let sideCount = 0

            if ((i + 1) % 10 == 0) {
                sideCount += mineMap.includes(i - 1) ? 1 : 0;
                sideCount += mineMap.includes(i + 9) ? 1 : 0;
                sideCount += mineMap.includes(i - 10) ? 1 : 0;
                sideCount += mineMap.includes(i + 10) ? 1 : 0;
                sideCount += mineMap.includes(i - 11) ? 1 : 0;
            }
            else if (i % 10 == 0) {
                sideCount += mineMap.includes(i + 1) ? 1 : 0;
                sideCount += mineMap.includes(i - 9) ? 1 : 0;
                sideCount += mineMap.includes(i + 10) ? 1 : 0;
                sideCount += mineMap.includes(i - 10) ? 1 : 0;
                sideCount += mineMap.includes(i + 11) ? 1 : 0;
            }
            else {
                sideCount += mineMap.includes(i + 1) ? 1 : 0;
                sideCount += mineMap.includes(i - 1) ? 1 : 0;
                sideCount += mineMap.includes(i + 9) ? 1 : 0;
                sideCount += mineMap.includes(i - 9) ? 1 : 0;
                sideCount += mineMap.includes(i + 10) ? 1 : 0;
                sideCount += mineMap.includes(i - 10) ? 1 : 0;
                sideCount += mineMap.includes(i + 11) ? 1 : 0;
                sideCount += mineMap.includes(i - 11) ? 1 : 0;
            }

            tile.setAttribute("value", sideCount);
            tile.innerHTML = sideCount != 0 ? `${sideCount}` : null;

            if (sideCount == 0) {
                greyTiles.push(i);
                tile.style.backgroundColor = "purple";
            }
        }

        if (i < 10) {
            tile.id = `${i}`
        }
        else {
            tile.id = `${i}`
        }
        tile.classList.add("tile");
        game.appendChild(tile);
    }

    // group grey tiles





    // add event trigger to tiles
    let tiles = [...document.querySelectorAll('.tile')];

    for (let i = 0; i < tiles.length; i++) {
        tiles[i].addEventListener('click', (e) => {
            !gameStarted && startGame();

            e.target.classList.add("found");

            // if tile has a mine
            if (e.target.classList.contains('mine')) {
                e.target.innerHTML = `<img src="./assets/icons/mine.svg" alt="mine">`;

                finishedGame(tiles);
                setStatus("lost", "upset smiley face");
            }

            const sideCount = e.target.value;
            tiles[i].innerHTML = sideCount != 0 ? `${sideCount}` : null;

            if (sideCount == 0) {
                // reveal all grey squares in group
                greyTiles.forEach(tile => {
                    tiles[tile].classList.add('found');
                })
                // numberOfTilesFound += numberOfGreySquaresInGroup
                numberOfTilesFound += greyTiles.length;
            }
            else {
                numberOfTilesFound++;
            }

            if (numberOfTilesFound == (90 - gameSettings.mines)) {
                finishedGame(tiles);
                setStatus("won", "smiley face in sunglasses");
            }
        });

        tiles[i].addEventListener('contextmenu', (e) => {
            !gameStarted && startGame();

            // prevent context menu from opening
            e.preventDefault();

            if (flags > 0) {
                e.target.classList.add("flag");
                e.target.innerHTML = `<img src="./assets/icons/flag.svg" alt="flag">`

                flags--;
                setStatusNumbers(flagsEl, flags);

                tiles[i].setAttribute('disabled', true);
            }
        });
    }
}

function startGame() {
    gameStarted = true;

    // start timer
    const counter = setInterval(() => {
        if (gameStarted) {
            seconds++;
            setStatusNumbers(secondsEl, seconds);
        }
        else {
            clearInterval(counter);
        }
    }, 1000);
}

// !gameStarted stops seconds timer
function finishedGame(tiles) {
    gameStarted = false;

    tiles.forEach(tile => {
        tile.setAttribute('disabled', true);
    })
}

function changeDifficulty(e) {
    difficulty = e.target.value;
    return settings[difficulty];
}

// gameStatus: playing, won, lost
function setStatus(gameStatus, alt) {
    statusEl.innerHTML = `<img src="./assets/status/${gameStatus}.svg" alt="${alt}">`
}

// flags & seconds
function setStatusNumbers(element, num) {
    const numStr = num.toString();
    const zero = `<img src="./assets/status-numbers/0.png" alt="number 0">`;

    if (num == 0) {
        element.innerHTML = zero;
        element.innerHTML += zero;
        element.innerHTML += zero;
    }
    else if (num >= 100) {
        element.innerHTML = `<img src="./assets/status-numbers/${numStr[0]}.png" alt="number ${numStr[0]}">`
        element.innerHTML += `<img src="./assets/status-numbers/${numStr[1]}.png" alt="number ${numStr[1]}">`
        element.innerHTML += `<img src="./assets/status-numbers/${numStr[2]}.png" alt="number ${numStr[2]}">`
    }
    else {
        element.innerHTML = zero;

        if (num < 10) {
            element.innerHTML += zero;
            element.innerHTML += `<img src="./assets/status-numbers/${numStr[0]}.png" alt="number ${numStr[0]}">`
        }
        else {
            element.innerHTML += `<img src="./assets/status-numbers/${numStr[0]}.png" alt="number ${numStr[0]}">`
            element.innerHTML += `<img src="./assets/status-numbers/${numStr[1]}.png" alt="number ${numStr[1]}">`
        }
    }
}


function findParent(element) {
    if (!element.hasAttribute('id')) {
        element = element.parentNode;
    }
    return element;
}