import * as React from "react";
import { type ReactElement } from "react";
import Dialog, { type DialogProps } from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export interface UploadInfo {
    open: boolean
    setOpen: any
    message: any[]
}

export default function UploadMessage({
                                          message,
                                          open,
                                          setOpen
                                      }: UploadInfo): ReactElement {
    const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper')
    const handleClickOpen = (): void => {
        setOpen(true)
    }

    const handleClose = (): void => {
        setOpen(false)
    }

    const descriptionElementRef = React.useRef<HTMLElement>(null)
    React.useEffect(() => {
        if (open) {
            const {current: descriptionElement} = descriptionElementRef
            if (descriptionElement !== null) {
                descriptionElement.focus()
            }
        }
    }, [open])

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                scroll={scroll}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title">Subscribe</DialogTitle>
                <DialogContent dividers={scroll === 'paper'}>
                    {message
                    .map(
                        (value, index, array) => <DialogContentText key={value[1]}
                                                                    id="scroll-dialog-description"
                                                                    ref={descriptionElementRef}
                                                                    tabIndex={-1}
                        >{value[1]}:{value[0]}</DialogContentText>
                    )}
                </DialogContent>
                {/* <DialogActions> */}
                {/*     <Button onClick={handleClose}>Cancel</Button> */}
                {/*     <Button onClick={handleClose}>Subscribe</Button> */}
                {/* </DialogActions> */}
            </Dialog>
        </React.Fragment>
    )
}
