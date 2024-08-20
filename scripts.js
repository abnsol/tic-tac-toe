function gameBoard(){
    let board = [['-','-','-'],['-','-','-'],['-','-','-']]; 

    const displayBoard = function(){
        for(let i = 0;i < 3;i++){
            console.log(board[i]);
        }
    }

    const changeBoard = function(r,c,letter){

        board[r][c] = letter;
        displayBoard();
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

    return {displayBoard,changeBoard,gameOver};
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
    const tic = gameBoard();
    const player1 = playerOne;
    const player2 = playerTwo;
    let turn = 0;          // player turn starts from player 1
    let gameOver = false; // gameOver state
    let tie = 9;         // tie ends at 9 moves
    const visited = []; // don't repeat a point

    function arraysEqual(arr1, arr2) {
        return arr1.every((val, index) => val === arr2[index]);
    }

    function hasVisited(row, col) {
        return visited.some(coords => arraysEqual(coords, [row, col]));
    }

    
    if (hasVisited(r,c)){
        return;
    }
        
    visited.push([r,c]);
    if (turn === 0){
        tic.changeBoard(r,c,player1.getLetter());
    }else{
        tic.changeBoard(r,c,player2.getLetter());
    }

    turn = 1 - turn;
    tie--;
    gameOver = tic.gameOver();
    

    if (gameOver){
        return `player ${2 - turn}`;
    }else{
        return 'tie';   
    }
}

const play = (function(){
    const modal = document.querySelector('#modal');
    const form = document.querySelector('#form');
    const player1name = document.querySelector('#playerOne .name');
    const player2name = document.querySelector('#playerTwo .name');

    function addGlobalEventListeners(type, selector, callback) {
        document.addEventListener(type, e => {
            if (e.target.matches(selector)) callback(e);
        });
    }

    function displayName(target,name){
        target.textContent = name;
    }

    addGlobalEventListeners('click','button',(e) => {
        modal.showModal();
        const formData = new FormData(form);
        const playerOne = formData.get('playerOne');
        const letterOne = formData.get('player1letter');
        const playerTwo = formData.get('playerTwo');
        const letterTwo = formData.get('player2letter');

        const player1 = player(playerOne,letterOne);
        const player2 = player(playerTwo,letterTwo);
        displayName(player1name,playerOne);
        displayName(player2name,playerTwo);

        // gameLogic(player1,player2);       
    });

    addGlobalEventListeners('click','.col',(e) => {
        const parent = Number(e.target.parentElement.id);
        const child = Number(e.target.id);
        console.log(parent + " " + child);
    });

})();