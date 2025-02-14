import { useState } from "react";
import GridValue from "./GridValue";
import GridNote from "./GridNote";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setLock } from "@/lib/features/pipe/pipeSlice";


type GridProps = {
    size: 'sm' | 'md' | 'lg',
    i: number,
    j: number,
}



export default function Grid(props: GridProps) {

    const {
        size,
        i,
        j,
    } = props;

    const dispatch = useAppDispatch()
    const isLock = useAppSelector((state) => state.pipeReducer.locked[i][j]);
    return (
        <div
            onContextMenu={(e) => {
                e.preventDefault();
                dispatch(setLock({ i, j }))
                e.stopPropagation();
            }}
            className={`box w-12 h-12 relative border border-gray-300 ${isLock ? "bg-gray-200" : "bg-white"}`}
        >
            <GridNote
                i={i}
                j={j}
            />
            <GridValue
                i={i}
                j={j}
            />

        </div>
    )
}