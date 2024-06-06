class SudokuGraph {
    constructor() {
        this.graph = {};
        this.initializeGraph();
    }

    initializeGraph() {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const key = `${row},${col}`;
                this.graph[key] = {
                    value: 0,
                    neighbors: this.getNeighbors(row, col)
                };
            }
        }
    }

    getNeighbors(row, col) {
        const neighbors = new Set();
        for (let i = 0; i < 9; i++) {
            if (i !== col) {
                neighbors.add(`${row},${i}`);
            }
            if (i !== row) {
                neighbors.add(`${i},${col}`);
            }
        }
        const startRow = 3 * Math.floor(row / 3);
        const startCol = 3 * Math.floor(col / 3);
        for (let r = startRow; r < startRow + 3; r++) {
            for (let c = startCol; c < startCol + 3; c++) {
                if (r !== row || c !== col) {
                    neighbors.add(`${r},${c}`);
                }
            }
        }

        return Array.from(neighbors).map(n => n.split(',').map(Number));
    }
}

function isValid(sudokuGraph, row, col, value) {
    const key = `${row},${col}`;
    for (const [r, c] of sudokuGraph.graph[key].neighbors) {
        if (sudokuGraph.graph[`${r},${c}`].value === value) {
            return false;
        }
    }
    return true;
}

function isValidBoard(sudokuGraph) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const key = `${row},${col}`;
            const value = sudokuGraph.graph[key].value;
            if (value !== 0 && !isValid(sudokuGraph, row, col, value)) {
                return false;
            }
        }
    }
    return true;
}

function solveSudoku(sudokuGraph, depth = 0, maxDepth = 10000) {
    if (depth > maxDepth) {
        return false;
    }

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const key = `${row},${col}`;
            if (sudokuGraph.graph[key].value === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (isValid(sudokuGraph, row, col, num)) {
                        sudokuGraph.graph[key].value = num;
                        if (solveSudoku(sudokuGraph, depth + 1, maxDepth)) {
                            return true;
                        }
                        sudokuGraph.graph[key].value = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function setupBoardFromHTML(cells, sudokuGraph) {
    let index = 0;
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const value = parseInt(cells[index].textContent) || 0;
            sudokuGraph.graph[`${row},${col}`].value = value;
            index++;
        }
    }
}

function getSolvedBoard(sudokuGraph) {
    const board = Array.from({ length: 9 }, () => Array(9).fill(0));
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            board[row][col] = sudokuGraph.graph[`${row},${col}`].value;
        }
    }
    return board;
}

function solveAndGetBoard(cells) {
    const sudokuGraph = new SudokuGraph();
    setupBoardFromHTML(cells, sudokuGraph);

    if (!isValidBoard(sudokuGraph)) {
        return Array.from({ length: 9 }, () => Array(9).fill(0));
    }

    if (solveSudoku(sudokuGraph)) {
        return getSolvedBoard(sudokuGraph);
    } else {
        return Array.from({ length: 9 }, () => Array(9).fill(0));
    }
}