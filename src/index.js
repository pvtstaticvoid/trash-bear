import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// ========================================

const GRID_SIZE = 12;

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
                <div>
                    <button onClick={() => { this.props.onSearch(); }}>Search</button>
                    <button onClick={() => { this.props.onSalesman(); }}>Salesman</button>
                    <button onClick={() => { this.props.onReset(); }}>Reset</button>
                </div>
                <div>
                    <button onClick={() => { this.props.onClickClear(); }}>Demolish</button>
                    <button onClick={() => { this.props.onClickWall(); }}>Wall</button>
                </div>
                <div>
                    <button onClick={() => { this.props.onClickGarbage1(); }}>Garbage 1</button>
                    <button onClick={() => { this.props.onClickGarbage2(); }}>Garbage 2</button>
                    <button onClick={() => { this.props.onClickGarbage3(); }}>Garbage 3</button>
                </div>
            </div>
        );
    }
}

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            grid: Array(GRID_SIZE ** 2).fill(null),
            tool: "W",
            den: 0,
            bin1: null,
            bin2: null,
            bin3: null,
        };
    }

    perm(xs) {
        let ret = [];
      
        for (let i = 0; i < xs.length; i = i + 1) {
          let rest = this.perm(xs.slice(0, i).concat(xs.slice(i + 1)));
      
          if(!rest.length) {
            ret.push([xs[i]])
          } else {
            for(let j = 0; j < rest.length; j = j + 1) {
              ret.push([xs[i]].concat(rest[j]))
            }
          }
        }
        return ret;
      }

    salesman() {

        this.setState(function (state, _) {

            const ADJ = new Map();
            const POIArr = ["den", "bin1", "bin2", "bin3"];

            for (var i = 0; i < POIArr.length; i++) {
                for (var j = i + 1; j < POIArr.length; j++) {

                    const a = state[POIArr[i]];
                    const b = state[POIArr[j]];

                    const [shortestPath, shortestDist] = this.getShortestPath(state, a, b);
                    ADJ[[a, b]] = [shortestPath, shortestDist];
                    ADJ[[b, a]] = [shortestPath, shortestDist];
                    // console.log(a, b);
                    // console.log(ADJ[[a, b]]);
                }
            }

            const bucket = [state.bin1, state.bin2, state.bin3];
            const perms = this.perm(bucket);
            
            var best_dist = null;
            var best_path = null;

            for (var i = 0; i < perms.length; i++) {
                const perm = perms[i];
                const [d, a, b, c] = [0, perm[0], perm[1], perm[2]];

                // console.log(ADJ);

                const [p1, d1] = ADJ[[d, a]];
                const [p2, d2] = ADJ[[a, b]];
                const [p3, d3] = ADJ[[b, c]];
                const [p4, d4] = ADJ[[c, d]];
                const total_dist = d1 + d2 + d3 + d4;

                p1.pop();
                p2.pop();
                p3.pop();

                const path = [...p1, ...p2, ...p3, ...p4]

                if (best_dist == null || total_dist < best_dist) {
                    best_dist = total_dist;
                    best_path = path;
                }

            }


            const new_grid = Array(GRID_SIZE ** 2).fill(null);
            for (var i = 0; i < best_path.length; i++) {
                const idx = best_path[i];
                new_grid[idx] = "·";
            }

            return ({
                grid: new_grid
            });

        });

    }

    getShortestPath(state, a, b) {

        const distArr = Array(GRID_SIZE ** 2).fill(null);
        const prevArr = Array(GRID_SIZE ** 2).fill(null);
        
        const i = Math.floor(a / GRID_SIZE);
        const j = a % GRID_SIZE;

        this.visit(state, i, j, 0, distArr, prevArr, null);

        const shortestPath = Array();
        let curr_idx = b;
        while (curr_idx != null) {
            shortestPath.push(curr_idx);
            curr_idx = prevArr[curr_idx];
        }

        const shortestDist = shortestPath.length - 1;

        shortestPath.reverse();
        return [shortestPath, shortestDist];
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
        this.setState(function (state, _) {
            const grid = state.grid.slice();
            grid[i] = state.tool;

            let ret = {};
            ret["grid"] = grid;

            if (state.tool === "1") {
                ret["bin1"] = i;
            } else if (state.tool === "2") {
                ret["bin2"] = i;
            } else if (state.tool === "3") {
                ret["bin3"] = i;
            }

            return ret;
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
                        onSalesman={() => {
                            this.salesman();
                        }}
                        onReset={() => {
                            this.setState({
                                grid: Array(GRID_SIZE ** 2).fill(null),
                                tool: "W",
                                bin1: null,
                                bin2: null,
                                bin3: null,
                            });
                        }}
                        onClickClear={() => this.setState({ tool: null })}
                        onClickWall={() => this.setState({ tool: "W" })}
                        onClickGarbage1={() => this.setState({ tool: "1" })}
                        onClickGarbage2={() => this.setState({ tool: "2" })}
                        onClickGarbage3={() => this.setState({ tool: "3" })}
                    />
                </div>
            </div>
        );
    }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);