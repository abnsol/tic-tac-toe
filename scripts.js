function addGlobalEventListeners(type, selector, callback) {
    document.addEventListener(type, e => {
        if (e.target.matches(selector)) callback(e);
    });
}

function displayName(target,name){
    target.textContent = name;
}

function gameBoard(){
    let board = [['-','-','-'],['-','-','-'],['-','-','-']]; 

    const displayBoard = function(r,c,letter){
        const rowAll = document.querySelectorAll(`.row`);
        const row = rowAll[r];
        const col = row.children[c];
        col.textContent = letter;
    }

    const changeBoard = function(r,c,letter){
        board[r][c] = letter;
        displayBoard(r,c,letter);
        
    }

    const clearBoard = function(){
        board = [['-','-','-'],['-','-','-'],['-','-','-']];
        for (let i = 0;i < 3;i++){
            for (let j = 0;j < 3;j++){
                displayBoard(i,j,'-');
            }
        }
    }

    const equalArr = function(arr1,arr2){
        for(let i = 0; i < 3;i++){
            if(arr1[i] !== arr2[i]) return false;
        }
        return true;
    }

    const gameOver = function(){
        const winingCondition = [['o','o','o'],['x','x','x']];

        for(let i = 0;i < 3;i++){
            for (let j = 0;j < 2; j++){
                if (equalArr(winingCondition[j],board[i])) return true;
            }
        }

        for(let i = 0;i < 3;i++){
            let col = []
            for(let j = 0;j < 3;j++){
                col.push(board[j][i])
            }
            for (let k = 0;k < 2; k++){
                if (equalArr(winingCondition[k],col)) return true;
            }
        }

        let diagLeft = [board[0][0],board[1][1],board[2][2]];
        let diagRight = [board[0][2],board[1][1],board[2][0]];

        for (let i = 0;i < 2; i++){
            if (equalArr(winingCondition[i],diagLeft)) return true;
            if (equalArr(winingCondition[i],diagRight)) return true;
        }

        return false;
    };

    return {displayBoard,changeBoard,clearBoard,gameOver};
}


function player(name,letter){
    this.name = name;
    this.letter = letter;
    this.score = 0;

    const getName = () => name;
    const getLetter = () => letter;
    const addScore = () => score += 1;
    const getScore = () => score;

    return {getName,getLetter,getScore,addScore};
}

function gameLogic(playerOne,playerTwo){
    const gameOverModal = document.querySelector('#gameOver');
    const winnerName = gameOverModal.firstElementChild;
    const tic = gameBoard();
    tic.clearBoard();
    const player1 = playerOne;
    const player2 = playerTwo;
    let turn = 0;          // player turn starts from player 1
    let gameOver = false;  // gameOver state
    let tie = 9;           // tie ends at 9 moves
    let visited = [];   // don't repeat a point


    function arraysEqual(arr1, arr2) {
        return arr1.every((val, index) => val === arr2[index]);
    }

    function hasVisited(row, col) {
        return visited.some(coords => arraysEqual(coords, [row, col]));
    }

    addGlobalEventListeners('click','.col',(e) => {
        const row = Number(e.target.parentElement.id);
        const col = Number(e.target.id);

        if (hasVisited(row,col)){
            return;
        }
            
        visited.push([row,col]);

        if (turn === 0){
            tic.changeBoard(row,col,player1.getLetter());
        }else if(turn === 1){
            tic.changeBoard(row,col,player2.getLetter());
        }
        
        turn = 1 - turn;
        tie--;
        gameOver = tic.gameOver();

        if (gameOver){
            tie = 9;
            gameOver = false;
            visited = [];
            let winner = undefined;
            if (1 - turn === 0){
                winner = player1.getName();
            }else{
                winner = player2.getName();
            }

            winnerName.textContent = winner + ' Wins!';
            gameOverModal.showModal();
            
            addGlobalEventListeners('click','#gameOver button',(e) => {
                tic.clearBoard();
                gameOverModal.close();
            });

        }else if(tie == 0){
            winnerName.textContent = "Tie!" 
            gameOverModal.showModal();
            tie = 9;
            visited = []
            addGlobalEventListeners('click','#gameOver button',(e) => {
                tic.clearBoard();
                gameOverModal.close();
                
            });
        }
    });
}

const play = (function(){
    const modal = document.querySelector('#modal');
    const form = document.querySelector('#form');
    const player1name = document.querySelector('#playerOne .name');
    const player2name = document.querySelector('#playerTwo .name');
    
    addGlobalEventListeners('click','#play',(e) => {
        modal.showModal();
        addGlobalEventListeners('click','form button',(e) =>{
            const formData = new FormData(form);
            const playerOne = formData.get('playerOne');
            const letterOne = formData.get('player1letter');
            const playerTwo = formData.get('playerTwo');
            const letterTwo = formData.get('player2letter');
    
            const player1 = player(playerOne,letterOne);
            const player2 = player(playerTwo,letterTwo);
            displayName(player1name,playerOne);
            displayName(player2name,playerTwo);
            gameLogic(player1,player2); 
        })
    });
})();