import { AppBar, Layout, Menu, TitlePortal } from "react-admin";
import GitHubIcon from "@mui/icons-material/GitHub";

const MyAppBar = () => {
  const username = localStorage.getItem("user");
  return (
    <AppBar>
      <TitlePortal></TitlePortal>
      {username ? username : "未登录"}
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
        leftIcon={<GitHubIcon />}
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
