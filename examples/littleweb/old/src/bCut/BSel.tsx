import { Button, Card, CardContent, FormControl, MenuItem, TextField } from "@mui/material";
import React, { type ReactElement, useState } from "react";
import { get } from "../util/request";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Image } from "antd";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";

interface VideoInfo {
    title: string
    image: string
    quality: string[]
    bvid: string
    useQuality: string
    pages: any[]
}

export default function ({
                             bvid,
                             setBvid
                         }: {
    bvid: string
    setBvid: (info: string) => void
}): ReactElement {
    const [videoInfo, setVideoInfo] = useState<VideoInfo>({
        bvid: '',
        image: '',
        pages: [],
        quality: [],
        title: '',
        useQuality: ''
    })
    const [bvidIn, setBvidIn] = useState('BV1FQ4y1z7eD')
    return (
        <Box>
            <TextField id="standard-basic" onChange={
                (event) => {
                    setBvidIn(event.currentTarget.value)
                }} label="请输入bvid或url"
                       fullWidth={true}
                       variant="standard"
                       defaultValue="BV1FQ4y1z7eD"/>
            <Button variant="contained" onClick={() => {
                void get('/api/download/getVideoInfo?bvid=' + bvidIn).then(data => {
                    console.log(data)
                    data = data.data
                    const obj: VideoInfo = {
                        title: data.title,
                        image: data.image.replace(/^(http)s*(:\/\/)/, 'https://images.weserv.nl/?url='),
                        quality: data.quality,
                        bvid: bvidIn,
                        useQuality: data.quality[0],
                        pages: data.pages
                    }
                    setVideoInfo(obj)
                    setBvid(bvidIn)
                    console.log('set bvid: ' + bvidIn)
                })
            }}>解析</Button>

            <Card sx={{maxWidth: 345}}>
                <Image
                    src={videoInfo.image}
                />
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        {videoInfo.title}
                    </Typography>
                </CardContent>
                {videoInfo.pages.length > 1 && <Box sx={{minWidth: 120}}>
                    <FormControl fullWidth>
                        <InputLabel id="预计分p数量">预计分p数量</InputLabel>
                        <Select
                            labelId="预计分p数量"
                            id="demo-simple-select"
                            label="预计分p数量"
                        >
                            {videoInfo.pages.map(value => {
                                return <MenuItem key={value.cid} value={value.cid}>{value.part}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                </Box>}
            </Card>
        </Box>
    )
}
