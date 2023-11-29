const statusEl = document.getElementById("status");
const secondsEl = document.getElementById("seconds");
const flagsEl = document.getElementById("flags");
const game = document.getElementById("game");

const difficultySelect = document.getElementById("difficulty");

const NUM_OF_TILES = 100;
const SETTINGS = {
  beginner: {
    flags: 12,
    mines: 10,
  },
  intermediate: {
    flags: 10,
    mines: 20,
  },
  expert: {
    flags: 8,
    mines: 32,
  },
};

let gameStarted = false;
let seconds = 0;
let numberOfTilesFound = 0;
let mineMap = [];
let gameSettings = SETTINGS[difficultySelect.value];
let flags = gameSettings.flags;
let tiles = [];

// on difficulty setting change
difficultySelect.addEventListener("change", () => {
  gameSettings = SETTINGS[difficultySelect.value];
  // reset game
  gameStarted = false;
  setupGame();
});

// clicking status button resets game
statusEl.addEventListener("click", () => {
  gameStarted = false;
  setupGame();
});

setupGame();

function revealTile(clickedTile, i, value) {
  clickedTile.classList.add("found");
  clickedTile.disabled = true;
  numberOfTilesFound++;

  if (value) {
    clickedTile.innerHTML = `<img src="assets/icons/${value}.svg" alt="Number ${value}" />`;
  } else {
    revealNearbyTiles(i, tiles);
  }
}

function setupGame() {
  // set initial values
  seconds = 0;
  numberOfTilesFound = 0;
  flags = gameSettings.flags;
  mineMap = [];
  setStatusNumbers(flagsEl, flags);
  setStatusNumbers(secondsEl, seconds);
  setStatus("playing", "smiley face");

  // populate tiles
  game.replaceChildren();
  for (let i = 0; i < NUM_OF_TILES; i++) {
    const tile = document.createElement("button");

    if (i < 10) {
      tile.id = `0${i}`;
    } else {
      tile.id = `${i}`;
    }
    tile.classList.add("tile");
    game.appendChild(tile);
  }

  // add event trigger to tiles
  tiles = [...document.querySelectorAll(".tile")];
  for (let i = 0; i < tiles.length; i++) {
    tiles[i].addEventListener("click", (e) => {
      !gameStarted && startGame(e.target.id);

      if (e.target.classList.contains("mine")) {
        finishedGame(tiles);
        setStatus("lost", "upset smiley face");
        tiles[i].classList.add("found");
        return;
      }

      const value = tiles[i].getAttribute("value");
      revealTile(tiles[i], i, value);
      console.log(tiles[i], i, value);

      if (numberOfTilesFound == NUM_OF_TILES - gameSettings.mines) {
        finishedGame(tiles);
        setStatus("won", "smiley face in sunglasses");
      }
      console.log(
        "found",
        numberOfTilesFound,
        "out of",
        NUM_OF_TILES - gameSettings.mines
      );
    });

    tiles[i].addEventListener("contextmenu", (e) => {
      !gameStarted && startGame(e.target.id);

      // prevent context menu from opening
      e.preventDefault();

      if (flags > 0 && !e.target.disabled) {
        console.log("flag", e);
        e.target.classList.add("flag");
        e.target.innerHTML = `<img src="./assets/icons/flag.svg" alt="flag">`;

        flags--;
        setStatusNumbers(flagsEl, flags);
        if (!e.target.classList.contains("mine")) {
          numberOfTilesFound++;
        }

        tiles[i].setAttribute("disabled", true);
      }
    });
  }
}

function revealNearbyTiles(index, tiles) {
  const x = index % 10;
  const y = Math.floor(index / 10);

  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      const cordsx = x + j;
      const cordsy = y + i;

      if (i === 0 && j === 0) {
        continue;
      } else if (cordsx >= 0 && cordsx < 10 && cordsy >= 0 && cordsy < 10) {
        const adjacentTileIndex = cordsy * 10 + cordsx;
        const adjacentTile = tiles[adjacentTileIndex];

        if (!adjacentTile.classList.contains("found")) {
          revealTile(
            adjacentTile,
            adjacentTileIndex,
            adjacentTile.getAttribute("value")
          );
        }
      }
    }
  }
}

