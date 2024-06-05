import {
  Datagrid,
  FilterButton,
  Identifier,
  List,
  TextField,
  TextInput,
  TopToolbar,
  useRecordContext,
} from "react-admin";
import CreateButton from "../customAdmin/CreateButton";
import { Box } from "@mui/material";

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
