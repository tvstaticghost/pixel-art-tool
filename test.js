const GRID = document.getElementById('grid');
const DEFAULTCOLOR = "bg-gray-300";
const GRIDSIZE = 24;

let selectedColor = "#000000";
let fadedSelectedColor = "#181818";
let selectedTool = "pencilTool";

let isHolding = false;
let isFirstLineClick = false;

function handleSelectedTool() {
    let selectionToolList = document.getElementsByClassName('selection-tool');

    for (let i = 0; i < selectionToolList.length; i++) {
        selectionToolList[i].addEventListener('click', () => {
            if (selectionToolList[i].classList.contains('not-selected')) {
                selectionToolList[i].classList.remove('not-selected');
                selectionToolList[i].classList.add('selected');
                removeAllOtherSelected(selectionToolList[i].id);
                selectedTool = selectionToolList[i].id;
            }
        });
    }
}

function removeAllOtherSelected(selectedId) {
    let selectionToolList = document.getElementsByClassName('selection-tool');
    for (let i = 0; i < selectionToolList.length; i++) {
        if (selectionToolList[i].classList.contains('selected') && selectionToolList[i].id != selectedId) {
            selectionToolList[i].classList.remove('selected');
            selectionToolList[i].classList.add('not-selected');
        }
    }
}

function drawLine(startingCoordinate, endingCoordinate) {
    let arrayMap = [];
    while ((startingCoordinate[0] !== endingCoordinate[0]) || (startingCoordinate[1] !== endingCoordinate[1])) {
        let tempArrItem = [];

        if (startingCoordinate[0] > endingCoordinate[0]) {
            tempArrItem.push(startingCoordinate[0] - 1);
            startingCoordinate[0]--;
        }
        else if (startingCoordinate[0] === endingCoordinate[0]) {
            tempArrItem.push(startingCoordinate[0]);
        }
        else {
            tempArrItem.push(startingCoordinate[0] + 1);
            startingCoordinate[0]++;
        }

        if (startingCoordinate[1] > endingCoordinate[1]) {
            tempArrItem.push(startingCoordinate[1] - 1);
            startingCoordinate[1]--;
        }
        else if (startingCoordinate[1] === endingCoordinate[1]) {
            tempArrItem.push(startingCoordinate[1]);
        }
        else {
            tempArrItem.push(startingCoordinate[1] + 1);
            startingCoordinate[1]++;
        }

        arrayMap.push(tempArrItem);
    }

    return arrayMap;
}

class Pixel {
    defaultColor = "#d1d5db";
    pixel = "";
    height = 4;
    width = 4;
    previousColor = "";

    createPixel() {
        let newPixel = document.createElement('div');
        newPixel.classList.add(`w-${this.width}`, `h-${this.height}`, `${DEFAULTCOLOR}`);
        this.pixel = newPixel;
    }

    addHoverColor() {
        //Adds pixel hover effect
        this.pixel.addEventListener('mouseover', () => {
            if (isHolding) {
                if (selectedTool === "pencilTool") {
                    this.pixel.style.backgroundColor = selectedColor;
                    this.previousColor = selectedColor;
                }
                else if (selectedTool === "eraserTool") {
                    this.pixel.style.backgroundColor = this.defaultColor;
                    this.previousColor = this.defaultColor;
                }
            }
            else {
                this.previousColor = window.getComputedStyle(this.pixel).backgroundColor;
                if (selectedTool === "pencilTool") {
                    this.pixel.style.backgroundColor = selectedColor;
                }
                else if (selectedTool === "eraserTool") {
                    this.pixel.style.backgroundColor = this.defaultColor;
                }
                else if (selectedTool === "lineTool") {
                    this.pixel.style.backgroundColor = fadedSelectedColor;
                }
            }
        });

        //changes color of pixel back to previous color if not holding mouse down
        this.pixel.addEventListener('mouseout', () => {
            if (!isHolding) {
                this.pixel.style.backgroundColor = this.previousColor;
            }
        });
    }

    addSelectColor() {
        this.pixel.addEventListener('click', () => {
            if (selectedTool === 'pencilTool') {
                this.pixel.style.backgroundColor = selectedColor;
                this.previousColor = selectedColor;
            }
            else if (selectedTool === 'eraserTool') {
                this.pixel.style.backgroundColor = this.defaultColor;
                this.previousColor = this.defaultColor;
            }
            else if (selectedTool === "lineTool") {
                if (!isFirstLineClick) {
                    isFirstLineClick = true;
                }
                else if (isFirstLineClick) {
                    //drawLine();
                    isFirstLineClick = false;
                }
            }
        });

        this.pixel.addEventListener('mousedown', () => {
            isHolding = true;
            console.log(isHolding);
        });

        this.pixel.addEventListener('mouseup', () => {
            isHolding = false;
        });
    }
}

function renderGrid(size, lineArray=null) {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            let div = new Pixel();
            div.createPixel();
            div.addHoverColor();
            div.addSelectColor();
            GRID.appendChild(div.pixel);

            if (lineArray !== null) {
                for (let k = 0; k < lineArray.length; k++) {
                    if (lineArray[0] === i && lineArray[1] === j) {
                        div.style.backgroundColor = selectedColor;
                    }
                }
            }
        }
    }
}

window.addEventListener('mouseup', () => {
    isHolding = false;
});

renderGrid(GRIDSIZE);
handleSelectedTool();

//test
console.log(drawLine([0, 1], [3, 3]));