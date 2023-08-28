/**
 * @param selectedCells {Array.<Cell>}
 */
export const wordChecker = selectedCells => {
    let cells = [...selectedCells];
    if (cells.length === 0) {
        return false;
    }
    let prev = cells.shift();
    for (let i of cells) {
        if (i.props.sequenceNumber - prev.props.sequenceNumber !== 1 || i.props.word !== prev.props.word) {
            return false;
        }
        prev = i;
    }
    return prev.props.sequenceNumber === prev.props.word.length;
}