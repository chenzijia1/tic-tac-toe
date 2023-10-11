interface ValidBodyHasWinContext {
    board: Array<Array<null | string>>;
    rowIndex: number;
    colIndex: number;
    winNum: number;
}
interface ValidBackDirectionContext {
    board: Array<Array<null | string>>;
    vectorsIndex: Array<number>;
    rowIndex: number;
    colIndex: number;
    winNum: number;
}
interface ValidGetCountNumContext {
    rowIndex: number;
    colIndex: number;
    board: Array<Array<null | string>>;
    vectorsIndex: Array<number>;
}
const VECTORS: Array<Array<number>> = [[0, 1], [1, 0], [1, 1], [1, -1]];// 四个方向的方向向量
/**
 * 判断是否胜利，分成四个方向判断
 * @params {number} rowIndex,colIndex 棋盘下标
 * @params {Array} board  棋盘
 * @params {number} winNum  获胜需要的数量
 * @returns {boolean} 是否有人获胜
 */
export  function getBodyHasWin (bodyHasWinContext: ValidBodyHasWinContext) : boolean {
    const { rowIndex, colIndex, board, winNum } = bodyHasWinContext;
    for (let index = 0; index < VECTORS.length; index++) {
        const enoughNumber = backDirection({ rowIndex, colIndex, board, vectorsIndex: VECTORS[index], winNum });
        if (enoughNumber) {
            return true;
        }
    }
    return false;
}
/**
 *每个方向分正方向和反方向判断
 * @param backDirectionContext 棋子下标，棋盘，方向向量和获胜数目
 * @returns 是否够数
 */
function backDirection (backDirectionContext: ValidBackDirectionContext) : boolean {
    const { rowIndex, colIndex, board, vectorsIndex, winNum } = backDirectionContext;
    const count: number = getCountNum({ rowIndex, colIndex, board, vectorsIndex });
    vectorsIndex[0] = -vectorsIndex[0];
    vectorsIndex[1] = -vectorsIndex[1];
    const backCount: number = getCountNum({ rowIndex, colIndex, board, vectorsIndex });
    if (count + backCount - 1 >= winNum) {
        return true;
    }
    return false;
}
/**
 *计算每个方向的数量
 * @param getCountNumContext 当前棋子下标，棋盘和方向向量
 * @returns 数量
 */
function getCountNum (getCountNumContext: ValidGetCountNumContext) : number {
    let { rowIndex, colIndex } = getCountNumContext;
    const { board, vectorsIndex } = getCountNumContext;
    let count: number = 0;
    const pieceType: (string | null) = board[rowIndex][colIndex];
    while (rowIndex < board.length && rowIndex >= 0 && colIndex < board[0].length && colIndex >= 0 && board[rowIndex][colIndex] === pieceType) {
        count++;
        rowIndex += vectorsIndex[0];
        colIndex += vectorsIndex[1];
    }
    return count;
}
