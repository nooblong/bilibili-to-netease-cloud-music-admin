import {
  Button,
  Card,
  CardContent,
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
import { Loading, TextInput, useDataProvider } from "react-admin";
import SearchIcon from "@mui/icons-material/Search";

export default GetBvid;

function GetBvid({ videoInfo, setVideoInfo }: any) {
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
        dataProvider
          .getVideoInfo("getVideoInfo", { bvid: bvid })
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
    <Box width={"100%"}>
      <TextField
        source="bvid"
        variant="outlined"
        onChange={(event) => {
          setBvid(event.currentTarget.value);
        }}
        multiline
        fullWidth
        defaultValue={videoInfo.bvid}
        label="输入bvid或url后点击解析"
        InputProps={{ endAdornment: <SearchButton /> }}
      />
      <br />
      {loading && <Loading />}
      {videoInfo.title && (
        <Card>
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
                <InputLabel id="选择分p,默认1p">选择分p,默认1p</InputLabel>
                <Select
                  labelId="选择分p,默认1p"
                  id="demo-simple-select"
                  value={videoInfo.cid}
                  label="选择分p,默认1p"
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
            </Box>
          )}
        </Card>
      )}
    </Box>
  );
}
