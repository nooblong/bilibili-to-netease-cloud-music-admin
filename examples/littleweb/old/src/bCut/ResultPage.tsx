import { Result } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import React, { type ReactElement } from "react";

export default function (): ReactElement {
    const {state} = useLocation()
    const navigate = useNavigate()
    return (
        <Result status={state.status} title={state.title}
                extra={<>
                    你可以通过
                    <a href={state.link}>{state.link}</a>
                    获取声音
                    <br/>
                    <p>
                        因为要审核所以要等会才有
                    </p>
                    <Button variant="contained" onClick={() => {
                        navigate(state.extra.to)
                    }}>
                        {state.extra.name}
                    </Button>
                </>
                }/>
    )
}
