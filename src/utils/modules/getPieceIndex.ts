import { getBodyHasWin, getWinNum } from './chessUtil';
import { depthClone } from './depthClone';
interface ValidGetPieceIndexContext {
    board: Array<Array<string | null>>;
    aiPlayerIndex: number;
    historyPath: Array<Array<number>>;
    chessPlayer: Array<string>;
    winNum: number;
}
interface ValidCalculateScoreContext {
    board: Array<Array<string | null>>;
}
interface ValidAccordWinNumContext {
    board: Array<Array<string | null>>;
    player: string;
}
interface ValidBestScoreContext {
    row:number;
    col:number;
    board: Array<Array<string | null>>;
    depth: number;
    currentPlayer: string;
    opponentPlayer:string;
}
const DEPTH: number = 6;
let WIN_NUM: number = 0;
let PERSON_PLAYER: string = ''; // 人玩家
let AI_PLAYER: string = ''; // AI玩家
const MAX_NUM: number = 10000000; // 用来检测AI胜利的深度，找到最近的获胜路
/**
 * chessPlayer 代表玩家数组、aiPlayerIndex代表ai玩家的下标
 *  获取最大分数的下标
 */
export function getPieceIndex (pieceIndexContext: ValidGetPieceIndexContext): string {
    const { aiPlayerIndex, chessPlayer, winNum, board } = pieceIndexContext;
    if (board[(board.length - 1) / 2][(board[0].length - 1) / 2] === null) return `${(board.length - 1) / 2}-${(board[0].length - 1) / 2}`;
    // 获取获胜所需棋子数
    WIN_NUM = winNum;
    // 获取到ai和人的字符
    AI_PLAYER = chessPlayer[aiPlayerIndex];
    chessPlayer.forEach((player, index) => {
        if (index !== aiPlayerIndex) {
            PERSON_PLAYER = player;
        }
    });
    // 深克隆棋盘
    const depBoard: Array<Array<string | null>> = depthClone(board);
    const depth: number = 1;
    let maxScore: number = -Infinity;
    // 当前玩家为AI
    const currentPlayer  = AI_PLAYER;
    let maxRow: number = 0;
    let maxCol: number = 0;
    for (let row = 0; row < depBoard.length; row++) {
        for (let col = 0; col < depBoard[row].length; col++) {
            if (depBoard[row][col] !== null) {
                continue;
            }
            depBoard[row][col] = currentPlayer;
            const score =  getBestScore({ row, col, board: depBoard, depth, currentPlayer: PERSON_PLAYER, opponentPlayer: currentPlayer });
            depBoard[row][col] = null;
            if (score >= maxScore) {
                maxScore = score;
                maxRow = row;
                maxCol = col;
            }
        }
    }
    return `${maxRow}-${maxCol}`;
}
/**
 *  求极大极小值递归
 * currentPlayer: 当前玩家, opponentPlayer:对手玩家，用来递归切换玩家和判断是否是AI
 */
function getBestScore (bestScoreContext: ValidBestScoreContext) : number {
    const { row, col, board, depth, currentPlayer, opponentPlayer } = bestScoreContext;
    // 判断玩家是否获胜，AI获胜返回极大值，反之返回极小值
    if (getBodyHasWin({ board, rowIndex: row, colIndex: col, winNum: WIN_NUM })) {
        if (AI_PLAYER === opponentPlayer) {
            return MAX_NUM - depth;
        }
        return -Infinity;
    }
    if (!boardHasSpace(board)) return 0;
    let  bestScore = -Infinity;
    // 表示人落子
    if (currentPlayer !== AI_PLAYER) {
        bestScore = Infinity;
    }
    // 到规定深度开始计算评分
    if (depth === DEPTH) {
        return calculateScore({ board });
    }
    for (let rowIndex = 0; rowIndex < board.length; rowIndex++) {
        for (let colIndex = 0; colIndex < board[rowIndex].length; colIndex++) {
            if (board[rowIndex][colIndex] !== null) {
                continue;
            }
            board[rowIndex][colIndex] = currentPlayer;
            const score = getBestScore({ row: rowIndex, col: colIndex, board, depth: depth + 1, currentPlayer: opponentPlayer, opponentPlayer: currentPlayer });
            board[rowIndex][colIndex] = null;
            // 当前玩家是AI，取最大值
            if (currentPlayer === AI_PLAYER) {
                if (score >= bestScore) {
                    bestScore = score;
                }
                continue;
            }
            // 当前玩家不是AI，取最小值
            if (score < bestScore) {
                bestScore = score;
            }
        }
    }
    return bestScore;
}
/**
 * 判断棋盘是否还有剩余空间
 * @param board
 * @returns
 */
function boardHasSpace (board:Array<Array<string | null>>) {
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            if (board[row][col] === null) {
                return true;
            }
        }
    }
    return false;
}
/**
 *分别统计AI，玩家获胜的排数，计算得分
 * @param calculateScoreContext
 */
function calculateScore (calculateScoreContext: ValidCalculateScoreContext) : number {
    const { board } = calculateScoreContext;
    const AICount: number = accordWinNum({ board, player: AI_PLAYER });
    const personCount: number = accordWinNum({ board, player: PERSON_PLAYER });
    return AICount - personCount;
}
/**
 *统计棋子连成获胜数目的排数
 */
function accordWinNum (accordWinNumContext: ValidAccordWinNumContext) : number {
    const { player, board } = accordWinNumContext;
    const depBoard: Array<Array<string| null>> = depthClone(board);
    let count: number = 0;
    for (let rowIndex = 0; rowIndex < depBoard.length; rowIndex++) {
        for (let colIndex = 0; colIndex < depBoard[rowIndex].length; colIndex++) {
            if (depBoard[rowIndex][colIndex] === null) {
                // 落下一子统计一次获胜排数
                depBoard[rowIndex][colIndex] = player;
                count += getWinNum({ board: depBoard, rowIndex, colIndex, winNum: WIN_NUM });
            }
        }
    }
    return count;
}
