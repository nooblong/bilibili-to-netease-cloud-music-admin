import React, { type ReactElement, useRef, useState } from "react";
import { get, post } from "../util/request";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import UserInfo from "./UserInfo";
import { message } from "antd";

export default function ({
                             userInfo,
                             handleLogin
                         }: { userInfo: any, handleLogin: (info: any) => void }): ReactElement {
    const img = useRef<any>(null)
    const [open, setOpen] = useState(false)
    const [messageApi, contextHolder] = message.useMessage()
    const timer = useRef<any>()

    const handleClickOpen = (): void => {
        setOpen(true)
        void login()
    }

    const handleClose = (apply: boolean): void => {
        setOpen(false)
        clearInterval(timer.current)
    }

    async function login(): Promise<void> {
        let status = false
        await getLoginStatus().then(value => {
            status = value
        })
        if (status) {
            setOpen(false)
            return
        }

        let key2: string
        void get('/api/netmusic/getQrCode').then(value => {
            img.current.src = value.data.image
            key2 = value.data.uniqueKey
        }).then(() => {
            timer.current = setInterval(async () => {
                void checkStatus(key2).then(value => {
                    if (value.code === 800) {
                        void messageApi.error('二维码已过期,请重新获取')
                        clearInterval(timer.current)
                    }
                    if (value.code === 803) {
                        // 这一步会返回cookie
                        clearInterval(timer.current)
                        void messageApi.success('授权登录成功')
                        void getLoginStatus()
                        setOpen(false)
                    }
                })
            }, 3000)
        }).catch(() => {
            void messageApi.error('需要登录小工具账号')
            setOpen(false)
        })
    }

    async function checkStatus(key: string): Promise<any> {
        return await post(`/api/direct/login/qr/check?key=${key}&timestamp=${Date.now()}`, null)
    }

    function LoginDialog(): ReactElement {
        return (
            <div>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>保存到手机扫码登录</DialogTitle>
                    <DialogContent>
                        <img ref={img} src="" alt=""/>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            handleClose(false)
                        }}>取消</Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }

    async function getLoginStatus(): Promise<boolean> {
        return await post(`/api/direct/login/status?timestamp=${Date.now()}`, {})
        .then(value => {
            if (value.code === 200 && value.account != null) {
                handleLogin(value)
                return true
            }
            return false
        })
    }

    return (
        <>
            {contextHolder}
            <Button variant="contained" onClick={handleClickOpen}>登录网易云</Button>
            {userInfo?.account != null
                ?
                <UserInfo id={userInfo.account.id} userName={userInfo.account.userName} userId={userInfo.profile.userId}
                          nickname={userInfo.profile.nickname} signature={userInfo.profile.signature}/>
                : '   未登录'}
            <LoginDialog/>
        </>
    )
}
