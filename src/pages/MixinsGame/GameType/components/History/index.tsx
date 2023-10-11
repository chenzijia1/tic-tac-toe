import   { Fragment } from 'react';
import { useSelector } from 'react-redux';
import './index.css';
interface HistoryProps {
    regretChess: (id:number) => void;
}
/**
 *渲染历史记录的格子、regretChess触发点击事件可回退
 * @returns
 */
function History (props:HistoryProps) {
    const { regretChess } = props;
    const { historyPath } = useSelector((state: {game: ValidInitial}) => state.game);
    return (
        <Fragment>
            <div className="btn" onClick={() => regretChess(-1)}>清除所有走过的路</div>
            {historyPath.map((item, index) => <div className="btn" onClick={() => regretChess(index)} key={index}>{`第${index + 1}步，第${item[0] + 1}行，第${item[1] + 1}列`}</div>)}
        </Fragment>
    );
}
export default History;
