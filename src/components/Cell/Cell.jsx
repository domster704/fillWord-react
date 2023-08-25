import React from "react";
import s from "./Cell.module.css";
import {connect} from "react-redux";

class Cell extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            word: this.props.word,
            letter: this.props.letter,
            x: this.props.x,
            y: this.props.y,
            isGuessed: false,
            isWordCorrect: this.props.isWordCorrect,
            sequenceNumber: this.props.sequenceNumber,
            isSelected: false
        }
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        let localState = {};
        if (nextProps.guessedWords.indexOf(this.state.word) !== -1 && !this.state.isGuessed) {
            localState = Object.assign(localState, {
                isGuessed: true
            });
        }

        if (nextProps.selectedCellsButID.indexOf(`${this.state.x}_${this.state.y}`) !== -1 && !this.state.isSelected) {
            localState = Object.assign(localState, {
                isSelected: true
            });
        } else if (nextProps.selectedCellsButID.indexOf(`${this.state.x}_${this.state.y}`) === -1 && this.state.isSelected) {
            localState = Object.assign(localState, {
                isSelected: false
            });
        }

        if (Object.keys(localState).length !== 0) {
            this.setState(localState);
            return true;
        }

        return false;
    }

    render() {
        return (
            <div id='cell'
                 className={s.cell + ' ' + (this.state.x + "_" + this.state.y) + ' ' + (this.state.isSelected ? s.selectCell : '')}
                 style={(this.state.isGuessed) ? {backgroundColor: this.props.color} : {}}>{this.state.letter + " | " + this.state.sequenceNumber}</div>
        )
    }
}

const mapStateToProps = state => {
    return {
        selectedCellsButID: state.main.selectedCellsButID,
        guessedCells: state.main.guessedCells,
        guessedWords: state.main.guessedWords,
    }
}

const mapDispatchToProps = dispatch => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Cell);