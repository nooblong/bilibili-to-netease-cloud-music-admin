import {
  Datagrid,
  FilterButton,
  Identifier,
  List,
  SelectInput,
  TextField,
  TextInput,
  TopToolbar,
} from "react-admin";
import { AuditStatusEnum } from "../subscribes/Enums";
import CreateButton from "../customAdmin/CreateButton";

const RecentListMobile = () => {
  return (
    <List
      actions={<PostListActions />}
      filters={recentFilters}
      exporter={false}
    >
      <Datagrid bulkActionButtons={false} rowClick={rowClick}>
        <TextField source="uploadName" label="上传名字" />
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

const rowClick = (id: Identifier, resource: string) => {
  console.log(resource);
  // https://y.music.163.com/m/program?id=2534086095
  return "show";
};

const recentFilters = [
  // <SearchInput source="name" alwaysOn />,
  <TextInput
    label="标题"
    source="title"
    defaultValue=""
    name={"标题"}
    key={"标题"}
  />,
  <TextInput
    label="用户名"
    source="username"
    defaultValue=""
    name={"用户名"}
    key={"用户名"}
  />,
  <TextInput
    label="备注"
    source="remark"
    defaultValue=""
    name={"备注"}
    key={"备注"}
  />,
  <SelectInput
    key={"状态"}
    label="状态"
    source="status"
    choices={AuditStatusEnum}
  ></SelectInput>,
];

const RecentList = () => {
  return <RecentListMobile />;
};

export default RecentList;
