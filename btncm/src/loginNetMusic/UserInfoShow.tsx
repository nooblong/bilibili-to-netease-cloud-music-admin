import { Paper } from '@mui/material';
import React, { ReactElement } from 'react';

export interface NetAccount {
    id: string;
    userName: string;
    userId: string;
    nickname: string;
    signature: string;
}

export default function (netAccount: NetAccount): ReactElement {
    return (
        <div>
            <Paper sx={{ fontSize: '10px' }}>
                id: {netAccount.id}
                <br />
                username: {netAccount.userName}
                <br />
                nickname: {netAccount.nickname}
                <br />
                signature: {netAccount.signature}
                <br />
            </Paper>
        </div>
    );
}
