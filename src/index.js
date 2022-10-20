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
                                const idx = i * GRID_SIZE + j
                                return (
                                    this.renderSquare(idx)
                                );
                            })}
                        </div>
                    )
                })}
                <button onClick={() => { this.props.onSearch(); }}>Search</button>
                <button onClick={() => { this.props.onReset(); }}>Reset</button>
            </div>
        );
    }
}

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            grid: Array(GRID_SIZE ** 2).fill(null),
        };
    }

    DFS() {
        this.setState(function (state, _) {

            const distArr = Array(GRID_SIZE ** 2).fill(null);
            const prevArr = Array(GRID_SIZE ** 2).fill(null);
            this.visit(state, 0, 0, 0, distArr, prevArr, null);

            const shortestPath = Array(GRID_SIZE ** 2).fill(null);
            let curr_idx = GRID_SIZE ** 2 - 1;
            while (curr_idx != null) {
                shortestPath[curr_idx] = "X";
                curr_idx = prevArr[curr_idx];
            }

            return ({
                grid: shortestPath,
            });
        });
    }

    visit(state, i, j, d, distArr, prevArr, prevIdx) {

        const idx = i * GRID_SIZE + j;

        if (i < 0 || i >= GRID_SIZE || j < 0 || j >= GRID_SIZE) { return; }
        if (state.grid[idx] === "W") { return; }
        if ((distArr[idx] != null && distArr[idx] <= d)) { return; }

        distArr[idx] = d;
        prevArr[idx] = prevIdx

        this.visit(state, i + 1, j, d + 1, distArr, prevArr, idx);
        this.visit(state, i - 1, j, d + 1, distArr, prevArr, idx);
        this.visit(state, i, j + 1, d + 1, distArr, prevArr, idx);
        this.visit(state, i, j - 1, d + 1, distArr, prevArr, idx);
    }

    handleClick(i) {
        const grid = this.state.grid.slice();
        grid[i] = this.state.xIsNext ? "X" : "W";
        this.setState({
            grid: grid
        });
    }

    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        grid={this.state.grid}
                        onClick={i => this.handleClick(i)}
                        onSearch={() => {
                            this.DFS();
                        }}
                        onReset={() => {
                            this.setState({
                                grid: Array(GRID_SIZE ** 2).fill(null),
                            });
                        }}
                    />
                </div>
            </div>
        );
    }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);