export const VideoOrderEnum = [
  {
    id: "PUB_NEW_FIRST_THEN_OLD",
    name: "先更新新发布的",
  },
  {
    id: "PUB_OLD_FIRST_THEN_NEW",
    name: "先更新以前的",
  },
];

export const UserVideoOrderEnum = [
  {
    id: "PUBDATE",
    name: "发布日期排序",
  },
  {
    id: "FAVORITE",
    name: "用户收藏排序",
  },
  {
    id: "VIEW",
    name: "用户点击排序",
  },
];

export const CollectionVideoOrderEnum = [
  {
    id: "DEFAULT",
    name: "默认排序",
  },
  {
    id: "CHANGE",
    name: "升序排序",
  },
];

export const SubscribeTypeEnum = [
  {
    id: "UP",
    name: "UP主",
  },
  {
    id: "COLLECTION",
    name: "合集",
  },
  {
    id: "OLDCOLLECTION",
    name: "旧合集(视频列表)",
  },
  {
    id: "FAVORITE",
    name: "收藏夹",
  },
  // {
  //   id: "PART",
  //   name: "单个视频分P",
  // },
];

export const StatusEnum = [
  {
    id: "1",
    name: "启用",
  },
  {
    id: "0",
    name: "禁用",
  },
];

export const AuditStatusEnum = [
  /*
  // control by app
    WAIT("等待"),
    PROCESSING("处理中"),
    AUDITING("审核中"),
    // control by 163
    ONLY_SELF_SEE("仅自己可见"),
    ONLINE("已上线"),
    FAILED("失败"),
    TRANSCODE_FAILED("转码失败"),
    // control by app
    OVER_MAX_RETRY("超过重试次数"),
    INTERNAL_ERROR("内部错误"),
    SKIP("跳过"),
    UNKNOWN("未知错误"),
    NO_LOGIN("登录失效查询失败");
   */
  {
    id: "WAIT",
    name: "等待",
  },
  {
    id: "PROCESSING",
    name: "处理中",
  },
  {
    id: "AUDITING",
    name: "审核中",
  },
  {
    id: "ONLY_SELF_SEE",
    name: "仅自己可见",
  },
  {
    id: "ONLINE",
    name: "已上线",
  },
  {
    id: "FAILED",
    name: "失败",
  },
  {
    id: "TRANSCODE_FAILED",
    name: "转码失败",
  },
  {
    id: "OVER_MAX_RETRY",
    name: "超过重试次数",
  },
  {
    id: "INTERNAL_ERROR",
    name: "内部错误",
  },
  {
    id: "SKIP",
    name: "跳过",
  },
  {
    id: "UNKNOWN",
    name: "未知错误",
  },
  {
    id: "OTHER",
    name: "其他",
  },
];
