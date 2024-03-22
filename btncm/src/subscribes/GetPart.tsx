import {
    Button,
    CardContent,
    FormControl,
    MenuItem,
    TextField,
} from '@mui/material';
import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import { useDataProvider, useNotify } from 'react-admin';

export default function ({ setTargetId }) {
    const dataProvider = useDataProvider();
    // const [url, setUrl] = useState<string>();
    const notify = useNotify();
    const [videoInfo, setVideoInfo] = useState({
        title: '',
        quality: [],
        image: '',
        // bvid: 'BV15a411M7r2', // single
        bvid: 'BV1vQ4y1Y7h2', // multipart
        useQuality: '',
        pages: [],
        cid: '',
        partName: '',
    });
    const handleChange = (event): void => {
        if (videoInfo.pages.length > 1) {
            const obj = {
                ...videoInfo,
                cid: event.target.value,
                partName: videoInfo.pages.filter(
                    value => value.cid === event.target.value
                )[0].part,
            };
            setVideoInfo(obj);
        }
    };

    return (
        <>
            <TextField
                label="输入bvid或url"
                onChange={event => {
                    setVideoInfo({
                        ...videoInfo,
                        bvid: event.currentTarget.value,
                    });
                }}
                defaultValue={videoInfo.bvid}
                fullWidth
                sx={{ width: '100%' }}
            />
            <Button
                variant="contained"
                onClick={() => {
                    dataProvider
                        .getVideoInfo('getVideoInfo', { bvid: videoInfo.bvid })
                        .then(data => {
                            data = data.data;
                            const obj = {
                                ...videoInfo,
                                title: data.title,
                                image: data.image.replace(
                                    /^(http)s*(:\/\/)/,
                                    'https://images.weserv.nl/?url='
                                ),
                                pages: data.pages,
                                cid: videoInfo.cid,
                                partName: videoInfo.partName,
                            };
                            setVideoInfo(obj);
                            setTargetId(videoInfo.bvid);
                            notify('设置目标id成功' + videoInfo.bvid);
                        });
                }}
            >
                解析
            </Button>
            <br />

            {videoInfo.title && (
                <>
                    {videoInfo.image !== '' && (
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
                                <InputLabel id="选择分p,默认1p">
                                    分p预览
                                </InputLabel>
                                <Select
                                    labelId="选择分p,默认1p"
                                    id="demo-simple-select"
                                    value={videoInfo.cid}
                                    label="选择分p,默认1p"
                                    onChange={handleChange}
                                >
                                    {videoInfo.pages.map(value => {
                                        return (
                                            <MenuItem
                                                key={value.cid}
                                                value={value.cid}
                                            >
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
            <Box sx={{ minWidth: 120 }}>
                预计分p数量: {videoInfo.pages.length}
            </Box>
        </>
    );
}
