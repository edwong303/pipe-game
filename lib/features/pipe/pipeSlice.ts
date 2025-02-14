import { board, source, isWrapped } from "@/puzzles/pipe";
import { createSlice } from "@reduxjs/toolkit";

const height = board.length;
const width = board[0].length;

const dirs: [number, number][] = [
    [-1, 0], [0, 1], [1, 0], [0, -1]
];


type PipeMap = {
    [k in number]: Array<Set<number>>
};

export const pipes: PipeMap = {
    0: [new Set([1, 4]), new Set([5, 4]), new Set([7, 4]), new Set([3, 4])],
    1: [new Set([1, 4, 7]), new Set([3, 4, 5]),],
    2: [new Set([1, 4, 5]), new Set([5, 4, 7]), new Set([7, 4, 3]), new Set([3, 4, 1]),],
    3: [new Set([1, 4, 5, 7]), new Set([5, 4, 7, 3]), new Set([3, 4, 7, 1]), new Set([3, 4, 1, 5]),],
};

const nextPipes = [
    [[dirs[0],], [dirs[1],], [dirs[2],], [dirs[3],],],
    [[dirs[0], dirs[2],], [dirs[1], dirs[3],],],
    [[dirs[0], dirs[1],], [dirs[1], dirs[2],], [dirs[2], dirs[3],], [dirs[3], dirs[0],]],
    [[dirs[0], dirs[1], dirs[2],], [dirs[1], dirs[2], dirs[3],], [dirs[2], dirs[3], dirs[0],], [dirs[3], dirs[0], dirs[1],],]
]

export interface PipeGameState {
    board: number[][],
    isWrapped: boolean,
    width: number,
    height: number,
    rotates: number[][],
    locked: boolean[][],
    source: [number, number],
    connected: number[][],
    errors: boolean[][],
    notes: number[][][],
    offset: [number, number],
}

const initialState: PipeGameState = {
    board,
    isWrapped,
    width: width,
    height: height,
    rotates: Array(height).fill(0).map(_ => Array(width).fill(0)),
    locked: Array(height).fill(0).map(_ => Array(width).fill(false)),
    source,
    connected: Array(height).fill(0).map(() => Array(width).fill(-1)),
    errors: Array(height).fill(0).map(_ => Array(width).fill(false)),
    notes: Array(height).fill(0).map(() => Array(width).fill(0).map(() => Array(9).fill(0))),
    offset: [0, 0],
}
initialNote(initialState);
initialRotate(initialState);

bfs(initialState);


export const pipeSlice = createSlice({
    name: "pipe",
    initialState,
    reducers: {
        setRotate: (state, action) => {

            const {
                i, j
            } = action.payload;
            rotate(state, i, j, 1);



            bfs(state)

        },
        setLock: (state, action) => {
            const {
                isWrapped,
                board, rotates, locked,
                width, height,
                notes,
            } = state;

            const {
                i, j
            } = action.payload;

            const lock = locked[i][j]
            locked[i][j] = !lock

            const v = board[i][j];
            const r = rotates[i][j];

            for (const [di, dj] of dirs) {
                let newI = i + di;
                let newJ = j + dj;

                if (!isWrapped) {
                    if (newI < 0 || height <= newI || newJ < 0 || width <= newJ) continue;
                } else {
                    newI = (newI + height) % height;
                    newJ = (newJ + width) % width;
                }

                const x = 4 - 3 * di - dj;
                const included = nextPipes[v][r].some(([a, b]) => a == di && b == dj);

                if (notes[newI][newJ][x] < -1) continue;

                if (state.locked[i][j]) {
                    notes[newI][newJ][x] = included ? 1 : -1;
                } else {
                    notes[newI][newJ][x] = 0;
                }

                rotate(state, newI, newJ, 0);
            }
            // initialRotate(state);
            bfs(state);
        },
        setOffset: (state, action) => {

            const {
                height, width,
                offset: [i, j],
            } = state;
            const {
                di, dj,
            } = action.payload

            const newI = (i + di) % height;
            const newJ = (j + dj) % width;

            state.offset = [newI, newJ];
        }
    },
});

