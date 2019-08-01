function boardFindNeighbours() {
    for (let rows = 0; rows < 8; rows++) {
        for (let cols = 0; cols < 8; cols++) {
            board[rows][cols].findNeighbours();
        }
    }
}


function doMove(gBoard, toMove, optId) {
    let row = toMove.r;
    let col = toMove.c;
    let endMove = toMove.options[optId].move;
    let purge = toMove.options[optId].purge;
    gBoard[endMove.r][endMove.c] = new Piece(endMove.c, endMove.r, toMove.color, toMove.id);
    gBoard[endMove.r][endMove.c].king = toMove.king;
    gBoard[toMove.r][toMove.c] = new Piece(toMove.c, toMove.r, color(0, 0, 0), 0);
    if (purge) {
        gBoard[purge.r][purge.c] = new Piece(purge.c, purge.r, color(0, 0, 0), 0);
    }
}


function cloneBoard(gBoard) {
    // create a new 2D array
    let newBoard = [];
    for (let row = 0; row < 8; row++) {
        newBoard.push([]);
    }

    // create new pieces in each position of the board
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            newBoard[row][col] = new Piece(col, row, gBoard[row][col].color, gBoard[row][col].id);
            newBoard[row][col].king = gBoard[row][col].king;
        }
    }

    // update neighbours of new board
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            newBoard[row][col].findNeighbours();
        }
    }

    // update possible moves for each neighbour
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            newBoard[row][col].possibleMoves();
        }
    }
    return newBoard;
}


class Piece {
    constructor(col, row, color, id) {
        this.c = col;
        this.r = row;
        this.id = id;
        this.size =  width > height ? round(height / 8) : round(width / 8);
        this.color = color;
        this.neighbours = [];
        this.options = [];
        this.king = false;
    }

    findNeighbours() {
        this.c - 1, this.r + 1,
        this.c - 1, this.r + 1,
        this.neighbours = [];
        if (this.c > 0 && this.r > 0) {
            this.neighbours.push(board[this.r - 1][this.c - 1]);
        }
        if (this.c < 7 && this.r > 0) {
            this.neighbours.push(board[this.r - 1][this.c + 1]);
        }
        if (this.c > 0 && this.r < 7) {
            this.neighbours.push(board[this.r + 1][this.c - 1]);
        }
        if (this.c < 7 && this.r < 7) {
            this.neighbours.push(board[this.r + 1][this.c + 1]);
        }
    }


    possibleMoves() {
        this.options = [];
        for (let i = 0; i < this.neighbours.length; i++) {
            // id 1 shouldn't consider neighbours above, unless king
            if (this.id == 1 && this.neighbours[i].r < this.r && !this.king)
                continue;
            // id 2 shouldn't consider neighbours below, unless king
            if (this.id == 2 && this.neighbours[i].r > this.r && !this.king)
                continue;

            if (this.neighbours[i].id == 0) {
                this.options.push({move : this.neighbours[i], purge : null});
            } else {
                // check if opposing ID
                if (this.neighbours[i].id != this.id) {
                    // check if position in direction is open, if so, possible to jump
                    let xDir = this.neighbours[i].c - this.c;
                    let yDir = this.neighbours[i].r - this.r;
                    if (
                        // check within boundary X dir
                        this.c + (xDir * 2) <= 7 && this.c + (xDir * 2) >= 0 &&
                        // check within boundary Y dir
                        this.r + (yDir * 2) <= 7 && this.r + (yDir * 2) >= 0 &&
                        // check square is open
                        board[this.r + (yDir * 2)][this.c + (xDir * 2)].id == 0
                    ) {
                        // available to jump
                        this.options.push({move : board[this.r + (yDir * 2)][this.c + (xDir * 2)], purge : this.neighbours[i]});
                    }
                }
            }
        }
    }

    update() {
        // check if piece is kinged
        if (this.king)
            return;
        if (this.id == 1 && this.r == 7)
            this.king = true;
        else if (this.id == 2 && this.r == 0)
            this.king = true;
    }


    render() {
        if (this.id != 0) {
            fill(this.color);
            ellipse(this.c * this.size + (this.size / 2), this.r * this.size + (this.size / 2), this.size, this.size);
            if (this.king) {

                fill(0);
                ellipse(this.c * this.size + (this.size / 2), this.r * this.size + (this.size / 2), this.size / 4, this.size / 4);
            }
        }
    }


}
