import { ReactElement, useEffect, useState } from "react";
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
} from "@mui/material";
import {
  ReferenceField,
  ShowButton,
  useDataProvider,
  useNotify,
  useRecordContext,
} from "react-admin";

const LoginNetMusic = () => {
  const [img, setImg] = useState<string>("");
  const [checking, setChecking] = useState(false);
  const [loginStatus, setLoginStatus] = useState("未登录");
  const [key, setKey] = useState("");
  const dataProvider = useDataProvider();
  const record = useRecordContext();
  const notify = useNotify();

  useEffect(() => {
    if (!checking) {
      return;
    }
    const id = setInterval(async () => {
      void dataProvider.checkQrBili(key).then((value: any) => {
        setLoginStatus(value.data.data.message);
        if (value.data.data.code === 86038) {
          notify("二维码已过期,请重新获取", { type: "error" });
          clearInterval(timer);
        }
        if (value.data.data.code === 0) {
          clearInterval(timer);
          notify("授权登录成功", { type: "success" });
          setChecking(false);
        }
      });
    }, 3000);
    return () => {
      clearInterval(id);
    };
  }, [checking, dataProvider, key, notify]);

  return (
    <>
      <Grid>
        <CardContent>仅用于下载音频</CardContent>
        <CardContent>{loginStatus}</CardContent>
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography
            component="span"
            variant="body2"
            data-testid="postLink"
          ></Typography>
          {checking && <LoginDialog img={img} />}
          <ReferenceField record={record} source="post_id" reference="posts" />
        </CardContent>
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            onClick={() => {
              login(setImg, setChecking, setKey, dataProvider);
            }}
          >
            扫码登录
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
        <Card
          sx={{
            height: "100%",
            marginTop: 2,
            display: "flex",
            flexDirection: "column",
          }}
        ></Card>
      </Grid>
    </>
  );
};

function LoginDialog({ img }: { img: string }): ReactElement {
  return (
    <div>
      <DialogTitle>保存到手机扫码登录</DialogTitle>
      <DialogContent>{img !== "" && <img src={img} alt="" />}</DialogContent>
      <DialogActions></DialogActions>
    </div>
  );
}

let timer: any;

async function login(setImg: any, setChecking: any, setKey: any, dataProvider: any): Promise<void> {
  dataProvider
    .getQrBili()
    .then((data: any) => {
      setImg(data.data.image);
      setKey(data.data.uniqueKey);
    })
    .then(() => {
      setChecking(true);
    })
    .catch((reason: any) => {
      alert(reason);
    });
}

export default LoginNetMusic;
