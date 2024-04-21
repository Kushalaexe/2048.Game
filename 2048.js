var board;
var score = 0;
var row = 4;
var columns = 4;

window.onload = function () {
    setGame();

    const restartButton = document.getElementById('restartButton');
    restartButton.addEventListener('click', function () {
        resetGame();
    })

    const replayButton = document.getElementById('replayButton')
    replayButton.addEventListener('click', function () {
        document.addEventListener('keyup', KeyPress)
        resetGame();
    })
    if (score < 2048) {
        document.addEventListener('keyup', KeyPress)
    }
}


function setGame() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]

    for (let r = 0; r < row; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            updateTile(tile, num);
            document.getElementById("board").append(tile)

        }
    }
    setTwo();
    setTwo();
}

function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = "";
    tile.classList.add('tile');
    if (num > 0) {
        tile.innerText = num;
        if (num == 2048) {
            showWinPopup();
            document.removeEventListener('keyup', KeyPress)
            disableTouchEvents();
        }
        else if (num <= 2048) {
            tile.classList.add('x' + num.toString());
        } else {
            tile.classList.add("x2048");
        }
    }
}


//To use slide events 
function KeyPress(e) {
    if (e.code == "ArrowLeft") {
        if (slideLeft()) {
            showGameOverPopup();
        }

        else {
            setTwo();
        }
    } else if (e.code == "ArrowRight") {
        if (slideRight()) {
            showGameOverPopup();
        }

        else {
            setTwo();
        }
    } else if (e.code == "ArrowUp") {
        if (slideUp()) {
            showGameOverPopup();
        }

        else {
            setTwo();
        }
    } else if (e.code == "ArrowDown") {
        if (slideDown()) {
            showGameOverPopup();
        }
        else {
            setTwo();
        }
    }
    document.getElementById("score").innerText = score;
}



function slideLeft() {
    for (let r = 0; r < row; r++) {
        let row = board[r];
        row = slide(row);
        board[r] = row;
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
    return isGameOver();
}

function slideRight() {
    for (let r = 0; r < row; r++) {
        let row = board[r];
        row.reverse();
        row = slide(row);
        row.reverse();
        board[r] = row;
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
    return isGameOver();
}

function slideUp() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slide(row);
        for (let r = 0; r < columns; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
    return isGameOver();
}

function slideDown() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse();
        row = slide(row);
        row.reverse();
        for (let r = 0; r < columns; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
    return isGameOver();
}


// To add tiles and removing zero(empty space)
function slide(row) {
    row = filterZero(row);

    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] == row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i];
        }
    }
    row = filterZero(row);
    while (row.length < columns) {
        row.push(0);
    }
    return row;
}

function filterZero(row) {
    return row.filter(num => num != 0);
}


// To whether there is any zero or not
function hasEmptyTile() {
    for (let r = 0; r < row; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0)
                return true;
        }
    }
    return false;
}


//To spawn number 2 at random place
function setTwo() {
    if (!hasEmptyTile()) {
        return;
    }

    let found = false;
    while (!found) {
        let r = Math.floor(Math.random() * row);
        let c = Math.floor(Math.random() * columns);
        if (board[r][c] == 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = '2';
            tile.classList.add('x2');
            found = true;

        }
    }
}

function showWinPopup() {
    const won = document.getElementById('won')
    won.style.display = 'block'
    gameWon = true

}


function showGameOverPopup() {
    const gameOverPopup = document.getElementById('game-over-popup');
    gameOverPopup.style.display = 'block';
    gameWon = true
}

function isGameOver() {
    // Check if there are no empty tiles
    if (!hasEmptyTile()) {
        if (!canMoveLeft() && !canMoveRight() && !canMoveUp() && !canMoveDown()) {
            showGameOverPopup();
            return true;
        }
    }
    return false;
}


// Check the tiles can moveable or not when popup won or gameover
function canMoveLeft() {
    for (let r = 0; r < row; r++) {
        for (let c = 1; c < columns; c++) {
            if (board[r][c] !== 0 && (board[r][c - 1] === 0 || board[r][c - 1] === board[r][c])) {
                return true;
            }
        }
    }
    return false;
}

