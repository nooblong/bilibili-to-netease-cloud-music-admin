import * as React from 'react';
import { ReactElement, useEffect, useState } from 'react';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Typography,
} from '@mui/material';
import { ReferenceField, ShowButton, TextField } from 'ra-ui-materialui';
import { useDataProvider, useNotify, useRecordContext } from 'ra-core';
import UserInfoShow from './UserInfoShow';
import LoginNetMusicPassword from './LoginNetMusicPassword';

const LoginNetMusic = () => {
    const [img, setImg] = useState();
    const [userInfo, setUserInfo] = useState<any>({});
    const [checking, setChecking] = useState(false);
    const [loginStatus, setLoginStatus] = useState('未登录');
    const [key, setKey] = useState('');
    const dataProvider = useDataProvider();
    const record = useRecordContext();
    const notify = useNotify();

    useEffect(() => {
        if (!checking) {
            return;
        }
        const id = setInterval(async () => {
            void dataProvider.qrCheck(key).then(value => {
                setLoginStatus(value.data.message);
                if (value.data.code === 800) {
                    notify('二维码已过期,请重新获取', { type: 'error' });
                    clearInterval(timer);
                }
                if (value.data.code === 803) {
                    clearInterval(timer);
                    notify('授权登录成功', { type: 'success' });
                    dataProvider.loginStatus().then(userInfo => {
                        setUserInfo(userInfo);
                        setChecking(false);
                    });
                }
            });
        }, 3000);
        return () => {
            clearInterval(id);
        };
    }, [checking, dataProvider, key, notify]);

    useEffect(() => {
        dataProvider.isLogin().then(data => {
            if (
                data.data.data === null ||
                data.data.data.account === null ||
                data.data.data.account === 'null' ||
                data.data.data.account.anonimousUser
            ) {
                localStorage.removeItem('netmusic');
            } else {
                localStorage.setItem('netmusic', JSON.stringify(data.data));
            }
            setUserInfo(data.data);
        });
    }, [dataProvider]);

    return (
        <>
            <Grid>
                <Card
                    sx={{
                        flexDirection: 'column',
                    }}
                >
                    <CardContent>
                        扫码登录不支持服务端刷新登录信息，可能会过期导致订阅失败(不用订阅就无所谓)
                    </CardContent>
                    <CardContent>
                        {userInfo?.data != null &&
                        userInfo.data?.account != null &&
                        !userInfo.data.account.anonimousUser ? (
                            <UserInfoShow
                                id={userInfo.data?.account.id}
                                userName={userInfo.data?.account.userName}
                                userId={userInfo.data?.profile.userId}
                                nickname={userInfo.data?.profile.nickname}
                                signature={userInfo.data?.profile.signature}
                            />
                        ) : (
                            loginStatus
                        )}
                        <TextField
                            record={record}
                            source="body"
                            sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                            }}
                        />
                    </CardContent>
                    <CardContent sx={{ flexGrow: 1 }}>
                        <Typography
                            component="span"
                            variant="body2"
                            data-testid="postLink"
                        ></Typography>
                        {checking && <LoginDialog img={img} />}
                        <ReferenceField
                            record={record}
                            source="post_id"
                            reference="posts"
                        />
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'flex-end' }}>
                        <Button
                            variant="contained"
                            onClick={() => {
                                login(
                                    setImg,
                                    setChecking,
                                    setKey,
                                    dataProvider
                                );
                            }}
                        >
                            扫码登录网易云
                        </Button>
                        {checking && (
                            <Button
                                onClick={() => {
                                    setChecking(false);
                                }}
                            >
                                取消
                            </Button>
                        )}
                        <ShowButton record={record} />
                    </CardActions>
                </Card>
                <Card
                    sx={{
                        height: '100%',
                        marginTop: 2,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <LoginNetMusicPassword />
                </Card>
            </Grid>
        </>
    );
};
function LoginDialog({ img }): ReactElement {
    return (
        <div>
            <DialogTitle>保存到手机扫码登录</DialogTitle>
            <DialogContent>
                {img !== '' && <img src={img} alt="" />}
            </DialogContent>
            <DialogActions></DialogActions>
        </div>
    );
}

let timer;
async function login(setImg, setChecking, setKey, dataProvider): Promise<void> {
    dataProvider
        .getQrCode()
        .then(data => {
            setImg(data.data.image);
            setKey(data.data.uniqueKey);
        })
        .then(() => {
            setChecking(true);
        })
        .catch(reason => {
            alert(reason);
        });
}

export default LoginNetMusic;
