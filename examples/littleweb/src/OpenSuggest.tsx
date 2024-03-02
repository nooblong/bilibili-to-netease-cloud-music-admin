import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useEffect } from 'react';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const AlertDialogSlide = ({ openIt }) => {
    const [open, setOpen] = React.useState(false);
    const [isFirstLoad, setIsFirstLoad] = React.useState(openIt);

    React.useEffect(() => {
        if (isFirstLoad) {
            setOpen(true);
            setIsFirstLoad(false);
        }
    }, [isFirstLoad]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{'这是一些提示'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        第一次进来要右上角退出游客模式才能进行操作登录网易云等。。
                        <br />
                        不要重复搬运已经有人搬过的！
                        <br />
                        ip和域名可能会变，会更新在github：
                        <a href="https://github.com/nooblong/bilibili-to-netease-cloud-music">
                            https://github.com/nooblong/bilibili-to-netease-cloud-music
                        </a>
                        <br />
                        可以的话麻烦关注一下我：网易云@nooblong
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>完成</Button>
                    {/*<Button onClick={handleClose}>Agree</Button>*/}
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

export default AlertDialogSlide;
