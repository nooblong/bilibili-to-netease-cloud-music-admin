import { useGetOne, useNotify } from "react-admin";
import { Button, Card, CardContent, Grid, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import { FailDots, Item, LoadingDots } from "../common";
import AddBilibiliCookieDialog from "./AddBilibiliCookieDialog";

const Dashboard = () => {
  const notify = useNotify();

  const SysInfo = () => {
    const {
      data: data,
      isLoading,
      error,
    } = useGetOne("sys/sysInfo", { id: "" });
    if (isLoading) {
      return <LoadingDots />;
    }
    if (error) {
      return <FailDots />;
    }

    return (
      <CardContent sx={{ alignContent: "center", justifyContent: "center", display: "flex" }}>
        <Grid
          container
          spacing={1}
          alignItems="center"
        >
          <Grid item xs={6}>
            <Item sx={{ border: 1 }}>网易云登录状态</Item>
          </Grid>
          <Grid item xs={6}>
            <Item sx={{ border: 1 }}>xs=6</Item>
          </Grid>
          <Grid item xs={6}>
            <Item sx={{ border: 1 }}>b站登录状态</Item>
          </Grid>
          <Grid item xs={6}>
            <Item sx={{ border: 1 }}>xs=6</Item>
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
        {/*// <Typography>*/}
        {/*//   系统大会员账号状态(系统需要至少一个大会员账号下载音频):*/}
        {/*//   {data.bilibiliCookieStatus === true ? "ok" : "fail"}*/}
        {/*// </Typography>*/}
        {/*// <AddBilibiliCookieDialog />*/}
      </CardContent>
    );
  };

  return (
    <Card>
      <SysInfo />
      <CardContent>
        <Typography>当前队列长度: {}</Typography>
        <Typography>队列内容:</Typography>
        <TextField
          multiline
          rows={10} // 设置初始显示的行数
          variant="outlined"
          fullWidth
          value={getAllInfo([])} // 设置显示的文本内容
        />
      </CardContent>
      <CardContent>
        <Typography>管理: </Typography>
        <br/>
        <AddBilibiliCookieDialog />
        <Button
          sx={{width: "100%", marginTop: "10px"}}
          variant={"outlined"}
          onClick={() => {
            // dataProvider
            //   .getOne("", { id: "/subscribe/checkUpJob" })
            //   .then(() => {
            //     notify("ok", { type: "success" });
            //   })
            //   .catch(() => {
            //     notify("error", { type: "error" });
            //   });
          }}
        >
          立即检查订阅
        </Button>
      </CardContent>
    </Card>
  );
};

const getAllInfo = (list: [any]) => {
  let str = "";
  for (let i of list) {
    str += "名字:" + i.mergeTitle + "优先级:" + i.priority;
    str += "\n";
  }
  return str;
};

export default Dashboard;
