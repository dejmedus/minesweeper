// https://stackoverflow.com/questions/9334084/moveable-draggable-div
const titleBars = [...document.querySelectorAll('.title-bar')];
let parentElements = [];
let clickOrder = [];

let element;

let x = 0;
let y = 0;
for (let i = 0; i < titleBars.length; i++) {
    titleBars[i].addEventListener('mousedown', (e) => {

        element = parentElements[i];

        setZIndex({
            element: parentElements[i],
            name: `${parentElements[i]}`
        });

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
    element.addEventListener('click', (e) => {
        setZIndex({
            element: parentElements[i],
            name: `${parentElements[i]}`
        });
    })
}

function setZIndex(div) {
    if (clickOrder.includes(`${div.name}`)) {
        clickOrder.splice(clickOrder.findIndex(div.name), 1);
    }
    clickOrder.push(div.element);

    for (let i = 0; i < clickOrder.length; i++) {
        clickOrder[i].style.zIndex = i + 1;
    }
}

function drag(e) {
    element.style.top = (e.clientY - y) + 'px';
    element.style.left = (e.clientX - x) + 'px';
}

window.addEventListener('mouseup', () => {
    window.removeEventListener('mousemove', drag);

}, true);
