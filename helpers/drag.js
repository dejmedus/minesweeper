// https://stackoverflow.com/questions/9334084/moveable-draggable-div
const titleBars = [...document.querySelectorAll('.title-bar')];
let titleBarParents = [];
const parentElements = [...document.querySelectorAll('[data-clicks]')];

let clickOrder = [];

let element;

let x = 0;
let y = 0;

for (let i = 0; i < titleBars.length; i++) {
    // get parent elements to drag
    element = titleBars[i];
    while (!element.hasAttribute('id')) {
        element = element.parentNode;
    }
    titleBarParents.push(element);

    // dragging brings to front
    titleBars[i].addEventListener('mousedown', (e) => {
        element = titleBarParents[i];

        e.stopPropagation()
        let index = parentElements.findIndex(element => element.id == e.target.dataset.clicks);

        setZIndex({
            element: parentElements[index],
            name: e.target.dataset.clicks
        });

        x = e.offsetX;
        y = e.offsetY;
        window.addEventListener('mousemove', drag);
    }, true);
}

// clicking anywhere on a div brings it to front
for (let i = 0; i < parentElements.length; i++) {
    parentElements[i].addEventListener('click', (e) => {
        e.stopPropagation()
        let index = parentElements.findIndex(element => element.id == e.target.dataset.clicks);

        setZIndex({
            element: parentElements[index],
            name: e.target.dataset.clicks
        });
    })
}



function setZIndex(div) {
    clickOrder.filter(element => element.name !== div.name);
    clickOrder.push({ element: div.element, name: div.name });

    for (let i = 0; i < clickOrder.length; i++) {
        clickOrder[i].element.style.zIndex = i + 1;
    }
    console.log(clickOrder);
}

function drag(e) {
    element.style.top = (e.clientY - y) + 'px';
    element.style.left = (e.clientX - x) + 'px';
}

window.addEventListener('mouseup', () => {
    window.removeEventListener('mousemove', drag);

}, true);
