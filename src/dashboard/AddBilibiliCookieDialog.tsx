import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import LoginBilibili from "./LoginBilibili";

export default function AddBilibiliCookieDialog() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen} fullWidth>
        提供一个大会员(可选)
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <LoginBilibili />
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
