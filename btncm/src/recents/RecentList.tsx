import * as React from 'react';
import {useMediaQuery} from '@mui/material';
import {Theme} from '@mui/material/styles';
import {CreateButton, FilterButton, InfiniteList, SelectInput, SimpleList, TextInput, TopToolbar,} from 'react-admin';
import {AuditStatusEnum} from '../subscribes/Enums';

const RecentListMobile = () => {
    return (
        <InfiniteList
            exporter={false}
            actions={<PostListActions />}
            filters={recentFilters}
        >
            <SimpleList
                linkType="show"
                primaryText={record => record.name}
                secondaryText={record =>
                    rowSx(record, 0).display +
                    '-' +
                    uploadStatusDict(record.uploadStatus)
                }
                tertiaryText={record =>
                    new Date(record.createTime).toLocaleDateString()
                }
                rowSx={rowSx}
            />
        </InfiniteList>
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
    const isSmall = useMediaQuery<Theme>(
        theme => theme.breakpoints.down('md'),
        { noSsr: true }
    );
    return <RecentListMobile />
};

function rowSx(record, index) {
    if (record.uploadStatus === 'NOT_UPLOAD') {
        return {
            display: '待上传',
        };
    }
    if (record.displayStatus === 'AUDITING') {
        return {
            '& .MuiListItemText-secondary': {
                color: 'red',
            },
            display: '审核中',
        };
    } else if (record.displayStatus === 'ONLY_SELF_SEE') {
        return {
            '& .MuiListItemText-secondary': {
                color: 'purple',
            },
            display: '仅自己可见',
        };
    } else if (record.displayStatus === 'ONLINE') {
        return {
            '& .MuiListItemText-secondary': {
                color: 'green',
            },
            display: '已发布',
        };
    } else if (record.displayStatus === 'FAILED') {
        return {
            '& .MuiListItemText-secondary': {
                color: 'black',
            },
            display: '发布失败',
        };
    } else {
        return {
            '& .MuiListItemText-secondary': {
                color: 'black',
            },
            display: '状态: ' + record.displayStatus,
        };
    }
}

function uploadStatusDict(status: string): string {
    switch (status) {
        case 'NOT_UPLOAD':
            return '未处理';
        case 'FINISHED':
            return '已上传';
        case 'NETEASE_ACCOUNT_EXPIRED':
            return '网易登录过期跳过';
    }
    return '未知状态';
}

export default RecentList;
