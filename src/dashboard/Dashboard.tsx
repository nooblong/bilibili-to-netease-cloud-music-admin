import { useEffect } from "react";
import { Loading, useGetOne } from "react-admin";
import { Card, CardContent } from "@mui/material";
import Typography from "@mui/material/Typography";
import AddBilibiliCookieDialog from "./AddBilibiliCookieDialog";

const Dashboard = () => {
  useEffect(() => {}, []);

  const { data, isLoading } = useGetOne("", { id: "sysInfo" });

  return isLoading ? (
    <Loading />
  ) : (
    <Card>
      <CardContent>
        <Typography
          color={data.activeBilibiliUserName === null ? "red" : "green"}
        >
          公共b站大会员账号状态:{" "}
          {data.activeBilibiliUserName === null
            ? "无可用b站大会员账号"
            : "当前提供b站大会员账号的用户:" + data.activeBilibiliUserName + " ,谢谢你"}
        </Typography>
        <AddBilibiliCookieDialog />
      </CardContent>
    </Card>
  );
};

export default Dashboard;
