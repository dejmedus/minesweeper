const settings = {
    beginner: {
        flags: 10,
        mines: 10
    },
    intermediate: {
        flags: 8,
        mines: 20
    },
    expert: {
        flags: 5,
        mines: 32
    },
}

let seconds = 0;
let gameStarted = false;
let gameOver = false;
let numberOfTilesFound = 0;

const statusEl = document.getElementById("status");
const secondsEl = document.getElementById("seconds");
const flagsEl = document.getElementById("flags");
const game = document.getElementById("game");
// get difficulty mode from game dropdown
const gameMenuButton = document.getElementById('game-btn');
const helpMenuButton = document.getElementById('help-btn');

const dialog = document.getElementById('dialog');
const closeDialog = document.getElementById('close-dialog');

const help = document.getElementById('help');
const closeHelp = document.getElementById('close-help');
let el;

setupGame();

function setupGame() {
    // bind menu button events
    gameMenuButton.addEventListener('click', () => {
        dialog.classList.add('show');
        gameMenuButton.classList.add('clicked');
    })
    helpMenuButton.addEventListener('click', () => {
        help.classList.add('show');
        helpMenuButton.classList.add('clicked');
    })

    closeDialog.addEventListener('click', () => {
        dialog.classList.remove('show');
        gameMenuButton.classList.remove('clicked');
    })
    closeHelp.addEventListener('click', () => {
        help.classList.remove('show');
        helpMenuButton.classList.remove('clicked');
    })

    // set initial values
    seconds = 0;
    numberOfTilesFound = 0
    gameOver = false;
    let flags = settings.beginner.flags;
    let mineMap = [];

    // set initial flags to zero
    setStatusNumbers(flagsEl, flags);

    // set initial seconds count to zero
    setStatusNumbers(secondsEl, seconds);

    // set initial game status to 'playing'
    statusEl.addEventListener('click', () => {
        // restart game
        gameStarted = false;
        setupGame();
    })
    setStatus("playing", 'smiley face');

    // generate mine map
    for (let i = 0; i < settings.beginner.mines; i++) {
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
        }

        if (i < 10) {
            tile.id = `0${i}`
        }
        else {
            tile.id = `${i}`
        }
        tile.classList.add("tile");
        game.appendChild(tile);
    }

    // add event trigger to tiles
    let tiles = [...document.querySelectorAll('.tile')];

    for (let i = 0; i < tiles.length; i++) {
        tiles[i].addEventListener('click', (e) => {
            if (!gameOver) {
                !gameStarted && startGame();

                e.target.classList.add("found");

                // if tile has a mine
                if (e.target.classList.contains('mine')) {
                    e.target.innerHTML = `<img src="./assets/icons/mine.svg" alt="mine">`;

                    finishedGame(tiles)
                    setStatus("lost", "upset smiley face");
                }

                const sideCount = e.target.value;
                tiles[i].innerHTML = sideCount != 0 ? `${sideCount}` : null;

                numberOfTilesFound++;
                if (numberOfTilesFound == (90 - settings.beginner.mines)) {
                    finishedGame(tiles);
                    setStatus("won", "smiley face in sunglasses");
                }
            }
        });

        tiles[i].addEventListener('contextmenu', (e) => {
            if (!gameOver) {
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
            }
        });
    }
}

function startGame() {
    gameStarted = true;

    // start timer
    startCount();
}

// seconds count
function startCount() {
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


function finishedGame(tiles) {
    gameStarted = false;
    gameOver = true;

    tiles.forEach(tile => {
        tile.setAttribute('disabled', true);
    })
}

// playing, won, lost
function setStatus(gameStatus, alt) {
    statusEl.innerHTML = `<img src="./assets/status/${gameStatus}.svg" alt="${alt}">`
}

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