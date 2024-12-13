document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const scoreElement = document.getElementById('score');
    const restartButton = document.getElementById('restart');
    
    const size = 4;
    let board = [];
    let score = 0;

    function initGame() {
        board = Array(size).fill().map(() => Array(size).fill(0));
        score = 0;
        updateBoard();
        addRandomTile();
        addRandomTile();
    }

    function addRandomTile() {
        const emptyTiles = [];
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (board[r][c] === 0) {
                    emptyTiles.push({ r, c });
                }
            }
        }
        if (emptyTiles.length === 0) return;

        const randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        const value = Math.random() < 0.9 ? 2 : 4;
        board[randomTile.r][randomTile.c] = value;
        updateBoard();
    }

    function updateBoard() {
        gameBoard.innerHTML = '';
        board.forEach((row, rIdx) => {
            row.forEach((tile, cIdx) => {
                const tileElement = document.createElement('div');
                tileElement.classList.add('tile');
                if (tile !== 0) {
                    tileElement.classList.add(`tile-${tile}`);
                    tileElement.textContent = tile;
                }
                gameBoard.appendChild(tileElement);
            });
        });
        scoreElement.textContent = `分数: ${score}`;
    }

    function slideLeft() {
        let moved = false;
        board.forEach((row, rowIdx) => {
            const nonZeroTiles = row.filter(val => val !== 0);
            const newRow = [];
            while (nonZeroTiles.length) {
                const tile = nonZeroTiles.shift();
                if (nonZeroTiles[0] === tile) {
                    newRow.push(tile * 2);
                    nonZeroTiles.shift();
                    score += tile * 2;
                } else {
                    newRow.push(tile);
                }
            }
            while (newRow.length < size) newRow.push(0);
            if (!moved && !newRow.every((val, idx) => val === row[idx])) {
                moved = true;
            }
            board[rowIdx] = newRow;
        });
        return moved;
    }

    function rotateBoard() {
        const newBoard = board[0].map((_, colIdx) => board.map(row => row[colIdx]));
        board = newBoard;
    }

    function handleKeyPress(e) {
        let moved = false;
        if (e.key === 'ArrowLeft') {
            moved = slideLeft();
        } else if (e.key === 'ArrowRight') {
            board.forEach(row => row.reverse());
            moved = slideLeft();
            board.forEach(row => row.reverse());
        } else if (e.key === 'ArrowUp') {
            rotateBoard();
            moved = slideLeft();
            rotateBoard();
            rotateBoard();
            rotateBoard();
        } else if (e.key === 'ArrowDown') {
            moved = slideDown(); // 使用 slideDown 直接处理下移
        }
        if (moved) {
            addRandomTile();
        }
    }
    

    function slideDown() {
        let moved = false;
        // 对每一列进行处理
        for (let c = 0; c < size; c++) {
            let column = [];
            // 提取每一列的数据
            for (let r = 0; r < size; r++) {
                column.push(board[r][c]);
            }
    
            // 合并列数据
            const mergedColumn = slideColumn(column);
    
            // 将合并后的列数据放回原来位置
            for (let r = 0; r < size; r++) {
                if (board[r][c] !== mergedColumn[r]) {
                    moved = true;
                }
                board[r][c] = mergedColumn[r];
            }
        }
        return moved;
    }
    
    function slideColumn(column) {
        // 过滤出非零的数字
        const nonZeroTiles = column.filter(val => val !== 0);
        const newColumn = [];
        while (nonZeroTiles.length) {
            const tile = nonZeroTiles.pop();  // 从尾部开始操作，模拟下移
            if (nonZeroTiles[nonZeroTiles.length - 1] === tile) {
                newColumn.push(tile * 2);
                nonZeroTiles.pop();
                score += tile * 2;
            } else {
                newColumn.push(tile);
            }
        }
        // 填充剩余的零
        while (newColumn.length < size) {
            newColumn.unshift(0);  // 把零放到前面，模拟下移
        }
        return newColumn;
    }
    
    
    

    restartButton.addEventListener('click', initGame);
    window.addEventListener('keydown', handleKeyPress);

    initGame();
});
