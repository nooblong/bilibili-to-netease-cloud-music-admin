import React, { type ReactElement, useState } from "react";

export default function Board({
                                  xIsNext,
                                  squares,
                                  onPlay,
                                  onStatusChange
                              }: {
    xIsNext: boolean
    squares: string[]
    onPlay: (nextSquares: string[], pos: [number, number]) => void
    onStatusChange: (status: string) => void
}): React.ReactElement[][] {
    // const [squares, setSquares] = useState(Array(9).fill(null))
    // const [xIsNext, setXIsNext] = useState(true);
    const [highLight, setHighLight] = useState(Array(3).fill(null))

    function handleClick(i: number): void {
        console.log('click')
        if ((squares[i] !== '') || (calculateWinner(squares, false) != null)) {
            return
        }
        const nextSquares = squares.slice()
        if (xIsNext) {
            nextSquares[i] = 'X'
        } else {
            nextSquares[i] = 'O'
        }
        // setSquares(nextSquares);
        // setXIsNext(!xIsNext);
        const row = Math.floor(i / 3) + 1
        const colum = i % 3 + 1
        onPlay(nextSquares, [colum, row])
        calculateWinner(nextSquares, true)
    }

    const winner = calculateWinner(squares, false)
    // const winner = calculateWinner(squares);
    let status: string
    if (winner != null) {
        status = 'Winner: ' + winner.toString()
    } else {
        status = 'Next player: ' + (xIsNext ? 'X' : 'O')
    }
    if (isFinish(squares)) {
        status = 'Finish!'
    }
    onStatusChange(status)

    function getSquare(): ReactElement[][] {
        const length: number = 9
        const rowNum: number = Math.sqrt(length)
        const rowIn = []
        // rowIn.push(<div className='status'>{status}</div>)
        for (let i = 0; i < rowNum; i++) {
            const row: ReactElement[] = []
            row.push(<div className='board-row'></div>)
            for (let j = 0; j < rowNum; j++) {
                const needHighLight: boolean = highLight != null ? highLight.includes((i * rowNum) + j) : false
                const element = <Square value={squares[(i * rowNum) + j]} onSquareClick={() => {
                    handleClick((i * rowNum) + j)
                }} highLight={needHighLight}/>
                row.push(element)
            }
            rowIn.push(row)
        }
        return rowIn
    }

    return getSquare()

    function Square({
                        value,
                        onSquareClick,
                        highLight
                    }: any): any {
        return <button className="square" style={highLight !== null ? {color: 'red'} : undefined}
                       onClick={onSquareClick}>{value}</button>
    }

    function calculateWinner(squares: any[], bool: boolean): number[] | null {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ]
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i]
            if ((Boolean((squares?.[a]))) && squares[a] === squares[b] && squares[a] === squares[c]) {
                if (bool) {
                    setHighLight([a, b, c])
                }
                return squares[a]
            }
        }
        return null
    }

    function isFinish(squares: any[]): boolean {
        let count: number = 0
        for (let i = 0; i < squares.length; i++) {
            if (squares[i] != null) {
                count += 1
            }
        }
        return count === 9
    }
}
