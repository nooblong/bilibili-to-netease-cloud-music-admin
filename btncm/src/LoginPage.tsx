import * as React from 'react';
import {useState} from 'react';
import {
    Form,
    LoginForm,
    required,
    TextInput,
    useDataProvider,
    useLogin,
    useNotify,
    useSafeSetState,
    useTranslate
} from 'react-admin';
import {Box, Button, Card, CardActions, CardContent, CircularProgress} from '@mui/material';
import {styled} from '@mui/material/styles';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

const LoginPage = () => {
    const {redirectTo} = {redirectTo: '/'};
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
    })(({theme}) => ({
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
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: '100vh',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: 'black',
                        backgroundSize: 'cover',
                    }}
                >
                    <Card sx={{minWidth: 300, marginTop: '6em'}}>
                        <Box
                            sx={{
                                margin: '1em',
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                        </Box>
                        <Box
                            sx={{
                                marginTop: '1em',
                                display: 'flex',
                                justifyContent: 'center',
                                color: theme => theme.palette.grey[500],
                            }}
                        >
                            登录
                        </Box>
                        <Box sx={{padding: '0 1em 1em 1em'}}>
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
                        </Box>
                        <CardActions>
                            <Button
                                variant="contained"
                                type="submit"
                                color="primary"
                                disabled={loading}
                                fullWidth
                            >
                                {loading && (
                                    <CircularProgress
                                        size={25} thickness={2}
                                    />
                                )}
                                登录
                            </Button>
                            <Button
                                variant="outlined"
                                type="submit"
                                color="primary"
                                disabled={loading}
                                fullWidth
                                onClick={event => {
                                    event.preventDefault();
                                    setRegistering(true);
                                }}
                            >
                                {loading && (
                                    <CircularProgress
                                        className={LoginFormClasses.icon}
                                        size={19}
                                        thickness={3}
                                    />
                                )}
                                注册
                            </Button>
                        </CardActions>
                    </Card>
                </StyledForm>
            ) : (
                <StyledForm
                    mode="onChange"
                    noValidate
                    onSubmit={submitRegister}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: '100vh',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: 'black',
                        backgroundSize: 'cover',
                    }}
                >
                    <Card sx={{minWidth: 300, marginTop: '6em'}}>
                        <Box
                            sx={{
                                margin: '1em',
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                        </Box>
                        <Box
                            sx={{
                                marginTop: '1em',
                                display: 'flex',
                                justifyContent: 'center',
                                color: theme => theme.palette.grey[500],
                            }}
                        >
                            注册
                        </Box>
                        <Box sx={{padding: '0 1em 1em 1em'}}>
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
                        </Box>
                        <CardActions>
                            <Button
                                variant="outlined"
                                type="submit"
                                fullWidth
                                color="primary"
                                onClick={event => {
                                    event.preventDefault();
                                    setRegistering(false);
                                }}
                            >
                                返回
                            </Button>
                            <Button
                                variant="contained"
                                type="submit"
                                color="primary"
                                disabled={loading}
                                fullWidth
                            >
                                {loading ? (
                                    <CircularProgress
                                        className={LoginFormClasses.icon}
                                        size={19}
                                        thickness={3}
                                    />
                                ) : (
                                    '完成'
                                )}
                            </Button>
                        </CardActions>
                    </Card>
                </StyledForm>
            )}
        </>
    );
};

export default LoginPage;
