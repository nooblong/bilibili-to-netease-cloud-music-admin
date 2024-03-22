import * as React from 'react';
import {AppBar, Layout, Logout, TitlePortal, UserMenu} from 'react-admin';
import {Button} from '@mui/material';
import {useNavigate} from 'react-router-dom';

const MyAppBar = () => {
    let netmusic = localStorage.getItem('netmusic');
    const nav = useNavigate();
    return (
        <AppBar
            userMenu={
                <UserMenu>
                    <Logout></Logout>
                </UserMenu>
            }
        >
            <TitlePortal />
            <Button
                onClick={() => {
                    nav('/loginNetMusic');
                }}
                variant="contained"
            >{`网易云状态: ${netmusic != null ? '已登录' : '未登录'}`}</Button>
        </AppBar>
    );
};

export default props => (
    <>
        <Layout {...props} appBar={MyAppBar} />
        {/*<ReactQueryDevtools*/}
        {/*    initialIsOpen={false}*/}
        {/*    toggleButtonProps={{*/}
        {/*        style: { width: 40, height: 30, marginLeft: 300 },*/}
        {/*    }}*/}
        {/*/>*/}
    </>
);
