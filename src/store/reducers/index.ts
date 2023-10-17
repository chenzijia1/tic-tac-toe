import { combineReducers } from 'redux';
import gameReducer from './gameReducer';
const reducer = combineReducers({ game: gameReducer });
export default reducer;
