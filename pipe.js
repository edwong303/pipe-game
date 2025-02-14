var types = [-1, 0, 0, 2, 0, 1, 2, 3, 0, 2, 1, 3, 2, 3, 3]
var htmlCells = document.getElementsByClassName("cell")
var cells = Array.from(htmlCells)
var pipes = cells
    .map(cell => Array.from(cell.classList))

var source = []

var pipeTypes = pipes
    .map(classList => classList.find(className => className.startsWith("pipe")))
    .map(pipe => pipe.substring(4))
    .map(type => Number(type))
    .map(t => types[t])

var n = Math.sqrt(pipes.length)

var puzzle = []

for (let i = 0; i < n; ++i) {
    var row = []
    for (let j = 0; j < n; ++j) {
        var index = i * n + j
        if (pipes[index].includes("source")) {
            source = [i, j]
        }

        row.push(pipeTypes[index])
    }
    puzzle.push(row)
}

const isWrapped = document.getElementsByClassName("wrapH").length > 0;

var texts = [
    "export const board = " + JSON.stringify(puzzle) + ";",
    "export const source: [number, number] = " + JSON.stringify(source) + ";",
    "export const isWrapped: boolean = " + JSON.stringify(isWrapped) + ";",

]

console.log(texts.join("\n"))
