import * as React from "react";
import { Admin, Resource } from "react-admin";
import { createRoot } from "react-dom/client";

import authProvider from "./authProvider";
import Layout from "./Layout";
import LoginNetMusic from "./loginNetMusic/LoginNetMusic";
import delayedDataProvider from "./dataProvider";
import LoginPage from "./LoginPage";
import UploadDetailCreate from "./recents/UploadDetailCreate";
import UploadDetail from "./recents/UploadDetailList";
import SubscribeList from "./subscribes/SubscribeList";
import SubscribeCreate from "./subscribes/SubscribeCreate";
import SubscribeEdit from "./subscribes/SubscribeEdit";
import UploadDetailShow from "./recents/UploadDetailShow";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import Dashboard from "./dashboard/Dashboard";

const container = document.getElementById("root");
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
root.render(
  <React.StrictMode>
    <Admin
      authProvider={authProvider}
      dataProvider={delayedDataProvider}
      dashboard={Dashboard}
      title="btncm"
      layout={Layout}
      loginPage={LoginPage}
    >
      <Resource
        name="uploadDetail"
        list={UploadDetail}
        create={UploadDetailCreate}
        show={UploadDetailShow}
        icon={PlaylistAddIcon}
        options={{ label: "单曲上传" }}
      />
      <Resource
        name="subscribe"
        list={SubscribeList}
        create={SubscribeCreate}
        edit={SubscribeEdit}
        icon={SubscriptionsIcon}
        options={{ label: "订阅" }}
      />
      <Resource
        icon={VpnKeyIcon}
        name="loginNetMusic"
        list={LoginNetMusic}
        options={{ label: "登录网易云" }}
      />
    </Admin>
  </React.StrictMode>
);
