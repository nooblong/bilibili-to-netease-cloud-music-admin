import {
  Checkbox,
  FormControl,
  IconButton,
  MenuItem,
  TextField,
} from "@mui/material";
import { useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import { Loading, useDataProvider } from "react-admin";
import SearchIcon from "@mui/icons-material/Search";

export default GetBvid;

function GetBvid({
  videoInfo,
  setVideoInfo,
}: {
  videoInfo: any;
  setVideoInfo: any;
}) {
  const dataProvider = useDataProvider();
  const [bvid, setBvid] = useState<string>(videoInfo.bvid);
  const [loading, setLoading] = useState(false);
  const handleChange = (event: any): void => {
    if (videoInfo.pages.length > 1) {
      const obj = {
        ...videoInfo,
        cid: event.target.value,
        partName: videoInfo.pages.filter(
          (value: any) => value.cid === event.target.value
        )[0].part,
      };
      setVideoInfo(obj);
    }
  };

  const SearchButton = () => (
    <IconButton
      onClick={() => {
        setLoading(true);
        let search: string = bvid;
        if (bvid.startsWith("[") || bvid.startsWith("【")) {
            const match = bvid.match(/https?:\/\/[^\s]+/);
            if (match) {
                setBvid(match[0]);
                search = match[0];
            }
        }
        dataProvider
          .get("bilibili/getVideoInfo", { bvid: search })
          .then((data: any) => {
            data = data.data;
            const obj = {
              ...videoInfo,
              title: data.title,
              image: data.image.replace(
                /^(http)s*(:\/\/)/,
                "https://images.weserv.nl/?url="
              ),
              pages: data.pages,
              cid: videoInfo.cid,
              partName: videoInfo.partName,
              bvid: bvid,
            };
            setVideoInfo(obj);
            setLoading(false);
          });
      }}
    >
      <SearchIcon />
    </IconButton>
  );

  return (
    <Box width={"100%"} sx={{ boxShadow: 0 }}>
      <TextField
        variant="outlined"
        onChange={(event) => {
          setBvid(event.currentTarget.value);
        }}
        multiline
        fullWidth
        defaultValue={videoInfo.bvid}
        label="输入bvid或长、短链接(自动提取)后点击右侧搜索"
        InputProps={{ endAdornment: <SearchButton /> }}
      />
      <br />
      {loading && <Loading />}
      {videoInfo.title && (
        <>
          {videoInfo.image !== "" && (
            <img width="100px" src={videoInfo.image} alt="" />
          )}
          <Typography variant="body2" color="text.secondary">
            {videoInfo.title}
          </Typography>
          <Checkbox checked={videoInfo.selectAll} onChange={() => {
              setVideoInfo({
                  ...videoInfo,
                  selectAll: !videoInfo.selectAll,
                  selected: videoInfo.pages
              })
          }}></Checkbox>全选分p
            {videoInfo.selectAll && <div>点击删除</div>}
            {videoInfo.selectAll && videoInfo.selected.map((i: any, index: number) => {
                // console.log(videoInfo.selected)
                    return <button key={i.cid} onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        console.log(videoInfo.selected)
                        setVideoInfo({
                            ...videoInfo,
                            selected: videoInfo.selected.filter((_:any, j:any) => {
                                return j != index
                            })
                        })
                    }}>{i.part}</button>;
                })
            }
          {videoInfo.pages.length > 1 && (
            <FormControl fullWidth disabled={videoInfo.selectAll}>
              <InputLabel id={"label"}>{videoInfo.cid == "" ? "选择分p" : null}</InputLabel>
              <Select
                variant={"outlined"}
                labelId={"label"}
                value={videoInfo.cid}
                onChange={handleChange}
              >
                {videoInfo.pages.map((value: any) => {
                  return (
                    <MenuItem key={value.cid} value={value.cid}>
                      {value.part}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          )}
        </>
      )}
    </Box>
  );
}
