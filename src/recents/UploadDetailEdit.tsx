import { Edit, SaveButton, SimpleForm, TextInput, Toolbar } from "react-admin";

const UploadDetailEdit = () => {
  return (
    <Edit>
      <SimpleForm
        toolbar={
          <Toolbar>
            <SaveButton />
          </Toolbar>
        }
      >
        <TextInput fullWidth disabled label="id" source="id" />
        <TextInput disabled label="subscribeId" source="subscribeId" />
        <TextInput disabled source="title" />
        <TextInput disabled source="userId" />
        <TextInput source="uploadName" />
      </SimpleForm>
    </Edit>
  );
};

export default UploadDetailEdit;
