import {createAction, createReducer} from "@reduxjs/toolkit";
import ActionsType from "./ActionsType";

const initialState = {
    selectedCells: [], // ячейки, выбранные юзером для составления слова
    selectedCellsButID: [], // ячейки, выбранные юзером для составления слова, с id {x_y}
    guessedWords: [], // угаданные слова
    guessedCells: [], // угаданные ячейки
    allWords: [], // список всех слов
};

export const addCell = createAction(ActionsType.ADD_CELL);
export const addSelectedWord = createAction(ActionsType.ADD_SELECTED_WORD);
export const addToAllWord = createAction(ActionsType.ADD_WORD);

export const clearSelectedWords = createAction(ActionsType.CLEAR_SELECTED_WORDS);

export const mainReducer = createReducer(initialState, {
    [addCell]: (state, action) => {
        state.selectedCells.push(action.payload);
        console.log(action.payload)
        state.selectedCellsButID.push(action.payload.props.x + "_" + action.payload.props.y);
    },
    [addSelectedWord]: (state, action) => {
        state.guessedCells.push(...state.selectedCells);
        state.selectedCells = [];
        state.selectedCellsButID = [];
        state.guessedWords.push(action.payload);
    },
    [addToAllWord]: (state, action) => {
        state.allWords.push(action.payload);
    },
    [clearSelectedWords]: state => {
        state.selectedCells = [];
        state.selectedCellsButID = [];
    }
});