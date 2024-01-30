import * as React from 'react';
import {
    BooleanField,
    Show,
    SimpleShowLayout,
    TextField,
    TranslatableFields,
} from 'react-admin'; // eslint-disable-line import/no-unresolved

const TagShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <TranslatableFields locales={['en', 'fr']}>
                <TextField source="name" />
            </TranslatableFields>
            <BooleanField source="published" />
        </SimpleShowLayout>
    </Show>
);

export default TagShow;
