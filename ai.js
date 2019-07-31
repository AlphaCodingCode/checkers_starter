function moveAI() {
    let move = minimax(cloneBoard(board), 4, 2);
    doMove(board, move.m, move.optId);
}


function minimax(gBoard, depth, maximizingPlayer) {

}


function checkTerminal(gBoard, playerId) {
    return true;
}


function boardHeuristic(gBoard, playerId) {
    let score = 0;
    return score;
}
