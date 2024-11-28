import { useState } from "react";
import { IconButton, TextField } from "@mui/material";
import { useDataProvider, useNotify } from "react-admin";
import SearchIcon from "@mui/icons-material/Search";
import { parseImgUrl } from "../common";

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
              }).catch((err: Error) => {
                notify(err.message);
            });
          }).catch((err: Error) => {
            notify(err.message);
        });
      }}
    >
      <SearchIcon />
    </IconButton>
  );

  return (
    <>
        <p>
            订阅合集会正序和倒序都查找一遍是否存在新视频，放中间就gg
            <br/>
            什么是合集：电脑进入个人主页-》合集和列表-》
            这是合集：<img  src={"collectionIcon.png"} alt={""}/>
            <br/>
            这是旧合集，前往旧合集订阅：<img src={"oldCollectionIcon.png"} alt={""}/>
        </p>
      <TextField
        fullWidth
        variant="outlined"
        sx={{ width: "100%" }}
        onChange={(event) => {
          setUrl(event.currentTarget.value);
        }}
        label="输入一个包含于合集的视频的bvid或链接后点击右侧搜索"
        defaultValue={url}
        InputProps={{ endAdornment: <SearchButton /> }}
      />
      <img
        width="100px"
        src={collectionInfo == null ? "" : parseImgUrl(collectionInfo.cover)}
        alt=""
      />
      {collectionInfo == null ? "" : collectionInfo.title + " , 数量：" + collectionInfo.media_count}
    </>
  );
};

export default GetCollection;
