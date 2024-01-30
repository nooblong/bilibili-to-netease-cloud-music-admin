export const VideoOrderEnum = [
    {
        id: 'PUB_NEW_FIRST_THEN_OLD',
        name: '先更新新发布的',
    },
    {
        id: 'PUB_OLD_FIRST_THEN_NEW',
        name: '先更新以前的',
    },
];

export const UserVideoOrderEnum = [
    {
        id: 'PUBDATE',
        name: '发布日期排序',
    },
    {
        id: 'FAVORITE',
        name: '用户收藏排序',
    },
    {
        id: 'VIEW',
        name: '用户点击排序',
    },
];

export const CollectionVideoOrderEnum = [
    {
        id: 'DEFAULT',
        name: '默认排序',
    },
    {
        id: 'CHANGE',
        name: '升序排序',
    },
];

export const SubscribeTypeEnum = [
    {
        id: 'UP',
        name: 'UP主',
    },
    {
        id: 'COLLECTION',
        name: '合集',
    },
    {
        id: 'FAVORITE',
        name: '收藏夹',
    },
    {
        id: 'PART',
        name: '单个视频分P',
    },
];

export const AuditStatusEnum = [
    {
        id: 'AUDITING',
        name: '审核中',
    },
    {
        id: 'ONLY_SELF_SEE',
        name: '仅自己可见',
    },
    {
        id: 'ONLINE',
        name: '已发布',
    },
    {
        id: 'OTHER',
        name: '其他',
    },
];
