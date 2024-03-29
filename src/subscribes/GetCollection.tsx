import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import { useDataProvider, useNotify } from "react-admin";
import { parseImgUrl } from "../dataProvider";
import Box from "@mui/material/Box";

export default function ({ setTargetId }) {
  const [url, setUrl] = useState(
    "https://www.bilibili.com/video/BV1yH4y1R78K/"
  );
  const [collectionInfo, setCollectionInfo] = useState<any>();
  const dataProvider = useDataProvider();
  const notify = useNotify();
  return (
    <Box margin="10px">
      <TextField
        fullWidth
        sx={{ width: "100%" }}
        onChange={(event) => {
          setUrl(event.currentTarget.value);
        }}
        label="请输入一个包含于合集的视频的bvid或链接"
        defaultValue={url}
      />
      <Button
        variant="contained"
        onClick={() => {
          if (url === null || url === "") {
            notify("填写url！");
            return;
          }
          dataProvider
            .getSeriesIdByUrl("getSeriesInfo", { url })
            .then(({ data }) => {
              if (data === null) {
                notify("找不到合集");
              }
              dataProvider
                .getSeriesInfo("getSeriesInfo", { id: data })
                .then(({ data }) => {
                  if (data.code !== -1) {
                    setCollectionInfo(data.data);
                    setTargetId(data.data.id);
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
        src={collectionInfo == null ? "" : parseImgUrl(collectionInfo.cover)}
        alt=""
      />
      {collectionInfo == null ? "" : collectionInfo.title}
    </Box>
  );
}
