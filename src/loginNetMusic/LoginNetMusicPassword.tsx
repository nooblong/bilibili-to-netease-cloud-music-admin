import React, { Fragment, useState } from "react";
import {
  Create,
  required,
  SaveButton,
  SimpleForm,
  TextInput,
  useDataProvider,
  useNotify,
} from "react-admin";
import { Button, Checkbox, Container, Grid } from "@mui/material";
import { useFormContext } from "react-hook-form";

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
          source={"phone"}
          validate={required("Required field")}
          fullWidth={true}
        />
        {sendCode ? (
          <Grid container>
            <Grid item xs={8}>
              <TextInput
                source={"captcha"}
                fullWidth={true}
                validate={required("Required field")}
              />
            </Grid>
            <Grid item xs={4}>
              <Container>
                <Button
                  variant="contained"
                  onClick={() => {
                    dataProvider
                      .sendCode("sendCode", {
                        phone: context.getValues("phone"),
                      })
                      .then((data) => {
                        if (data.data.code === 200) {
                          notify("成功");
                        } else {
                          notify("失败");
                        }
                      });
                  }}
                >
                  发送验证码
                </Button>
              </Container>
            </Grid>
            <Grid item xs={8}>
              <p>先验证一下验证码是否正确</p>
            </Grid>
            <Grid item xs={4}>
              <Container>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => {
                    dataProvider
                      .verify("verify", {
                        phone: context.getValues("phone"),
                        captcha: context.getValues("captcha"),
                      })
                      .then((data) => {
                        if (data.data.code === 200) {
                          notify("验证成功");
                        } else {
                          notify("验证失败");
                        }
                      });
                  }}
                >
                  验证
                </Button>
              </Container>
            </Grid>
          </Grid>
        ) : (
          <TextInput
            source={"password"}
            validate={required("Required field")}
            fullWidth={true}
          />
        )}
        <SaveButton
          label="登录"
          type="button"
          mutationOptions={{
            onSuccess: (data) => {
              if (data.data.code === 200) {
                notify("登录成功: " + data.data.profile.nickname, {
                  type: "success",
                });
                localStorage.setItem("netmusic", JSON.stringify(data.data));
              } else {
                notify(data.data.msg, { type: "error" });
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
