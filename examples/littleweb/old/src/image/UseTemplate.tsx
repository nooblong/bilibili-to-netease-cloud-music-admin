import { post, simplePost } from "../util/request";
import React, { Fragment, type ReactElement, useEffect, useRef, useState } from "react";
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  TextField
} from "@mui/material";
import IconButton from "@mui/material/IconButton";

interface Img {
    id: number
    imgUrl: string
}

interface Ele {
    id: number
    name: string
    str: string
}

export default function ({handleChangeImage}: { handleChangeImage: (data: Blob) => void }): ReactElement {
    const [data, setData] = useState<Img[]>([])
    const [open, setOpen] = useState(false)
    const ele = useRef<Ele[]>([])
    const [currentImageId, setCurrentImageId] = useState(0)
    const myRef = useRef<any>(null)

    useEffect(() => {
        post('/api/list', null)
        .then(value => {
            const ids = value.data as number[]
            ids.forEach(i => {
                getImage(i, (id, url) => {
                    setData((prev) => {
                        let exist = false
                        prev.forEach(i => {
                            if (i.id === id) {
                                exist = true
                            }
                        })
                        return exist ? [...prev] : [...prev, {
                            id,
                            imgUrl: url
                        }]
                    })
                })
            })
        }).catch(reason => {
            console.log(reason)
        })
    }, [])

    function handleSelect(id: string, imageElements: Array<{ id: number, str: string }>): void {
        void fetch('/api/generateImageByTemplate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                imageFileId: id,
                imageElements
            })
        })
        .then(async data => {
            console.log(data)
            const blob = await data.blob()
            handleChangeImage(blob)
        })
    }

    function getImage(id: number, setUrl: (id: number, url: string) => void): void {
        let result: string = ''
        simplePost('/api/getImage', {id})
        .then(async value => {
            const blob = await value.blob()
            result = URL.createObjectURL(blob)
            setUrl(id, result)
        }).catch(reason => {
            console.log(reason)
        })
    }

    const handleClickOpen = (id: number): void => {
        void post('/api/imageElementDetail', {imageFileId: id}).then(value => {
            ele.current = value.data
        }).then(value => {
            setOpen(true)
            setCurrentImageId(id)
        })
    }

    const handleClose = (apply: boolean): void => {
        setOpen(false)
        if (!apply) {
            return
        }
        console.log(ele)
        handleSelect(currentImageId.toString(), ele.current.map(value => {
            const a: { id: number, str: string } = {
                id: value.id,
                str: value.str
            }
            return a
        }))
    }

    function DetailDialog(): ReactElement {
        function handleFileChange(event: any): void {
            void post('/api/checkPassword', {
                id: currentImageId,
                password: myRef.current?.value
            }).then(value => {
                if (value.code === 200) {
                    const selectedFile = event.target.files[0]
                    const fd = new FormData()
                    fd.append('file', selectedFile)
                    fd.append('id', currentImageId.toString())
                    void fetch('/api/changeImage', {
                        method: 'POST',
                        body: fd
                    }).then(res => {
                        if (res.ok) {
                            location.reload()
                        } else {
                            alert('上传失败:')
                            console.log('error: ', res)
                        }
                    })
                } else {
                    alert('请不要修改别人图片')
                }
            })
        }

        return (
            <div>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>填写详细信息</DialogTitle>
                    <DialogContent>
                        <input placeholder="密码,没有不填" ref={myRef} onChange={event => {
                            console.log(myRef.current?.value)
                        }}/>
                        更改图片
                        <input type="file" accept=".jpg,.png" onChange={handleFileChange}></input>
                        {
                            ele.current.map(value => {
                                return (
                                    <TextField
                                        key={value.id}
                                        autoFocus
                                        margin="dense"
                                        id="name"
                                        label={value.name}
                                        type="email"
                                        fullWidth
                                        variant="standard"
                                        defaultValue={value.str}
                                        onChange={event => {
                                            ele.current = ele.current.map(value1 => {
                                                if (value1.id === value.id) {
                                                    return {
                                                        ...value1,
                                                        str: event.currentTarget.value
                                                    }
                                                } else {
                                                    return value1
                                                }
                                            })
                                        }}
                                    />
                                )
                            })
                        }
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            handleClose(false)
                        }}>取消</Button>
                        <Button onClick={() => {
                            handleClose(true)
                        }}>生成</Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }

    return (
        <Fragment>
            <Container>
                <ImageList sx={{
                    width: '100%',
                    height: '100%'
                }} variant="woven" cols={2} gap={8}>
                    {data.map((item) => (
                        <Fragment key={item.id}>
                            <ImageListItem key={item.id} onClick={() => {
                                handleClickOpen(item.id)
                            }}>
                                <img
                                    src={item.imgUrl}
                                    srcSet={item.imgUrl}
                                    alt={item.id + ''}
                                    loading="lazy"
                                />
                                <ImageListItemBar
                                    title={item.id}
                                    actionIcon={
                                        <IconButton
                                            sx={{color: 'rgba(255, 255, 255, 0.54)'}}
                                            aria-label={`info about ${item.id}`}
                                        >
                                        </IconButton>
                                    }
                                />
                            </ImageListItem>
                        </Fragment>
                    ))}
                </ImageList>
                <DetailDialog/>
            </Container>
        </Fragment>
    )
}
