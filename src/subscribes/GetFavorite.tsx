import { FormControl, IconButton, MenuItem, TextField } from "@mui/material";
import { useDataProvider, useNotify } from "react-admin";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";

const GetFavorite = ({ setTargetId }: { setTargetId: any }) => {
  const [uid, setUid] = useState("451618887");
  const [favList, setFavList] = useState<any[]>([]);
  const dataProvider = useDataProvider();
  const notify = useNotify();

  const SearchButton = () => (
    <IconButton
      onClick={() => {
        dataProvider
          .getUserFavoriteList("getSubscribe", { uid })
          .then(({ data }: any) => {
            console.log(data);
            setFavList(data.data.list);
            setTargetId(data.data.list[0].id);
            notify("设置目标id成功");
          });
      }}
    >
      <SearchIcon />
    </IconButton>
  );

  return (
    <Box margin="10px">
      <TextField
        onChange={(event) => {
          setUid(event.currentTarget.value);
        }}
        variant="outlined"
        defaultValue={uid}
        label="请输入用户uid"
        fullWidth={true}
        InputProps={{ endAdornment: <SearchButton /> }}
      />
      <FormControl fullWidth>
        <InputLabel id="选择收藏夹">选择收藏夹</InputLabel>
        <Select
          label="选择收藏夹"
          variant="outlined"
          onChange={(event) => {
            setTargetId(event.target.value);
            notify("设置目标id成功");
          }}
          defaultValue={""}
        >
          {favList.map((value) => {
            return (
              <MenuItem key={value.id} value={value.id}>
                {value.title}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
};

export default GetFavorite;
