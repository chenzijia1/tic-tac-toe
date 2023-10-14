interface ValidAction{
    type: string;
    payload: any;
}
interface ValidGAME_CATEGORY{
    boardLen: number;
    chessPlayer: Array<string>;
    winNum: number;
    chineseName: string;
}
interface ValidInitial{
    GAME_CATEGORY: Array<ValidGAME_CATEGORY>;
    bodyHasWin: (string | null);
    historyPath: Array<Array<number>>;
    ticIndex: number;
    fivePieceIndex: number;
    currentIndex: number;
    board:Array<Array<string | null>>;
    aiPlayerIndex: number;
    aiPersonBattle: Array<string>;
}
