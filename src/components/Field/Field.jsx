import React from "react";
import s from './Field.module.css';

import FillWordMatrix from "../../logic/FillWord";
import {getRandomColor} from "../../logic/extra";
import {wordDictionary} from "../../logic/Words";
import {RUSSIAN_ALPHABET} from "../../logic/RussianAlphabet";
import Cell from "../Cell/Cell";
import {connect} from "react-redux";
import {addCell, addSelectedWord, addToAllWord, clearSelectedWords} from "../../store/reducers";
import {wordChecker} from "../../logic/wordChecker";

class Field extends React.Component {
    constructor(props) {
        super(props);

        let fillWordInit = new FillWordMatrix(this.props.rows, this.props.cols).wordsPlaceHolders;
        const rowsHTMLInit = this.initRows(fillWordInit);
        this.state = {
            fillWord: fillWordInit,
            rowsHTML: rowsHTMLInit,
            isMouseDown: false
        };
    }

    initRows(fillWordInit) {
        let rowsHTMLInit = {};

        let i = 0;
        for (let value in fillWordInit) {
            let color = getRandomColor();
            let sequenceNumber = 1;

            let isWordNotExisted = false;
            let word = '';
            if (wordDictionary.dict.hasOwnProperty(fillWordInit[value].length)) {
                word = wordDictionary.dict[fillWordInit[value].length][Math.floor(Math.random() * (wordDictionary.dict[fillWordInit[value].length].length - 1))];
                this.props.addToAllWord(word);
            } else {
                isWordNotExisted = true;
            }
            let wordIndex = 0;
            for (let point of fillWordInit[value]) {
                if (isWordNotExisted) {
                    word = RUSSIAN_ALPHABET[Math.floor(Math.random() * (RUSSIAN_ALPHABET.length - 1))]
                }
                let [x, y] = [point.x, point.y];
                let CellComponent = <Cell key={`${x}_${y}`}
                                          letter={isWordNotExisted ? word : word[wordIndex++]}
                                          x={x} y={y} color={color} sequenceNumber={sequenceNumber}
                                          word={word}/>

                if (!rowsHTMLInit.hasOwnProperty(x)) {
                    rowsHTMLInit[x] = {};
                }
                rowsHTMLInit[x][y] = CellComponent;
                sequenceNumber++
            }
            i++;
        }
        return rowsHTMLInit
    }

    handlerMouseMove(event) {
        if (!this.state.isMouseDown || event.target.id !== 'cell') return;

        let [x, y] = event.target.classList[1].split("_").map(el => Number(el));
        if (this.props.selectedCellsButID.indexOf(`${x}_${y}`) !== -1) return;
        let cell = this.state.rowsHTML[x][y];
        this.props.addCell(cell);
    }

    handlerMouseDown() {
        this.setState({
            isMouseDown: true
        });
    }

    handlerMouseUp() {
        if (this.state.isMouseDown) {
            if (wordChecker(this.props.selectedCells)) {
                console.log(this.props.selectedCells[0].props.word)
                this.props.addWord(this.props.selectedCells[0].props.word);
            } else {
                this.props.clearSelectedWords();
            }

            this.setState({
                isMouseDown: false
            });
        }
    }

    render() {
        return (
            <div className={s.field} onMouseMove={e => this.handlerMouseMove(e)}
                 onMouseDown={e => this.handlerMouseDown(e)}
                 onMouseUp={e => this.handlerMouseUp(e)}>{
                Object.keys(this.state.rowsHTML).map(row => {
                    return <div className={s.row} key={row} id='row'>{
                        Object.keys(this.state.rowsHTML[row]).map(col => {
                            return this.state.rowsHTML[row][col];
                        })
                    }</div>
                })
            }</div>
        );
    }
}

const mapStateToProps = state => {
    return {
        selectedCellsButID: state.main.selectedCellsButID,
        selectedCells: state.main.selectedCells,
        guessedWords: state.main.guessedWords
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addWord: word => dispatch(addSelectedWord(word)),
        addCell: cell => dispatch(addCell(cell)),
        addToAllWord: (word) => dispatch(addToAllWord(word)),
        clearSelectedWords: () => dispatch(clearSelectedWords())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Field);