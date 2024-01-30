import * as React from "react";
import { type ReactElement, useState } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import CheckTwoToneIcon from "@mui/icons-material/CheckTwoTone";
import CloseTwoToneIcon from "@mui/icons-material/CloseTwoTone";
import { useAuth } from "../login/Login";
import NetMusicLogin from "./NetMusicLogin";
import { Checkbox, CircularProgress, Grid, ImageListItem, ImageListItemBar, Input, TextField } from "@mui/material";
import { Image, message } from "antd";
import { post } from "../util/request";
import ImageList from "@mui/material/ImageList";
import { useNavigate } from "react-router-dom";
import BUser from "./BUser";
import SubscribeList from "./SubscribeList";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import BCollection from "./BCollection";
import BSel from "./BSel";

interface subscribeParams {
    uid?: string
    voiceListId?: string
    olderNum?: number
    keyWord?: string
    limitSec?: number
    targetId?: string
}

export default function Subscribe(): ReactElement {
    const auth = useAuth()
    const [userInfo, setUserInfo] = useState<any>({})
    const [bUserInfo, setbUserInfo] = useState<any>({})
    const [bCollectionInfo, setbCollectionInfo] = useState<any>({})
    const uploadFunc = 1
    const [userVoiceList, setUserVoiceList] = useState<any[]>([])
    const [checked, setChecked] = useState<subscribeParams>({
        olderNum: 1,
        keyWord: '阿梓',
        limitSec: 3000
    })
    const [messageApi, contextHolder] = message.useMessage()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [subscribeType, setSubscribeType] = useState(1)
    const [bvid, setBvid] = useState('')

    const steps = [
        {
            label: '选择上传方式',
            description: '你可以选择将歌曲上传至自己的账号或作者的账号然后收藏进自己的歌单，网站会保存cookie但是不会主动刷新',
            test: <>
                <br/>
                {(auth.user == null)
                    ? <CloseTwoToneIcon color={'error'}/>
                    : <CheckTwoToneIcon color={'success'}/>} app登陆状态<br/>
                {uploadFunc === 1 && (
                    userInfo.account == null
                        ? <><CloseTwoToneIcon color={'error'}/>网易云登陆状态<br/></>
                        : <><CheckTwoToneIcon
                            color={'success'}/>网易云登陆状态<br/></>)
                }
                {uploadFunc === 1 && <NetMusicLogin userInfo={userInfo} handleLogin={info => {
                    setUserInfo(info)
                }}/>}
            </>,
            check: function (): boolean {
                if (auth.user == null) {
                    void messageApi.warning('请登录小工具账号')
                    return false
                }
                if (uploadFunc === 1 && (userInfo.account == null)) {
                    void messageApi.warning('请登录网易云')
                    return false
                }
                return true
            }
        },
        {
            label: '输入作者uid',
            description:
                '网页端个人主页-个人资料，或分享up主url',
            test: <>
                <ToggleButtonGroup
                    color="primary"
                    value={'' + subscribeType}
                    exclusive
                    onChange={(event: any) => {
                        setSubscribeType(parseInt(event.currentTarget.value))
                    }}
                    aria-label="Platform"
                >
                    <ToggleButton value="1">订阅Up主</ToggleButton>
                    <ToggleButton value="2">订阅视频分P</ToggleButton>
                    <ToggleButton value="3">订阅收藏夹</ToggleButton>
                    <ToggleButton value="4">订阅视频合集</ToggleButton>
                </ToggleButtonGroup>
                {subscribeType === 1 && <BUser userInfo={bUserInfo} handleGetInfo={setbUserInfo}/>}
                {subscribeType === 2 && <BSel bvid={bvid} setBvid={setBvid}/>}
                {subscribeType === 4 &&
                    <BCollection collectionInfo={bCollectionInfo} handleGetInfo={setbCollectionInfo}/>}
            </>,
            loadNext: function () {
                void post('/api/direct/voice/list/search', null).then(value => {
                    setUserVoiceList(value.data.list)
                })
                setChecked({
                    ...checked,
                    uid: bUserInfo.data?.mid
                })
            },
            check: function (): boolean {
                if (bUserInfo.data?.mid == null && subscribeType === 1) {
                    void messageApi.warning('请解析uid')
                    return false
                }
                if (bCollectionInfo.id == null && subscribeType === 4) {
                    void messageApi.warning('请解析视频合集id')
                    return false
                }
                if (bvid === '' && subscribeType === 2) {
                    void messageApi.warning('请解析包含分p的视频')
                    return false
                }
                return true
            }
        },
        {
            label: '选择播客',
            description: '',
            check: function (): boolean {
                if (checked.voiceListId == null) {
                    void messageApi.warning('选择播客')
                    return false
                }
                return true
            },
            test: <>
                <ImageList sx={{
                    width: '300px',
                    height: '300px'
                }}>
                    {userVoiceList.map((item) => (
                        <ImageListItem key={item.voiceListId}>
                            <Image
                                src={item.coverUrl}/>
                            <ImageListItemBar
                                title={item.voiceListName}
                                subtitle={item.categoryName}
                                actionIcon={
                                    <Checkbox
                                        checked={checked?.voiceListId === item.voiceListId}
                                        onChange={() => {
                                            setChecked({
                                                ...checked,
                                                voiceListId: item.voiceListId
                                            })
                                        }}
                                        inputProps={{'aria-label': 'controlled'}}
                                        sx={{
                                            color: 'white',
                                            '&.Mui-checked': {
                                                color: 'white'
                                            }
                                        }}
                                        value={item.voiceListId}
                                    />
                                }
                            />
                        </ImageListItem>
                    ))}
                </ImageList>
            </>
        },
        {
            label: '填写声音数据',
            description:
                '',
            test: <>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            id="name"
                            name="name"
                            label="关键词(所有就不填)"
                            fullWidth
                            variant="standard"
                            defaultValue="阿梓"
                            onChange={event => {
                                setChecked({
                                    ...checked,
                                    keyWord: event.currentTarget.value
                                })
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        上传历史视频个数(由新到老) :
                        <Input
                            defaultValue={1}
                            type="number"
                            onChange={event => {
                                setChecked({
                                    ...checked,
                                    olderNum: parseInt(event.currentTarget.value)
                                })
                            }}></Input>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        限制视频长度(单位:秒) :
                        <Input
                            onChange={event => {
                                setChecked({
                                    ...checked,
                                    limitSec: parseInt(event.currentTarget.value)
                                })
                            }}
                            defaultValue={3000}
                            type="number"></Input>
                    </Grid>
                </Grid>
            </>,
            check: function (): boolean {
                return true
            }
        }
    ]

    const [activeStep, setActiveStep] = React.useState(0)

    const handleNext = (stepNum: number): void => {
        const check = steps[stepNum].check
        if (check != null) {
            const check1 = check()
            if (!check1) {
                return
            }
        }
        setActiveStep((prevActiveStep) => prevActiveStep + 1)
        const loadNext = steps[stepNum].loadNext
        if (loadNext != null) {
            loadNext()
        }
        console.log(checked)
    }

    const handleBack = (): void => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1)
    }

    const handleReset = (): void => {
        // setActiveStep(0);
        window.location.reload()
    }

    return (
        <Box sx={{maxWidth: 400}}>
            {contextHolder}
            <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) => (
                    <Step key={step.label}>
                        <StepLabel
                            optional={
                                index === 3
                                    ? (
                                        <Typography variant="caption">Last step</Typography>
                                    )
                                    : null
                            }
                        >
                            {step.label}
                        </StepLabel>
                        <StepContent>
                            <Typography>{step.description}</Typography>
                            {step.test}
                            <Box sx={{mb: 2}}>
                                <div>
                                    <Button
                                        variant="contained"
                                        onClick={() => {
                                            handleNext(index)
                                        }}
                                        sx={{
                                            mt: 1,
                                            mr: 1
                                        }}
                                    >
                                        {index === steps.length - 1 ? '完成' : '下一步'}
                                    </Button>
                                    <Button
                                        disabled={index === 0}
                                        onClick={handleBack}
                                        sx={{
                                            mt: 1,
                                            mr: 1
                                        }}
                                    >
                                        上一步
                                    </Button>
                                </div>
                            </Box>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
            {activeStep === steps.length && (
                <Paper square elevation={0} sx={{p: 3}}>
                    <Typography>All steps completed - you&apos;re finished</Typography>
                    <br/>
                    <Button
                        variant="contained"
                        sx={{
                            mt: 1,
                            mr: 1
                        }}
                        disabled={loading}
                        onClick={event => {
                            setLoading(true)
                            const obj = {
                                ...checked,
                                targetId: checked.uid,
                                type: 1
                            }
                            if (subscribeType === 4) {
                                obj.targetId = bCollectionInfo.id
                                obj.type = 4
                            }
                            if (subscribeType === 2) {
                                console.log('get bvid: ' + bvid)
                                obj.targetId = bvid
                                obj.type = 2
                            }
                            void post('/api/download/addSubscribe', obj
                            ).catch(reason => {
                                navigate('/result', {
                                    state: {
                                        status: 'error',
                                        title: '未知错误',
                                        link: '',
                                        extra: {
                                            to: '/uploadStepper',
                                            name: '返回'
                                        }
                                    }
                                })
                            }).then(data => {
                                console.log(data)
                                if (data.code === 200) {
                                    void messageApi.success(data.message)
                                } else {
                                    void messageApi.error(data.message)
                                }
                                setTimeout(() => {
                                    window.location.reload()
                                }, 2000)
                            })
                        }
                        }>
                        添加订阅
                    </Button>
                    {loading && <CircularProgress size={100}/>}
                    {loading && <p>同步上传，根据你的歌曲时间而定</p>}
                    <Button onClick={handleReset} variant="contained" sx={{
                        mt: 1,
                        mr: 1
                    }}>
                        Reset
                    </Button>
                </Paper>
            )}
            <SubscribeList/>
        </Box>
    )
}
