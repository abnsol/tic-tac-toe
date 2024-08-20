function gameBoard(){
    let board = [['-','-','-'],['-','-','-'],['-','-','-']]; 

    const displayBoard = function(){
        for(let i = 0;i < 3;i++){
            console.log(board[i]);
        }
    }

    const changeBoard = function(r,c,letter){
        if (board[r][c] == 'x' || board[r][c] == 'o') return 'please enter correct input';

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

function gameLogic(){
    const tic = gameBoard();
    const player1 = player('Ebenezer','x');
    const player2 = player('Solomon','o');
    let turn = 0;          // player turn starts from player 1
    let gameOver = false; // gameOver state
    let tie = 9;         // tie ends at 9 moves
    const visited = []; // don't repeat a point

    function inbound(r,c){ 
        return ((0 <= r && r < 3) && (0 <= c && c < 3));
    } 

    function arraysEqual(arr1, arr2) {
        return arr1.every((val, index) => val === arr2[index]);
    }

    function hasVisited(row, col) {
        return visited.some(coords => arraysEqual(coords, [row, col]));
    }

    do{
        let r = Number(prompt("row:"));
        let c = Number(prompt("col:"));
    
        while (!inbound(r,c) || hasVisited(r,c)){
            r = Number(prompt("row:"));
            c = Number(prompt("col:"));
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
    }while(!gameOver && tie > 0);

    if (gameOver){
        return `player ${2 - turn}`;
    }else{
        return 'tie';   
    }
}

