// https://stackoverflow.com/questions/9334084/moveable-draggable-div
const minesweeper = document.getElementById('minesweeper');
const titleBar = document.getElementById('title-bar');

titleBar.addEventListener('mousedown', () => {
    window.addEventListener('mousemove', drag);
}, true);

window.addEventListener('mouseup', () => {
    window.removeEventListener('mousemove', drag);
}, true);

function drag(e) {
    minesweeper.style.top = e.clientY + 'px';
    minesweeper.style.left = (e.clientX - 90) + 'px';
}
