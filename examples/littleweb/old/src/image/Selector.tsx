import React, { Fragment, type ReactElement, useEffect, useState } from "react";
import { type ImageElementBo } from "./Custom";
import { type RGBColor, SketchPicker } from "react-color";
import { post } from "../util/request";
import { Input } from "@mui/material";

interface ImageFile {
    id: number
    name: string
}

export default function ({
                             imageElementList,
                             setImageElementList,
                             index
                         }:
                             {
                                 imageElementList: ImageElementBo[]
                                 setImageElementList: React.Dispatch<ImageElementBo[]>
                                 index: number
                             }): ReactElement {
    console.log('selector刷新')
    const imageElement = imageElementList.filter((i) => {
        return i.id === index
    })[0]
    if (imageElement == null) {
        return <h3>未选择</h3>
    }

    const [x, setX] = useState(imageElement.x)
    const [xs, setXs] = useState(imageElement.xs)
    const [y, setY] = useState(imageElement.y)
    const [ys, setYs] = useState(imageElement.ys)
    const [rgb, setRgb] = useState<RGBColor>(imageElement.rgb ?? {
        r: 1,
        g: 1,
        b: 1
    })
    const [size, setSize] = useState(imageElement.size)
    const [str, setStr] = useState(imageElement.str)
    const [style, setStyle] = useState(imageElement.style)
    const [font, setFont] = useState(imageElement.fontName)
    const [name, setName] = useState(imageElement.name)
    const [fontData, setFontData] = useState<ImageFile[]>([])

    useEffect(() => {
        setX(imageElement.x)
        setXs(imageElement.xs)
        setY(imageElement.y)
        setYs(imageElement.ys)
        // setRgb((imageElement.rgb == null) ? {r: 1, g: 1, b: 1} : imageElement.rgb);
        setSize(imageElement.size)
        setStr(imageElement.str)
        setStyle(imageElement.style)
        setFont(imageElement.fontName)
        setName(imageElement.name)
    }, [imageElementList])

    useEffect(() => {
        setImageElementList(
            imageElementList.map(i => {
                if (i.id === index) {
                    return imageElement
                } else {
                    return i
                }
            })
        )
    }, [x, xs, y, ys, rgb, size, str, style, font])

    useEffect(() => {
        void post('/api/listFont', null)
        .then(value => {
            const data: ImageFile[] = value.data
            setFontData(data)
            setFont(data[0].id + '')
        })
    }, [])
    const ariaLabel = {'aria-label': 'description'}
    return (
        <Fragment>
            <table border={1} width="100%">
                <tbody>
                <tr>
                    <>
                        <td width={20}>x:
                        </td>
                        <td>
                            <Input sx={{width: '40%'}} placeholder="Placeholder" value={x} inputProps={ariaLabel}
                                   onChange={(event) => {
                                       setX(Number.parseInt(event.currentTarget.value))
                                       imageElement.x = Number.parseInt(event.currentTarget.value)
                                   }}/>
                            {'.'}
                            <Input sx={{width: '40%'}} placeholder="Placeholder" value={xs} inputProps={ariaLabel}
                                   onChange={(event) => {
                                       setXs(Number.parseInt(event.currentTarget.value))
                                       imageElement.xs = Number.parseInt(event.currentTarget.value)
                                   }}/>
                        </td>
                        <td>{imageElement.x + imageElement.xs / 100}%</td>
                    </>
                </tr>
                <tr>
                    <>
                        <td>y:</td>
                        <td>
                            <Input sx={{width: '40%'}} placeholder="Placeholder" value={y} inputProps={ariaLabel}
                                   onChange={(event) => {
                                       setY(Number.parseInt(event.currentTarget.value))
                                       imageElement.y = Number.parseInt(event.currentTarget.value)
                                   }}/>
                            {'.'}
                            <Input sx={{width: '40%'}} placeholder="Placeholder" value={ys} inputProps={ariaLabel}
                                   onChange={(event) => {
                                       setYs(Number.parseInt(event.currentTarget.value))
                                       imageElement.ys = Number.parseInt(event.currentTarget.value)
                                   }}/>
                        </td>
                        <td>{imageElement.y + imageElement.ys / 100}%</td>
                    </>
                </tr>
                <tr>
                    <>
                        <td>color:</td>
                        <td>{imageElement.rgb?.r},{imageElement.rgb?.g},{imageElement.rgb?.b},{imageElement.rgb?.a}</td>
                    </>
                </tr>
                <tr>
                    <>
                        <td>size:</td>
                        <td>{imageElement.size}</td>
                    </>
                </tr>
                </tbody>
            </table>
            <table border={1} width="100%">
                <tbody>
                <tr>
                    <>
                        <td>
                            X:
                        </td>
                        <td>
                            Low
                            <input id="range26" type="range" min="0" max="100" value={x}
                                   onChange={(event) => {
                                       setX(Number.parseInt(event.currentTarget.value))
                                       imageElement.x = Number.parseInt(event.currentTarget.value)
                                   }}/>
                            High
                        </td>
                    </>
                </tr>
                <tr>
                    <>
                        <td>
                            X微:
                        </td>
                        <td>
                            Low
                            <input id="range26" type="range" min="0" max="100" value={xs}
                                   onChange={(event) => {
                                       setXs(Number.parseInt(event.currentTarget.value))
                                       imageElement.xs = (Number.parseInt(event.currentTarget.value))
                                   }}/>
                            High
                        </td>
                    </>
                </tr>

                <tr>
                    <>
                        <td>Y:</td>
                        <td>
                            Low
                            <input id="range26" type="range" min="0" max="100" value={y}
                                   onChange={(event) => {
                                       setY(Number.parseInt(event.currentTarget.value))
                                       imageElement.y = (Number.parseInt(event.currentTarget.value))
                                   }}/>
                            High
                        </td>
                    </>
                </tr>
                <tr>
                    <>
                        <td>Y微:</td>
                        <td>
                            Low
                            <input id="range26" type="range" min="0" max="100" value={ys}
                                   onChange={(event) => {
                                       setYs(Number.parseInt(event.currentTarget.value))
                                       imageElement.ys = (Number.parseInt(event.currentTarget.value))
                                   }}/>
                            High
                        </td>
                    </>
                </tr>

                </tbody>
            </table>

            <hr/>

            <table border={1} width="100%">
                <tbody>
                <tr>
                    <>
                        <td>组件名称 :</td>
                        <td>
                            <input type="text" value={name} onChange={event => {
                                setName(event.currentTarget.value)
                                imageElement.name = event.currentTarget.value
                            }}/>
                        </td>
                    </>
                </tr>
                <tr>
                    <>
                        <td>内容 :</td>
                        <td>
                            <input id="text17" type="text" value={str} onChange={(event) => {
                                setStr(event.currentTarget.value)
                                imageElement.str = event.currentTarget.value
                            }}/>
                        </td>
                    </>
                </tr>
                <tr>
                    <>
                        <td>样式 :</td>
                        <td>
                            <select onChange={(event) => {
                                setStyle(Number.parseInt(event.currentTarget.value))
                                imageElement.style = (Number.parseInt(event.currentTarget.value))
                            }}>
                                <option value="0">0 - 清楚的</option>
                                <option value="1">1 - 粗的</option>
                                <option value="2">2 - 斜的</option>
                            </select>
                        </td>
                    </>
                </tr>
                <tr>
                    <>
                        <td>字体大小 :</td>
                        <td>
                            <input id="text24" type="number" value={size} onChange={(event) => {
                                setSize(Number.parseInt(event.currentTarget.value))
                                imageElement.size = (Number.parseInt(event.currentTarget.value))
                            }}/>
                        </td>
                    </>
                </tr>
                <tr>
                    <>
                        <td>
                            字体 :
                        </td>
                        <td>
                            <select value={font} onChange={(event) => {
                                setFont(event.currentTarget.value)
                                imageElement.fontName = event.currentTarget.value
                            }}>
                                {
                                    fontData.map(i => {
                                        return (
                                            <option value={i.id} key={i.id}>{i.name}</option>
                                        )
                                    })
                                }
                            </select>
                        </td>
                    </>
                </tr>
                </tbody>
            </table>
            <fieldset>
                <SketchPicker color={rgb} onChangeComplete={(color) => {
                    setRgb(color.rgb)
                    imageElement.rgb = color.rgb
                }}/>
            </fieldset>

        </Fragment>
    )
}
