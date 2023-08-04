const gridContainer = document.getElementById("grid-container");
const selectValue = document.getElementById("select-value");
const settings = document.getElementById("settings");
const play = document.getElementById("play-button");
let interval;

// Initialize the game board
let gamePieces = [];
gridSize = 25;
createGrid();
gridContainer.style.height = window.innerWidth + "px";

// Keeps the container height relative to the width
// (width is 90% of the screen size)
window.onresize = () => {
    gridContainer.style.height = window.innerWidth * 0.9 + "px";
};

function displayGrid() {
    switch (selectValue.options.selectedIndex) {
        case 0:
            gridSize = 25;
            gridContainer.style.gridTemplateColumns = "repeat(25,1fr)";
            gridContainer.style.gridTemplateRows = "repeat(25,1fr)";
            break;
        case 1:
            gridSize = 50;
            gridContainer.style.gridTemplateColumns = "repeat(50,1fr)";
            gridContainer.style.gridTemplateRows = "repeat(50,1fr)";
            break;
        case 2:
            gridSize = 100;
            gridContainer.style.gridTemplateColumns = "repeat(100,1fr)";
            gridContainer.style.gridTemplateRows = "repeat(100,1fr)";
            break;
    }
    createGrid();
}

/* Creates the grid for the game */
function createGrid() {
    // Erase the previous grid
    while (gridContainer.firstChild) {
        gridContainer.removeChild(gridContainer.lastChild);
    }

    for (let i = 0; i < gridSize; i++) {
        gamePieces[i] = new Array(gridSize);

        for (let j = 0; j < gridSize; j++) {
            gridElement = document.createElement("div");
            gamePieces[i][j] = new Array(2);
            gridElement.className = "grid-piece";
            gridElement.setAttribute("draggable", false);

            gridElement.setAttribute(
                "ondragenter",
                "changeColor(" + i + "," + j + ")"
            );

            gridElement.setAttribute(
                "onclick",
                "changeColor(" + i + "," + j + ")"
            );

            gridContainer.append(gridElement);
            gamePieces[i][j][0] = gridElement;
            gamePieces[i][j][1] = 0;
        }
    }
}

function changeColor(i, j) {
    let piece = gamePieces[i][j][0];

    if (piece.style.backgroundColor == "black") {
        piece.style.backgroundColor = "transparent";
        piece.style.borderColor = "black";
    } else {
        piece.style.backgroundColor = "black";
        piece.style.borderColor = "#f3e7c1";
    }
    window.onclick = function (e) {
        if (e.altKey) {
            /*alt is down*/
            for (let k = 0; k < gridSize; k++) {
                piece = gamePieces[k][j][0];
                piece.style.backgroundColor = "black";
                piece.style.borderColor = "#f3e7c1";
            }
        }

        if (e.ctrlKey) {
            /*ctrl is down*/
            for (let k = 0; k < gridSize; k++) {
                piece = gamePieces[i][k][0];
                piece.style.backgroundColor = "black";
                piece.style.borderColor = "#f3e7c1";
            }
        }
    };

    window.ondragenter = function (e) {
        if (e.ctrlKey) {
            /*ctrl is down*/
            for (let k = 0; k < gridSize; k++) {
                piece = gamePieces[i][k][0];
                piece.style.backgroundColor = "black";
                piece.style.borderColor = "#f3e7c1";
            }
        }

        if (e.altKey) {
            /*alt is down*/
            for (let k = 0; k < gridSize; k++) {
                piece = gamePieces[k][j][0];
                piece.style.backgroundColor = "black";
                piece.style.borderColor = "#f3e7c1";
            }
        }
    };
}

function livePiecesSurrounding(i, j) {
    count = 0;

    if (i > 0) {
        if (j > 0)
            if (gamePieces[i - 1][j - 1][0].style.backgroundColor == "black")
                count++;

        if (gamePieces[i - 1][j][0].style.backgroundColor == "black") count++;

        if (j < gridSize - 1)
            if (gamePieces[i - 1][j + 1][0].style.backgroundColor == "black")
                count++;
    }

    if (j > 0)
        if (gamePieces[i][j - 1][0].style.backgroundColor == "black") count++;

    if (j < gridSize - 1)
        if (gamePieces[i][j + 1][0].style.backgroundColor == "black") count++;

    if (i < gridSize - 1) {
        if (j > 0)
            if (gamePieces[i + 1][j - 1][0].style.backgroundColor == "black")
                count++;

        if (gamePieces[i + 1][j][0].style.backgroundColor == "black") count++;

        if (j < gridSize - 1)
            if (gamePieces[i + 1][j + 1][0].style.backgroundColor == "black")
                count++;
    }

    return count;
}

function pauseGame() {
    settings.removeChild(settings.lastElementChild);
    settings.appendChild(play);
    clearInterval(interval);
}

function playGame() {
    let pauseButton = document.createElement("button");
    let intervalTime = document.getElementById("interval");

    if (intervalTime.value > 0 && intervalTime.value <= 10000) {
        pauseButton.innerText = "Pause";
        pauseButton.setAttribute("onclick", "pauseGame()");
        pauseButton.setAttribute("id", "play-button");

        settings.removeChild(settings.lastElementChild);
        settings.appendChild(pauseButton);

        interval = setInterval(playGameHelper, intervalTime.value);
    } else {
        alert("Set interval time in between 1 and 10,000");
    }
}
 
function playGameHelper() {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            gamePieces[i][j][1] = livePiecesSurrounding(i, j);
        }
    }

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            let piece = gamePieces[i][j][0];

            if (gamePieces[i][j][1] == 3) {
                piece.style.backgroundColor = "black";
                piece.style.borderColor = "#f3e7c1";
            }

            if (gamePieces[i][j][1] != 2 && gamePieces[i][j][1] != 3) {
                piece.style.backgroundColor = "transparent";
                piece.style.borderColor = "black";
            }
        }
    }
}
