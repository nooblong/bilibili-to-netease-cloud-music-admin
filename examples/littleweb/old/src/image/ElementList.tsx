import React, { useState } from "react";
import { type ImageElementBo } from "./Custom";
import { Link } from "react-router-dom";
import { Button, ButtonGroup, Grid } from "@mui/material";

export default function ({
                             list,
                             setList,
                             handleSelect,
                             id,
                             setId
                         }: {
    list: ImageElementBo[]
    setList: React.Dispatch<ImageElementBo[]>
    handleSelect: (index: number) => void
    id: number
    setId: React.Dispatch<React.SetStateAction<number>>
}) {
    const [selId, setSelId] = useState(0)

    return (
        <div>
            <p>元素列表
                <Button variant={'outlined'} onClick={() => {
                    setList([...list, {
                        id,
                        x: 0,
                        xs: 0,
                        y: 0,
                        ys: 0,
                        str: 'data',
                        size: 82,
                        fontName: '苹方黑体-中粗-简.ttf',
                        name: '第' + id + '个',
                        isShow: true
                    }])
                    setId(++id)
                }}>增加
                </Button>
            </p>
            <Grid>
                {
                    list.map(i => (
                        <Grid xs={12} item key={i.name} onClick={() => {
                            setSelId(i.id)
                            handleSelect(i.id)
                        }}>
                            <ButtonGroup variant="contained" aria-label="outlined primary button group">
                                <Button variant={i.id === selId ? 'contained' : 'outlined'}>
                                    <Link style={{textDecoration: 'none'}} to={''}>{i.name}</Link>
                                </Button>
                                <Button variant="outlined" color="error" disabled={list.length === 1} onClick={() => {
                                    setList(list.filter(j => {
                                        return j.id !== i.id
                                    }))
                                }}>删除
                                </Button>
                                <Button variant={'outlined'} onClick={() => {
                                    setList(list.map(j => {
                                        if (j.id === i.id) {
                                            j.isShow = !j.isShow
                                            return j
                                        } else {
                                            return j
                                        }
                                    }))
                                }}>{i.isShow ? '隐藏' : '显示'}</Button>
                            </ButtonGroup>
                        </Grid>
                    ))
                }
            </Grid>
        </div>
    )
}
