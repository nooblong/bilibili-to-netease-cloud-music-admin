import * as React from 'react';
import {useMediaQuery} from '@mui/material';
import {Theme} from '@mui/material/styles';
import {
    CreateButton, Datagrid,
    FilterButton,
    InfiniteList,
    List,
    SelectInput,
    SimpleList, TextField,
    TextInput,
    TopToolbar,
} from 'react-admin';
import {AuditStatusEnum} from '../subscribes/Enums';

const RecentListMobile = () => {
    return (

        <List actions={<PostListActions/>} filters={recentFilters} exporter={false}>
            <Datagrid bulkActionButtons={false} rowClick={(id, resource, record) => rowClick(id, resource)}>
                <TextField source="uploadName" />
                <TextField source="status" />
                <TextField source="createTime" />
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

const rowClick = (_id, _resource) => {
    console.log(_id);
    //https://y.music.163.com/m/program?id=2534086095
    return 'show';
};

const recentFilters = [
    // <SearchInput source="name" alwaysOn />,
    <TextInput label="标题" source="title" defaultValue="" />,
    <TextInput label="用户名" source="username" defaultValue="" />,
    <TextInput label="备注" source="remark" defaultValue="" />,
    <SelectInput
        label="状态"
        source="status"
        choices={AuditStatusEnum}
    ></SelectInput>,
];

const RecentList = () => {
    return <RecentListMobile />
};

export default RecentList;
