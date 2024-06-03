import { useDataProvider, useNotify } from "react-admin";
import { Button, Card, CardContent, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import AddBilibiliCookieDialog from "./AddBilibiliCookieDialog";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const notify = useNotify();
  const dataProvider = useDataProvider();
  const [sysInfo, setSysInfo] = useState({
    netCookieStatus: false,
    bilibiliCookieStatus: false,
  });
  const [queueInfo, setQueueInfo] = useState({
    total: 0,
    records: [],
  });

  useEffect(() => {
    dataProvider.getOne("sysInfo", { id: undefined }).then((data) => {
      setSysInfo(data);
    });
    // dataProvider
    //   .getOne("queueInfo?pageNo=1&pageSize=50", {
    //     id: undefined,
    //   })
    //   .then((data) => {
    //     setQueueInfo(data);
    //   });
  }, [dataProvider]);

  return (
    <Card>
      <CardContent>
        上传声音需要在网页云进行实名认证！！！查看自己有没有实名:
        <a href="https://music.163.com/st/ncreator/upload?userType=3">
          https://music.163.com/st/ncreator/upload?userType=3
        </a>
      </CardContent>
      <CardContent>
        <Typography>
          系统大会员账号状态(系统需要至少一个大会员账号下载音频):
          {sysInfo.bilibiliCookieStatus === true ? "ok" : "fail"}
        </Typography>
        <AddBilibiliCookieDialog />
      </CardContent>
      <CardContent>
        <Button
          sx={{ margin: "10px" }}
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
          立即检查订阅(仅admin)
        </Button>
      </CardContent>
      <CardContent>
        <Typography>当前队列长度: {queueInfo.total}</Typography>
        <Typography>队列内容:</Typography>
        <TextField
          multiline
          rows={10} // 设置初始显示的行数
          variant="outlined"
          fullWidth
          value={getAllInfo(queueInfo.records)} // 设置显示的文本内容
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
