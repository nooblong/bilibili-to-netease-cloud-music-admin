import {
  Button,
  Datagrid,
  FilterButton,
  Identifier,
  List,
  SelectInput,
  TextField,
  TextInput,
  TopToolbar,
  useRecordContext,
} from "react-admin";
import CreateButton from "../customAdmin/CreateButton";
import { Box, ButtonGroup } from "@mui/material";
import { useEffect } from "react";
import { StatusEnum } from "./Enums";

const AvatarField = (props: any) => {
  const record = useRecordContext(props);
  return record ? (
    <Box maxWidth={"100%"} maxHeight={"100%"}>
      <img
        src={record.netCover}
        style={{
          maxHeight: "50px",
          maxWidth: "50px",
          objectFit: "contain",
        }}
        alt=""
      />
    </Box>
  ) : null;
};

const Jump = () => {
  const record = useRecordContext();
  if (!record) {
    return null;
  }
  return (
    <>
      跳转至
      <a
        href={""}
        onClick={(event) => {
          event.stopPropagation();
          window.open(
            `https://music.163.com/#/djradio?id=${record.voiceListId}`,
            "_blank"
          );
        }}
      >
        网易云
      </a>
      /
      <a
        href={""}
        onClick={(event) => {
          event.stopPropagation();
          let url;
          switch (record.type) {
            case "UP":
              url = `https://space.bilibili.com/${record.targetId}`;
              break;
            case "FAVORITE":
              url = `https://space.bilibili.com/6906052/favlist?fid=${record.targetId}`;
              break;
            case "COLLECTION":
              url = `https://space.bilibili.com/6906052/channel/collectiondetail?sid=${record.targetId}`;
              break;
            case "PART":
              url = `https://www.bilibili.com/video/${record.targetId}`;
              break;
          }
          window.open(url, "_blank");
        }}
      >
        b站
      </a>
    </>
  );
};

const SubscribesDesktop = () => {
  useEffect(() => {
    localStorage.removeItem("RaStore.subscribe.listParams");
  }, []);
  const username = localStorage.getItem("user");
  return (
    <List
      perPage={10}
      exporter={false}
      filters={recentFilters}
      actions={<SubscribeListActions />}
      filterDefaultValues={{ username: username, status: 1 }}
    >
      <Datagrid rowClick={rowClick} bulkActionButtons={false}>
        <AvatarField source="netCover" />
        <TextField source="remark" label="备注" />
        <TextField source="typeDesc" label="类型" />
        <TextField source="userName" label="用户" />
        <TextField source="processTime" label="处理时间" />
        <Jump />
      </Datagrid>
    </List>
  );
};

const SubscribeListActions = () => (
  <TopToolbar>
    <CreateButton />
    <FilterButton />
  </TopToolbar>
);

const rowClick = (id: Identifier, resource: string) => {
  console.log(resource);
  // https://y.music.163.com/m/program?id=2534086095
  return "show";
};

const recentFilters = [
  <TextInput
    key={"username"}
    label="用户名"
    source="username"
    defaultValue=""
    name={"username"}
    variant="outlined"
  />,
  <SelectInput
    choices={StatusEnum}
    key={"status"}
    label="状态"
    source="status"
    defaultValue=""
    name={"status"}
    variant="outlined"
  />,
];

const SubscribeList = () => {
  return <SubscribesDesktop />;
};

export default SubscribeList;
