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
import { parseDatetime } from "../common";
import GetFavorite from "./GetFavorite";
import GetPart from "./GetPart";
import { toChoice } from "../recents/UploadDetailCreate";
import moment from "moment/moment";
import Typography from "@mui/material/Typography";
import GetOldCollection from "./GetOldCollection";
import * as React from "react";

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
        {localStorage.getItem("user") === "admin" && (
          <BooleanInput
            source="crack"
            variant="outlined"
            fullWidth
            label="开启超能力"
            disabled={data1 && data1.fullName !== "admin2"}
          />
        )}
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
          defaultValue={"99999"}
          validate={required("Required field")}
          label="限制时长(秒)，不会上传超过这个的"
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
            <img src={"regex.png"} alt={""}/>
        </p>
        <p>
            {"如何自定义名称参考上图，若有分p则对【分p名-视频名】进行匹配，无则仅对视频名，上图结果为【泠鸢歌】《悠哉日常》（2024.12.12）"}
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
            <TextInput
              source="regex"
              helperText={false}
              label="正则表达式"
              variant={"outlined"}
            />
            <TextInput
              source="pos"
              helperText={false}
              variant="outlined"
              label="序号，只能为数字"
            />
          </SimpleFormIterator>
        </ArrayInput>
        <BooleanInput source="enable" label="启用" fullWidth />
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
                  enable: data.enable ? 1 : 0,
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
      return <GetUp setTargetId={setTargetId} />;
    case "COLLECTION":
      return <GetCollection setTargetId={setTargetId} />;
    case "FAVORITE":
      return <GetFavorite setTargetId={setTargetId} />;
    case "PART":
      return <GetPart setTargetId={setTargetId} />;
      case "OLDCOLLECTION":
          return <GetOldCollection setTargetId={setTargetId} />;
    default:
      return <>未知类型</>;
  }
}

export default SubscribeEdit;
