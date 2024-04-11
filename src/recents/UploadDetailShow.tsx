import {
  Create,
  Loading,
  required,
  SaveButton,
  SelectInput,
  SimpleForm,
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
  Pagination,
  Stack,
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
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [success, setSuccess] = useState(false);
  // const controllerProps = useEditController({
  //   resource: "uploadDetail",
  //   id: params.id,
  // });

  const uploadDetail: any = useGetOne(
    "uploadDetail",
    {
      id: voiceDetailId,
    },
    {
      onSuccess: (data1) => {
        dataProvider
          .instanceLog(data1.instanceId, page - 1)
          .then((data: any) => {
            setLogData(data.data);
            setTotalPage(data.data.totalPages);
            setPage(data.data.index + 1);
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
        const result = dataProvider.getOne("uploadDetail/restartJob", {
          id: voiceDetailId,
        });
        result
          .then(() => {
            notify("ok", { type: "success" });
          })
          .catch((reason) => {
            notify(reason.toString(), { type: "error" });
          });
      }}
    >
      重新上传
    </Button>,
    <Button key="three">Three</Button>,
  ];

  const MyForm = () => {
    return (
      <>
        <Typography>上传这首歌到自己的播客</Typography>
        <SelectInput
          source="voiceListId"
          label="选择播客"
          fullWidth
          defaultValue={""}
          choices={data && data.voiceList ? toChoice(data.voiceList.list) : []}
          validate={required("Required field")}
          variant="outlined"
        ></SelectInput>
      </>
    );
  };

  return (
    <>
      <Create resource={"addToMy"}>
        <SimpleForm toolbar={<></>}>
          <MyForm />
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
      <hr />
      <ButtonGroup size="large" fullWidth aria-label="Large button group">
        {buttons}
      </ButtonGroup>
      <hr />
      <Card>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            上传日志
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
            {logData === null ? <Loading /> : logData.data}
          </Typography>
          <Stack spacing={2}>
            <Typography>
              Page: {page} TotalPage: {totalPage}
            </Typography>
            <Pagination
              count={totalPage}
              page={page}
              onChange={(event, page) => {
                setPage(page);
              }}
            />
          </Stack>
        </CardContent>
      </Card>
    </>
  );
};

export default UploadDetailShow;
