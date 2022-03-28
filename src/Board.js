import React from "react";
import Square from "./Square";

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(9).fill(null),
            xIsNext: true,
            match: [],
            winner: "",
            status: ""
        };
    }

    handleClick = async (i) => {

        const squares = this.state.squares;

        if (squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        let nullCount = squares.filter((s) => { return s === null }).length;
        await this.setState({
            squares: squares,
            xIsNext: !this.state.xIsNext,
            status: nullCount ? "" : "Draw"
        });

        if (this.calculateWinner(squares)) {
            return;
        }

        if (squares[i] === "X") {
            let next = this.getNext(squares);
            setTimeout(() => {
                this.handleClick(next);
            }, 1000);
        }
    }

    renderSquare = (i) => {
        return (
            <Square
                key={i}
                match={this.state.match}
                index={i}
                value={this.state.squares[i]}
                onClick={() => this.handleClick(i)}
            />
        );
    }

    lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    getNext = (squares) => {
        let squaresWithX, squaresWithO, squaresWithNull = [];
        let weightage = {};
        for (let i = 0; i < this.lines.length; i++) {

            squaresWithX = this.lines[i].filter((s) => { return squares[s] === "X" });
            squaresWithO = this.lines[i].filter((s) => { return squares[s] === "O" });
            squaresWithNull = this.lines[i].filter((s) => { return squares[s] === null });

            // if O is about to win, find the 3rd squre
            if (squaresWithO.length > 1 && squaresWithNull.length === 1) {
                if (squaresWithNull.length) {
                    weightage[squaresWithNull[0]] = weightage[squaresWithNull[0]] ? weightage[squaresWithNull[0]] + 200 : 200;
                }
            }

            // if X is about to win find possible squres and block 1
            if (squaresWithX.length > 1 && squaresWithO.length === 0) {
                if (squaresWithNull.length) {
                    weightage[squaresWithNull[0]] = weightage[squaresWithNull[0]] ? weightage[squaresWithNull[0]] + 100 : 100;
                }
            }

            if (squaresWithX.length === 1 && squaresWithO.length === 1) {
                if (squaresWithNull.length) {
                    weightage[squaresWithNull[0]] = weightage[squaresWithNull[0]] ? weightage[squaresWithNull[0]] + 10 : 10;
                }
            }

            if (squaresWithX.length === 1 && squaresWithO.length === 0) {
                squaresWithNull.forEach(element => {
                    weightage[element] = weightage[element] ? weightage[element] + 5 : 5;
                });
            }
        }

        var sortable = [];
        for (var i in weightage) {
            sortable.push([i, weightage[i]]);
        }

        sortable.sort(function (a, b) {
            return b[1] - a[1];
        });

        return sortable[0][0];
    }

    calculateWinner = (squares) => {
        for (let i = 0; i < this.lines.length; i++) {
            const [a, b, c] = this.lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                this.setState({
                    match: this.lines[i],
                    winner: squares[a]
                });
                return squares[a];
            }
        }
        return null;
    }

    render() {
        let status;
        if (this.state.winner !== '') {
            status = 'Winner: ' + this.state.winner;
        } else if (this.state.status != "") {
            status = 'Draw';
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        const squares = [];
        for (let i = 0; i < 9; i++) {
            squares.push(this.renderSquare(i));
        }

        return (
            <div>
                <div className="status">{status}</div>
                {!this.state.xIsNext && <div className="overlay" >test</div>}
                <div className="board">
                    {squares}
                </div>
            </div>
        );
    }
}

export default Board;