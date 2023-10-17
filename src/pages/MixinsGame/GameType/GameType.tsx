import { getBoard, getBodyHasWin } from  '../../../utils';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Fragment, Component } from 'react';
import * as TYPES from '../../../store/action-types';
import Square from './components/Square';
import History from './components/History';
import  { getPieceIndex } from '../../../utils/index';
interface GameTypeProps {
    GAME_CATEGORY: Array<ValidGAME_CATEGORY>;
    bodyHasWin: (string | null);
    historyPath: Array<Array<number>>;
    ticIndex: number;
    fivePieceIndex: number;
    currentIndex: number;
    board: Array<Array<string | null>>;
    aiPlayerIndex: number;
    setBoard: (board: Array<Array<string | null>>) => void;
    setHistoryPath: (historyPath: Array<Array<number>>) => void;
    setBodyHasWin: (bodyHasWin: string | null) => void;
}
/**
 *创建棋盘和历史记录的组件
 * @param props 棋盘长度、棋子类型数组、获胜需要的数目
 * @returns
 */
class GameType extends Component<GameTypeProps, {}> {
    /**
     *切换游戏时，更新棋盘、清除历史数据、清空赢家
     * @param prevProps
     */
    componentDidUpdate (prevProps: GameTypeProps): void {
        const { setBoard, setHistoryPath, setBodyHasWin, historyPath, board, aiPlayerIndex, currentIndex, ticIndex } = this.props;
        // 切换游戏时清空,切换先后手时清空
        if (prevProps.currentIndex !== this.props.currentIndex || prevProps.aiPlayerIndex !== this.props.aiPlayerIndex) {
            setBoard(getBoard(this.props.GAME_CATEGORY[this.props.currentIndex].boardLen));
            setHistoryPath([]);
            setBodyHasWin(null);
            return;
        }
        // 轮到AI落子
        if (currentIndex === ticIndex) {
            if (historyPath.length % 2 === aiPlayerIndex) {
                const pieceIndex: string = getPieceIndex({ board, historyPath, aiPlayer: this.props.GAME_CATEGORY[this.props.currentIndex].chessPlayer[aiPlayerIndex] });
                this.isWin(pieceIndex);
            }
        }
    }
    /**
     *修改棋盘，判断是否获胜以及记录走过的路
     * @param id 棋子的下标
     * @returns
     */
    isWin = (id: string) => {
        const { bodyHasWin, board, historyPath, currentIndex, GAME_CATEGORY, setBoard, setHistoryPath, setBodyHasWin  } = this.props;
        const currentGameType = GAME_CATEGORY[currentIndex];
        const rowIndex: number = Number(id.split('-')[0]);
        const colIndex: number = Number(id.split('-')[1]);
        if (bodyHasWin || board[rowIndex][colIndex]) return;
        board[rowIndex][colIndex] = currentGameType.chessPlayer[historyPath.length % 2];
        setBoard([...board]);
        historyPath.push([rowIndex, colIndex]);
        setHistoryPath([...historyPath]);
        const hasWin = getBodyHasWin({ rowIndex, colIndex, board, winNum: currentGameType.winNum });
        if (hasWin) {
            setBodyHasWin(`获胜者：${board[rowIndex][colIndex]}`);
            return;
        }
        if (historyPath.length === currentGameType.boardLen * currentGameType.boardLen) {
            setBodyHasWin('平局');
        }
    };
    /**
     * 防止ai落子之前玩家再次落子
     * @param index 落子的位置
     */
    reduceChange = (index: string) => {
        const {  board, historyPath, currentIndex, GAME_CATEGORY, aiPlayerIndex, ticIndex  } = this.props;
        const currentGameType = GAME_CATEGORY[currentIndex];
        const lastPlayerIndex: number[] = historyPath[historyPath.length - 1];
        if (currentIndex === ticIndex) {
            if ((aiPlayerIndex && !historyPath.length) || currentGameType.chessPlayer[aiPlayerIndex] === board[lastPlayerIndex[0]][lastPlayerIndex[1]]) {
                this.isWin(index);
            }
            return;
        }
        this.isWin(index);
    }
    /**
     *回退函数，清除棋盘、清除历史、清除获胜的人
     * @param {number} index 要回退到第几步
     * @returns
     */
    regretChess = (index: number) => {
        const { board, historyPath, setBoard, setHistoryPath, setBodyHasWin, currentIndex, ticIndex, fivePieceIndex } = this.props;
        if (currentIndex === ticIndex) {
            const leavePath : Array<Array<number>> = historyPath.slice(0, index + 2);
            setHistoryPath(leavePath);
            for (let stepIndex:number = index + 2; stepIndex < historyPath.length; stepIndex++) {
                const stepArr:Array<number> = historyPath[stepIndex];
                board[stepArr[0]][stepArr[1]] = null;
                setBoard([...board]);
            }
            if (index !== historyPath.length - 2 && index !== historyPath.length - 1) {
                setBodyHasWin(null);
            }
        }
        if (currentIndex === fivePieceIndex) {
            const leavePath : Array<Array<number>> = historyPath.slice(0, index + 1);
            setHistoryPath(leavePath);
            for (let stepIndex:number = index + 1; stepIndex < historyPath.length; stepIndex++) {
                const stepArr:Array<number> = historyPath[stepIndex];
                board[stepArr[0]][stepArr[1]] = null;
                setBoard([...board]);
            }
            if (index !== historyPath.length - 1) {
                setBodyHasWin(null);
            }
        }
    };
    render () {
        const { board, bodyHasWin, currentIndex, GAME_CATEGORY, historyPath, ticIndex, fivePieceIndex } = this.props;
        const currentGameType = GAME_CATEGORY[currentIndex];
        return (
            <Fragment>
                <div className='out'>
                    <div className='board' >
                        {
                            board.map((rowContext, rowIndex) =>
                                <div key={rowIndex} className='board-row'>
                                    {
                                        rowContext
                                            .map((colContext, colIndex) => <Square key={`${rowIndex}-${colIndex}`} pieceIndex={`${rowIndex}-${colIndex}`} ticIndex={ticIndex} currentIndex={currentIndex} fivePieceIndex={fivePieceIndex} currentGameType={currentGameType}   reduceChange={this.reduceChange} pieceType={colContext}></Square>)
                                    }
                                </div>)
                        }
                        <div className='bodyHasWin'>{bodyHasWin ? <div>{bodyHasWin}</div> : <div>轮到：{currentGameType.chessPlayer[historyPath.length % 2]}</div>}</div>
                    </div>
                    <div>
                        <History  regretChess={this.regretChess}></History>
                    </div>
                </div>
            </Fragment>
        );
    }
}

/**
 * 派发修改redux信息,修改棋盘信息，修改历史记录信息，修改是否有人获胜信息
 * @param dispatch
 * @returns
 */
const mapDispatchToProps = (dispatch: Dispatch<ValidAction>) => {
    return {
        setBoard: (board: Array<Array<string | null>>) => {
            dispatch({ type: TYPES.BOARD, payload: board });
        },
        setHistoryPath: (historyPath: Array<Array<number>>) => {
            dispatch({ type: TYPES.HISTORY_PATH, payload: historyPath });
        },
        setBodyHasWin: (bodyHasWin: string | null) => {
            dispatch({ type: TYPES.BODY_HAS_WIN, payload: bodyHasWin });
        },
    };
};
export default connect((state: {game: ValidInitial}) => state.game, mapDispatchToProps)(GameType);

