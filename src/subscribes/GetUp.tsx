import { Box, IconButton, TextField } from "@mui/material";
import { useDataProvider, useNotify } from "react-admin";
import { ReactElement, useState } from "react";
import { parseImgUrl } from "../dataProvider";
import SearchIcon from "@mui/icons-material/Search";

const GetUp = ({ setTargetId }: any): ReactElement => {
  const [url, setUrl] = useState(
    "https://www.bilibili.com/video/BV1yH4y1R78K/"
  );
  const dataProvider = useDataProvider();
  const [collectionInfo, setCollectionInfo] = useState<any>();
  const notify = useNotify();

  const SearchButton = () => (
    <IconButton
      onClick={() => {
        if (url === null || url === "") {
          notify("填写url！");
          return;
        }
        dataProvider
          .getVideoInfo("getVideoInfo", { bvid: url })
          .then(({ data: videoData }: any) => {
            console.log(videoData);
            if (videoData === null) {
              notify("找不到合集");
            }
            dataProvider
              .getUserInfo("getUserInfo", {
                uid: videoData.uid,
              })
              .then(({ data }: any) => {
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
      <SearchIcon />
    </IconButton>
  );

  return (
    <Box margin="10px">
      <TextField
        variant="outlined"
        onChange={(event) => {
          setUrl(event.currentTarget.value);
        }}
        defaultValue={url}
        label="请输入一个该用户的视频的bvid或链接"
        fullWidth={true}
        InputProps={{ endAdornment: <SearchButton /> }}
      />
      <img
        src={collectionInfo == null ? "" : parseImgUrl(collectionInfo.face)}
        alt=""
      />
      {collectionInfo == null ? "" : collectionInfo.name}
    </Box>
  );
};

export default GetUp;
