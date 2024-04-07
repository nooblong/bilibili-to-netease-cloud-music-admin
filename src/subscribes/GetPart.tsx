import {
  CardContent,
  FormControl,
  IconButton,
  MenuItem,
  TextField,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import { useDataProvider, useNotify } from "react-admin";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";

const GetPart = ({ setTargetId }: { setTargetId: any }) => {
  const dataProvider = useDataProvider();
  // const [url, setUrl] = useState<string>();
  const notify = useNotify();
  const [videoInfo, setVideoInfo] = useState<any>({
    title: "",
    quality: [],
    image: "",
    // bvid: 'BV15a411M7r2', // single
    bvid: "BV1vQ4y1Y7h2", // multipart
    useQuality: "",
    pages: [],
    cid: "",
    partName: "",
  });
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
        dataProvider
          .getVideoInfo("getVideoInfo", { bvid: videoInfo.bvid })
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
            };
            setVideoInfo(obj);
            setTargetId(videoInfo.bvid);
            notify("设置目标id成功" + videoInfo.bvid);
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
        label="输入bvid或url"
        onChange={(event) => {
          setVideoInfo({
            ...videoInfo,
            bvid: event.currentTarget.value,
          });
        }}
        defaultValue={videoInfo.bvid}
        fullWidth
        sx={{ width: "100%" }}
        InputProps={{ endAdornment: <SearchButton /> }}
      />
      <br />

      {videoInfo.title && (
        <>
          {videoInfo.image !== "" && (
            <img width="100%" src={videoInfo.image} alt="" />
          )}
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              {videoInfo.title}
            </Typography>
          </CardContent>
          {videoInfo.pages.length > 1 && (
            <Box>
              <FormControl fullWidth>
                <InputLabel variant={"outlined"} id="选择分p,默认1p">
                  分p预览
                </InputLabel>
                <Select
                  defaultValue={""}
                  labelId="选择分p,默认1p"
                  id="demo-simple-select"
                  value={videoInfo.cid}
                  label="选择分p,默认1p"
                  onChange={handleChange}
                  variant={"outlined"}
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
            </Box>
          )}
        </>
      )}
      <Box sx={{ minWidth: 120 }}>预计分p数量: {videoInfo.pages.length}</Box>
    </Box>
  );
};

export default GetPart;
