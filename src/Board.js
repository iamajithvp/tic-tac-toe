import React from "react";
import Square from "./Square";

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(9).fill(null),
            xIsNext: true,
            match: [],
            winner: ""
        };
    }

    handleClick = (i) => {

        const squares = this.state.squares.slice();

        if (this.calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            squares: squares,
            xIsNext: !this.state.xIsNext
        });

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
        let x, o, n = [];
        let w = {};
        for (let i = 0; i < this.lines.length; i++) {

            x = this.lines[i].filter((s) => { return squares[s] === "X" });
            o = this.lines[i].filter((s) => { return squares[s] === "O" });
            n = this.lines[i].filter((s) => { return squares[s] === null });

            if (x.length > 1 && o.length === 0) {
                if (n.length) {
                    w[n[0]] = w[n[0]] ? w[n[0]] + 100 : 100;
                }
            }

            if (x.length === 1 && o.length === 1) {
                if (n.length) {
                    w[n[0]] = w[n[0]] ? w[n[0]] + 10 : 10;
                }
            }

            if (x.length === 1 && o.length === 0) {
                n.forEach(element => {
                    w[element] = w[element] ? w[element] + 5 : 5;
                });
            }
        }

        var sortable = [];
        for (var i in w) {
            sortable.push([i, w[i]]);
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