function startGame(clickedIndex) {
  // first clicked tile is always a number square
  let adjacent = returnAdjacent(clickedIndex);
  mineMap.push(adjacent[randomIndex(adjacent.length - 1, clickedIndex)]);

  // generate mine map
  for (let i = 0; i < gameSettings.mines - 1; i++) {
    mineMap.push(randomIndex(NUM_OF_TILES, clickedIndex));
  }

  // get tile numbers
  for (let i = 0; i < NUM_OF_TILES; i++) {
    if (mineMap.includes(i)) {
      tiles[i].classList.add("mine");
    } else {
      let sideCount = 0;
      adjacent = returnAdjacent(i);

      for (let i = 0; i < adjacent.length; i++) {
        sideCount += mineMap.includes(adjacent[i]) ? 1 : 0;
      }

      if (sideCount != 0) {
        tiles[i].setAttribute("value", sideCount);
      }
    }
  }

  gameStarted = true;

  // start timer
  const counter = setInterval(() => {
    if (gameStarted) {
      seconds++;
      setStatusNumbers(secondsEl, seconds);
    } else {
      clearInterval(counter);
    }
  }, 1000);
}

function randomIndex(highestNum, firstClick) {
  let index = Math.floor(Math.random() * highestNum + 1);
  while (mineMap.includes(index) || index == firstClick) {
    index = Math.floor(Math.random() * highestNum + 1);
  }
  return index;
}

// get squares adjacent to index
function returnAdjacent(i) {
  i = parseInt(i);
  if ((i + 1) % 10 == 0) {
    return [i - 1, i + 9, i + 10, i - 10, i - 11].filter((a) => a > 0);
  } else if (i % 10 == 0) {
    return [i + 1, i - 9, i + 10, i - 10, i + 11].filter((a) => a > 0);
  } else {
    return [i + 1, i - 1, i + 9, i - 9, i + 10, i - 10, i + 11, i - 11].filter(
      (a) => a > 0
    );
  }
}

// !gameStarted stops seconds timer
function finishedGame(tiles) {
  gameStarted = false;

  tiles.forEach((tile) => {
    tile.setAttribute("disabled", true);
  });
}

function changeDifficulty(e) {
  difficulty = e.target.value;
  return SETTINGS[difficulty];
}

// gameStatus: playing, won, lost
function setStatus(gameStatus, alt) {
  statusEl.innerHTML = `<img src="./assets/status/${gameStatus}.svg" alt="${alt}">`;
}

// flags & seconds
function setStatusNumbers(element, num) {
  const numStr = num.toString();
  const zero = `<img src="./assets/status-numbers/0.png" alt="number 0">`;

  if (num == 0) {
    element.innerHTML = zero;
    element.innerHTML += zero;
    element.innerHTML += zero;
  } else if (num >= 100) {
    element.innerHTML = `<img src="./assets/status-numbers/${numStr[0]}.png" alt="number ${numStr[0]}">`;
    element.innerHTML += `<img src="./assets/status-numbers/${numStr[1]}.png" alt="number ${numStr[1]}">`;
    element.innerHTML += `<img src="./assets/status-numbers/${numStr[2]}.png" alt="number ${numStr[2]}">`;
  } else {
    element.innerHTML = zero;

    if (num < 10) {
      element.innerHTML += zero;
      element.innerHTML += `<img src="./assets/status-numbers/${numStr[0]}.png" alt="number ${numStr[0]}">`;
    } else {
      element.innerHTML += `<img src="./assets/status-numbers/${numStr[0]}.png" alt="number ${numStr[0]}">`;
      element.innerHTML += `<img src="./assets/status-numbers/${numStr[1]}.png" alt="number ${numStr[1]}">`;
    }
  }
}
