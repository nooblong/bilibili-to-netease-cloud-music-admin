import React, { Fragment, type ReactElement, useState } from "react";
import UseTemplate from "./UseTemplate";
import { Button, Card, Grid } from "@mui/material";
import Box from "@mui/material/Box";

export default function (): ReactElement {
    const [imgUrl, setImgUrl] = useState('')
    const [imgHeight, setImgHeight] = useState(0)

    async function handleSetImage(data: Blob): Promise<void> {
        const url1 = URL.createObjectURL(data)
        setImgUrl(url1)
    }

    return (
        <Fragment>
            <p>
                1. 直接生成，直接点击图片输入文字。
                <br/>
                2. 自定义模板，进入自定义上传图片，编辑元素，完成后点击上传模板。然后到图片页，使用画图p去原有文字，点击图片更改为没有文字的图。
            </p>
            <Grid container spacing={3}>
                {/* <Grid item xs={12}>
                    <Card raised={true} sx={{minWidth: 275}}>
                        <Grid container spacing={1} margin={1}>
                            <Grid item xs={11}>
                                <TextField fullWidth id="standard-basic" label="时间" variant="standard" value={time}
                                           onChange={
                                               (e) => {
                                                   setTime(e.target.value)
                                               }
                                           }>
                                </TextField>
                            </Grid>
                            <Grid item xs={11}>
                                <TextField fullWidth id="standard-basic" label="日期" variant="standard" value={date}
                                           onChange={(e) => {
                                               setDate(e.target.value)
                                           }}>
                                </TextField>
                            </Grid>
                            <Grid item xs={11}>
                                <TextField fullWidth id="standard-basic" label="Standard" variant="standard">
                                    <label htmlFor="text24">速度</label>
                                    <input value={speed} type="text" onChange={(e) => {
                                        setSpeed(e.target.value)
                                    }}/>
                                </TextField>
                            </Grid>
                            <Grid item xs={11}>
                                <TextField fullWidth id="standard-basic" label="距离" variant="standard"
                                           value={distance}
                                           onChange={(e) => {
                                               setDistance(e.target.value)
                                           }}>
                                </TextField>
                            </Grid>
                            <Button
                                variant="contained"
                                sx={{mt: 3, ml: 1}}
                                onClick={() => {
                                    fetch("/api/generateImage", {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        // mode: "cors",
                                        body: JSON.stringify({
                                            "time": time,
                                            "date": date,
                                            "speed": speed,
                                            "distance": distance
                                        })
                                    }).then(async data => {
                                        console.log(data)
                                        const blob = await data.blob();
                                        let url1 = URL.createObjectURL(blob);
                                        setImgUrl(url1)
                                    })
                                }}
                            >
                                提交
                            </Button>
                        </Grid>
                    </Card>
                </Grid> */}
                <Grid item xs={12}>
                    <UseTemplate handleChangeImage={handleSetImage}/>
                </Grid>
                {imgUrl !== ''
                    ? <Button onClick={event => {
                        const csvURL = imgUrl
                        const tempLink = document.createElement('a')
                        tempLink.href = csvURL
                        tempLink.setAttribute('download',
                            new Date().getMonth() + '-' + new Date().getDate() + '.png')
                        tempLink.click()
                    }}>下载图片</Button>
                    : null}
                {imgUrl !== '' &&
                    <Grid item xs={12}>
                        <Card raised={true}>
                            <Box height={imgHeight}>
                                <img src={imgUrl} style={{
                                    width: '100%',
                                    objectFit: 'contain'
                                }}
                                     onLoad={(event) => {
                                         // 图片加载完毕
                                         window.dispatchEvent(new Event('resize'))
                                         setImgHeight(event.currentTarget.height)
                                         console.log(event.currentTarget.height)
                                     }} alt=""/>
                            </Box>
                        </Card>
                    </Grid>
                }
            </Grid>
        </Fragment>
    )
}
