import { Fragment, Component } from 'react';
import GameType from './GameType/GameType';
import { connect } from 'react-redux';
import * as TYPES from '../../store/action-types';
import './MixinsGame.css';
import { Dispatch } from 'redux';
interface MixinsGameProps {
    GAME_CATEGORY: Array<ValidGAME_CATEGORY>;
    currentIndex: number;
    aiPlayerIndex: number;
    ticIndex: number;
    setCurrentIndex: (index: number) => void;
    setAiPlayerIndex: (index: number) => void;
    aiPersonBattle: Array<string>;// 切换AI落子为先手后手
}
/**
 *创建棋子按钮的父组件
 * @returns
 */
class MixinsGame extends Component<MixinsGameProps, {}> {
    render () {
        const { GAME_CATEGORY, setCurrentIndex, aiPersonBattle, setAiPlayerIndex, aiPlayerIndex, currentIndex, ticIndex } = this.props;
        return (
            <Fragment>
                <div className='out'>
                    <GameType></GameType>
                    <div className='CURRENT_INDEX'>
                        { GAME_CATEGORY.map((item, index) => <div className={index === currentIndex ? 'turnPart' : 'chessTypePart'}  key = {index + 1} onClick={() => setCurrentIndex(index)}>{item.chineseName}</div>)}
                    </div>
                    {currentIndex === ticIndex
                        ? <div>
                            { aiPersonBattle.map((item, index) => <div className={index === aiPlayerIndex ? 'turnWho' : 'aiPersonBattle'}  key = {item} onClick={() => setAiPlayerIndex(index) }>{item}</div>)}
                        </div>
                        : <div></div>}
                </div>
            </Fragment>
        );
    }
}
/**
 * 派发修改仓库信息
 * @param dispatch
 * @returns
 */
const mapDispatchToProps = (dispatch: Dispatch<ValidAction>) => {
    return {
        setCurrentIndex: (index: number) => {
            dispatch({ type: TYPES.CURRENT_INDEX, payload: index });
        },
        setAiPlayerIndex: (index: number) => {
            dispatch({ type: TYPES.AI_PLAYER_INDEX, payload: index });
        },
    };
};
export default connect((state: { game: ValidInitial }) => state.game, mapDispatchToProps)(MixinsGame);
