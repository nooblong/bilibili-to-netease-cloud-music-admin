import React, { useEffect, useState } from "react";
import { Pie } from "@ant-design/plots";
import { get } from "../util/request";
import { Bar } from "@ant-design/plots/lib";

export default function Welcome() {
    const [res, setRes] = useState<any>({
        sysFreeNum: 0,
        diskUseNum: 0,
        registerNum: 0,
        addQueueNum: 0,
        downloadFileNum: 0,
    });
    useEffect(() => {
        get('/api/data/info').then(value => {
            setRes(value.data);
        });
    }, []);
    return (
        <>
            <DemoPie res={res} />
            <DemoBar res={res} />
        </>
    );
}

const DemoPie = function ({ res }: any) {
    const data = [
        {
            type: '磁盘剩余Mb',
            value: res.sysFreeNum,
        },
        {
            type: '系统使用Mb',
            value: res.diskUseNum,
        },
    ];
    const config = {
        data,
        appendPadding: 10,
        angleField: 'value',
        colorField: 'type',
        radius: 0.8,
        label: {
            type: 'outer',
        },
        interactions: [
            {
                type: 'element-active',
            },
        ],
    };

    return <Pie {...config} />;
};

const DemoBar = ({ res }: any) => {
    const data = [
        {
            year: '注册人数',
            value: res.registerNum,
        },
        {
            year: '上传网易次数',
            value: res.addQueueNum,
        },
        {
            year: '下载视频数',
            value: res.downloadFileNum,
        },
    ];
    const config: any = {
        data,
        xField: 'value',
        yField: 'year',
        seriesField: 'year',
        legend: {
            position: 'top-left',
        },
    };
    return <Bar {...config} />;
};
