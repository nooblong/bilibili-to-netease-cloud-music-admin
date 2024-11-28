import { useState } from "react";
import { IconButton, TextField } from "@mui/material";
import { useDataProvider, useNotify } from "react-admin";
import SearchIcon from "@mui/icons-material/Search";
import { parseImgUrl } from "../common";

const GetCollection = ({ setTargetId }: { setTargetId: any }) => {
  const [url, setUrl] = useState(
    "1869296"
  );
  const [collectionInfo, setCollectionInfo] = useState<any>();
  const dataProvider = useDataProvider();
  const notify = useNotify();

  const SearchButton = () => (
    <IconButton
      onClick={() => {
        if (url === null || url === "") {
          notify("填写sid！");
          return;
        }
        dataProvider
          .get("bilibili/getOldSeriesInfo", { id: url })
          .then(({ data }: any) => {
            if (data.code !== -1) {
              setCollectionInfo(data.data);
              setTargetId(data.data.series_id);
              notify("已更新目标id");
            } else {
              notify("b站抽风接口，再点一下-.-'");
            }
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
        如何获取sid：电脑进入个人主页-》合集和列表-》点击旧合集
        <img src={"oldCollectionIcon.png"} alt={""}/>
        检查网址：https://www.bilibili.com/list/11073?sid=<span style={{color: "red"}}>1869296</span>&desc=1&oid=823216201&bvid=BV1zg4y1t761
        -》获取sid
        </p>
      <TextField
        fullWidth
        variant="outlined"
        sx={{ width: "100%" }}
        onChange={(event) => {
          setUrl(event.currentTarget.value);
        }}
        label="输入sid后点击右侧搜索"
        defaultValue={url}
        InputProps={{ endAdornment: <SearchButton /> }}
      />
      {collectionInfo == null ? "" : collectionInfo.name + " , 数量： " + collectionInfo.total}
    </>
  );
};

export default GetCollection;
