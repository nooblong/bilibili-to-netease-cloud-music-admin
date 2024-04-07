import { ReactElement } from "react";
import { Card, CardContent } from "@mui/material";
import {
  ArrayInput,
  BooleanInput,
  DateTimeInput,
  DeleteButton,
  EditContextProvider,
  required,
  SaveButton,
  SelectInput,
  SimpleForm,
  SimpleFormIterator,
  TextField,
  TextInput,
  Title,
  Toolbar,
  ToolbarClasses,
  useEditController,
  useGetIdentity,
  useGetOne,
} from "react-admin";
import { useFormContext, useWatch } from "react-hook-form";
import { SubscribeTypeEnum, VideoOrderEnum } from "./Enums";
import GetCollection from "./GetCollection";
import GetUp from "./GetUp";
import { parseDatetime } from "../dataProvider";
import GetFavorite from "./GetFavorite";
import GetPart from "./GetPart";
import { toChoice } from "../recents/UploadDetailCreate";
import moment from "moment/moment";
import Typography from "@mui/material/Typography";

const SubscribeEdit = (props: any) => {
  const controllerProps = useEditController(props);
  const { resource, record } = controllerProps;

  const MyForm = () => {
    const context = useFormContext();
    const watchType = useWatch({ name: "type" });
    const { data } = useGetOne(
      "voiceList",
      { id: 1 },
      { retry: false, staleTime: Infinity }
    );
    const identity = useGetIdentity();
    const data1 = identity.data;
    return (
      <>
        <Card sx={{ width: "100%" }}>
          <CardContent>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              订阅日志
            </Typography>
            <Typography
              variant="body2"
              sx={{ whiteSpace: "pre-line", overflowY: "auto" }}
              maxHeight={200}
            >
              <TextField source="log"></TextField>
            </Typography>
          </CardContent>
        </Card>
        <TextInput
          source="id"
          fullWidth
          InputProps={{ disabled: true }}
          variant="outlined"
        />
        <TextInput source="remark" fullWidth label="备注" variant="outlined" />
        <SelectInput
          defaultValue={""}
          source="videoOrder"
          label="选择上传顺序"
          choices={VideoOrderEnum}
          validate={required("Required field")}
          variant="outlined"
          fullWidth
        ></SelectInput>
        <SelectInput
          defaultValue={""}
          source="voiceListId"
          variant="outlined"
          label="选择播客"
          choices={data && data.voiceList ? toChoice(data.voiceList.list) : []}
          fullWidth
          validate={required("Required field")}
        ></SelectInput>
        <SelectInput
          defaultValue={""}
          variant="outlined"
          source="type"
          label="订阅类型"
          choices={SubscribeTypeEnum}
          validate={required("Required field")}
          fullWidth
        ></SelectInput>
        {showAction(watchType, (targetId: any) => {
          console.log(targetId);
          context.setValue("targetId", targetId);
        })}
        <TextInput
          source="targetId"
          // validate={required('Required field')}
          label="目标id(不建议手动填写)"
          variant="outlined"
          fullWidth
        />
        <TextInput
          source="keyWord"
          fullWidth
          label="过滤关键词"
          variant="outlined"
        />
        <BooleanInput
          source="crack"
          variant="outlined"
          fullWidth
          label="绕过版权检测"
          disabled={data1 && data1.fullName !== "admin"}
        />
        <BooleanInput
          source="useVideoCover"
          label="使用视频封面，取消则为播客默认封面"
          variant="outlined"
          defaultValue
          fullWidth
        />
        <BooleanInput
          source={"checkPart"}
          label={"遇到多p视频上传全部part(严重消耗网络非必要不打开)"}
          variant={"outlined"}
          fullWidth
        />
        <TextInput
          source="limitSec"
          validate={required("Required field")}
          label="限制时长(秒)"
          variant="outlined"
          fullWidth
        />
        <p>
          上次处理时间,处理完实时更新,设置为当前时间则不处理以前视频,要上传以前所有视频可以设置为和下面开始时间一样
        </p>
        <DateTimeInput
          parse={parseDatetime}
          source="processTime"
          defaultValue={moment(new Date()).format("YYYY-MM-DD HH:mm:ss")}
          label="上次处理时间"
          variant="outlined"
          disabled={watchType === "PART"}
          fullWidth
        />
        {watchType !== "PART" && (
          <>
            <DateTimeInput
              parse={parseDatetime}
              source="fromTime"
              defaultValue={moment("1970-01-01 00:00:00").format(
                "YYYY-MM-DD HH:mm:ss"
              )}
              label="开始时间, 不会处理这个时间前的视频"
              fullWidth
              variant="outlined"
            />
            <DateTimeInput
              parse={parseDatetime}
              source="toTime"
              defaultValue={moment("2077-01-01 00:00:00").format(
                "YYYY-MM-DD HH:mm:ss"
              )}
              label="结束时间, 不会处理这个时间后的视频"
              variant="outlined"
              fullWidth
            />
          </>
        )}
        <p>
          {"使用大括号加序号来获取下面的变量: 例如歌名是:「2000.29.92《阿肝(again)》」, 自定义上传名称填:「你好{1}世界」," +
            "下面添加一个序号为1内容为「\\《(.*?)\\》」, 上传时会将名字变为: 「你好阿肝(again)世界」, 如果是多p视频, 则对「视频名-分p名」进行正则匹配"}
        </p>
        <TextInput
          source="regName"
          label="自定义上传名称，可以不填，填了则下面必须增加至少一项"
          fullWidth
          variant="outlined"
        />
        <ArrayInput
          source="subscribeRegs"
          label="用于自定义上传名称, 对视频名字匹配正则"
        >
          <SimpleFormIterator inline>
            <TextInput source="regex" helperText={false} label="正则表达式" />
            <TextInput
              source="pos"
              helperText={false}
              variant="outlined"
              label="序号，只能为数字"
            />
          </SimpleFormIterator>
        </ArrayInput>
        <BooleanInput source="enable" label="启用" disabled fullWidth />
      </>
    );
  };

  return (
    <EditContextProvider value={controllerProps}>
      <Title defaultTitle={controllerProps.defaultTitle} />
      <SimpleForm
        toolbar={
          <Toolbar>
            <div className={ToolbarClasses.defaultToolbar}>
              <SaveButton
                label="提交"
                type="button"
                variant="text"
                alwaysEnable
                transform={(data) => ({
                  ...data,
                  crack: data.crack ? 1 : 0,
                  useVideoCover: data.useVideoCover ? 1 : 0,
                  checkPart: data.checkPart ? 1 : 0,
                })}
              />
              <DeleteButton resource={resource} />
            </div>
          </Toolbar>
        }
        resource={resource}
        record={record}
        // onSubmit={save}
        warnWhenUnsavedChanges
      >
        <MyForm />
      </SimpleForm>
    </EditContextProvider>
  );
};

function showAction(type: string, setTargetId: any): ReactElement {
  switch (type) {
    case "UP":
      return (
        <Card sx={{ width: "100%" }} elevation={10}>
          <GetUp setTargetId={setTargetId} />
        </Card>
      );
    case "COLLECTION":
      return (
        <Card sx={{ width: "100%" }} elevation={10}>
          <GetCollection setTargetId={setTargetId} />
        </Card>
      );
    case "FAVORITE":
      return (
        <Card sx={{ width: "100%" }} elevation={10}>
          <GetFavorite setTargetId={setTargetId} />
        </Card>
      );
    case "PART":
      return (
        <Card sx={{ width: "100%" }} elevation={10}>
          <GetPart setTargetId={setTargetId} />
        </Card>
      );
    default:
      return (
        <Card sx={{ width: "100%" }} elevation={10}>
          <>未知类型</>
        </Card>
      );
  }
}

export default SubscribeEdit;
