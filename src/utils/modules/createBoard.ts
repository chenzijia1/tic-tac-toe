/**
 *构建棋盘的函数
 * @param boardLen 棋盘长度
 * @returns 棋盘数组
 */
export function getBoard (boardLen: number) {
    const board = new Array(boardLen)
        .fill(null)
        .map(() => new Array(boardLen).fill(null));
    return board;
}
