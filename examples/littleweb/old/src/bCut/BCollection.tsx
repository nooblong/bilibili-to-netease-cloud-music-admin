import { Button, Card, CardContent, TextField } from "@mui/material";
import React, { type ReactElement, useState } from "react";
import { get } from "../util/request";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Image } from "antd";

export default function ({
                             collectionInfo,
                             handleGetInfo
                         }: {
    collectionInfo: any
    handleGetInfo: (info: any) => void
}): ReactElement {
    const [bvid, setBvid] = useState('BV1cT411j7BC')
    return (
        <Box>
            <TextField id="standard-basic" onChange={
                (event) => {
                    setBvid(event.currentTarget.value)
                }} label="请输入一个包含于合集的视频的bvid或该视频的链接"
                       variant="standard"
                       fullWidth={true}
                       defaultValue="BV1cT411j7BC"/>
            <Button variant="contained" onClick={() => {
                void get('/api/download/getSeriesInfo?bvid=' + bvid).then(data => {
                    console.log(data)
                    data = data.data
                    data.cover = data.cover.replace(/^(http)s*(:\/\/)/, 'https://images.weserv.nl/?url=')
                    handleGetInfo(data)
                })
            }}>解析</Button>

            <Card sx={{maxWidth: 345}}>
                <Image
                    src={collectionInfo == null ? '' : collectionInfo.cover}
                />
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        {collectionInfo == null ? '' : collectionInfo.title}
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    )
}
