import { Button, Card, CardContent, TextField } from "@mui/material";
import React, { type ReactElement, useState } from "react";
import { get } from "../util/request";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Image } from "antd";

export interface UserInfo {
    uid: string
    data: any
}

export default function ({
                             userInfo,
                             handleGetInfo
                         }: {
    userInfo: UserInfo
    handleGetInfo: (info: UserInfo) => void
}): ReactElement {
    const [uid, setUid] = useState('6906052')
    return (
        <Box>
            <TextField id="standard-basic" onChange={
                (event) => {
                    setUid(event.currentTarget.value)
                }} label="请输入uid"
                       variant="standard"
                       fullWidth={true}
                       defaultValue="6906052"/>
            <Button variant="contained" onClick={() => {
                void get('/api/download/getUserInfo?uid=' + uid).then(data => {
                    console.log(data)
                    data = data.data
                    data.face = data.face.replace(/^(http)s*(:\/\/)/, 'https://images.weserv.nl/?url=')
                    handleGetInfo({
                        uid,
                        data
                    })
                })
            }}>解析</Button>

            <Card sx={{maxWidth: 345}}>
                <Image
                    src={userInfo.data == null ? '' : userInfo.data.face}
                />
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        {userInfo.data == null ? '' : userInfo.data.name}
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    )
}
