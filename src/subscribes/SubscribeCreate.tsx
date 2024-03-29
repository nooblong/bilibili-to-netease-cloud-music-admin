import { ReactElement, useEffect } from "react";
import {
  ArrayInput,
  BooleanInput,
  Create,
  DateTimeInput,
  required,
  SaveButton,
  SelectInput,
  SimpleForm,
  SimpleFormIterator,
  TextInput,
  Title,
  Toolbar,
  useDataProvider,
  useGetIdentity,
  useGetOne,
  useNotify,
} from "react-admin";
import { useFormContext, useWatch } from "react-hook-form";
import { SubscribeTypeEnum, VideoOrderEnum } from "./Enums";
import { parseDatetime } from "../dataProvider";
import GetUp from "./GetUp";
import GetCollection from "./GetCollection";
import GetFavorite from "./GetFavorite";
import GetPart from "./GetPart";
import { toChoice } from "../recents/UploadDetailCreate";
import moment from "moment";
import { Card } from "@mui/material";

const RecentCreateToolbar = () => {
  return (
    <Toolbar>
      <SaveButton
        label="提交"
        type="button"
        variant="text"
        alwaysEnable
        transform={(data) => ({
          ...data,
          crack: data.crack ? 1 : 0,
          useVideoCover: data.useVideoCover ? 1 : 0,
        })}
      />
    </Toolbar>
  );
};

const SubscribeCreate = () => {
  const { data } = useGetOne(
    "voiceList",
    { id: 1 },
    { retry: false, staleTime: Infinity }
  );
  const dataProvider = useDataProvider();
  const notify = useNotify();

  useEffect(() => {
    dataProvider.checkHasUploaded().then((uploaded: any) => {
      if (!uploaded.data) {
        notify("需要先上传一遍单曲才可以订阅", { type: "error" });
      }
    });
  }, [dataProvider, notify]);
  const MyForm = () => {
    const context = useFormContext();
    const watchType = useWatch({ name: "type" });
    const identity = useGetIdentity();
    const data1 = identity.data;
    return (
      <>
        <TextInput
          source="remark"
          fullWidth
          label="备注"
          validate={required("Required field")}
          variant="outlined"
        />
        <SelectInput
          source="videoOrder"
          label="选择上传顺序"
          choices={VideoOrderEnum}
          validate={required("Required field")}
          variant="outlined"
          fullWidth
        ></SelectInput>
        <SelectInput
          source="voiceListId"
          variant="outlined"
          label="选择播客"
          choices={data && data.voiceList ? toChoice(data.voiceList.list) : []}
          fullWidth
          validate={required("Required field")}
        ></SelectInput>
        <SelectInput
          variant="outlined"
          source="type"
          label="订阅类型"
          choices={SubscribeTypeEnum}
          validate={required("Required field")}
          fullWidth
        ></SelectInput>
        {showAction(watchType, (targetId: any) => {
          context.setValue("targetId", targetId);
        })}
        <TextInput
          source="targetId"
          // validate={required('Required field')}
          variant="outlined"
          label="目标id(不建议手动填写)"
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
          fullWidth
          disabled={data1 && data1.fullName !== "admin"}
          label="绕过版权检测"
        />
        <BooleanInput
          source="useVideoCover"
          label="使用视频封面，取消则为播客默认封面"
          fullWidth
        />
        <TextInput
          source="limitSec"
          validate={required("Required field")}
          variant="outlined"
          label="限制时长(秒)"
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
              variant="outlined"
              fullWidth
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
            "下面添加一个序号为1内容为「\\《(.*?)\\》」, 上传时会将名字变为: 「你好阿肝(again)世界」"}
        </p>
        <TextInput
          source="regName"
          label="自定义上传名称，可以不填"
          variant="outlined"
          fullWidth
        />
        <ArrayInput
          source="subscribeRegs"
          variant="outlined"
          label="用于自定义上传名称, 对视频名字匹配正则"
        >
          <SimpleFormIterator inline>
            <TextInput
              source="regex"
              helperText={false}
              label="正则表达式"
              variant="outlined"
            />
            <TextInput
              source="pos"
              variant="outlined"
              helperText={false}
              label="序号，只能为数字"
            />
          </SimpleFormIterator>
        </ArrayInput>
      </>
    );
  };

  return (
    <Create redirect="list">
      <Title defaultTitle="新建订阅" />
      <SimpleForm toolbar={<RecentCreateToolbar />} warnWhenUnsavedChanges>
        <MyForm />
      </SimpleForm>
    </Create>
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

export default SubscribeCreate;
