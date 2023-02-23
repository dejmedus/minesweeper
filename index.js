const difficultySettings = {
    beginner: [10, 5],
    intermediate: [8, 8],
    expert: [5, 10]
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

setupGame();

function setupGame() {
    // set initial values
    seconds = 0;
    numberOfTilesFound = 0
    gameOver = false;
    let flags = difficultySettings.beginner[0];
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
    for (let i = 0; i < difficultySettings.beginner[1]; i++) {
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
                if (numberOfTilesFound == (90 - difficultySettings.beginner[1])) {
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

