import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// ========================================

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        const idxs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        return (
            <div>
                {idxs.map((i) => {
                    return (
                        <div className="board-row">
                            {idxs.map((j) => {
                                return (
                                    this.renderSquare(i*10 + j)
                                );
                            })}
                        </div>
                    )
                })}
                <button onClick={() => {this.props.onStart(0, 0)}}>Start!</button>
                <button onClick={() => {this.props.onReset()}}>Reset</button>
                <button onClick={() => {this.props.onPrev()}}>Show prev path</button>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        // squares[0] = "X";
        // squares[99] = "X";
        this.state = {
            squares: Array(100).fill(null),
            prevArr: Array(100).fill(null),
        };
    }

    getDistances() {
        const distances = Array(100).fill(null);
        const prevArr = Array(100).fill(null);
        this.prop(0, 0, 0, distances, prevArr, null)
        this.setState({
            squares: distances,
            prevArr: prevArr,
        });
    }

    prop(i, j, d, distances, prevArr, prevIdx) {

        const idx = i*10 + j;
        if (i < 0 || i >= 10 || j < 0 || j >= 10) {
            return;
        }
        if ((distances[idx] != null && distances[idx] <= d) || this.state.squares[idx] === "W") {
            return;
        }

        if (idx === 0) {
            console.log({idx}, {d}, distances[idx]);
        }
        
        distances[idx] = d;
        let arrow;

        switch(idx) {
            case prevIdx + 1:
                arrow = "→"
                break;
            case prevIdx - 1:
                arrow = "←"
                break;
            case prevIdx + 10:
                arrow = "↓"
                break;
            case prevIdx - 10:
                arrow = "↑"
                break;
            default:
                arrow = "?"
                break;
        }

        prevArr[idx] = arrow

        this.prop(i + 1, j, d + 1, distances, prevArr, idx);
        this.prop(i - 1, j, d + 1, distances, prevArr, idx);
        this.prop(i, j + 1, d + 1, distances, prevArr, idx);
        this.prop(i, j - 1, d + 1, distances, prevArr, idx);
    }

    handleClick(i) {
        const squares = this.state.squares.slice();
        squares[i] = this.state.xIsNext ? "X" : "W";
        this.setState({
            squares: squares
        });
    }

    render() {

        // let status;
        // if (winner) {
        //     status = "Winner: " + winner;
        // } else {
        //     status = "Next player: " + (this.state.xIsNext ? "X" : "O");
        // }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={this.state.squares}
                        onClick={i => this.handleClick(i)}
                        onStart={(i, j) => {
                            this.getDistances();
                            // this.setState({squares: this.distances});
                        }}
                        onReset={() => {
                            this.setState({squares: Array(100).fill(null)});
                        }}
                        onPrev={() => {
                            this.setState((state, props) => ({squares: state.prevArr}));
                        }}
                    />
                </div>
                <div className="game-info">
                    {/* <div>{status}</div> */}
                    {/* <ol>{moves}</ol> */}
                </div>
            </div>
        );
    }
}





// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);