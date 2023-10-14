import { Fragment, PureComponent } from 'react';
import './index.css';
interface SquareProps {
    pieceIndex: string;
    pieceType: string|null;
    isWin: (id: string)=>void;
    fivePieceIndex: number;
    currentIndex: number;
    currentGameType: ValidGAME_CATEGORY;
    ticIndex: number;
}
/**
 * 创建棋盘的组件
 * @param props 棋子下标、棋子类型、获胜需要棋子数量、棋子类型数组、点击触发是否获胜的函数
 * @returns
 */
class Square extends PureComponent<SquareProps, {}> {
    /**
     *获取棋子类型
     */
    getPieceType = () => {
        const { pieceType, ticIndex, currentIndex, fivePieceIndex, currentGameType } = this.props;
        if (currentIndex === ticIndex) return pieceType;
        if (currentIndex === fivePieceIndex) {
            if (currentGameType.chessPlayer[0] === pieceType) {
                return <div className='whiteBtn'></div>;
            }
            if (currentGameType.chessPlayer[1] === pieceType) {
                return <div className='blackBtn'></div>;
            }
            return null;
        }
    };
    render () {
        const { isWin, pieceIndex } = this.props;
        return (
            <Fragment>
                {<button onClick={() => isWin(pieceIndex)}>{this.getPieceType()}</button>}
            </Fragment>
        );
    }
}
export default Square;
