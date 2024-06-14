import {
  Create,
  Loading,
  NumberInput,
  required,
  SaveButton,
  SelectInput,
  SimpleForm,
  TextInput,
  useDataProvider,
  useGetOne,
  useNotify,
  useRedirect,
} from "react-admin";
import { toChoice } from "./UploadDetailCreate";
import { useParams } from "react-router-dom";
import {
  Button,
  ButtonGroup,
  Card,
  CardContent,
  TextField,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { useState } from "react";

const UploadDetailShow = () => {
  const redirect = useRedirect();
  const params = useParams();
  const voiceDetailId = params.id;
  const notify = useNotify();
  const dataProvider = useDataProvider();
  const [logData, setLogData] = useState<any>(null);
  const [success, setSuccess] = useState(false);

  const uploadDetail: any = useGetOne(
    "uploadDetail",
    {
      id: voiceDetailId,
    },
    {
      onSuccess: (data1) => {
        dataProvider.get(`uploadDetail/${data1.id}`, {}).then((data: any) => {
          setLogData(data.data.log);
          setSuccess(true);
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

  const buttons = [
    <Button
      key="one"
      disabled={!success}
      onClick={() => {
        window.open(
          `https://music.163.com/#/program?id=${
            success ? uploadDetail.data.voiceId : -1
          }`,
          "_blank"
        );
      }}
    >
      跳转到网易云
    </Button>,
    <Button
      key="two"
      onClick={() => {
        const result = dataProvider.get(
          `uploadDetail/restartJob/${voiceDetailId}`,
          {}
        );
        result
          .then(() => {
            notify("ok", { type: "success" });
          })
          .catch((reason: any) => {
            notify(reason.toString(), { type: "error" });
          });
      }}
    >
      重新上传
    </Button>,
  ];

  return (
    <>
      <Create resource={"addToMy"}>
        <SimpleForm toolbar={<></>}>
          上传到自己的播客
          <SelectInput
            source="voiceListId"
            label="选择播客"
            fullWidth
            defaultValue={""}
            choices={
              data && data.voiceList ? toChoice(data.voiceList.list) : []
            }
            validate={required("Required field")}
            variant="outlined"
          ></SelectInput>
          上传id
          <NumberInput
            source={"voiceDetailId"}
            disabled
            variant={"outlined"}
            defaultValue={Number(voiceDetailId)}
            value={Number(voiceDetailId)}
          ></NumberInput>
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
                redirect("list", "uploadDetail", data.id);
              },
            }}
          />
        </SimpleForm>
      </Create>
      <Card sx={{ marginTop: 1, marginBottom: 1 }}>
        <ButtonGroup size="large" fullWidth aria-label="Large button group">
          {buttons}
        </ButtonGroup>
      </Card>
      <Card>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            上传日志
          </Typography>
          <Typography>
            <TextField
              fullWidth
              variant={"outlined"}
              sx={{ overflowX: "auto" }}
              multiline
              value={logData === null ? <Loading /> : logData}
            ></TextField>
          </Typography>
        </CardContent>
      </Card>
    </>
  );
};

export default UploadDetailShow;
