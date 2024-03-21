import * as React from 'react';
import {useEffect} from 'react';
import {
    Create,
    required,
    SaveButton,
    SelectInput,
    SimpleForm,
    TextField,
    TextInput,
    Toolbar,
    useCreate,
    useGetOne,
    useNotify,
    useRedirect
} from 'react-admin';
import {Card} from '@mui/material';
import {toChoice} from './RecentCreate';
import {useParams} from 'react-router-dom';

const RecentShow = () => {
    const redirect = useRedirect();
    const params = useParams();
    const voiceDetailId = params.id;
    const [create] = useCreate();
    const notify = useNotify();

    const { data: detail, isLoading } = useGetOne(
        'uploadDetail',
        { id: voiceDetailId },
        { onError: () => redirect('/recentsList') }
    );

    const { data, error } = useGetOne(
        'voiceList',
        { id: 1 },
        { retry: false, staleTime: Infinity }
    );
    useEffect(() => {
        if (data === null || data?.voiceList === null) {
            redirect('/loginNetmusic');
        }
        return () => {};
    }, [data, redirect]);

    const RecentToolbar = () => (
        <Toolbar>
            <SaveButton
                label="提交"
                type="button"
                variant="text"
                alwaysEnable
                mutationOptions={{
                    onSuccess: data => {
                        notify(data.data.message, {
                            type: 'info',
                            messageArgs: { smart_count: 1 },
                        });
                        redirect('list', 'recentsList', data.id);
                    },
                }}
            />
        </Toolbar>
    );

    const MyForm = () => {
        return (
            <>
                <p>上传这首歌到自己的播客</p>
                <SelectInput
                    source="voiceListId"
                    label="选择播客"
                    choices={
                        data && data.voiceList
                            ? toChoice(data.voiceList.list)
                            : []
                    }
                    validate={required('Required field')}
                ></SelectInput>
                <TextInput
                    source="voiceDetailId"
                    defaultValue={voiceDetailId}
                    disabled
                />
                <TextField
                    source="uploadName"
                    label="名字"
                    record={detail}
                    disabled
                />
            </>
        );
    };

    return (
        <Create resource={'addToMy'}>
            <Card sx={{ marginTop: '1em', maxWidth: '30em' }}>
                <SimpleForm toolbar={<RecentToolbar />}>
                    <MyForm />
                </SimpleForm>
            </Card>
        </Create>
    );
};

export default RecentShow;
