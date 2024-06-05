import { Button, Card, CardContent, Grid, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import { FailDots, Item, LoadingDots, useGetInfo } from "../common";
import AddBilibiliCookieDialog from "./AddBilibiliCookieDialog";
import { useDataProvider, useNotify } from "react-admin";

const Dashboard = () => {
  const notify = useNotify();
  const dataProvider = useDataProvider();
  const {
    data: data1,
    isLoading: isLoading1,
    error: error1,
  } = useGetInfo("sys/sysInfo", {});
  const {
    data: data2,
    isLoading: isLoading2,
    error: error2,
  } = useGetInfo(`sys/queueInfo`, { pageNo: 1, pageSize: 100 });

  const SysInfo = () => {
    if (isLoading1) {
      return <LoadingDots />;
    }
    if (error1) {
      return <FailDots />;
    }

    return (
      <CardContent
        sx={{
          alignContent: "center",
          justifyContent: "center",
          display: "flex",
        }}
      >
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={6}>
            <Item sx={{ border: 1 }}>你的网易云登录状态</Item>
          </Grid>
          <Grid item xs={6}>
            <Item sx={{ border: 1 }}>
              {data1 && data1.data.netCookieStatus + ""}
            </Item>
          </Grid>
          <Grid item xs={6}>
            <Item sx={{ border: 1 }}>b站登录状态</Item>
          </Grid>
          <Grid item xs={6}>
            <Item sx={{ border: 1 }}>
              {data1.data.bilibiliCookieStatus + ""}
            </Item>
          </Grid>
          <Grid item xs={6}>
            <Item sx={{ border: 1 }}>注册用户数</Item>
          </Grid>
          <Grid item xs={6}>
            <Item sx={{ border: 1 }}>xs=6</Item>
          </Grid>
          <Grid item xs={6}>
            <Item sx={{ border: 1 }}>游客当日访问数</Item>
          </Grid>
          <Grid item xs={6}>
            <Item sx={{ border: 1 }}>xs=6</Item>
          </Grid>
          <Grid item xs={6}>
            <Item sx={{ border: 1 }}>用户当日访问数</Item>
          </Grid>
          <Grid item xs={6}>
            <Item sx={{ border: 1 }}>xs=6</Item>
          </Grid>
        </Grid>
      </CardContent>
    );
  };

  const QueueInfo = () => {
    if (isLoading2) {
      return <LoadingDots />;
    }
    if (error2) {
      return <FailDots />;
    }

    const getAllInfo = (list: [any]) => {
      let str = "";
      for (let i of list) {
        str += "名字:" + i.title + "优先级:" + i.priority;
        str += "\n";
      }
      return str;
    };
    return (
      <CardContent>
        <Typography>当前队列长度: {data2.data.total}</Typography>
        <Typography>队列内容:</Typography>
        <TextField
          multiline
          rows={10} // 设置初始显示的行数
          variant="outlined"
          fullWidth
          value={getAllInfo(data2.data.records)} // 设置显示的文本内容
        />
      </CardContent>
    );
  };

  return (
    <Card>
      <SysInfo />
      <QueueInfo />
      <CardContent>
        <Typography>管理: </Typography>
        <br />
        <AddBilibiliCookieDialog />
        <Button
          sx={{ width: "100%", marginTop: "10px" }}
          variant={"outlined"}
          onClick={() => {
            dataProvider
              .get("subscribe/checkUpJob")
              .then(() => {
                notify("ok", { type: "success" });
              })
              .catch((reason: Error) => {
                notify(reason.message, { type: "error" });
              });
          }}
        >
          立即检查订阅
        </Button>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
