// https://stackoverflow.com/questions/9334084/moveable-draggable-div
const minesweeper = document.getElementById('minesweeper');
const titleBar = document.getElementById('title-bar');

let x = 0;
let y = 0;
titleBar.addEventListener('mousedown', (e) => {
    x = e.offsetX;
    y = e.offsetY;
    window.addEventListener('mousemove', drag);
}, true);

window.addEventListener('mouseup', () => {
    window.removeEventListener('mousemove', drag);
}, true);

function drag(e) {
    minesweeper.style.top = (e.clientY - y) + 'px';
    minesweeper.style.left = (e.clientX - x) + 'px';
}
