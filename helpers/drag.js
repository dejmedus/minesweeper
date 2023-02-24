// https://stackoverflow.com/questions/9334084/moveable-draggable-div
const titleBars = [...document.querySelectorAll('.title-bar')];
let parentElements = [];

let element;

let x = 0;
let y = 0;
for (let i = 0; i < titleBars.length; i++) {
    titleBars[i].addEventListener('mousedown', (e) => {

        // bring current element to front
        for (let j = 0; j < parentElements.length; j++) {
            parentElements[j].style.zIndex = "1";
        }

        element = parentElements[i];
        element.style.zIndex = "2";

        x = e.offsetX;
        y = e.offsetY;
        window.addEventListener('mousemove', drag);
    }, true);

    // get parent elements to drag
    element = titleBars[i];
    while (!element.hasAttribute('id')) {
        element = element.parentNode;
    }
    parentElements.push(element);

    // clicking anywhere on a div brings it to front
    // element.addEventListener('click', (e) => {
    //     for (let j = 0; j < parentElements.length; j++) {
    //         parentElements[j].style.zIndex = "1";
    //     }

    //     e.target.style.zIndex = "2";
    // })
}

function drag(e) {
    element.style.top = (e.clientY - y) + 'px';
    element.style.left = (e.clientX - x) + 'px';
}

window.addEventListener('mouseup', () => {
    window.removeEventListener('mousemove', drag);

}, true);
