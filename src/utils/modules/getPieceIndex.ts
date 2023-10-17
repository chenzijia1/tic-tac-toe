import { getBodyHasWin, getWinNum } from './chessUtil';
import { depthClone } from './depthClone';
import { initial } from '../../store/reducers/gameReducer';
interface ValidPieceIndexContext {
    board: Array<Array<string | null>>;
    historyPath: Array<Array<number>>;
    aiPlayer: string;
}
interface ValidCalculateScoreContext {
    board: Array<Array<string | null>>;
    aiPlayer: string;
}
interface ValidAccordWinNumContext {
    board: Array<Array<string | null>>;
    player: string;
}
interface ValidBestScoreContext {
    row: number;
    col: number;
    board: Array<Array<string | null>>;
    depth: number;
    historyPath: Array<Array<number>>;
    aiPlayer: string;
    alpha: number;
    beta: number;
}
const { GAME_CATEGORY, ticIndex } = initial;
const DEPTH: number = 6; // 递归深度，放子层数
const MAX_NUM: number = 10000000; // 用来检测AI胜利的深度，找到最近的获胜路
/**
 *
 *  获取最大分数的下标
 */
export function getPieceIndex ({ historyPath, board, aiPlayer }: ValidPieceIndexContext): string {
    const depth: number = 0;
    let maxScore: number = -Infinity;
    let maxRow: number = 0;
    let maxCol: number = 0;
    let alpha: number = -Infinity;
    for (let row: number = 0; row < board.length; row++) {
        for (let col: number = 0; col < board[row].length; col++) {
            if (board[row][col] !== null) {
                continue;
            }
            board[row][col] = aiPlayer;
            historyPath.push([row, col]);
            const score =  getBestScore({ row, col, board, historyPath, depth: depth + 1, alpha, beta: Infinity, aiPlayer });
            board[row][col] = null;
            historyPath.pop();
            if (score >= maxScore) {
                maxScore = score;
                maxRow = row;
                maxCol = col;
            }
            alpha = Math.max(alpha, maxScore);
        }
    }
    return `${maxRow}-${maxCol}`;
}
/**
 *  求极大极小值递归
 *
 */
function getBestScore ({ row, col, board, depth, alpha, beta, historyPath, aiPlayer }: ValidBestScoreContext) : number {
    const ticGame: ValidGAME_CATEGORY = GAME_CATEGORY[ticIndex];
    const currentPlayer: string = ticGame.chessPlayer[historyPath.length % 2];
    // 判断玩家是否获胜，AI获胜返回极大值，反之返回极小值
    if (getBodyHasWin({ board, rowIndex: row, colIndex: col, winNum: ticGame.winNum })) {
        if (currentPlayer !== aiPlayer) {
            return MAX_NUM - depth;
        }
        return -Infinity;
    }
    // 到规定深度开始计算评分
    if (depth === DEPTH) {
        return calculateScore({ board, aiPlayer });
    }
    if (historyPath.length === Math.pow(board.length, 2)) return 0;
    let  bestScore: number = -Infinity;
    // 表示人落子
    if (currentPlayer !== aiPlayer) {
        bestScore = Infinity;
    }
    for (let rowIndex: number = 0; rowIndex < board.length; rowIndex++) {
        for (let colIndex: number = 0; colIndex < board[rowIndex].length; colIndex++) {
            if (board[rowIndex][colIndex] !== null) {
                continue;
            }
            board[rowIndex][colIndex] = currentPlayer;
            historyPath.push([rowIndex, colIndex]);
            const score = getBestScore({ row: rowIndex, col: colIndex, board, historyPath, depth: depth + 1, alpha, beta, aiPlayer });
            board[rowIndex][colIndex] = null;
            historyPath.pop();
            // 当前玩家是AI，取最大值
            if (currentPlayer === aiPlayer) {
                if (score >= bestScore) {
                    bestScore = score;
                }
                // 剪枝
                alpha = Math.max(alpha, bestScore);
                if (alpha > beta) return bestScore;
                continue;
            }
            // 当前玩家不是AI，取最小值
            if (score < bestScore) {
                bestScore = score;
            }
            // 剪枝
            beta = Math.min(beta, bestScore);
            if (alpha > beta) return bestScore;
        }
    }
    return bestScore;
}
/**
 *分别统计AI，玩家获胜的排数，计算得分
 * @param calculateScoreContext
 */
function calculateScore ({ board, aiPlayer }: ValidCalculateScoreContext) : number {
    const ticGame: ValidGAME_CATEGORY = GAME_CATEGORY[ticIndex];
    const xCount: number = accordWinNum({ board, player: ticGame.chessPlayer[0] });
    const oCount: number = accordWinNum({ board, player: ticGame.chessPlayer[1] });
    if (ticGame.chessPlayer[0] === aiPlayer) {
        return xCount - oCount;
    }
    return oCount - xCount;
}
/**
 *统计棋子连成获胜数目的排数
 */
function accordWinNum ({ player, board }: ValidAccordWinNumContext) : number {
    const depBoard: Array<Array<string| null>> = depthClone(board);
    let count: number = 0;
    for (let rowIndex: number = 0; rowIndex < depBoard.length; rowIndex++) {
        for (let colIndex: number = 0; colIndex < depBoard[rowIndex].length; colIndex++) {
            if (depBoard[rowIndex][colIndex] === null) {
                // 落下一子统计一次获胜排数
                depBoard[rowIndex][colIndex] = player;
                count += getWinNum({ board: depBoard, rowIndex, colIndex, winNum: GAME_CATEGORY[ticIndex].winNum });
            }
        }
    }
    return count;
}