function canMoveRight() {
    for (let r = 0; r < row; r++) {
        for (let c = 0; c < columns - 1; c++) {
            if (board[r][c] !== 0 && (board[r][c + 1] === 0 || board[r][c + 1] === board[r][c])) {
                return true;
            }
        }
    }
    return false;
}

function canMoveUp() {
    for (let c = 0; c < columns; c++) {
        for (let r = 1; r < row; r++) {
            if (board[r][c] !== 0 && (board[r - 1][c] === 0 || board[r - 1][c] === board[r][c])) {
                return true;
            }
        }
    }
    return false;
}

function canMoveDown() {
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < row - 1; r++) {
            if (board[r][c] !== 0 && (board[r + 1][c] === 0 || board[r + 1][c] === board[r][c])) {
                return true;
            }
        }
    }
    return false;
}

// Reset game 
function resetGame() {
    clearBoard();
    score = 0
    setGame2();
    hideGameOverPopup();
    hideWinGame();

    gameWon = false

    const swipeElement = document.getElementById('board')
    swipeElement = document.addEventListener('touchstart', handleTouchStart, false)
    swipeElement = document.addEventListener('touchmove', handleTouchMove, false)
    swipeElement = document.addEventListener('touchend', handleTouchEnd, false)

}

//Clear the board
function clearBoard() {
    for (let r = 0; r < row; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString())
            tile.innerText = ''
            tile.classList = ''
            tile.classList.add('tile')
        }
    }
}

// Hide Won Popup
function hideWinGame() {
    const gameWin = document.getElementById('won');
    gameWin.style.display = 'none'
}

// Hide gameOver popup
function hideGameOverPopup() {
    const gameOverPopup = document.getElementById('game-over-popup');
    gameOverPopup.style.display = 'none';
}

// Set the board after restarting game or once clicked the replay button
function setGame2() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]
    setTwo()
    setTwo()
}


// NavBar
function openNav() {
    document.getElementById("mySidenav").setAttribute("style", "width: 347px !important;");
    document.getElementById("main").setAttribute("style", "margin-left: 350px !important;");
    document.body.setAttribute("style", "background-color: rgba(0,0,0,0.4) !important;");

}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById('main').style.marginLeft = '0';
    document.body.style.backgroundColor = "#68B984";
}


//Events For Mobile 
var gameWon = false;
var touchStartX, touchStartY, touchEndX, touchEndY;

const swipeElement = document.getElementById('board');
swipeElement.addEventListener('touchstart', handleTouchStart, false);
swipeElement.addEventListener('touchmove', handleTouchMove, false);
swipeElement.addEventListener('touchend', handleTouchEnd, false);

function handleTouchStart(event) {
    if (gameWon) {
        return
    }
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event) {
    if (gameWon) {
        return
    }
    // Prevent scrolling
    event.preventDefault();
}


function handleTouchEnd(event) {
    if (gameWon) {
        return
    }
    touchEndX = event.changedTouches[0].clientX;
    touchEndY = event.changedTouches[0].clientY;

    handleSwipe();
}


const sensitivity = 50;
function handleSwipe() {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > sensitivity) {
            // Swipe right
            if (slideRight()) {
                showGameOverPopup();
            } else {
                setTwo();
            }
        } else if (deltaX < -sensitivity) {
            // Swipe left
            if (slideLeft()) {
                showGameOverPopup();
            } else {
                setTwo();
            }
        }
    } else {
        // Vertical swipe
        if (deltaY > sensitivity) {
            // Swipe down
            if (slideDown()) {
                showGameOverPopup();
            } else {
                setTwo();
            }
        } else if (deltaY < - sensitivity) {
            // Swipe up
            if (slideUp()) {
                showGameOverPopup();
            } else {
                setTwo();
            }
        }
    }

    document.getElementById('score').innerText = score;
}

function disableTouchEvents() {
    document.removeEventListener('touchstart', handleTouchStart, false);
    document.removeEventListener('touchmove', handleTouchMove, false);
    document.removeEventListener('touchend', handleTouchEnd, false);
}
