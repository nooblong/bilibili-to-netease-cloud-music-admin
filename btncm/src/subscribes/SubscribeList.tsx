import * as React from 'react';
import { Avatar, useMediaQuery } from '@mui/material';
import { Theme } from '@mui/material/styles';
import {
    CreateButton,
    InfiniteList,
    List,
    SimpleList,
    TextField,
    TextInput,
    TopToolbar,Datagrid, FilterButton, SearchInput
} from 'react-admin';

const SubscribesMobile = () => {
    return (
        <InfiniteList
            exporter={false}
            filters={recentFilters}
            actions={<SubscribeListActions />}
        >
            <SimpleList
                linkType="edit"
                primaryText={record => record.remark}
                leftAvatar={(record, id) => <Avatar src={record.netCover} />}
                secondaryText={record => (
                    <>订阅类型:{rowSx(record.type, 1).display}</>
                )}
                tertiaryText={record =>
                    '处理时间' +
                    new Date(record.processTime).toLocaleDateString()
                }
                rowSx={rowSx}
            />
        </InfiniteList>
    );
};

const SubscribesDesktop = () => (
    <List
        exporter={false}
        filters={recentFilters}
        actions={<SubscribeListActions />}
    >
        <Datagrid rowClick={rowClick}>
            <TextField source="remark" label="备注" />
            <TextField source="type" label="类型" />
            <TextField source="videoOrder" label="获取视频顺序" />
            <TextField source="voiceListId" label="播客id" />
            <TextField source="targetId" label="目标id" />
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
    const isSmall = useMediaQuery<Theme>(
        theme => theme.breakpoints.down('md'),
        { noSsr: true }
    );
    return isSmall ? <SubscribesMobile /> : <SubscribesDesktop />;
};

function rowSx(record, index) {
    if (record === 'UP') {
        return {
            '& .MuiListItemText-secondary': {
                color: 'red',
            },
            display: 'UP主',
        };
    } else if (record === 'COLLECTION') {
        return {
            '& .MuiListItemText-secondary': {
                color: 'purple',
            },
            display: '合集',
        };
    } else if (record === 'PART') {
        return {
            '& .MuiListItemText-secondary': {
                color: 'green',
            },
            display: '多P视频',
        };
    } else if (record === 'FAVORITE') {
        return {
            '& .MuiListItemText-secondary': {
                color: 'black',
            },
            display: '收藏夹',
        };
    } else {
        return {
            '& .MuiListItemText-secondary': {
                color: 'black',
            },
            display: record,
        };
    }
}

export default SubscribeList;
