import {
  Create,
  required,
  SaveButton,
  SimpleForm,
  TextInput,
  useDataProvider,
  useNotify,
} from "react-admin";
import { Button, ButtonGroup, Checkbox, Grid } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { Fragment, useState } from "react";

const LoginNetMusicPassword = () => {
  const notify = useNotify();
  const [sendCode, setSendCode] = useState(false);
  const dataProvider = useDataProvider();
  const MyForm = () => {
    const context = useFormContext();
    return (
      <>
        <p>手机号登录</p>
        <div>
          使用验证码
          <Checkbox
            checked={sendCode}
            onChange={(event) => {
              setSendCode(event.target.checked);
            }}
          />
        </div>
        <TextInput
          variant="outlined"
          source={"phone"}
          validate={required("Required field")}
          fullWidth={true}
        />
        {sendCode ? (
          <Grid container>
            <Grid item xs={12}>
              <TextInput
                variant="outlined"
                source={"captcha"}
                fullWidth={true}
                validate={required("Required field")}
              />
            </Grid>
            <ButtonGroup size="large" fullWidth aria-label="Large button group">
              <Button
                onClick={() => {
                  dataProvider
                    .sendCode("sendCode", {
                      phone: context.getValues("phone"),
                    })
                    .then((data: any) => {
                      if (data.data.code === 200) {
                        notify("发送成功", { type: "success" });
                      } else {
                        notify(data.data.message + "", { type: "error" });
                      }
                    });
                }}
              >
                发送验证码
              </Button>

              <Button
                fullWidth
                onClick={() => {
                  dataProvider
                    .verify("verify", {
                      phone: context.getValues("phone"),
                      captcha: context.getValues("captcha"),
                    })
                    .then((data: any) => {
                      if (data.data.code === 200) {
                        notify("验证成功", { type: "success" });
                      } else {
                        notify(data.data.message + "", { type: "error" });
                      }
                    });
                }}
              >
                验证
              </Button>
            </ButtonGroup>
          </Grid>
        ) : (
          <TextInput
            source={"password"}
            fullWidth
            validate={required("Required field")}
            variant="outlined"
          />
        )}
        <hr />
        <SaveButton
          label="登录"
          type="button"
          mutationOptions={{
            onSuccess: (data: any) => {
              if (data.data.code === 200) {
                notify("登录成功: " + data.data.profile.nickname, {
                  type: "success",
                });
                localStorage.setItem("netmusic", JSON.stringify(data.data));
              } else {
                notify(data.data.message + "", { type: "error" });
              }
            },
          }}
          transform={(data) => {
            if (sendCode) {
              return { phone: data.phone, captcha: data.captcha };
            } else {
              return {
                phone: data.phone,
                password: data.password,
              };
            }
          }}
        />
      </>
    );
  };

  return (
    <Create resource="loginPassword">
      <SimpleForm toolbar={<Fragment />}>
        <MyForm />
      </SimpleForm>
    </Create>
  );
};

export default LoginNetMusicPassword;
