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
  useGetOne,
  useNotify,
  useRedirect,
} from "react-admin";
import { useFormContext } from "react-hook-form";
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
            redirect("list", "uploadDetail", data.id);
          },
        }}
        transform={(data) => {
          let array: any = [];
          if (videoInfo.selectAll) {
            for (let i = 0; i < videoInfo.selected.length; i++) {
                array.push({
                    ...data,
                    voiceBeginSec: (data.endTime && data.startTime) ?? 0,
                    voiceEndSec: (data.startTime && data.endTime) ?? 0,
                    cid: videoInfo.selected[i].cid,
                    bvid: videoInfo.bvid,
                    // todo 暂时定customUploadName + partName
                    customUploadName: data.customUploadName + videoInfo.selected[i].part
                });
            }
          } else {
              array.push({
                  ...data,
                  voiceBeginSec: (data.endTime && data.startTime) ?? 0,
                  voiceEndSec: (data.startTime && data.endTime) ?? 0,
                  cid: videoInfo.cid,
                  bvid: videoInfo.bvid,
              });
          }
          return array;
        }}
      />
    </Toolbar>
  );
};

const UploadDetailCreate = () => {
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
    selectAll: false,
    selected: []
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
          variant="outlined"
          source="voiceListId"
          label="选择播客"
          choices={data && data.voiceList ? toChoice(data.voiceList.list) : []}
          defaultValue={""}
          fullWidth
          validate={required("Required field")}
        ></SelectInput>
        <TextInput
          variant="outlined"
          source="customUploadName"
          multiline
          fullWidth
          label="上传标题, 多p且全选时为[此文字+分p标题]"
          validate={required("Required field")}
        />
        <TextInput
          variant="outlined"
          source="voiceOffset"
          label="声音增益(db)支持小数"
          validate={number("必须是数字")}
          fullWidth
        />
        <TextInput
          variant="outlined"
          source="startTime"
          label="剪辑开始时间(秒)支持小数"
          validate={number("必须是数字")}
          fullWidth
        />
        <TextInput
          variant="outlined"
          source="endTime"
          label="剪辑结束时间(秒)支持小数"
          validate={number("必须是数字")}
          fullWidth
        />
        <BooleanInput
          variant="outlined"
          source="useDefaultImg"
          label="使用视频封面，取消则为播客默认封面"
          defaultValue
          fullWidth
        />
        <BooleanInput source="privacy" label="隐私声音?" variant="outlined" />
        {localStorage.getItem("user") === "admin" && (
          <BooleanInput source="crack" variant="outlined" label="开启超能力" />
        )}
      </>
    );
  };

  return (
    <Create redirect="list">
      <SimpleForm toolbar={<RecentCreateToolbar videoInfo={videoInfo} />}>
        <MyForm />
      </SimpleForm>
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

export default UploadDetailCreate;
