import { useAppSelector } from "@/lib/hooks";

type GridNoteProps = {
    i: number,
    j: number,
}

const colors: Record<number, string> = {
    [-2]: "bg-red-500 bg-opacity-75",
    [-1]: "bg-red-500 bg-opacity-25",
    [0]: "",
    [1]: "bg-blue-500 bg-opacity-25",
    [2]: "bg-blue-500 bg-opacity-75",
}
export default function GridNote(props: GridNoteProps) {

    const {
        i, j,
    } = props;

    const isLock = useAppSelector((state) => state.pipeReducer.locked[i][j]);
    const note = useAppSelector((state) => state.pipeReducer.notes[i][j]);

    function getColor(k: number) {
        if (isLock) return "";
        if (note[k] == 0) return "";
        return colors[note[k]];
    }
    return (
        <div className="absolute top-0 left-0 w-full h-full text-black grid grid-cols-3">
            {
                Array(9).fill(0).map((_, k) => (
                    <div key={`Cell${i}${j}${k}`} className={getColor(k)}></div>
                ))
            }
        </div>
    )
}