import * as React from 'react';
import {useRecordContext, useTranslate} from 'react-admin';

export default () => {
    const translate = useTranslate();
    const record = useRecordContext();
    return (
        <>
            {record
                ? translate('post.edit.title', { title: record.title })
                : ''}
        </>
    );
};
