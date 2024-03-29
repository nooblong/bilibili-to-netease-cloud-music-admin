import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import LoginBilibili from "./LoginBilibili";

export default function AddBilibiliCookieDialog() {
  const [open, setOpen] = React.useState(false);
  const [scan, setScan] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <br />
      <Button variant="outlined" onClick={handleClickOpen}>
        提供一个以供下载音频?
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <LoginBilibili />
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
