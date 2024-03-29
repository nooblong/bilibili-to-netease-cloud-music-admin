import { useEffect } from "react";
import { Loading, useGetOne } from "react-admin";
import { Card, CardContent, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import AddBilibiliCookieDialog from "./AddBilibiliCookieDialog";

const Dashboard = () => {
  useEffect(() => {}, []);

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
            ? "无可用b站大会员账号"
            : "当前提供b站大会员账号的用户:" +
              data.activeBilibiliUserName +
              " ,谢谢你"}
        </Typography>
        <AddBilibiliCookieDialog />
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
