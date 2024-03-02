import * as React from 'react';
import {
    AppBar,
    InspectorButton,
    Layout,
    TitlePortal,
    UserMenu,
    useUserMenu,
} from 'react-admin';
import { Button, ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ReactQueryDevtools } from 'react-query/devtools';
import SettingsIcon from '@mui/icons-material/Settings';
import { Logout } from 'ra-ui-materialui';
import OpenSuggest from './OpenSuggest';

const MyAppBar = () => {
    let netmusic = localStorage.getItem('netmusic');
    const nav = useNavigate();
    return (
        <AppBar
            userMenu={
                <UserMenu>
                    <OpenSuggest openIt={false} />
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
            {/*<InspectorButton />*/}
        </AppBar>
    );
};

// It's important to pass the ref to allow Material UI to manage the keyboard navigation
const SettingsMenuItem = React.forwardRef((props, ref) => {
    // We are not using MenuItemLink so we retrieve the onClose function from the UserContext
    const { onClose } = useUserMenu();
    return (
        <MenuItem
            onClick={onClose}
            ref={ref}
            // It's important to pass the props to allow Material UI to manage the keyboard navigation
            {...props}
        >
            <ListItemIcon>
                <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Customize</ListItemText>
        </MenuItem>
    );
});

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
