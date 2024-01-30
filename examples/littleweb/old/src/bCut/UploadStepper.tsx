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
import BCut, { type VideoInfo } from "./BCut";
import {
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  ImageListItem,
  ImageListItemBar,
  Radio,
  Switch,
  type SwitchProps,
  TextField
} from "@mui/material";
import { Image, message } from "antd";
import { post } from "../util/request";
import ImageList from "@mui/material/ImageList";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Recent from "./Recent";

interface uploadParams {
    name: string
    autoPublish: boolean
    description: string
    voiceListId: string
    coverImgId: string
    categoryId: string
    secondCategoryId: string
    privacy: boolean
    qualityIn: string
    voiceBeginSec: number
    voiceEndSec: number
    voiceOffset: number
    cid: string
}

const IOSSwitch = styled((props: SwitchProps) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({theme}) => ({
    width: 42,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
        padding: 0,
        margin: 2,
        transitionDuration: '300ms',
        '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
                opacity: 1,
                border: 0
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.5
            }
        },
        '&.Mui-focusVisible .MuiSwitch-thumb': {
            color: '#33cf4d',
            border: '6px solid #fff'
        },
        '&.Mui-disabled .MuiSwitch-thumb': {
            color:
                theme.palette.mode === 'light'
                    ? theme.palette.grey[100]
                    : theme.palette.grey[600]
        },
        '&.Mui-disabled + .MuiSwitch-track': {
            opacity: theme.palette.mode === 'light' ? 0.7 : 0.3
        }
    },
    '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        width: 22,
        height: 22
    },
    '& .MuiSwitch-track': {
        borderRadius: 26 / 2,
        backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
        opacity: 1,
        transition: theme.transitions.create(['background-color'], {
            duration: 500
        })
    }
}))

