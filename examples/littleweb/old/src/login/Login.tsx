import * as React from "react";
import { type ReactElement, useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { post } from "../util/request";
import { api } from "../common/api";
import { Avatar, Button, Container, createTheme, Grid, TextField, ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { message } from "antd";

export default function (): ReactElement {
    const {state} = useLocation()

    return (
        <>
            <h3 hidden={state === null}>
                {state}
            </h3>
            <LoginPage/>
            <AuthStatus/>
        </>
    )
}

interface User {
    username: string
    token: string
}

interface AuthContextType {
    user: User | null
    signin: (body: any, callback: VoidFunction) => void
    signout: (callback: VoidFunction) => void
}

const initialState = {
    user: null,
    signin: () => {
    },
    signout: () => {
    }
}

const AuthContext = React.createContext<AuthContextType>(initialState)

export function AuthProvider({children}: { children: React.ReactNode }): React.JSX.Element {
    const [user, setUser] = useState<User | null>(null)

    const set1User = (user: User | null): void => {
        sessionStorage.setItem('user', JSON.stringify(user))
        if (user != null) {
            sessionStorage.setItem('token', user.token)
        }
        setUser(user)
    }

    if (user === null) {
        const userStorage = sessionStorage.getItem('user')
        if (userStorage !== null && userStorage !== 'null') {
            const parse: User = JSON.parse(userStorage)
            if (parse.username !== null && parse.token !== null) {
                set1User(parse)
            }
        }
    }

    const signin = (body: any, callback: VoidFunction): void => {
        // return fakeAuthProvider.signin(() => {
        //     setUser(newUser);
        //     callback();
        // });
        const objData: any = {}
        body.forEach((v: string, k: string) => {
            objData[k] = v
        })
        console.log(api)
        const promise = post('/api/login', objData)
        void promise.then(i => {
            console.log('i.data:   ' + i.data)
            const strings = i.data.split('.')
            const jsonInfo = JSON.parse(decodeURIComponent(escape(window.atob(strings[1].replace(/-/g, '+').replace(/_/g, '/')))))
            console.log(jsonInfo.data)
            // let data = JSON.parse(jsonInfo.data);
            console.log(jsonInfo.data.username)
            set1User({
                username: jsonInfo.data.username,
                token: i.data
            })
            callback()
        })
    }

    const signout = (callback: VoidFunction): void => {
        sessionStorage.removeItem('user')
        set1User(null)
        sessionStorage.removeItem('token')
        callback()
    }

    const value = {
        user,
        signin,
        signout
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
    return React.useContext(AuthContext)
}

function AuthStatus(): ReactElement {
    const auth = useAuth()
    useNavigate()

    if (auth.user == null) {
        return <p></p>
    }

    return (
        <>
            欢迎 {auth.user.username}!{' '}
            <Button variant="contained"
                    onClick={() => {
                        auth.signout(() => {
                        })
                    }}
            >
                登出
            </Button>
        </>
    )
}

export function RequireAuth({children}: { children: JSX.Element }): ReactElement {
    const auth = useAuth()
    if (auth.user == null) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they log in, which is a nicer user experience
        // than dropping them off on the home page.
        sessionStorage.setItem('location', location.pathname)
        return <Navigate to="/login" state={'该功能需要登录'} replace/>
    }

    return children
}

function LoginPage(): ReactElement {
    const auth = useAuth()
    const [messageApi, contextHolder] = message.useMessage()
    const navigate = useNavigate()
    const from = sessionStorage.getItem('location') ?? '/'

    useEffect(() => {
        // sessionStorage.removeItem("token")
        void post('/api/refreshToken', null).then(value => {
            if (value.code !== 200) {
                auth.signout(() => {
                    sessionStorage.removeItem('token')
                })
            }
        })
    }, [])

    function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)

        auth.signin(formData, () => {
            // Send them back to the page they tried to visit when they were
            // redirected to the login page. Use { replace: true } so we don't create
            // another entry in the history stack for the login page.  This means that
            // when they get to the protected page and click the back button, they
            // won't end up back on the login page, which is also really nice for the
            // user experience.
            void messageApi.success('登录成功')
            // setTimeout(() => {
            //   navigate(from, { replace: true })
            // }, 1000)
        })
    }

    const defaultTheme = createTheme()
    return (
        <ThemeProvider theme={defaultTheme}>
            {contextHolder}
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Box
                    sx={{
                        marginTop: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <Avatar sx={{
                        m: 1,
                        bgcolor: 'secondary.main'
                    }}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        登录
                    </Typography>
                    {auth.user === null
                        ? <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="用户名"
                                name="username"
                                autoComplete="username"
                                autoFocus
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="密码"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                            />
                            {/* <FormControlLabel */}
                            {/*     control={<Checkbox value="remember" color="primary"/>} */}
                            {/*     label="Remember me" */}
                            {/* /> */}
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{
                                    mt: 3,
                                    mb: 2
                                }}
                            >
                                登录
                            </Button>
                            <Grid container>
                                <Grid item>
                                    <Link to="/register">
                                        去注册
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                        : <h4>已登录</h4>}
                </Box>
            </Container>
        </ThemeProvider>
    )
}
