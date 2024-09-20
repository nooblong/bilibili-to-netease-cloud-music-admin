import {
  Button,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { FailDots, Item, LoadingDots, useGetInfo } from "../common";
import AddBilibiliCookieDialog from "./AddBilibiliCookieDialog";
import { useDataProvider, useNotify } from "react-admin";
import { useEffect } from "react";

const Dashboard = () => {
  const notify = useNotify();
  const dataProvider = useDataProvider();
  useEffect(() => {
    dataProvider.get("sys/log", {}).then(() => {
      console.log("记录成功");
    });
  }, [dataProvider]);
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
            <Item sx={{boxShadow: 0, border: 1}}>你的网易云登录状态: {data1 && data1.data.netCookieStatus + ""}</Item>
          </Grid>
          <Grid item xs={6}>
            <Item sx={{boxShadow: 0, border: 1}}>你的b站登录状态: {data1 && data1.data.bilibiliCookieStatus + ""}</Item>
          </Grid>
          <Grid item xs={6}>
            <Item sx={{boxShadow: 0, border: 1}}>系统就绪: {data1.data.ready + ""}</Item>
          </Grid>
          <Grid item xs={6}>
            <Item sx={{boxShadow: 0, border: 1}}>注册用户数: {data1 && data1.data.regNum + ""}</Item>
          </Grid>
          <Grid item xs={6}>
            <Item sx={{boxShadow: 0, border: 1}}>游客访问数: {data1 && data1.data.annoVisitNum + ""}</Item>
          </Grid>
          <Grid item xs={6}>
            <Item sx={{boxShadow: 0, border: 1}}>用户访问数: {data1 && data1.data.userVisitNum + ""}</Item>
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

    return (
      <CardContent sx={{border: 1, margin: "16px", "border-radius": "4px"}}>
        <Typography>当前队列长度: {data2.data.total}</Typography>
        <List dense={true} sx={{ maxHeight: "400px", overflowY: "auto" }}>
          {data2.data.records.map((i: any) => (
            <ListItem key={i.id}>
              <ListItemText primary={i.mergeTitle + " 优先级: " + i.priority} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    );
  };

  return (
    <Card>
      <SysInfo />
      <QueueInfo />
      <CardContent>
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
