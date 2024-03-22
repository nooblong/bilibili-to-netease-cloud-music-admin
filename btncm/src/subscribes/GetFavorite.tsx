import React, { useState } from 'react';
import { Button, FormControl, MenuItem, TextField } from '@mui/material';
import { useDataProvider, useNotify } from 'react-admin';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';

export default function ({ setTargetId }) {
    const [uid, setUid] = useState('451618887');
    const [mid, setMid] = useState<string>();
    const [favList, setFavList] = useState<any[]>([]);
    const dataProvider = useDataProvider();
    const notify = useNotify();
    return (
        <Box margin="10px">
            <TextField
                onChange={event => {
                    setUid(event.currentTarget.value);
                }}
                defaultValue={uid}
                label="请输入用户uid"
                fullWidth={true}
            />
            <Button
                variant="contained"
                onClick={() => {
                    dataProvider
                        .getUserFavoriteList('getSubscribe', { uid })
                        .then(({ data }) => {
                            console.log(data);
                            setFavList(data.data.list);
                            setMid(data.data.list[0].id);
                            setTargetId(data.data.list[0].id);
                            notify('设置目标id成功');
                        });
                }}
            >
                解析
            </Button>
            <FormControl fullWidth>
                <InputLabel id="选择收藏夹">选择收藏夹</InputLabel>
                <Select
                    id="demo-simple-select"
                    value={mid ?? ''}
                    label="选择收藏夹"
                    onChange={event => {
                        setMid(event.target.value);
                        setTargetId(event.target.value);
                        notify('设置目标id成功');
                    }}
                >
                    {favList.map(value => {
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
}
