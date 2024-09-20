import {
  Datagrid,
  FilterButton, Identifier,
  List,
  SelectInput,
  SortButton,
  TextField,
  TextInput,
  TopToolbar,
} from "react-admin";
import { AuditStatusEnum } from "../subscribes/Enums";
import CreateButton from "../customAdmin/CreateButton";
import {useEffect} from "react";

const UploadDetailListMobile = () => {
  useEffect(() => {
    localStorage.removeItem("RaStore.uploadDetail.listParams");
  }, []);
  const username = localStorage.getItem("user");
  return (
    <List
      actions={<PostListActions />}
      filters={recentFilters}
      exporter={false}
      perPage={30}
      sort={{ field: "createTime", order: "DESC" }}
      filterDefaultValues={{ username: username }}
    >
      <Datagrid bulkActionButtons={false} rowClick={rowClick}>
        <TextField source="mergeTitle" label="上传名字" />
        <TextField source="userName" label="用户" />
        <TextField source="statusDesc" label="状态" />
        <TextField source="createTime" label="创建时间" />
      </Datagrid>
    </List>
  );
};

const PostListActions = () => (
  <TopToolbar>
    <CreateButton />
    <FilterButton />
  </TopToolbar>
);

const recentFilters = [
  <TextInput
    label="视频标题"
    source="title"
    defaultValue=""
    name={"title"}
    key={"视频标题"}
    variant={"outlined"}
  />,
  <TextInput
    label="真实上传名字"
    source="uploadName"
    defaultValue=""
    name={"uploadName"}
    key={"真实上传名字"}
    variant={"outlined"}
  />,
  <TextInput
    label="用户名"
    source="username"
    name={"username"}
    key={"用户名"}
    variant={"outlined"}
  />,
  <SelectInput
    key={"状态"}
    label="状态"
    source="status"
    defaultValue={""}
    name={"status"}
    choices={AuditStatusEnum}
    variant={"outlined"}
  ></SelectInput>,
  <TextInput
    key={"订阅备注"}
    label="订阅备注"
    source="remark"
    defaultValue={""}
    name={"remark"}
    variant={"outlined"}
  ></TextInput>,
];

const rowClick = () => {
  return "show";
};

const UploadDetailList = () => {
  return <UploadDetailListMobile />;
};

export default UploadDetailList;
