import * as React from "react";
import { ReactElement } from "react";
import { Card } from "@mui/material";
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
import { toChoice } from "../recents/RecentCreate";
import moment from "moment/moment";

const SubscribeEdit = (props) => {
  const controllerProps = useEditController(props);
  const { resource, record, save } = controllerProps;

  const MyForm = () => {
    const context = useFormContext();
    const watchType = useWatch({ name: "type" });
    const { data, error } = useGetOne(
      "voiceList",
      { id: 1 },
      { retry: false, staleTime: Infinity }
    );
    const identity = useGetIdentity();
    const data1 = identity.data;
    return (
      <>
        <TextInput source="id" fullWidth InputProps={{ disabled: true }} />
        <TextInput source="remark" fullWidth label="备注" />
        <SelectInput
          source="videoOrder"
          label="选择上传顺序"
          choices={VideoOrderEnum}
          validate={required("Required field")}
          fullWidth
        ></SelectInput>
        <SelectInput
          source="voiceListId"
          label="选择播客"
          choices={
            data && data.voiceList
              ? toChoice(data.voiceList.list)
              : [{ id: 1, name: "1" }]
          }
          fullWidth
          validate={required("Required field")}
        ></SelectInput>
        <SelectInput
          source="type"
          label="订阅类型"
          choices={SubscribeTypeEnum}
          validate={required("Required field")}
          fullWidth
        ></SelectInput>
        {showAction(watchType, (targetId) => {
          console.log(targetId);
          context.setValue("targetId", targetId);
        })}
        <TextInput
          source="targetId"
          // validate={required('Required field')}
          label="目标id(不建议手动填写)"
          fullWidth
        />
        <TextInput source="keyWord" fullWidth label="过滤关键词" />
        <BooleanInput
          source="crack"
          fullWidth
          label="绕过版权检测"
          disabled={data1 && data1.fullName !== "admin"}
        />
        <BooleanInput
          source="useVideoCover"
          label="使用视频封面，取消则为播客默认封面"
          defaultValue
          fullWidth
        />
        <TextInput
          source="limitSec"
          validate={required("Required field")}
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
            />
            <DateTimeInput
              parse={parseDatetime}
              source="toTime"
              defaultValue={moment("2077-01-01 00:00:00").format(
                "YYYY-MM-DD HH:mm:ss"
              )}
              label="结束时间, 不会处理这个时间后的视频"
              fullWidth
            />
          </>
        )}
        <p>
          {"使用大括号加序号来获取下面的变量: 例如 '{pubdate} 《{1}》', 数字1是下面的序号为1的正则结果, 会将名字变为: '2023.1.1 《彩虹糖的梦》', " +
            "特殊变量: {pubdate}为获取视频发布时间, 格式为yyyy.MM.dd"}
        </p>
        <TextInput
          source="regName"
          label="自定义上传名称，可以不填"
          fullWidth
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
              label="序号，只能为数字"
            />
          </SimpleFormIterator>
        </ArrayInput>
      </>
    );
  };

  return (
    <EditContextProvider value={controllerProps}>
      <div className="edit-page">
        <Title defaultTitle={controllerProps.defaultTitle} />
        <Card sx={{ marginTop: "1em", maxWidth: "30em" }}>
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
        </Card>
      </div>
    </EditContextProvider>
  );
};

function showAction(type: string, setTargetId: any): ReactElement {
  switch (type) {
    case "UP":
      return (
        <Card sx={{ width: "100%", marginBottom: "15px" }} elevation={10}>
          <GetUp setTargetId={setTargetId} />
        </Card>
      );
    case "COLLECTION":
      return (
        <Card sx={{ width: "100%", marginBottom: "15px" }} elevation={10}>
          <GetCollection setTargetId={setTargetId} />
        </Card>
      );
    case "FAVORITE":
      return (
        <Card sx={{ width: "100%", marginBottom: "15px" }} elevation={10}>
          <GetFavorite setTargetId={setTargetId} />
        </Card>
      );
    case "PART":
      return (
        <Card sx={{ width: "100%", marginBottom: "15px" }} elevation={10}>
          <GetPart setTargetId={setTargetId} />
        </Card>
      );
    default:
      return (
        <Card sx={{ width: "100%", marginBottom: "15px" }} elevation={10}>
          <>未知类型</>
        </Card>
      );
  }
}

export default SubscribeEdit;
