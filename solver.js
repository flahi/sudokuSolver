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
                neighbors.add([row, i]);
            }
            if (i !== row) {
                neighbors.add([i, col]);
            }
        }
        const startRow = 3 * Math.floor(row / 3);
        const startCol = 3 * Math.floor(col / 3);
        for (let r = startRow; r < startRow + 3; r++) {
            for (let c = startCol; c < startCol + 3; c++) {
                if (r !== row || c !== col) {
                    neighbors.add([r, c]);
                }
            }
        }

        return Array.from(neighbors);
    }
}