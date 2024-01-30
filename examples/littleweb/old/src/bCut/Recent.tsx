import * as React from "react";
import { type ReactElement, useEffect, useState } from "react";
import { get } from "../util/request";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { Avatar, ListItemAvatar, TablePagination } from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

export default function (): ReactElement {
    const [pageData, setPageData] = useState<any[]>([])
    const [page, setPage] = React.useState(0)
    const [rowsPerPage, setRowsPerPage] = React.useState(10)
    const [total, setTotal] = useState(0)

    async function getData(page: number, rowsPerPage: number): Promise<void> {
        const api = await get(`/api/data/recent?pageNo=${page + 1}&pageSize=${rowsPerPage}`)
        console.log(api)
        setTotal(api.data.total)
        setPageData(api.data.records.map((i: any) => {
            if (i.displayStatus === 'AUDITING') {
                i.display = '审核中'
                i.color = 'red'
            } else if (i.displayStatus === 'ONLY_SELF_SEE') {
                i.display = '仅自己可见'
                i.color = 'purple'
            } else if (i.displayStatus === 'ONLINE') {
                i.display = '已发布'
                i.color = 'green'
            } else if (i.displayStatus === 'FAILED') {
                i.display = '发布失败！'
                i.color = 'red'
            } else {
                i.display = '状态: ' + i.displayStatus
                i.color = 'black'
            }
            return i
        }))
    }

    useEffect(() => {
        void getData(page, rowsPerPage)
    }, [])

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number
    ): void => {
        setPage(newPage)
        void getData(newPage, rowsPerPage)
    }

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ): void => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
        void getData(0, parseInt(event.target.value, 10))
    }

    return (
        <>
            <p>最近上传</p>
            {pageData.map((value, index) => {
                return <List key={value.id} sx={{
                    width: '100%',
                    maxWidth: '100%',
                    bgcolor: 'background.paper'
                }}>
                    <ListItem key={value.id} alignItems="flex-start">
                        <ListItemAvatar>
                            <Avatar alt={value.userName}/>
                        </ListItemAvatar>
                        <ListItemText
                            primary={value.name}
                            secondary={
                                <React.Fragment>
                                    <Typography
                                        sx={{display: 'inline'}}
                                        component="span"
                                        variant="body2"
                                        color={value.color}
                                    >
                                        {value.display}
                                    </Typography>
                                    &nbsp;&nbsp;&nbsp;创建时间:{value.createTime}
                                </React.Fragment>
                            }
                        />
                    </ListItem>
                    <Divider variant="inset" component="li"/>
                </List>
            })}
            <TablePagination
                labelDisplayedRows={({
                                         from,
                                         to,
                                         count
                                     }) => `${from}-${to}共${count}`}
                labelRowsPerPage='每页'
                component="div"
                count={total}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </>
    )
}
