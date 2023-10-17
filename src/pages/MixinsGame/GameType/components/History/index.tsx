import   { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import './index.css';
interface HistoryProps {
    regretChess: (id: number) => void;
    historyPath: Array<Array<number>>;
    aiPlayerIndex: number;
    currentIndex: number;
    ticIndex: number;
}
/**
 *渲染历史记录的格子、regretChess触发点击事件可回退
 * @returns
 */
class History extends Component<HistoryProps, {}> {
    render () {
        const { regretChess, historyPath, aiPlayerIndex, currentIndex, ticIndex  } = this.props;
        return (
            <Fragment>
                <div className="btn" onClick={() => regretChess(currentIndex === ticIndex ? -2 : -1)}>清除所有走过的路</div>
                {historyPath.map((item, index) => <div className={index % 2 === aiPlayerIndex && currentIndex === ticIndex ? 'disablesBtn' : 'btn'}  onClick={() => regretChess(index)} key={index}>{`第${index + 1}步，第${item[0] + 1}行，第${item[1] + 1}列`}</div>)}
            </Fragment>
        );
    }
}
export default connect((state: {game: ValidInitial}) => state.game)(History);
