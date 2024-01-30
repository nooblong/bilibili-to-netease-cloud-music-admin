import React, { type ReactElement, useState } from "react";
import Terminal, { ColorMode, TerminalOutput } from "react-terminal-ui";

const TerminalController = (props = {}): ReactElement => {
    const [terminalLineData, setTerminalLineData] = useState([
        <TerminalOutput>你好</TerminalOutput>
    ])
    // Terminal has 100% width by default, so it should usually be wrapped in a container div
    return (
        <div className="container">
            <Terminal name='' colorMode={ColorMode.Light} onInput={terminalInput => {
                console.log(`New terminal input received: '${terminalInput}'`)
            }
            }>
                {terminalLineData}
            </Terminal>
        </div>
    )
}

export default function (): ReactElement {
    return (
        <>
            <TerminalController/>
        </>
    )
}
