var board;
var score = 0;
var row = 4;
var columns = 4;

window.onload = function () {
    setGame();

    const restartButton = document.getElementById('restartButton');
    restartButton.addEventListener('click',function(){
    resetGame();
    })
    const replayButton= document.getElementById('replayButton')
    replayButton.addEventListener('click',function(){
    document.addEventListener('keyup',KeyPress)
    resetGame();
    })
    if(score <2048){
        document.addEventListener('keyup',KeyPress)
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

function KeyPress (e) {
    if (e.code == "ArrowLeft") {
        if (slideLeft()) {
            showGameOverPopup();
        }
      
        else  {
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

function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = "";
    tile.classList.add('tile');
    if (num > 0) {
        tile.innerText = num;
        if (num == 2048){
            showWinPopup();
            document.removeEventListener('keyup',KeyPress)
        }
        else if (num <= 2048) {
            tile.classList.add('x' + num.toString());
          
        } else {
            tile.classList.add("x4096");
        }
    }
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

function hasEmptyTile() {
    for (let r = 0; r < row; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0)
                return true;
        }
    }
    return false;
}

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


function showWinPopup(){
    const won = document.getElementById('won')
    won.style.display='block'
}


function showGameOverPopup() {
    const gameOverPopup = document.getElementById('game-over-popup');
    gameOverPopup.style.display = 'block';
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

function resetGame() {
    clearBoard();
    score=0
    setGame2();
    hideGameOverPopup();
    hideWinGame();
}

function clearBoard(){
    for (let r=0;r<row;r++){
        for(let c=0;c<columns;c++){
            let tile=document.getElementById(r.toString()+"-"+c.toString())
            tile.innerText=''
            tile.classList=''
            tile.classList.add('tile')
        }
    }
}
function hideWinGame(){
    const gameWin = document.getElementById('won');
    gameWin.style.display= 'none'
}
function hideGameOverPopup() {
    const gameOverPopup = document.getElementById('game-over-popup');
    gameOverPopup.style.display = 'none';
}

function setGame2(){
    board = [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ]
    setTwo()
    setTwo()
}

const backgroundMusic=document.getElementById('backgroundMusic')


function toggleMute(){
   
    backgroundMusic.muted = !backgroundMusic.muted;
    if(backgroundMusic.muted){
        
        document.getElementById('muteIcon').src='mute-copy.png'
    }
    else{
        document.getElementById('muteIcon').src='volume-high-solid-copy.png'
    }
}

function openNav() {
    document.getElementById("mySidenav").style.width = "350px";
    document.getElementById("main").style.marginLeft="350px";
    document.body.style.backgroundColor="rgba(0,0,0,0.4)";
  }
  
  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById('main').style.marginLeft='0';
    document.body.style.backgroundColor="#68B984";
  }