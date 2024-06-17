import {
  Datagrid,
  EditButton,
  FilterButton,
  List,
  SelectInput,
  ShowButton,
  SortButton,
  TextField,
  TextInput,
  TopToolbar,
} from "react-admin";
import { AuditStatusEnum } from "../subscribes/Enums";
import CreateButton from "../customAdmin/CreateButton";
import { Box, Stack } from "@mui/material";

const PostListActionToolbar = ({ children }: any) => (
  <Box sx={{ alignItems: "center", display: "flex" }}>{children}</Box>
);

const UploadDetailListMobile = () => {
  return (
    <List
      actions={<PostListActions />}
      filters={recentFilters}
      exporter={false}
      perPage={30}
      sort={{ field: "id", order: "DESC" }}
    >
      <Datagrid bulkActionButtons={false}>
        <TextField source="mergeTitle" label="上传名字" />
        <TextField source="userName" label="用户" />
        <TextField source="statusDesc" label="状态" />
        <TextField source="createTime" label="创建时间" />
        <PostListActionToolbar>
          <Stack>
            <EditButton />
            <ShowButton />
          </Stack>
        </PostListActionToolbar>
      </Datagrid>
    </List>
  );
};

const PostListActions = () => (
  <TopToolbar>
    <CreateButton />
    <FilterButton />
    <SortButton fields={["createTime", "updateTime"]} />
  </TopToolbar>
);

const recentFilters = [
  <TextInput
    label="视频标题"
    source="title"
    defaultValue=""
    name={"title"}
    key={"视频标题"}
  />,
  <TextInput
    label="真实上传名字"
    source="uploadName"
    defaultValue=""
    name={"uploadName"}
    key={"真实上传名字"}
  />,
  <TextInput
    label="用户名"
    source="username"
    defaultValue=""
    name={"username"}
    key={"用户名"}
  />,
  <SelectInput
    key={"状态"}
    label="状态"
    source="status"
    defaultValue={""}
    name={"status"}
    choices={AuditStatusEnum}
  ></SelectInput>,
  <TextInput
    key={"订阅备注"}
    label="订阅备注"
    source="remark"
    defaultValue={""}
    name={"remark"}
  ></TextInput>,
];

const UploadDetailList = () => {
  return <UploadDetailListMobile />;
};

export default UploadDetailList;