function initialNote(state: PipeGameState) {
    const {
        board,
        isWrapped,
        rotates,
        width,
        height,
        notes,
    } = state;

    for (let i = 0; i < height; ++i) {
        for (let j = 0; j < width; ++j) {
            const v = board[i][j];
            const r = rotates[i][j];

            if (!isWrapped) {
                if (i == 0) notes[i][j][1] = -2;
                if (j == 0) notes[i][j][3] = -2;
                if (i == height - 1) notes[i][j][7] = -2;
                if (j == width - 1) notes[i][j][5] = -2;
            }


            for (const [di, dj] of dirs) {
                let newI = i + di;
                let newJ = j + dj;

                if (!isWrapped) {
                    if (newI < 0 || height <= newI || newJ < 0 || width <= newJ) continue;
                } else {
                    newI = (newI + height) % height;
                    newJ = (newJ + width) % width;
                }

                const t = 4 + 3 * di + dj;

                if (v == 0 && board[newI][newJ] == 0) {
                    notes[i][j][t] = -2;
                }
            }
        }


    }
}

function initialRotate(state: PipeGameState) {
    const {
        width,
        height,
    } = state;

    for (let i = 0; i < height; ++i) {
        for (let j = 0; j < width; ++j) {
            rotate(state, i, j);
        }


    }
}

function rotate(state: PipeGameState, i: number, j: number, offset: number = 0) {
    const {
        board,
        rotates,
        notes,
    } = state;

    const pipe = board[i][j];
    const rotate = rotates[i][j]
    const gridNotes = notes[i][j];

    const blueSet = new Set();
    const redSet = new Set();

    for (let k = 0; k < gridNotes.length; ++k) {
        if (gridNotes[k] > 0) {
            blueSet.add(k);
        } else if (gridNotes[k] < 0) {
            redSet.add(k);
        }
    }

    for (let k = 0; k < 4; ++k) {
        const newRotate = (rotate + k + offset) % (pipes[pipe].length);
        const newPipe = pipes[pipe][newRotate];

        // console.log(`i: ${i}, j: ${j}, newRotate: ${newRotate}, blueSet: ${JSON.stringify(blueSet)}, redSet: ${JSON.stringify(redSet)}`);

        if (newPipe.intersection(redSet).size > 0) continue;
        // noRed
        if (blueSet.difference(newPipe).size > 0) continue;
        rotates[i][j] = newRotate; // (rotate + 1) % (pipes[pipe].length);
        break;
    }
}

function bfs(state: PipeGameState) {
    const {
        board,
        rotates,
        width,
        height,
        source,
        connected,
        errors,
    } = state;

    for (let i = 0; i < height; ++i) {
        for (let j = 0; j < width; ++j) {
            connected[i][j] = -1;
        }
    }

    let level = 1;
    let queue: [number, number][] = [source]
    const visited = new Set();
    while (queue.length != 0) {
        const next: [number, number][] = []

        for (const [i, j] of queue) {
            const index = i * width + j;
            if (visited.has(index)) continue;
            visited.add(index);
            connected[i][j] = level;

            const v = board[i][j];
            const r = rotates[i][j];

            for (const [di, dj] of nextPipes[v][r]) {
                let newI = i + di;
                let newJ = j + dj;

                if (!isWrapped) {
                    if (newI < 0 || height <= newI || newJ < 0 || width <= newJ) continue;
                } else {
                    newI = (newI + height) % height;
                    newJ = (newJ + width) % width;
                }

                const nextPipeShape = board[newI][newJ];
                const nextRotate = rotates[newI][newJ];
                const nextPipe = pipes[nextPipeShape][nextRotate];
                // console.log("nextPipeShape", nextPipeShape, "nextRotate", nextRotate)
                const t = 4 - 3 * di - dj;

                if (nextPipe.has(t)) next.push([newI, newJ]);
            }
        }

        queue = next;
    }


}
export const { setLock, setRotate, setOffset } = pipeSlice.actions;
export const pipeReducer = pipeSlice.reducer;