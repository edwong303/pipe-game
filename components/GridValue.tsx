import { pipes, setRotate } from "@/lib/features/pipe/pipeSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useState } from "react";

type GridValueProps = {
    i: number,
    j: number,
}

export default function GridValue(props: GridValueProps) {

    const {
        i, j,
    } = props;

    // const [rotate, setRotate] = useState<number>(0);
    const dispatch = useAppDispatch()

    const value = useAppSelector((state) => state.pipeReducer.board[i][j]);
    const rotate = useAppSelector((state) => state.pipeReducer.rotates[i][j]);
    const pipe = (value in pipes) ? pipes[value][rotate % (pipes[value].length)] : undefined;
    const isLock = useAppSelector((state) => state.pipeReducer.locked[i][j]);

    const isSource = useAppSelector((state) => {
        const source = state.pipeReducer.source;
        return source[0] == i && source[1] == j;
    });
    const isConnected = useAppSelector((state) => state.pipeReducer.connected[i][j]) > 0;
    const error = useAppSelector((state) => state.pipeReducer.errors[i][j]);

    // if (error) console.log("i", i, "j", j, error);

    function getColor(index: number,) {

        if (!!!pipe) return "";
        if (!pipe.has(index)) return "";

        const classList = [];

        if (!isSource && !isConnected) {
            classList.push("bg-gray-500")
        } else if (isSource && index == 4) {
            classList.push("bg-red-500")
        } else {
            classList.push("bg-blue-500")
        }

        if (value == 0 && index == 4) {
            classList.push("rounded-full")
        }
        return classList.join(" ")
    }

    return (
        <div
            className="absolute top-0 left-0 w-full h-full bg-opacity-25 text-black grid grid-cols-3"
            onClick={() => {
                if (isLock) return;
                dispatch(setRotate({ i, j }));
            }}
        >
            {
                (isSource) ?
                    (
                        <>
                            {
                                Array(9).fill(0).map((_, k) => (
                                    <div key={`Cell${i}${j}${k}`} className={getColor(k)}></div>
                                ))
                            }
                        </>
                    ) :
                    (
                        <>
                            {
                                Array(9).fill(0).map((_, k) => (
                                    <div key={`Cell${i}${j}${k}`} className={getColor(k)}></div>
                                ))
                            }
                        </>
                    )
            }

        </div>
    )
}