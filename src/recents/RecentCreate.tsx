import { useEffect, useState } from "react";
import {
  BooleanInput,
  Create,
  number,
  required,
  SaveButton,
  SelectInput,
  SimpleForm,
  TextInput,
  Toolbar,
  useGetIdentity,
  useGetOne,
  useNotify,
  useRedirect,
} from "react-admin";
import { useFormContext } from "react-hook-form";
import { Card } from "@mui/material";
import GetBvid from "./GetBvid";

const RecentCreateToolbar = ({ videoInfo }: any) => {
  const notify = useNotify();
  const redirect = useRedirect();
  return (
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
        transform={(data) => ({
          ...data,
          voiceBeginSec: (data.endTime && data.startTime) ?? 0,
          voiceEndSec: (data.startTime && data.endTime) ?? 0,
          cid: videoInfo.cid,
          bvid: videoInfo.bvid,
        })}
      />
    </Toolbar>
  );
};

const RecentCreate = () => {
  const [videoInfo, setVideoInfo] = useState({
    title: "",
    quality: [],
    image: "",
    // bvid: 'BV15a411M7r2', // single
    bvid: "BV1vQ4y1Y7h2", // multipart
    useQuality: "",
    pages: [],
    cid: "",
    partName: "",
  });
  const redirect = useRedirect();
  const { data } = useGetOne(
    "voiceList",
    { id: 1 },
    { retry: false, staleTime: Infinity }
  );
  useEffect(() => {
    if (data === null || data?.voiceList === null) {
      redirect("/loginNetmusic");
    }
    return () => {};
  }, [data, redirect]);

  const MyForm = () => {
    const context = useFormContext();
    const identity = useGetIdentity();
    const data1 = identity.data;
    return (
      <>
        <GetBvid
          videoInfo={videoInfo}
          setVideoInfo={(data: any) => {
            setVideoInfo(data);
            context.setValue(
              "customUploadName",
              (data.partName !== null && data.partName !== ""
                ? data.partName + "-"
                : "") + data.title
            );
          }}
        />
        <SelectInput
          source="voiceListId"
          label="选择播客"
          choices={data && data.voiceList ? toChoice(data.voiceList.list) : []}
          fullWidth
          validate={required("Required field")}
        ></SelectInput>
        <TextInput
          source="customUploadName"
          multiline
          fullWidth
          label="上传名字"
          validate={required("Required field")}
        />
        <TextInput
          source="voiceOffset"
          label="声音增益(db)支持小数"
          validate={number("必须是数字")}
          fullWidth
        />
        <TextInput
          source="startTime"
          label="剪辑开始时间(秒)支持小数"
          validate={number("必须是数字")}
          fullWidth
        />
        <TextInput
          source="endTime"
          label="剪辑结束时间(秒)支持小数"
          validate={number("必须是数字")}
          fullWidth
        />
        <BooleanInput
          source="useDefaultImg"
          label="使用视频封面，取消则为播客默认封面"
          defaultValue
          fullWidth
        />
        <BooleanInput source="privacy" label="隐私声音?" />
        <BooleanInput
          source="crack"
          disabled={data1 && data1.fullName !== "admin"}
          label="绕过版权检测"
        />
      </>
    );
  };

  return (
    <Create redirect="list">
      <div className="create-page">
        <Card sx={{ marginTop: "1em", maxWidth: "30em" }}>
          <SimpleForm toolbar={<RecentCreateToolbar videoInfo={videoInfo} />}>
            <MyForm />
          </SimpleForm>
        </Card>
      </div>
    </Create>
  );
};

export function toChoice(voiceList: any[]): any[] {
  return voiceList.map((i) => {
    i.id = i.voiceListId;
    i.name = i.voiceListName;
    return i;
  });
}

export default RecentCreate;
