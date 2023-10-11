import { getBoard, getBodyHasWin } from  '../../../utils';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useCallback, Fragment } from 'react';
import * as TYPES from '../../../store/action-types';
import Square from './components/Square';
import History from './components/History';
/**
 *创建棋盘和历史记录的组件
 * @param props 棋盘长度、棋子类型数组、获胜需要的数目
 * @returns
 */
function GameType () {
    const dispatch = useDispatch();
    const { currentIndex, GAME_CATEGORY, historyPath, bodyHasWin, reduceHistoryLen, board, ticIndex, fivePieceIndex } = useSelector((state: {game: ValidInitial}) => state.game);
    const currentGameType = GAME_CATEGORY[currentIndex];
    useEffect(() => {
        dispatch({ type: TYPES.BOARD, payload: getBoard(currentGameType.boardLen) });
        dispatch({ type: TYPES.HISTORY_PATH, payload: [] });
        dispatch({ type: TYPES.BODY_HAS_WIN, payload: null });
    }, [currentGameType.boardLen]);
    /**
     *修改棋盘，判断是否获胜以及记录走过的路
     * @param id 棋子的下标
     * @returns
     */
    const isWin = useCallback((id: string) => {
        const rowIndex: number = Number(id.split('-')[0]);
        const colIndex: number = Number(id.split('-')[1]);
        if (bodyHasWin || board[rowIndex][colIndex]) return;
        board[rowIndex][colIndex] = currentGameType.chessPlayer[historyPath.length % 2];
        dispatch({ type: TYPES.BOARD, payload: [...board] });
        historyPath.push([rowIndex, colIndex]);
        dispatch({ type: TYPES.HISTORY_PATH, payload: [...historyPath] });
        const hasWin = getBodyHasWin({ rowIndex, colIndex, board, winNum: currentGameType.winNum });
        if (hasWin) {
            dispatch({ type: TYPES.BODY_HAS_WIN, payload: `获胜者：${board[rowIndex][colIndex]}` });
            return;
        }
        if (historyPath.length === currentGameType.boardLen * currentGameType.boardLen) {
            dispatch({ type: TYPES.BODY_HAS_WIN, payload: '平局' });
        }
    }, [bodyHasWin, board.length, reduceHistoryLen]);
    /**
     *回退函数，清除棋盘、清除历史、清除获胜的人
     * @param {number} index 要回退到第几步
     * @returns
     */
    const regretChess = (index: number) => {
        const leavePath : Array<Array<number>> = historyPath.slice(0, index + 1);
        dispatch({ type: TYPES.HISTORY_PATH, payload: leavePath });
        for (let stepIndex:number = index + 1; stepIndex < historyPath.length; stepIndex++) {
            const stepArr:Array<number> = historyPath[stepIndex];
            board[stepArr[0]][stepArr[1]] = null;
            dispatch({ type: TYPES.BOARD, payload: [...board] });
        }
        if (index !== historyPath.length - 1) {
            dispatch({ type: TYPES.BODY_HAS_WIN, payload: null });
            dispatch({ type: TYPES.REDUCE_HISTORY_LEN, payload: reduceHistoryLen + 1 });
        }
    };
    return (
        <Fragment>
            <div className='out'>
                <div className='board' >
                    {
                        board.map((rowContext, rowIndex) =>
                            <div key={rowIndex} className='board-row'>
                                {
                                    rowContext
                                        .map((colContext, colIndex) => <Square key={`${rowIndex}-${colIndex}`} pieceIndex={`${rowIndex}-${colIndex}`} currentGameType={currentGameType} currentIndex={currentIndex} ticIndex={ticIndex}  fivePieceIndex={fivePieceIndex} isWin={isWin} pieceType={colContext}></Square>)
                                }
                            </div>)
                    }
                    <div className='bodyHasWin'>{bodyHasWin ? <div>{bodyHasWin}</div> : <div>轮到：{currentGameType.chessPlayer[historyPath.length % 2]}</div>}</div>
                </div>
                <div>
                    <History  regretChess={regretChess}></History>
                </div>
            </div>
        </Fragment>
    );
}
export default GameType;
