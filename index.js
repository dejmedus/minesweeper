
// sweeper buttons
const game = document.getElementId("game");
for (let i = 0; i < 90; i++) {
    const btn = document.createElement("button");
    if (i < 10) {
        btn.id = `0${i}`
    }
    else {
        btn.id = `${i}`
    }
    btn.classList.add("btn");
    game.appendChild(btn);
}

// game status
const statusEl = document.getElementId("status");

let gameStatus = playing;

statusEl.innerHTML = `<img src="./assets/status/${gameStatus}.png" alt="game status smiley face">`

const scoreEl = document.getElementId("score");
const triesEl = document.getElementId("tries");

// status numbers
let score = 12;
let tries = 04;

statusNumbers(score);
statusNumbers(tries);

function statusNumbers(element, num) {
    const zero = `<img src="./assets/status-numbers/0.png" alt="number 0">`;

    element.innerHTML += zero;

    if (num < 10) {
        element.innerHTML += zero;
    }
    else {
        element.innerHTML += `<img src="./assets/status-numbers/${num[0]}.png" alt="number ${num[0]}">`
    }
    element.innerHTML += `<img src="./assets/status-numbers/${num[1]}.png" alt="number ${num[1]}">`
}


