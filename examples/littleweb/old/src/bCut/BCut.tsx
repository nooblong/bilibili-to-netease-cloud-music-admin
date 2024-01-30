import { Button, Card, CardActions, CardContent, FormControl, MenuItem, NativeSelect, TextField } from "@mui/material";
import React, { type ReactElement, useState } from "react";
import { get } from "../util/request";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Image } from "antd";
import InputLabel from "@mui/material/InputLabel";
import Select, { type SelectChangeEvent } from "@mui/material/Select";

export interface VideoInfo {
    title: string
    image: string
    quality: string[]
    bvid: string
    useQuality: string
    pages: any[]
    cid: string
    partName: string
}

export default function ({
                             videoInfo,
                             handleGetInfo
                         }: {
    videoInfo: VideoInfo
    handleGetInfo: (info: VideoInfo) => void
}): ReactElement {
    const [bvid, setBvid] = useState(videoInfo.bvid)
    const [page, setPage] = useState<string>('')
    const [partName, setPartName] = useState<string>('')

    const handleChange = (event: SelectChangeEvent): void => {
        if (videoInfo.pages.length > 1) {
            setPage(event.target.value)
            const obj = {
                ...videoInfo,
                cid: event.target.value,
                partName: videoInfo.pages.filter(value => value.cid === event.target.value)[0].part
            }
            if (event.target.value !== page) {
                void get('/api/download/getVideoInfo?bvid=' + bvid + '&cid=' + event.target.value).then(data => {
                    data = data.data
                    obj.quality = data.quality
                })
            }
            handleGetInfo(obj)
        }
    }

    return (
        <Box>
            <TextField id="standard-basic" onChange={
                (event) => {
                    setBvid(event.currentTarget.value)
                }} label="请输入bvid"
                       variant="standard"
                       fullWidth={true}
                       defaultValue="BV15a411M7r2"/>
            <Button variant="contained" onClick={() => {
                void get('/api/download/getVideoInfo?bvid=' + bvid).then(data => {
                    console.log(data)
                    data = data.data
                    const obj = {
                        title: data.title,
                        image: data.image.replace(/^(http)s*(:\/\/)/, 'https://images.weserv.nl/?url='),
                        quality: data.quality,
                        bvid,
                        useQuality: data.quality[0],
                        pages: data.pages,
                        cid: page,
                        partName
                    }
                    if (data.pages.length > 1) {
                        setPage(data.pages[0].cid)
                        setPartName(data.pages[0].part)
                        obj.cid = data.pages[0].cid
                        obj.partName = data.pages[0].part
                    } else {
                        setPage('')
                        setPartName('')
                        obj.cid = ''
                        obj.partName = ''
                    }
                    handleGetInfo(obj)
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
                        <InputLabel id="请选择分p">请选择分p</InputLabel>
                        <Select
                            labelId="请选择分p"
                            id="demo-simple-select"
                            value={page}
                            label="请选择分p"
                            onChange={handleChange}
                        >
                            {videoInfo.pages.map(value => {
                                return <MenuItem key={value.cid} value={value.cid}>{value.part}</MenuItem>
                            })}
                            <MenuItem key={''} value={''}>不选择(默认1p)</MenuItem>
                        </Select>
                    </FormControl>
                </Box>}

                <CardActions>
                    码率:
                    <FormControl>
                        <NativeSelect
                            value={videoInfo.useQuality}
                            onChange={event => {
                                handleGetInfo({
                                    ...videoInfo,
                                    useQuality: event.currentTarget.value
                                })
                            }}
                        >
                            {videoInfo.quality.length === 0 && <option>未选择码率</option>}
                            {
                                videoInfo.quality.map(value => {
                                    return <option key={value} value={value}>{value}</option>
                                })
                            }
                        </NativeSelect>
                    </FormControl>
                </CardActions>
            </Card>
        </Box>
    )
}
