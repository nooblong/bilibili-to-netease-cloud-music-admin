import {
  Create,
  Loading,
  required,
  SaveButton,
  SelectInput,
  SimpleForm,
  Toolbar,
  useDataProvider,
  useGetOne,
  useNotify,
  useRedirect,
} from "react-admin";
import { toChoice } from "./RecentCreate";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useState } from "react";

const RecentShow = () => {
  const redirect = useRedirect();
  const params = useParams();
  const voiceDetailId = params.id;
  const notify = useNotify();
  const dataProvider = useDataProvider();
  const [logData, setLogData] = useState(null);

  const uploadDetail: any = useGetOne(
    "uploadDetail",
    {
      id: voiceDetailId,
    },
    {
      onSuccess: (data1) => {
        dataProvider
          .instanceLog(data1.instanceId, 0)
          .then((data) => {
            // console.log(data);
            setLogData(data.data);
          });
      },
    }
  );

  const { data } = useGetOne(
    "voiceList",
    { id: 1 },
    {
      retry: false,
      staleTime: Infinity,
    }
  );

  const RecentToolbar = () => (
    <Toolbar>
      <SaveButton
        label="提交"
        type="button"
        variant="text"
        alwaysEnable
        mutationOptions={{
          onSuccess: (data) => {
            notify(data.data.message, {
              type: "info",
              messageArgs: { smart_count: 1 },
            });
            redirect("list", "recentsList", data.id);
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
          fullWidth
          choices={data && data.voiceList ? toChoice(data.voiceList.list) : []}
          validate={required("Required field")}
        ></SelectInput>
      </>
    );
  };

  return (
    <>
      <Create resource={"addToMy"}>
        <SimpleForm toolbar={<RecentToolbar />}>
          <MyForm />
        </SimpleForm>
      </Create>
      <hr />
      <Card>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            上传日志
          </Typography>
          <Typography variant="body2">
            {logData === null ? <Loading /> : logData.data}
          </Typography>
        </CardContent>
      </Card>
    </>
  );
};

export default RecentShow;
