import * as React from "react";
import { type ReactElement, useEffect, useState } from "react";
import { get, post } from "../util/request";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { Avatar, Button, Card, ListItemAvatar, TablePagination } from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useAuth } from "../login/Login";
import ListItemButton from "@mui/material/ListItemButton";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { blue } from "@mui/material/colors";
import { Image } from "antd";
import UploadMessage from "./UploadMessage";
import moment from "moment";
import useMessage from "antd/es/message/useMessage";

export default function (): ReactElement {
    let num = 1
    const [radioList, setRadioList] = useState<any[]>([])
    const [pageData, setPageData] = useState<any[]>([])
    const [page, setPage] = React.useState(0)
    const [rowsPerPage, setRowsPerPage] = React.useState(10)
    const [total, setTotal] = useState(0)
    const {voiceListId} = useParams()
    const state = useLocation()
    const [status, setStatus] = useState('ONLY_SELF_SEE')
    const [open, setOpen] = React.useState(false)
    const [selectedValue, setSelectedValue] = React.useState('')
    const [selectedDetailId, setSelectedDetailId] = React.useState('')
    const [openMessage, setOpenMessage] = useState(false)
    const [msg, setMsg] = useState<any[]>([['上传中', 0]])
    const [messageApi, context] = useMessage()

    async function getData(page: number, rowsPerPage: number): Promise<void> {
        const api = await get(`/api/data/voiceListSong?pageNo=${page + 1}
    &pageSize=${rowsPerPage}&voiceListId=${voiceListId}${(status !== '' && status !== null) ? '&status=' + status : ''}`)
        setTotal(api.data.total)
        if (radioList.length === 0) {
            void post('/api/direct/voice/list/search', null).then(value => {
                setRadioList(value.data.list)
            }).catch(reason => {
                void messageApi.error('需要返回上层登录网易云')
            })
        }
        setPageData(api.data.records.map((i: any) => {
            if (i.displayStatus === 'AUDITING') {
                i.display = '审核中'
                i.color = 'red'
            } else if (i.displayStatus === 'ONLY_SELF_SEE') {
                i.display = '仅自己可见'
                i.color = 'purple'
            } else if (i.displayStatus === 'ONLINE') {
                i.display = '已发布'
                i.color = 'green'
            } else if (i.displayStatus === 'FAILED') {
                i.display = '发布失败！'
                i.color = 'red'
            } else {
                i.display = '状态: ' + i.displayStatus
                i.color = 'black'
            }
            return i
        }))
    }

    useEffect(() => {
        void getData(page, rowsPerPage)
    }, [status])

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number
    ): void => {
        setPage(newPage)
        void getData(newPage, rowsPerPage)
    }

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ): void => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
        void getData(0, parseInt(event.target.value, 10))
    }

    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        newAlignment: string
    ): void => {
        setStatus(newAlignment)
        setPage(0)
    }

    // console.log(state.state[0])
    interface SimpleDialogProps {
        open: boolean
        selectedValue: string
        onClose: (value: string) => void
    }

    function SimpleDialog(props: SimpleDialogProps): ReactElement {
        const {
            onClose,
            selectedValue,
            open
        } = props

        const handleClose = (): void => {
            onClose(selectedValue)
        }

        const handleListItemClick = (value: string): void => {
            onClose(value)
        }

        return (
            <Dialog onClose={handleClose} open={open}>
                <DialogTitle>选择播客</DialogTitle>
                <List sx={{pt: 0}}>
                    {radioList.map((radio) => (
                        <ListItem disableGutters key={radio.voiceListId}>
                            <ListItemButton onClick={() => {
                                handleListItemClick(radio.voiceListId)
                            }}>
                                <ListItemAvatar>
                                    <Avatar sx={{
                                        bgcolor: blue[100],
                                        color: blue[600]
                                    }}>
                                        <Image
                                            src={radio.coverUrl}/>
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={radio.voiceListName}/>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Dialog>
        )
    }

    const handleClickOpen = (): void => {
        if (auth.user == null) {
            sessionStorage.setItem('location', location.pathname)
            navigate({pathname: '/login'}, {state: '该功能需要登录'})
        }
        setOpen(true)
    }

    const handleClose = (radioListId: string): void => {
        setOpen(false)
        console.log(radioListId)
        if (radioListId !== '') {
            setOpenMessage(true)
            const id = setInterval(() => {
                msg.push(['上传中...', num])
                num++
                setMsg([...msg, ['上传中...', num]])
            }, 1000)
            void post('/api/download/addToMyList',
                {
                    voiceDetailId: selectedDetailId,
                    voiceListId: radioListId
                }
            ).catch(reason => {
                alert(reason.message)
            }).then(data => {
                if (data.code === 200) {
                    clearInterval(id)
                    setMsg([])
                    setOpenMessage(false)
                    alert('上传成功')
                } else {
                    clearInterval(id)
                    setMsg([])
                    setOpenMessage(false)
                    alert('未知错误')
                }
            }).finally(() => {

            })
            // 不设置
            // setSelectedValue(radioListId)
        }
    }

    const auth = useAuth()
    const navigate = useNavigate()

    return (
        <>
            {context}
            <UploadMessage open={openMessage} setOpen={setOpenMessage} message={
                msg
            }/>
            <SimpleDialog
                selectedValue={selectedValue}
                open={open}
                onClose={handleClose}
            />
            <ToggleButtonGroup
                color="primary"
                value={status}
                exclusive
                onChange={handleChange}
                aria-label="Platform"
            >
                <ToggleButton value="ONLINE">成功</ToggleButton>
                <ToggleButton value="ONLY_SELF_SEE">仅自己可见</ToggleButton>
                <ToggleButton value="AUDITING">审核中</ToggleButton>
                <ToggleButton value="FAILED">失败</ToggleButton>
            </ToggleButtonGroup>
            <h3>上传审核不过的到自己播客</h3>
            当前订阅:{(state.state != null)
            ? state.state.map((i: { keyWord: any, limitSec: any, type: number, targetId: any, processTime: any }) => {
                return <Card key={i.targetId}>{`up主ID:「${i.targetId}」关键词:「${i.keyWord}」限制时长「${i.limitSec}s」类型为
              「${i.type === 1 ? 'Up主' : i.type === 4 ? '合集' : '未知'}」
            最近更新时间:「${moment(i.processTime).format('YYYY-MM-DD HH:mm:ss')}」`}</Card>
            })
            : []}
            {pageData.map((value, index) => {
                return <List key={value.id} sx={{
                    width: '100%',
                    maxWidth: '100%',
                    bgcolor: 'background.paper'
                }}>
                    <ListItem key={value.id} alignItems="flex-start">
                        <ListItemAvatar>
                            <Avatar alt={value.userName}/>
                        </ListItemAvatar>
                        <ListItemText
                            primary={value.partName != null ? value.partName + '-' + value.fileName : '' + value.fileName}
                            secondary={
                                <React.Fragment>
                                    <Typography
                                        sx={{display: 'inline'}}
                                        component="span"
                                        variant="body2"
                                        color={value.color}
                                    >
                                        {value.display}
                                    </Typography>
                                </React.Fragment>
                            }
                        />
                        <Button onClick={() => {
                            setSelectedDetailId(value.id)
                            console.log(value.id)
                            handleClickOpen()
                        }}>
                            上传至我的播客
                        </Button>
                    </ListItem>
                    <Divider variant="fullWidth" component="li"/>
                </List>
            })}
            <TablePagination
                labelDisplayedRows={({
                                         from,
                                         to,
                                         count
                                     }) => `${from}-${to}共${count}`}
                labelRowsPerPage='每页'
                component="div"
                count={total}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </>
    )
}
