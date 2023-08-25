// https://www.cyberforum.ru/csharp-beginners/thread2729866.html

class Direction {
    static TOP = 0;
    static RIGHT = 1;
    static BOTTOM = 2;
    static LEFT = 3;
}

export default class FillWordMatrix {
    deadEnd = [];
    wordsPlaceHolders = {};
    matrix = [];
    minLengthOfWord = 3;

    rows = 0;
    cols = 0;

    evolutionStepsCount = 2;

    /**
     * @param width {int}
     * @param height {int}
     */
    constructor(width, height) {
        let matrix = (() => {
            let array = [];
            for (let i = 0; i < width; i++) {
                array.push([])
                for (let j = 0; j < height; j++) {
                    array[i].push(0)
                }
            }
            return array;
        })();

        this.matrix = matrix;
        this.rows = matrix.length;
        this.cols = matrix[0].length;

        this.init();
    }

    init(minLengthOfWord = 4) {
        this.minLengthOfWord = minLengthOfWord;
        this.startFill();

        for (let i = 0; i < this.evolutionStepsCount; i++) {
            this.deadEnd = [];
            this.evolutionStep();
        }
    }

    startFill() {
        let index = 0;
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.matrix[i][j] = index;

                /** @type {Point[]} */
                let oneElemList = [];
                oneElemList.push(new Point(i, j));
                this.wordsPlaceHolders[index] = oneElemList;
                index++;
            }
        }
    }

    evolutionStep() {
        let keys = Object.keys(this.wordsPlaceHolders).map(elem => parseInt(elem));
        for (let i = 0; i < keys.length; i++) {
            this.tryToGrow(keys[i]);
        }
    }

    tryToGrow(index) {
        if (!this.wordsPlaceHolders.hasOwnProperty(index.toString())) {
            return;
        }

        let worm = this.wordsPlaceHolders[index];
        let head = worm[0];
        let tail = worm.at(-1);

        let possibleDirection = this.getPossibleDirection(tail, index);
        if (possibleDirection.length !== 0) {
            this.chooseDirectionAndGrow(index, possibleDirection, tail);
            return;
        }

        possibleDirection = this.getPossibleDirection(head, index);
        if (possibleDirection.length !== 0) {
            this.wordsPlaceHolders[index] = this.wordsPlaceHolders[index].reverse();
            this.chooseDirectionAndGrow(index, possibleDirection, head);
            return;
        }

        if (this.wordsPlaceHolders[index].length < this.minLengthOfWord) {
            this.deadEnd.push(index);
        }
    }

    /**
     * @param point {Point}
     * @param index {int}
     */
    getPossibleDirection(point, index) {
        let possibleDirection = [];
        if (point.y > 0 && this.matrix[point.x][point.y - 1] !== index && this.isHeadOrTail(new Point(point.x, point.y - 1))) {
            possibleDirection.push(Direction.LEFT);
        }
        if (point.y < this.cols - 1 && this.matrix[point.x][point.y + 1] !== index && this.isHeadOrTail(new Point(point.x, point.y + 1))) {
            possibleDirection.push(Direction.RIGHT);
        }
        if (point.x > 0 && this.matrix[point.x - 1][point.y] !== index && this.isHeadOrTail(new Point(point.x - 1, point.y))) {
            possibleDirection.push(Direction.TOP);
        }
        if (point.x < this.rows - 1 && this.matrix[point.x + 1][point.y] !== index && this.isHeadOrTail(new Point(point.x + 1, point.y))) {
            possibleDirection.push(Direction.BOTTOM);
        }

        return possibleDirection;
    }

    /**
     * @param point {Point}
     */
    isHeadOrTail(point) {
        if (point.x < 0 || point.y < 0) {
            return false;
        }
        let key = this.matrix[point.x][point.y];
        if (this.wordsPlaceHolders[key] === undefined) {
            return false;
        }
        return (Point.equals(this.wordsPlaceHolders[key][0], point) ||
            Point.equals(this.wordsPlaceHolders[key][this.wordsPlaceHolders[key].length - 1], point));
    }

    /**
     * @param index {int}
     * @param possibleDirection {Point[]}
     * @param tail {Point}
     */
    chooseDirectionAndGrow(index, possibleDirection, tail) {
        let direction = possibleDirection[Math.floor(Math.random() * possibleDirection.length)];
        let otherPoint;

        switch (direction) {
            case Direction.LEFT:
                otherPoint = new Point(tail.x, tail.y - 1);
                break;
            case Direction.RIGHT:
                otherPoint = new Point(tail.x, tail.y + 1);
                break;
            case Direction.TOP:
                otherPoint = new Point(tail.x - 1, tail.y);
                break;
            case Direction.BOTTOM:
                otherPoint = new Point(tail.x + 1, tail.y);
                break;
        }
        this.growFromTailToDirection(index, otherPoint);
    }

    growFromTailToDirection(index, otherPoint) {
        let key = this.matrix[otherPoint.x][otherPoint.y];
        if (key === index) {
            throw new Error("начало");
        }

        if (!Point.equals(otherPoint, this.wordsPlaceHolders[key][0])) {
            this.wordsPlaceHolders[key] = this.wordsPlaceHolders[key].reverse();
        }

        for (let point of this.wordsPlaceHolders[key]) {
            this.matrix[point.x][point.y] = index;
        }

        this.wordsPlaceHolders[index].push(...this.wordsPlaceHolders[key]);
        delete this.wordsPlaceHolders[key];
        if (Math.random() * 3 < 2) {
            this.wordsPlaceHolders[index] = this.wordsPlaceHolders[index].reverse();
        }
    }
}

class Point {
    /**
     * @param x {int}
     * @param y {int}
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * @param point1 {Point}
     * @param point2 {Point}
     * @returns {boolean}
     */
    static equals(point1, point2) {
        return point1.x === point2.x && point1.y === point2.y;
    }
}
