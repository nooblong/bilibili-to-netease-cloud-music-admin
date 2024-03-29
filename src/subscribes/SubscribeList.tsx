import {
  Datagrid,
  FilterButton,
  List,
  TextField,
  TextInput,
  TopToolbar,
  useRecordContext,
} from "react-admin";
import { Identifier } from "react-admin";
import CreateButton from "../customAdmin/CreateButton";

const AvatarField = (props: any) => {
  const record = useRecordContext(props);
  return record ? (
    <img
      src={record.netCover}
      style={{
        maxHeight: "100px",
        maxWidth: "100px",
        objectFit: "contain",
      }}
      alt=""
    />
  ) : null;
};

const SubscribesDesktop = () => (
  <List
    perPage={100}
    exporter={false}
    filters={recentFilters}
    actions={<SubscribeListActions />}
  >
    <Datagrid rowClick={rowClick} bulkActionButtons={false}>
      <AvatarField source="netCover" />
      <TextField source="remark" label="备注" />
      <TextField source="typeDesc" label="类型" />
      <TextField source="userName" label="用户" />
      <TextField source="processTime" label="处理时间" />
    </Datagrid>
  </List>
);

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
  // <SearchInput source="remark" alwaysOn />,
  <TextInput
    key={"title"}
    label="Title"
    source="remark"
    defaultValue=""
    name={"remark"}
  />,
];

const SubscribeList = () => {
  return <SubscribesDesktop />;
};

export default SubscribeList;
