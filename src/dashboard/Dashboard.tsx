import { Loading, useGetOne, useNotify } from "react-admin";
import { Button, Card, CardContent, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import AddBilibiliCookieDialog from "./AddBilibiliCookieDialog";
import dataProvider from "../dataProvider";

const Dashboard = () => {
  const notify = useNotify();
  const { data, isLoading } = useGetOne("", { id: "sysInfo" });
  const queueInfo = useGetOne(
    "",
    { id: "queueInfo" },
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );

  return isLoading || queueInfo.isLoading ? (
    <Loading />
  ) : (
    <Card>
      <CardContent>
        上传声音需要在网页云进行实名认证！！！查看自己有没有实名:
        <a href="https://music.163.com/st/ncreator/upload?userType=3">
          https://music.163.com/st/ncreator/upload?userType=3
        </a>
      </CardContent>
      <CardContent>
        <Typography
          color={data.activeBilibiliUserName === null ? "red" : "green"}
        >
          系统大会员账号状态(系统需要至少一个大会员账号下载音频):{" "}
          {data.activeBilibiliUserName === null
            ? "无可用b站大会员账号!暂停上传"
            : "当前提供账号的用户:" + data.activeBilibiliUserName}
        </Typography>
        <AddBilibiliCookieDialog />
      </CardContent>
      <CardContent>
        <Button
          sx={{ marginRight: "10px" }}
          variant={"outlined"}
          onClick={() => {
            dataProvider
              .getOne("", { id: "/subscribe/checkUpJob" })
              .then(() => {
                notify("ok", { type: "success" });
              })
              .catch(() => {
                notify("error", { type: "error" });
              });
          }}
        >
          立即检查订阅(仅管理员)
        </Button>
        <Button sx={{ marginRight: "10px" }} variant={"outlined"}>
          预留
        </Button>
        <Button sx={{ marginRight: "10px" }} variant={"outlined"}>
          预留
        </Button>
      </CardContent>
      <CardContent>
        <Typography>当前队列长度: {queueInfo.data.data.length}</Typography>
        <Typography>队列内容:</Typography>
        <TextField
          multiline
          rows={10} // 设置初始显示的行数
          variant="outlined"
          fullWidth
          value={getAllInfo(queueInfo.data.data)} // 设置显示的文本内容
        />
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
