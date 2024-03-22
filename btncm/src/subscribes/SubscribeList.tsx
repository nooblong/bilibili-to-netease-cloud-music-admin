import * as React from 'react';
import {Avatar, useMediaQuery} from '@mui/material';
import {Theme} from '@mui/material/styles';
import {
    CreateButton,
    Datagrid,
    FilterButton, ImageField,
    InfiniteList,
    List,
    SimpleList,
    TextField,
    TextInput,
    TopToolbar, useRecordContext
} from 'react-admin';

const AvatarField = (props) => {
    const record = useRecordContext(props);
    return record ? <img src={record.netCover} style={{maxHeight: "100%", maxWidth: "100%"}}  alt=''/> : null;
}

const SubscribesDesktop = () => (
    <List
        exporter={false}
        filters={recentFilters}
        actions={<SubscribeListActions />}
    >
        <Datagrid rowClick={rowClick} bulkActionButtons={false}>
            <AvatarField source="netCover" />
            <TextField source="remark" label="备注" />
            <TextField source="type" label="类型" />
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

const rowClick = (_id, _resource) => {
    console.log(_id);
    //https://y.music.163.com/m/program?id=2534086095
    return 'show';
};

const recentFilters = [
    // <SearchInput source="remark" alwaysOn />,
    <TextInput label="Title" source="remark" defaultValue="" />,
];

const SubscribeList = () => {
    return <SubscribesDesktop />;
};

export default SubscribeList;
