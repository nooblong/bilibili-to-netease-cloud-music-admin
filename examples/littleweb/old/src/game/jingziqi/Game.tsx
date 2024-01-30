import React, { type ReactElement, useState } from "react";
import Board from "./Board";

class Move {
    array: string[]
    now: [number, number]

    constructor() {
        this.array = new Array(9)
        this.now = [-1, -1]
    }
}

export default function Game(): ReactElement {
    // const [xIsNext, setXIsNext] = useState(true);
    const [history, setHistory] = useState<Move[]>([new Move()])
    const [currentMove, setCurrentMove] = useState(0)
    const isNext = currentMove % 2 === 0
    const [sort, setSort] = useState(false)
    const [status, setStatus] = useState('')
    // const currentSquares = history[history.length - 1];
    const currentSquares = history[currentMove].array

    function handlePlay(nextSquares: string[], pos: [number, number]): void {
        const nextMove: Move = new Move()
        nextMove.array = nextSquares
        nextMove.now = pos
        const nextHistory = [...history.slice(0, currentMove + 1), nextMove]
        setHistory(nextHistory)
        setCurrentMove(nextHistory.length - 1)
        // setHistory([...history, nextSquares]);
        // setXIsNext(!xIsNext);
    }

    function jumpTo(nextMove: number): void {
        setCurrentMove(nextMove)
        // setXIsNext(nextMove % 2 === 0);
    }

    function moves(): JSX.Element[] {
        const result: JSX.Element[] = history.map(
            (squares, move) => {
                let description
                if (move > 0) {
                    description = 'Go to move #' + move + '(' + squares.now[0] + ',' + squares.now[1] + ')'
                } else {
                    description = 'Go to game start'
                }
                if (move === currentMove) {
                    return (
                        <div key={move} style={{padding: '3px'}}>
                            <tr key={move}>
                                <text>you are at move #{move} : ( {squares.now[0]}, {squares.now[1]} )</text>
                            </tr>
                        </div>
                    )
                }
                return (
                    <div key={move} style={{padding: '3px'}}>
                        <tr key={move}>
                            <text onClick={() => {
                                jumpTo(move)
                            }}>{description}</text>
                        </tr>
                    </div>
                )
            }
        )
        if (sort) {
            return result.reverse()
        } else {
            return result
        }
    }

    return (
        <div className="wrap window" style={{height: 165}}>
            <div className="title-bar">
                <div className="title-bar-text">井字棋</div>
            </div>
            <div className="game">
                <div className="game-board">
                    <Board
                        xIsNext={isNext}
                        squares={currentSquares}
                        onPlay={handlePlay}
                        onStatusChange={setStatus}
                    />
                </div>
                <div className="sunken-panel" style={{height: 120}}>
                    <table className="interactive">
                        <thead>
                        <tr>
                            <th>Step</th>
                        </tr>
                        </thead>
                        <tbody>
                        <div>
                            <>{moves()}</>
                        </div>
                        </tbody>
                    </table>
                </div>
                <div>
                    <button onClick={() => {
                        setSort(!sort)
                    }}>sort
                    </button>
                </div>
            </div>
            <div className="status-bar" style={{width: '100%'}}>
                <p className="status-bar-field">{status}</p>
            </div>
        </div>
    )
}
