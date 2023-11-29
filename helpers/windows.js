// https://stackoverflow.com/questions/9334084/moveable-draggable-div
const titleBars = [...document.querySelectorAll(".title-bar")];

const gameMenuButton = document.getElementById("game-btn");
const helpMenuButton = document.getElementById("help-btn");

const dialog = document.getElementById("dialog");
const closeDialog = document.getElementById("close-dialog");

const help = document.getElementById("help");
const closeHelp = document.getElementById("close-help");

let zIndex = 1;
let element;
let x = 0;
let y = 0;

// bind menu button events
gameMenuButton.addEventListener("click", (e) => {
  e.stopPropagation();
  dialog.classList.add("show");
  dialog.style.zIndex = zIndex++;
  gameMenuButton.classList.add("clicked");
});
helpMenuButton.addEventListener("click", (e) => {
  e.stopPropagation();
  help.classList.add("show");
  help.style.zIndex = zIndex++;
  helpMenuButton.classList.add("clicked");
});

closeDialog.addEventListener("click", (e) => {
  e.stopPropagation();
  dialog.classList.remove("show");
  gameMenuButton.classList.remove("clicked");
});
closeHelp.addEventListener("click", (e) => {
  e.stopPropagation();
  help.classList.remove("show");
  helpMenuButton.classList.remove("clicked");
});

// setup event listeners
for (let i = 0; i < titleBars.length; i++) {
  const parentDiv = titleBars[i].parentNode;

  parentDiv.addEventListener("click", (e) => {
    e.stopPropagation();
    parentDiv.style.zIndex = zIndex++;
  });

  titleBars[i].addEventListener(
    "mousedown",
    (e) => {
      e.stopPropagation();
      element = parentDiv;
      parentDiv.style.zIndex = zIndex++;

      x = e.offsetX;
      y = e.offsetY;
      window.addEventListener("mousemove", drag);
    },
    true
  );
}

function drag(e) {
  element.style.top = e.clientY - y + "px";
  element.style.left = e.clientX - x + "px";
}

window.addEventListener(
  "mouseup",
  () => {
    window.removeEventListener("mousemove", drag);
  },
  true
);
