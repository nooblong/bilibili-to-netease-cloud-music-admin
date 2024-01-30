import React, { type ReactElement, useEffect, useState } from "react";
import { type RGBColor } from "react-color";
import ElementList from "./ElementList";
import Selector from "./Selector";
import { post } from "../util/request";
import { Alert, Card, Grid, Input, Snackbar, Stack } from "@mui/material";
import Box from "@mui/material/Box";

export interface ImageElement {
    imageFileId: number
    posXPercent: number
    posYPercent: number
    name?: string
    str?: string
    color?: string
    style?: number
    size?: number
    fontName?: string
    originalData?: string
    distance?: string
    time?: string
    password?: string
}

export interface ImageElementBo {
    id: number
    x: number
    xs: number
    y: number
    ys: number
    rgb?: RGBColor
    name?: string
    str?: string
    style?: number
    size?: number
    fontName?: string
    isShow: boolean
    h?: string
    m?: string
    s?: string
    distance?: string
}

export default function (): ReactElement {
    const [list, setList] = useState<ImageElementBo[]>([
        {
            id: 0,
            x: 0,
            xs: 0,
            y: 0,
            ys: 0,
            str: 'data',
            size: 82,
            fontName: '?',
            name: '第' + 0 + '个',
            isShow: true
        }
    ])

    const [imgUrl, setImgUrl] = useState('')
    const [imgId, setImgId] = useState(0)

    const [selected, setSelected] = useState(0)

    const [id, setId] = useState(1)
    const [imgHeight, setImgHeight] = useState(0)
    const [toast, setToast] = useState(false)
    const [msg, setMsg] = useState('')
    const [tSuccess, setTSuccess] = useState(true)
    const [distance, setDistance] = useState('')
    const [h, setH] = useState('')
    const [m, setM] = useState('')
    const [s, setS] = useState('')
    const [password, setPassword] = useState('')

    if (getSelected(selected) == null) {
        setSelected(list[0].id)
    }

    useEffect(() => {
        if (imgId !== null && imgId !== 0) {
            const timer = setTimeout(() => {
                updateImage(imgId)
            }, 200)
            return () => {
                clearTimeout(timer)
            }
        }
    }, [list, imgId])

    function trans(): ImageElement[] {
        const toSend: ImageElement[] = []
        list.forEach((i): void => {
            i.h = h
            i.m = m
            i.s = s
            i.distance = distance
            if (i.isShow) {
                toSend.push({
                    imageFileId: imgId,
                    posXPercent: i.x == null ? 20 : i.x + (i.xs / 100),
                    posYPercent: i.y == null ? 20 : i.y + (i.ys / 100),
                    color: i.rgb == null ? '255,255,255,1' : i.rgb?.r + ',' + i.rgb?.g + ',' + i.rgb?.b + ',' + i.rgb?.a,
                    fontName: i.fontName ?? '苹方黑体-中粗-简.ttf',
                    name: i.name ?? 'noname',
                    size: i.size ?? 82,
                    str: i.str === '' || i.str == null ? 'data' : i.str,
                    style: i.style ?? 0,
                    originalData: JSON.stringify(list),
                    distance,
                    time: h + '///' + m + '///' + s,
                    password
                })
            }
        })
        return toSend
    }

    function handleFileChange(event: any): void {
        const selectedFile = event.target.files[0]
        const fd = new FormData()
        fd.append('file', selectedFile)
        void fetch('/api/uploadImage', {
            method: 'POST',
            body: fd
        }).then(async res => {
            return await res.json()
        }).then(res => {
            // 相同的话去获取json
            if (res.code === 201) {
                void post('/api/getOriginalData', {id: res.data}).then(value => {
                    if (value.data !== null) {
                        const parse: ImageElementBo[] = JSON.parse(value.data)
                        const currentId = parse[parse.length - 1].id + 1
                        setId(currentId)
                        setList(parse)
                        if (undefined !== parse[0].h) {
                            setH(parse[0].h)
                        }
                        if (undefined !== parse[0].m) {
                            setM(parse[0].m)
                        }
                        if (undefined !== parse[0].s) {
                            setS(parse[0].s)
                        }
                        if (undefined !== parse[0].distance) {
                            setDistance(parse[0].distance)
                        }
                    } else {
                        setList([{
                            id: 0,
                            x: 0,
                            xs: 0,
                            y: 0,
                            ys: 0,
                            str: 'data',
                            size: 82,
                            fontName: '?',
                            name: '第' + 0 + '个',
                            isShow: true
                        }])
                    }
                    setImgId(res.data)
                })
            } else {
                setImgId(res.data)
                updateImage(res.data)
            }
        })
    }

    function updateImage(id: number): void {
        const toSend: ImageElement[] = trans()
        void fetch('/api/generateCustomImage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                imageId: id,
                imageElements: toSend
            })
        }).then(async data => {
            const blob = await data.blob()
            const url1 = URL.createObjectURL(blob)
            setImgUrl(url1)
        })
    }

    function handleSelect(index: number): void {
        setSelected(index)
    }

    function doSetList(toSet: ImageElementBo[]): void {
        if (imgId !== 0) {
            setList(toSet)
        }
    }

    function getSelected(id: number): ImageElementBo {
        return list.filter((i) => {
            return i.id === id
        })[0]
    }

    function uploadTemplate(): void {
        post('/api/saveTemplate', trans()).then(r => {
            if (r.code !== 200) {
                console.log(r)
                setMsg('上传失败')
                setTSuccess(false)
                setToast(true)
            } else {
                setTSuccess(true)
                setMsg('上传成功')
                setToast(true)
            }
        }).catch(reason => {
            setMsg(reason)
            setTSuccess(false)
            setToast(true)
        })
    }

    function handleClose(): void {
        setToast(false)
    }

    const ariaLabel = {'aria-label': 'description'}

    return (
        <Grid container spacing={{
            xs: 2,
            md: 3
        }} columns={{
            xs: 4,
            sm: 8,
            md: 12
        }}>
            <Snackbar open={toast} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={tSuccess ? 'success' : 'error'} sx={{width: '100%'}}>
                    {msg}
                </Alert>
            </Snackbar>
            <Grid item xs={4}>
                <Card raised={true}>
                    <Stack>
                        <div>
                            <p>自定义模板(上传相同hash的图为编辑模板)</p>
                            <Input placeholder="密码" sx={{width: 80}} value={password} onChange={(event) => {
                                setPassword(event.currentTarget.value)
                            }}/>
                            <input type="file" accept=".jpg,.png" onChange={handleFileChange}/>
                        </div>
                        <div>
                            跑时:
                            <Input sx={{width: 80}} value={h} placeholder="h" inputProps={ariaLabel}
                                   onChange={(event) => {
                                       setH(event.currentTarget.value)
                                   }}/>
                            时
                            <Input sx={{width: 80}} value={m} placeholder="m" inputProps={ariaLabel}
                                   onChange={(event) => {
                                       setM(event.currentTarget.value)
                                   }}/>
                            分
                            <Input sx={{width: 80}} value={s} placeholder="s" inputProps={ariaLabel}
                                   onChange={(event) => {
                                       setS(event.currentTarget.value)
                                   }}/>
                            秒
                        </div>
                        <div>
                            路程:
                            <Input sx={{width: 80}} placeholder="m" value={distance} inputProps={ariaLabel}
                                   onChange={(event) => {
                                       setDistance(event.currentTarget.value)
                                   }}/>
                            公里
                        </div>
                        <div>
                            <button onClick={() => {
                                uploadTemplate()
                            }}>调试完成-{'>'}上传模板
                            </button>
                        </div>
                    </Stack>

                    <Box marginTop={2} height={imgHeight}>
                        {imgUrl !== '' &&
                            <img src={imgUrl} style={{
                                width: '350px',
                                objectFit: 'contain'
                            }}
                                 onLoad={(event) => {
                                     // 图片加载完毕
                                     window.dispatchEvent(new Event('resize'))
                                     setImgHeight(event.currentTarget.height)
                                 }} alt=""/>}
                    </Box>
                </Card>
            </Grid>
            <Grid item xs={4}>
                <Card raised={true}>
                    <p>选择器:{getSelected(selected) == null ? '未选择' : getSelected(selected).name}</p>
                    <Selector key={selected} imageElementList={list} setImageElementList={doSetList}
                              index={selected}/>
                </Card>
            </Grid>
            <Grid item xs={4}>
                <Card raised={true}>
                    <ElementList list={list} handleSelect={handleSelect} setList={doSetList} setId={setId} id={id}/>
                </Card>
            </Grid>
        </Grid>
    )
}
