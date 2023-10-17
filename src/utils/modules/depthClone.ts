
/**
 * 将board棋盘深拷贝
 */
export function depthClone (cloneData: (Array<Array<string | null>>)) {
    return JSON.parse(JSON.stringify(cloneData));
}
