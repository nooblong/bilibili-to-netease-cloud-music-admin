import * as React from 'react';
import { useState } from 'react';
import {
    Form,
    required,
    useDataProvider,
    useLogin,
    useNotify,
    useSafeSetState,
    useTranslate,
} from 'ra-core';
import { Button, CardContent, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Login, LoginForm, TextInput } from 'ra-ui-materialui';

const LoginPage = () => (
    <>
        <Login
            sx={{ background: 'black' }}
            // A random image that changes everyday
            // backgroundImage={'https://source.unsplash.com/random/1600x900/daily'.replace(
            //     /^(http)s*(:\/\/)/,
            //     'https://images.weserv.nl/?url='
            // )}
            children={Children()}
        />
    </>
);

const Children = () => {
    const { redirectTo, className } = { redirectTo: '/' };
    const [loading, setLoading] = useSafeSetState(false);
    const [registering, setRegistering] = useState(false);
    const login = useLogin();
    const translate = useTranslate();
    const notify = useNotify();
    const dataProvider = useDataProvider();

    const submit = (values: FormData) => {
        setLoading(true);
        login(values, redirectTo)
            .then(() => {
                setLoading(false);
            })
            .catch(error => {
                setLoading(false);
                notify(
                    typeof error === 'string'
                        ? error
                        : typeof error === 'undefined' || !error.message
                        ? 'ra.auth.sign_in_error'
                        : error.message,
                    {
                        type: 'error',
                        messageArgs: {
                            _:
                                typeof error === 'string'
                                    ? error
                                    : error && error.message
                                    ? error.message
                                    : undefined,
                        },
                    }
                );
            });
    };

    const submitRegister = (values: FormData) => {
        setLoading(true);
        dataProvider
            .register('register', values)
            .then(data => {
                notify(data.data.message, {
                    type: data.data.code >= 0 ? 'success' : 'error',
                });
                setRegistering(false);
            })
            .then(() => {
                setLoading(false);
            })
            .catch(error => {
                setLoading(false);
                notify(
                    typeof error === 'string'
                        ? error
                        : typeof error === 'undefined' || !error.message
                        ? 'ra.auth.sign_in_error'
                        : error.message,
                    {
                        type: 'error',
                        messageArgs: {
                            _:
                                typeof error === 'string'
                                    ? error
                                    : error && error.message
                                    ? error.message
                                    : undefined,
                        },
                    }
                );
            });
    };

    const PREFIX = 'RaLoginForm';

    const LoginFormClasses = {
        content: `${PREFIX}-content`,
        button: `${PREFIX}-button`,
        icon: `${PREFIX}-icon`,
    };

    const StyledForm = styled(Form, {
        name: PREFIX,
        overridesResolver: (props, styles) => styles.root,
    })(({ theme }) => ({
        [`& .${LoginFormClasses.content}`]: {
            width: 300,
        },
        [`& .${LoginFormClasses.button}`]: {
            marginTop: theme.spacing(2),
        },
        [`& .${LoginFormClasses.icon}`]: {
            margin: theme.spacing(0.3),
        },
    }));

    interface LoginFormProps {
        redirectTo?: string;
        className?: string;
    }

    interface FormData {
        username: string;
        password: string;
    }

    LoginForm.propTypes = {
        redirectTo: PropTypes.string,
    };

    return (
        <>
            {!registering ? (
                <StyledForm
                    onSubmit={submit}
                    mode="onChange"
                    noValidate
                    className={className}
                    sx={{ textAlign: 'center' }}
                >
                    登录
                    <CardContent className={LoginFormClasses.content}>
                        <TextInput
                            autoFocus
                            source="username"
                            label={translate('ra.auth.username')}
                            autoComplete="username"
                            validate={required()}
                            fullWidth
                        />
                        <TextInput
                            source="password"
                            label={translate('ra.auth.password')}
                            type="password"
                            autoComplete="current-password"
                            validate={required()}
                            fullWidth
                        />

                        <Button
                            variant="contained"
                            type="submit"
                            color="primary"
                            disabled={loading}
                            fullWidth
                            className={LoginFormClasses.button}
                        >
                            {loading ? (
                                <CircularProgress
                                    className={LoginFormClasses.icon}
                                    size={19}
                                    thickness={3}
                                />
                            ) : (
                                '登录'
                            )}
                        </Button>
                        <Button
                            variant="contained"
                            type="submit"
                            color="primary"
                            disabled={loading}
                            fullWidth
                            className={LoginFormClasses.button}
                            onClick={event => {
                                event.preventDefault();
                                setRegistering(true);
                            }}
                        >
                            {loading ? (
                                <CircularProgress
                                    className={LoginFormClasses.icon}
                                    size={19}
                                    thickness={3}
                                />
                            ) : (
                                '注册'
                            )}
                        </Button>
                    </CardContent>
                </StyledForm>
            ) : (
                <StyledForm
                    onSubmit={submitRegister}
                    mode="onChange"
                    noValidate
                    className={className}
                    sx={{ textAlign: 'center' }}
                >
                    注册
                    <CardContent className={LoginFormClasses.content}>
                        <TextInput
                            autoFocus
                            source="username"
                            label={translate('ra.auth.username')}
                            validate={required()}
                            fullWidth
                        />
                        <TextInput
                            source="password"
                            label={translate('ra.auth.password')}
                            type="password"
                            validate={required()}
                            fullWidth
                        />
                        <Link
                            to=""
                            onClick={event => {
                                event.preventDefault();
                                setRegistering(false);
                            }}
                        >
                            返回登录
                        </Link>
                        <Button
                            variant="contained"
                            type="submit"
                            color="primary"
                            disabled={loading}
                            fullWidth
                            className={LoginFormClasses.button}
                        >
                            {loading ? (
                                <CircularProgress
                                    className={LoginFormClasses.icon}
                                    size={19}
                                    thickness={3}
                                />
                            ) : (
                                '注册'
                            )}
                        </Button>
                    </CardContent>
                </StyledForm>
            )}
        </>
    );
};

export default LoginPage;
