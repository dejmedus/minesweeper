
console.log("working");

// sweeper buttons
const game = document.getElementById("game");
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
const statusEl = document.getElementById("status");

let gameStatus = "playing";

statusEl.innerHTML = `<img src="./assets/status/${gameStatus}.svg" alt="game status smiley face">`

const scoreEl = document.getElementById("score");
const triesEl = document.getElementById("tries");

// status numbers
let score = 12;
let tries = 4;

statusNumbers(scoreEl, score);
statusNumbers(triesEl, tries);

function statusNumbers(element, num) {
    const numStr = num.toString();
    const zero = `<img src="./assets/status-numbers/0.png" alt="number 0">`;

    if (num == 0) {
        element.innerHTML += zero;
        element.innerHTML += zero;
        element.innerHTML += zero;
    }
    else if (num >= 100) {
        element.innerHTML += `<img src="./assets/status-numbers/${numStr[0]}.png" alt="number ${numStr[0]}">`
        element.innerHTML += `<img src="./assets/status-numbers/${numStr[1]}.png" alt="number ${numStr[1]}">`
        element.innerHTML += `<img src="./assets/status-numbers/${numStr[2]}.png" alt="number ${numStr[2]}">`
    }
    else {
        element.innerHTML += zero;

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


