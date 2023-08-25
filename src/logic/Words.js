import data from './../res/words.json'

class WordsDictionary {
    dict = {};

    constructor() {
        this.divideByLength(data.words);
    }

    divideByLength(wordsList) {
        for (let i of wordsList) {
            if (!this.dict.hasOwnProperty(i.length)) {
                this.dict[i.length] = [];
            }
            this.dict[i.length].push(i);
        }
    }
}

export const wordDictionary = new WordsDictionary();