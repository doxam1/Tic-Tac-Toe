const Gameboard = (() => {

    let gameBoard = ['','','','','','','','','']

    const render = () => {
        let boardHtml = '';
        gameBoard.forEach((square, index) => {
            boardHtml += `<div class='square' id='square-${index}'> ${square} </div>`        
        });
        document.querySelector('.gameBoard').innerHTML = boardHtml; 
        const squares = document.querySelectorAll('.square');
        squares.forEach(square => {
            square.addEventListener('click', Game.handleClick)
        })
    }
    const update = (index, value) => {
        gameBoard[index] = value;
        render();
    }

    const getGameBoard = () => {
        return gameBoard;
    }
    
    return {
        getGameBoard,
        render,
        update
    }
    
})();

/////////////////////////////////////////
const createPlayer = (name, mark) => {
    return {
        name,
        mark
    }
}


//////////////////////////////////////////////
const Game = (() => {
    let players = [];
    let currentPlayerIndex;
    let gameOver;

    const startGame = () => {
        players = [
            createPlayer(document.querySelector('#playerOne').value, 'X'),
            createPlayer(document.querySelector('#playerTwo').value, 'O')
        ]
        currentPlayerIndex = 0;
        gameOver = false;
        Gameboard.render();
        const squares = document.querySelectorAll('.square');
        squares.forEach(square => {
            square.addEventListener('click', handleClick)
        })

    }
    const handleClick = (e) => {
        if (gameOver) return;
        if (e.target.textContent.trim() != '') return;
        let index = parseInt(e.target.id.split('-')[1])
        Gameboard.update(index, players[currentPlayerIndex].mark)

        if (checkForWin(Gameboard.getGameBoard(), players[currentPlayerIndex].mark)) {
            gameOver = true;
            document.querySelector('.results').textContent += `${players[currentPlayerIndex].name} won!`
        } else if (checkForTie(Gameboard.getGameBoard())) {
            gameOver = true;
            document.querySelector('.results').textContent += "It's a Tie!";
        }

        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;

    }
    const cleanBoard = () => {
        for (i=0; i<9 ; i++ ) {
            Gameboard.update(i, '');
            gameOver = false;
        }
        document.querySelector('.results').textContent = 'Results: '
    }

    const checkForTie = (board) => {
        return board.every(cell => cell !== '');
    }

    const checkForWin = (board) => {
        const winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ]
        for (i = 0; i < winningCombinations.length; i++){
            const [a, b, c] = winningCombinations[i];
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
               return true; 
            }
        } return false;
    }

    return {
        cleanBoard,
        startGame,
        handleClick
    }



})();



const newGameBtn = document.querySelector('.newGameBtn');
const newGameInputsDialog = document.querySelector('.newGameInputs');
const startGameBtn = document.querySelector('.startGame');
const mainGameDiv = document.querySelector('.mainGame');
const cleanBoard = document.querySelector('.reasetBoardBtn');

cleanBoard.addEventListener('click', Game.cleanBoard)

newGameBtn.addEventListener('click', ()=>{
    newGameInputsDialog.showModal();
    document.querySelector('.playerXname').textContent = 'player X: ';
    document.querySelector('.playerOname').textContent = 'player O: ';
    document.querySelector('.results').textContent = 'Results: '
})

startGameBtn.addEventListener('click', ()=>{
    newGameInputsDialog.close();
    document.querySelector('.playerXname').textContent += document.querySelector('#playerOne').value;
    document.querySelector('.playerOname').textContent += document.querySelector('#playerTwo').value;   

    mainGameDiv.style.display = 'flex';
    for (i=0; i<9 ; i++ ) {
        Gameboard.update(i, '');
    }
    Game.startGame();
})
