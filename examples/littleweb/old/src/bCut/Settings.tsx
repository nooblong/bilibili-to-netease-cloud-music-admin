import React, { type ReactElement, useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import { get, post } from "../util/request";
import ReactJson from "@microlink/react-json-view";
import { message } from "antd";

export default function (): ReactElement {
    const [messageApi, contextHolder] = message.useMessage()
    const [cookie, setCookie] = useState({})
    useEffect(() => {
        void get('/api/getBiliCookies').then(value => {
            setCookie(JSON.parse(value.data))
        }).catch(reason => {
            void messageApi.error('没有权限')
        })
    }, [])
    return (
        <Box component="form"
             sx={{
                 '& > :not(style)': {
                     m: 1,
                     width: '25ch'
                 }
             }}
             noValidate
             onSubmit={event => {
                 event.preventDefault()
                 const form: any = event.target
                 const formData: any = new FormData(form)
                 const jsonData: any = {}
                 for (const pair of formData.entries()) {
                     jsonData[pair[0]] = pair[1]
                 }
                 console.log('Input value:', JSON.stringify(jsonData))
                 void post('/api/setBiliCookies', jsonData).then(value => {
                     void messageApi.info(value.message)
                 })
             }}
             autoComplete="off">
            当前cookie:<ReactJson displayDataTypes={false} src={cookie}/>
            <br/>
            {contextHolder}
            <TextField
                id="outlined-uncontrolled"
                label="sessdata"
                name="sessdata"
            />
            <TextField
                id="outlined-uncontrolled"
                label="bili_jct"
                name="bili_jct"
            />
            <TextField
                id="outlined-uncontrolled"
                label="buvid3"
                name="buvid3"
            />
            <TextField
                id="outlined-uncontrolled"
                label="buvid4"
                name="buvid4"
            />
            <TextField
                id="outlined-uncontrolled"
                label="ac_time_value"
                name="ac_time_value"
            />
            <Button type="submit">提交</Button>
        </Box>
    )
}
