import * as TYPES from '../action-types';
import { getBoard } from '../../utils';
interface ValidAction{
    type: string;
    payload: any;
}
const initial: ValidInitial = {
    GAME_CATEGORY: [
        {
            boardLen: 3,
            chessPlayer: ['x', 'o'],
            chineseName: '井字棋',
            winNum: 3,
        },
        {
            boardLen: 15,
            chessPlayer: ['白棋', '黑棋'],
            chineseName: '五子棋',
            winNum: 5,
        },
    ],
    ticIndex: 0,
    fivePieceIndex: 1,
    currentIndex: 0,
    bodyHasWin: null,
    historyPath: [],
    reduceHistoryLen: 0,
    board: getBoard(3),
};
export default function gameReducer (state = initial, action: ValidAction) {
    const { type, payload } = action;
    if (type === TYPES.BODY_HAS_WIN) {
        return {
            ...state,
            bodyHasWin: payload,
        };
    }
    if (type === TYPES.HISTORY_PATH) {
        return {
            ...state,
            historyPath: payload,
        };
    }
    if (type === TYPES.REDUCE_HISTORY_LEN) {
        return {
            ...state,
            reduceHistoryLen: payload,
        };
    }
    if (type === TYPES.CURRENT_INDEX) {
        return {
            ...state,
            currentIndex: payload,
        };
    }
    if (type === TYPES.BOARD) {
        return {
            ...state,
            board: payload,
        };
    }
    return state;
}
