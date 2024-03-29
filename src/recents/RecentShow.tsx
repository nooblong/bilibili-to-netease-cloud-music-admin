import {
  Create,
  EditContextProvider,
  Loading,
  required,
  SaveButton,
  SelectInput,
  SimpleForm,
  TextInput,
  Title,
  Toolbar,
  ToolbarClasses,
  useDataProvider,
  useEditController,
  useGetOne,
  useNotify,
  useRedirect,
} from "react-admin";
import { toChoice } from "./RecentCreate";
import { Link, useParams } from "react-router-dom";
import {
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Pagination,
  Stack,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useState } from "react";

const RecentShow = () => {
  const redirect = useRedirect();
  const params = useParams();
  const voiceDetailId = params.id;
  const notify = useNotify();
  const dataProvider = useDataProvider();
  const [logData, setLogData] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [success, setSuccess] = useState(false);
  const controllerProps = useEditController({
    resource: "uploadDetail",
    id: params.id,
  });
  console.log(controllerProps);

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
            console.log(data);
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

  const buttons = [
    <Button key="one" disabled={!success}>
      <Link
        style={{ textDecoration: "none", color: "inherit" }}
        to={`https://music.163.com/#/program?id=${
          success ? uploadDetail.data.voiceId : -1
        }`}
      >
        跳转到网易云
      </Link>
    </Button>,
    <Button key="two">Two</Button>,
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
      <EditContextProvider value={controllerProps}>
        <Title defaultTitle={controllerProps.defaultTitle} />
        <Card sx={{ marginTop: "1em" }}>
          <CardContent>编辑用于重新上传</CardContent>
          <SimpleForm
            toolbar={
              <Toolbar>
                <div className={ToolbarClasses.defaultToolbar}>
                  <SaveButton
                    label="提交"
                    type="button"
                    variant="text"
                    mutationOptions={{
                      onSuccess: (response: any) => {
                        console.log(response);
                        notify(response.message);
                        redirect("/recentsList");
                      },
                    }}
                  />
                </div>
              </Toolbar>
            }
            resource={""}
            record={controllerProps.record}
            warnWhenUnsavedChanges
          >
            <TextInput source="uploadName" fullWidth label="上传名字" />
          </SimpleForm>
        </Card>
      </EditContextProvider>
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

export default RecentShow;
