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
        <TextInput
          fullWidth
          disabled
          label="id"
          source="id"
          variant="outlined"
        />
        <TextInput
          fullWidth
          disabled
          label="subscribeId"
          source="subscribeId"
          variant="outlined"
        />
        <TextInput fullWidth disabled source="title" variant="outlined" />
        <TextInput fullWidth disabled source="userId" variant="outlined" />
        <TextInput fullWidth source="uploadName" variant="outlined" />
      </SimpleForm>
    </Edit>
  );
};

export default UploadDetailEdit;
