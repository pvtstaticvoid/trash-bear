import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// ========================================

const GRID_SIZE = 6;

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
                value={this.props.grid[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        const idxs = [...Array(GRID_SIZE).keys()];
        return (
            <div>
                {idxs.map((i) => {
                    return (
                        <div className="board-row">
                            {idxs.map((j) => {
                                const idx = i*GRID_SIZE + j
                                return (
                                    this.renderSquare(idx)
                                );
                            })}
                        </div>
                    )
                })}
                <button onClick={() => {
                    this.props.onStart(0, 0);
                    this.props.onPrev();
                }}>Find Shortest Path</button>
                <button onClick={() => {this.props.onReset()}}>Reset</button>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: Array(GRID_SIZE**2).fill(null),
            prevArr: Array(GRID_SIZE**2).fill(null),
        };
    }

    getDistances() {
        const distances = Array(GRID_SIZE**2).fill(null);
        const prevArr = Array(GRID_SIZE**2).fill(null);
        this.prop(0, 0, 0, distances, prevArr, null)
        this.setState({
            grid: distances,
            prevArr: prevArr,
        });
    }

    prop(i, j, d, distances, prevArr, prevIdx) {

        const idx = i*GRID_SIZE + j;
        if (i < 0 || i >= GRID_SIZE || j < 0 || j >= GRID_SIZE) {
            return;
        }
        if ((distances[idx] != null && distances[idx] <= d) || this.state.grid[idx] === "W") {
            return;
        }
        
        distances[idx] = d;
        prevArr[idx] = prevIdx

        this.prop(i + 1, j, d + 1, distances, prevArr, idx);
        this.prop(i - 1, j, d + 1, distances, prevArr, idx);
        this.prop(i, j + 1, d + 1, distances, prevArr, idx);
        this.prop(i, j - 1, d + 1, distances, prevArr, idx);
    }

    getShortedPath() {
        this.setState(function(state, props) {
            
            const ret = Array(GRID_SIZE**2).fill(null);

            let curr_idx = GRID_SIZE**2 - 1;
            while (curr_idx != null) {
                ret[curr_idx] = "X";
                curr_idx = state.prevArr[curr_idx];
            }
            
            return {
                grid: ret
            };
        });
    }

    handleClick(i) {
        const grid = this.state.grid.slice();
        grid[i] = this.state.xIsNext ? "X" : "W";
        this.setState({
            grid: grid
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
                        n = {GRID_SIZE}
                        grid={this.state.grid}
                        onClick={i => this.handleClick(i)}
                        onStart={(i, j) => {
                            this.getDistances();
                            // this.setState({grid: this.distances});
                        }}
                        onReset={() => {
                            this.setState({grid: Array(GRID_SIZE**2).fill(null)});
                        }}
                        onPrev={() => {
                            this.getShortedPath();
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