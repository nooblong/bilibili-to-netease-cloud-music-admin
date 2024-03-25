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
        <Typography>b站账号状态:</Typography>
        {data.activeBilibiliUserName === null
          ? "无可用b站大会员账号"
          : "当前提供b站大会员账号的用户" + data.activeBilibiliUserName}
        {"     "}
        <AddBilibiliCookieDialog />
      </CardContent>
    </Card>
  );
};

export default Dashboard;
