import * as TYPES from '../action-types';
import { getBoard } from '../../utils';
export const initial: ValidInitial = {
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
    board: getBoard(3),
    aiPlayerIndex: 1, // 默认AI玩家后手
    aiPersonBattle: ['AI玩家先手', '你先手'],
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
    if (type === TYPES.AI_PLAYER_INDEX) {
        return {
            ...state,
            aiPlayerIndex: payload,
        };
    }
    return state;
}
