import { useNavigate } from "react-router-dom";
import * as React from "react";
import { type ReactElement } from "react";
import { Avatar, Button, Container, createTheme, TextField, ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { post } from "../util/request";
import { message } from "antd";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import { useAuth } from "./Login";

export default function (): ReactElement {
    const [messageApi, contextHolder] = message.useMessage()
    const defaultTheme = createTheme()
    const navigate = useNavigate()
    const auth = useAuth()

    function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        post('/api/register', {
            username: formData.get('username'),
            password: formData.get('password')
        }).then(value => {
            if (value.message == null) {
                void messageApi.error('注册失败, 用户名可能重复')
                return
            }
            void messageApi.success(value.message)
            setTimeout(() => {
                auth.signin(formData, () => {
                    navigate('/')
                })
            }, 1000)
        }).catch(reason => {
            void messageApi.error('注册失败')
        })
    }

    return (<ThemeProvider theme={defaultTheme}>
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
                    <HowToRegIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    注册
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="用户名(任意)"
                        name="username"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="密码(任意)"
                        type="password"
                        id="password"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                            mt: 3,
                            mb: 2
                        }}
                    >
                        注册
                    </Button>
                </Box>
            </Box>
        </Container>
    </ThemeProvider>)
}
