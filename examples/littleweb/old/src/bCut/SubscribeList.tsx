import { type ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import * as React from "react";
import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { Button, CardActionArea, CardActions, Grid } from "@mui/material";
import { get } from "../util/request";
import { Link, Route, Routes } from "react-router-dom";

export default function SubscribeList(): ReactJSXElement {
    const [voiceData, setVoiceData] = useState<any[]>([])

    async function fetchData(): Promise<void> {
        let mapData = await get('/api/data/subscribeVoiceList')
        mapData = mapData.data
        const result = []
        for (const [k, v] of Object.entries(mapData)) {
            const value = await get('/api/direct/dj/detail?rid=' + k + '&useCookie=99999')
            result.push({
                voiceListId: k,
                voiceListName: value.data.name,
                voiceListImage: value.data.picUrl,
                voiceProgramCount: value.data.programCount,
                voiceListSubscribe: v
            })
        }
        setVoiceData(result)

        // void get('/api/download/getUserInfo?uid=' + uid).then(data => {
        //   console.log(data)
        //   data = data.data
        //   data.face = data.face.replace(/^(http)s*(:\/\/)/, 'https://images.weserv.nl/?url=')
        //   handleGetInfo({
        //     uid,
        //     data
        //   })
        // })
    }

    useEffect(() => {
        console.log('start')
        void fetchData()
        return () => {
            console.log('return')
            setVoiceData([])
        }
    }, [])

    return (
        <Grid container spacing={1}>
            <Routes>
                <Route path="/choose" element={<h1>!@#</h1>}></Route>
            </Routes>
            {voiceData.map(i =>
                <Grid key={i.voiceListId} item xs={6}>
                    <Card
                        key={i.voiceListId}
                        sx={{}}>
                        <Link to={{pathname: '/choose/' + i.voiceListId}} state={i.voiceListSubscribe}>
                            <CardActionArea>
                                <CardMedia
                                    component="img"
                                    height="120"
                                    image={i.voiceListImage.replace(/^(http)s*(:\/\/)/, 'https://images.weserv.nl/?url=')}
                                    alt="green iguana"
                                />
                                <CardContent>
                                    {i.voiceListName}
                                    <br/>
                                    {i.voiceProgramCount}首
                                </CardContent>
                            </CardActionArea>
                        </Link>

                        <CardActions>
                            <Button size="small" color="primary">
                                全部上传(未通过)
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            )}
        </Grid>
    )
}
