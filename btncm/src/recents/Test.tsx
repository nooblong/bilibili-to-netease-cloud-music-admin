import * as React from 'react';
import { SelectInput, SimpleForm } from 'react-admin';
import { useForm, useWatch } from 'react-hook-form';
import { Button, TextInput } from 'ra-ui-materialui';

const countries = ['USA', 'UK', 'France'];
const cities = {
    USA: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'],
    UK: ['London', 'Birmingham', 'Glasgow', 'Liverpool', 'Bristol'],
    France: ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice'],
};
const toChoices = items => items.map(item => ({ id: item, name: item }));

const CityInput = () => {
    const country = useWatch({ name: 'country' });
    return (
        <SelectInput
            choices={country ? toChoices(cities[country]) : []}
            source="cities"
        />
    );
};

const MyTextInput = () => {
    const form = useForm();
    const country = useWatch({ name: 'country' });
    return (
        <>
            <TextInput source="asd" />
            <Button
                onClick={() => {
                    form.setValue('country2', 'fuck', { shouldDirty: true });
                }}
            >
                asd
            </Button>
        </>
    );
};

const Test = () => (
    // <Edit>
    <SimpleForm>
        <SelectInput source="country" choices={toChoices(countries)} />
        <TextInput source="country2" />
        <CityInput />
        <MyTextInput />
    </SimpleForm>
    // </Edit>
);

export default Test;
