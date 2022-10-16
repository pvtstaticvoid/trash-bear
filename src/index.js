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
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(100).fill(null)
        };
    }

    handleClick(i) {
        const squares = this.state.squares.slice();
        squares[i] = this.state.xIsNext ? "X" : "O";
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