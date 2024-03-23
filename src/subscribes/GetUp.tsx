import { Button, TextField } from "@mui/material";
import { parseImgUrl } from "../dataProvider";
import React, { ReactElement, useState } from "react";
import { useDataProvider, useNotify } from "react-admin";
import Box from "@mui/material/Box";

export default function ({ setTargetId }): ReactElement {
  const [url, setUrl] = useState(
    "https://www.bilibili.com/video/BV1yH4y1R78K/"
  );
  const dataProvider = useDataProvider();
  const [collectionInfo, setCollectionInfo] = useState<any>();
  const notify = useNotify();
  return (
    <Box margin="10px">
      <TextField
        onChange={(event) => {
          setUrl(event.currentTarget.value);
        }}
        defaultValue={url}
        label="请输入一个该用户的视频的bvid或链接"
        fullWidth={true}
      />
      <Button
        variant="contained"
        onClick={() => {
          if (url === null || url === "") {
            notify("填写url！");
            return;
          }
          dataProvider
            .getVideoInfo("getVideoInfo", { bvid: url })
            .then(({ data: videoData }) => {
              console.log(videoData);
              if (videoData === null) {
                notify("找不到合集");
              }
              dataProvider
                .getUserInfo("getUserInfo", {
                  uid: videoData.uid,
                })
                .then(({ data }) => {
                  if (data.code !== -1) {
                    setCollectionInfo(data.data);
                    setTargetId(videoData.uid);
                    notify("已更新目标id");
                  } else {
                    notify("b站抽风接口，再点一下-.-'");
                  }
                });
            });
        }}
      >
        解析
      </Button>
      <img
        width="100%"
        src={collectionInfo == null ? "" : parseImgUrl(collectionInfo.face)}
        alt=""
      />
      {collectionInfo == null ? "" : collectionInfo.name}
    </Box>
  );
}
