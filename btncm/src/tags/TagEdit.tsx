/* eslint react/jsx-key: off */
import * as React from 'react';
import {useParams} from 'react-router';
import {
    Datagrid,
    Edit,
    EditButton,
    List,
    required,
    ResourceContextProvider,
    SimpleFormConfigurable,
    TextField,
    TextInput,
    TranslatableInputs,
} from 'react-admin';

const TagEdit = () => {
    const { id } = useParams<'id'>();
    return (
        <>
            <Edit redirect="list">
                <SimpleFormConfigurable warnWhenUnsavedChanges>
                    <TextField source="id" />
                    <TranslatableInputs locales={['en', 'fr']}>
                        <TextInput source="name" validate={[required()]} />
                    </TranslatableInputs>
                </SimpleFormConfigurable>
            </Edit>
            <ResourceContextProvider value="posts">
                <List
                    hasCreate={false}
                    resource="posts"
                    filter={{ tags: [id] }}
                    title=" "
                >
                    <Datagrid>
                        <TextField source="id" />
                        <TextField source="title" />
                        <EditButton />
                    </Datagrid>
                </List>
            </ResourceContextProvider>
        </>
    );
};

export default TagEdit;
