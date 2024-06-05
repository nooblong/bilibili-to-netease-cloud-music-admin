import { useState } from "react";
import { IconButton, TextField } from "@mui/material";
import { useDataProvider, useNotify } from "react-admin";
import { parseImgUrl } from "../dataProvider";
import Box from "@mui/material/Box";
import SearchIcon from "@mui/icons-material/Search";

const GetCollection = ({ setTargetId }: { setTargetId: any }) => {
  const [url, setUrl] = useState(
    "https://www.bilibili.com/video/BV1yH4y1R78K/"
  );
  const [collectionInfo, setCollectionInfo] = useState<any>();
  const dataProvider = useDataProvider();
  const notify = useNotify();

  const SearchButton = () => (
    <IconButton
      onClick={() => {
        if (url === null || url === "") {
          notify("填写url！");
          return;
        }
        dataProvider
          .get("bilibili/getSeriesIdByBvid", { url: url })
          .then(({ data }: any) => {
            if (data === null) {
              notify("找不到合集");
            }
            dataProvider
              .get("bilibili/getSeriesInfo", { id: data })
              .then(({ data }: any) => {
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
      <SearchIcon />
    </IconButton>
  );

  return (
    <>
      <TextField
        fullWidth
        variant="outlined"
        sx={{ width: "100%" }}
        onChange={(event) => {
          setUrl(event.currentTarget.value);
        }}
        label="请输入一个包含于合集的视频的bvid或链接"
        defaultValue={url}
        InputProps={{ endAdornment: <SearchButton /> }}
      />
      <img
        width="100%"
        src={collectionInfo == null ? "" : parseImgUrl(collectionInfo.cover)}
        alt=""
      />
      {collectionInfo == null ? "" : collectionInfo.title}
    </>
  );
};

export default GetCollection;
