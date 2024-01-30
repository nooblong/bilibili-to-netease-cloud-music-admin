import * as React from "react";
import { type ReactElement, useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Link, Outlet, useLocation } from "react-router-dom";
import { AppBar, Button, SwipeableDrawer } from "@mui/material";
import { useAuth } from "../login/Login";
import { post } from "../util/request";

const DrawerHeader = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end'
}))

type Anchor = 'top' | 'left' | 'bottom' | 'right'

export default function PersistentDrawerLeft(): ReactElement {
    const [pageName, setPageName] = React.useState('')

    const auth = useAuth()

    useEffect(() => {
        const interval = setInterval(() => {
            void post('/api/refreshToken', null).then(value => {
                if (value.code !== 200) {
                    auth.signout(() => {
                        console.log('signout')
                        sessionStorage.removeItem('token')
                    })
                }
            })
        }, 300000)
        return () => {
            clearInterval(interval)
        }
    }, [])

    const [state, setState] = useState({
        top: false,
        left: false,
        bottom: false,
        right: false
    })

    function ButtonAppBar(): ReactElement {
        const location = useLocation()
        return (
            <Box sx={{flexGrow: 1}}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{mr: 2}}
                            onClick={toggleDrawer('left', true)}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                            {pageName}
                        </Typography>
                        <Link to={'/login'} style={{
                            textDecoration: 'none',
                            color: 'white'
                        }} onClick={() => {
                            console.log(location.pathname)
                            sessionStorage.setItem('location', location.pathname)
                        }
                        }>
                            <Button color="inherit">{(auth.user != null) ? auth.user.username : '未登录'}</Button>
                        </Link>
                    </Toolbar>
                </AppBar>
            </Box>
        )
    }

    const toggleDrawer =
        (anchor: Anchor, open: boolean) =>
            (event: React.KeyboardEvent | React.MouseEvent) => {
                if (
                    event.type === 'keydown' &&
                    ((event as React.KeyboardEvent).key === 'Tab' ||
                        (event as React.KeyboardEvent).key === 'Shift')
                ) {
                    return
                }

                setState({
                    ...state,
                    [anchor]: open
                })
            }

    const list = (anchor: Anchor): ReactElement => (
        <Box
            sx={{width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250}}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <Divider/>
            <List>
                {[
                    {
                        name: '上传网易云',
                        path: '/uploadStepper'
                    },
                    {
                        name: '订阅up主视频到网易云',
                        path: '/subscribe'
                    },
                    {
                        name: '图片生成',
                        path: '/image'
                    },
                    {
                        name: '自定义图片生成位置',
                        path: '/image/custom'
                    },
                    {
                        name: '聊天',
                        path: '/chat'
                    },
                    {
                        name: '系统管理',
                        path: '/settings'
                    }
                ].map((text, index) => (
                    <Link to={text.path} style={{
                        textDecoration: 'none',
                        color: 'black'
                    }} key={text.path}
                          onClick={() => {
                              setPageName(text.name)
                          }}>
                        <ListItem key={text.name} disablePadding>
                            <ListItemButton>
                                <ListItemText primary={text.name}/>
                            </ListItemButton>
                        </ListItem>
                    </Link>
                ))}
            </List>
        </Box>
    )

    return (
        <div>
            <CssBaseline/>
            <ButtonAppBar/>
            {(['left'] as const).map((anchor) => (
                <React.Fragment key={anchor}>
                    <SwipeableDrawer
                        anchor={anchor}
                        open={state[anchor]}
                        onClose={toggleDrawer(anchor, false)}
                        variant="temporary"
                        ModalProps={{
                            keepMounted: false
                        }}
                        onOpen={toggleDrawer(anchor, true)}>
                        {list(anchor)}
                    </SwipeableDrawer>
                </React.Fragment>
            ))}
            {/* <DrawerHeader/> */}
            <Box
                sx={{
                    margin: '5px',
                    alignItems: 'center'
                }}>
                <Outlet/>
            </Box>
        </div>
    )
}