export default function UploadStepper(): ReactElement {
    const auth = useAuth()
    const [userInfo, setUserInfo] = useState<any>({})
    const [uploadFunc, setUploadFunc] = useState(1)
    const [videoInfo, setVideoInfo] = useState<VideoInfo>({
        title: '',
        quality: [],
        image: '',
        bvid: 'BV15a411M7r2',
        useQuality: '',
        pages: [],
        cid: '',
        partName: ''
    })
    const [userVoiceList, setUserVoiceList] = useState<any[]>([])
    const [checked, setChecked] = useState<uploadParams>({
        autoPublish: false,
        categoryId: '1',
        coverImgId: '1',
        description: '这个人很懒，什么都没有写',
        name: videoInfo.title,
        privacy: false,
        qualityIn: '1',
        secondCategoryId: '1',
        voiceListId: '1',
        voiceBeginSec: 0,
        voiceEndSec: 0,
        voiceOffset: 0,
        cid: ''
    })
    const [messageApi, contextHolder] = message.useMessage()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    let steps = [
        {
            label: '选择上传方式',
            description: '你可以选择将歌曲上传至自己的账号或作者的账号然后收藏进自己的歌单，网站会保存cookie但是不会主动刷新',
            test: <>
                <Radio
                    checked={uploadFunc === 1}
                    onChange={() => {
                        setUploadFunc(1)
                    }}
                    value="a"
                    name="radio-buttons"
                    inputProps={{'aria-label': 'A'}}
                /> 用自己网易云
                <Radio
                    checked={uploadFunc === 2}
                    onChange={() => {
                        setUploadFunc(2)
                    }}
                    value="b"
                    name="radio-buttons"
                    inputProps={{'aria-label': 'B'}}
                /> 用作者的
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
                console.log(userInfo)
                if (uploadFunc === 1 && (userInfo.account == null)) {
                    void messageApi.warning('请登录网易云')
                    return false
                }
                return true
            }
        },
        {
            label: '获取视频(支持多p)',
            description:
                '输入b站视频的bvid或b23.tv(客户端分享复制链接)短链或长链(网页链接)',
            test: <>
                <BCut videoInfo={videoInfo} handleGetInfo={setVideoInfo}/>
                {}
            </>,
            loadNext: function () {
                if (uploadFunc === 1) {
                    void post('/api/direct/voice/list/search', null).then(value => {
                        setUserVoiceList(value.data.list)
                    })
                } else {
                    setChecked({
                        autoPublish: false,
                        categoryId: '1',
                        coverImgId: '1',
                        description: '这个人很懒，什么都没有写',
                        name: videoInfo.title,
                        privacy: false,
                        qualityIn: '1',
                        secondCategoryId: '1',
                        voiceListId: '1',
                        voiceBeginSec: 0,
                        voiceEndSec: 0,
                        voiceOffset: 0,
                        cid: ''
                    })
                }
            },
            check: function (): boolean {
                if (videoInfo.title === '') {
                    void messageApi.warning('请解析bvid')
                    return false
                }
                return true
            }
        },
        {
            label: '选择播客',
            description: '',
            check: function (): boolean {
                if (checked == null) {
                    void messageApi.warning('选择播客')
                    return false
                }
                setChecked({
                    ...checked,
                    description: '这个人很懒，什么都没有写',
                    name: videoInfo.cid === '' ? videoInfo.title : videoInfo.partName + '-' + videoInfo.title,
                    privacy: false
                })
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
                                            setChecked(item)
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
                            required
                            id="name"
                            name="name"
                            label="声音名字"
                            fullWidth
                            variant="standard"
                            defaultValue={videoInfo.cid === '' ? videoInfo.title : videoInfo.partName + '-' + videoInfo.title}
                            onChange={event => {
                                setChecked({
                                    ...checked,
                                    name: event.currentTarget.value
                                })
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="description"
                            name="description"
                            label="声音介绍"
                            fullWidth
                            variant="standard"
                            defaultValue={'这个人很懒，什么都没有写'}
                            onChange={event => {
                                setChecked({
                                    ...checked,
                                    description: event.currentTarget.value
                                })
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="name"
                            name="name"
                            label="声音开始时间(单位:秒)"
                            variant="standard"
                            defaultValue="0"
                            onChange={event => {
                                setChecked({
                                    ...checked,
                                    voiceBeginSec: parseFloat(event.currentTarget.value)
                                })
                            }}
                        />
                        <TextField
                            required
                            id="name"
                            name="name"
                            label="声音结束时间(单位:秒)"
                            sx={{marginLeft: '10px'}}
                            variant="standard"
                            defaultValue="0"
                            onChange={event => {
                                setChecked({
                                    ...checked,
                                    voiceEndSec: parseFloat(event.currentTarget.value)
                                })
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="name"
                            name="name"
                            label="声音增益(单位:dB)"
                            type="range"
                            sx={{width: '140px'}}
                            variant="standard"
                            defaultValue="0"
                            onChange={event => {
                                setChecked({
                                    ...checked,
                                    voiceOffset: parseInt(event.currentTarget.value)
                                })
                            }}
                        />
                        {checked?.voiceOffset / 10}dB
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControlLabel value={'隐私发布'} labelPlacement="start"
                                          control={<IOSSwitch onChange={event => {
                                              setChecked({
                                                  ...checked,
                                                  privacy: event.currentTarget.checked
                                              })
                                          }}/>} label={'隐私发布'}/>
                    </Grid>
                </Grid>
            </>
        }
    ]

    if (uploadFunc === 2) {
        steps = steps.filter((value, index, array) => {
            return index !== 2
        })
    }

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
    }

    const handleBack = (): void => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1)
    }

    const handleReset = (): void => {
        // setActiveStep(0);
        window.location.reload()
    }

    return (
        <Box sx={{maxWidth: '100%'}}>
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
                            void post('/api/download/addQueue',
                                {
                                    bvid: videoInfo.bvid,
                                    useMyAccount: (uploadFunc === 2 ? 'true' : 'false'),
                                    name: checked.name,
                                    description: checked?.description,
                                    voiceListId: checked?.voiceListId,
                                    coverImgId: checked?.coverImgId,
                                    privacy: checked?.privacy,
                                    qualityIn: videoInfo.useQuality,
                                    voiceOffset: (checked?.voiceOffset == null ? (0 + '') : checked?.voiceOffset / 10),
                                    voiceBeginSec: (checked?.voiceBeginSec == null ? (0 + '') : checked?.voiceBeginSec),
                                    voiceEndSec: (checked?.voiceEndSec == null ? (0 + '') : checked?.voiceEndSec),
                                    cid: (videoInfo.cid === '' ? null : videoInfo.cid)
                                }
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
                                    navigate('/result', {
                                        state: {
                                            status: data.code === 200 ? 'success' : 'error',
                                            title: data.code === 200 ? '添加成功' : '添加失败',
                                            link: data.data.access,
                                            extra: {
                                                to: '/uploadStepper',
                                                name: '返回'
                                            }
                                        }
                                    })
                                } else {
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
                                }
                            })
                        }
                        }>
                        添加队列
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
            <Recent/>
        </Box>
    )
}
