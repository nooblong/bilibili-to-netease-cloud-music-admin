import { AppBar, Layout, Menu, TitlePortal } from "react-admin";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const MyAppBar = () => {
  const netmusic = localStorage.getItem("netmusic");
  const nav = useNavigate();
  return (
    <AppBar>
      <TitlePortal />
      <Button
        onClick={() => {
          nav("/loginNetMusic");
        }}
        variant="contained"
      >{`网易云状态: ${netmusic != null ? "已登录" : "未登录"}`}</Button>
    </AppBar>
  );
};

const MyMenu = () => {
  let a: any;
  return (
    <Menu>
      <Menu.DashboardItem />
      <Menu.ResourceItem name="uploadDetail" />
      <Menu.ResourceItem name="subscribe" />
      <Menu.ResourceItem name="loginNetMusic" />
      <Menu.Item
        {...a}
        to="https://github.com/nooblong/bilibili-to-netease-cloud-music"
        primaryText="跳转Github"
      >
        {"Github"}
      </Menu.Item>
    </Menu>
  );
};

let element = (props: any) => (
  <>
    <Layout {...props} appBar={MyAppBar} menu={MyMenu} />
  </>
);
export default element;
