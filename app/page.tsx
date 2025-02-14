"use client"

import Grid from "@/components/Grid";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useState } from "react";
import StoreProvider from "./StoreProvider";
import { setOffset } from "@/lib/features/pipe/pipeSlice";


// const source = [1, 2]
function PipeGame() {
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('lg');
  const isWrapped = useAppSelector(state => state.pipeReducer.isWrapped);
  const width = useAppSelector(state => state.pipeReducer.width);
  const height = useAppSelector(state => state.pipeReducer.height);
  const [di, dj] = useAppSelector(state => state.pipeReducer.offset);
  const dispatch = useAppDispatch();

  return (
    <div>
      <div className="w-fit border-2 border-gray-500">
        {
          Array(height).fill(0).map((_, i: number) => (
            <div key={"row-" + i} className="flex flex-row">
              {
                Array(width).fill(0).map((_, j, number) => (
                  <Grid
                    key={"grid-" + i + "-" + j}
                    size={size}
                    i={(i + di) % height}
                    j={(j + dj) % width}
                  ></Grid>
                ))
              }
            </div>
          ))
        }
      </div>
      {
        (isWrapped) ?
          (
            <div className="flex flex-row">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                onClick={() => dispatch(setOffset({ di: 0, dj: 1 }))}
              >
                <path d="M20 15h-8v3.586a1 1 0 0 1 -1.707 .707l-6.586 -6.586a1 1 0 0 1 0 -1.414l6.586 -6.586a1 1 0 0 1 1.707 .707v3.586h8a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1z" />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                onClick={() => dispatch(setOffset({ di: 1, dj: 0 }))}
              >
                <path d="M9 20v-8h-3.586a1 1 0 0 1 -.707 -1.707l6.586 -6.586a1 1 0 0 1 1.414 0l6.586 6.586a1 1 0 0 1 -.707 1.707h-3.586v8a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
              </svg>
            </div>
          ) : null
      }
    </div>
  );
}
export default function Home() {
  return (
    <StoreProvider>
      <PipeGame />
    </StoreProvider>
  )

}