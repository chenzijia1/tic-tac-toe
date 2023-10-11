import { Fragment } from 'react';
import GameType from './GameType/GameType';
import { useSelector, useDispatch } from 'react-redux';
import * as TYPES from '../../store/action-types';
import './MixinsGame.css';
/**
 *创建棋子按钮的父组件
 * @returns
 */
function MixinsGame () {
    const { GAME_CATEGORY } = useSelector((state: {game: ValidInitial}) => state.game);
    const dispatch = useDispatch();
    return (
        <Fragment>
            <div className='out'>
                <GameType></GameType>
                <div className='CURRENT_INDEX'>
                    { GAME_CATEGORY.map((item, index) => <div className="chessTypePart"  key = {index + 1} onClick={() => dispatch({ type: TYPES.CURRENT_INDEX, payload: index })}>{item.chineseName}</div>)}
                </div>
            </div>
        </Fragment>
    );
}
export default MixinsGame;
