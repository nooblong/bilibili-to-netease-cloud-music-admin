import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material";
import loadable from "@loadable/component";
import { AuthProvider, RequireAuth } from "./login/Login";

const root = createRoot(document.getElementById('root') as HTMLElement);

const ErrorPage = loadable(async () => await import('./ErrorPage'), {});
const Root = loadable(async () => await import('./routes/root'), {});
const Image = loadable(async () => await import('./image/Image'), {});
const Custom = loadable(async () => await import('./image/Custom'), {});
const Login = loadable(async () => await import('./login/Login'), {});
const Register = loadable(async () => await import('./login/Register'), {});
const UploadStepper = loadable(
    async () => await import('./bCut/UploadStepper'),
    {}
);
const ResultPage = loadable(async () => await import('./bCut/ResultPage'), {});
const Game = loadable(async () => await import('./game/jingziqi/Game'), {});
const Welcome = loadable(async () => await import('./login/Welcome'), {});
const FollowUpPage = loadable(
    async () => await import('./bCut/FollowUpPage'),
    {}
);
const SubScribe = loadable(async () => await import('./bCut/Subscribe'), {});
const Chat = loadable(async () => await import('./chat/Chat'), {});
const ChooseSong = loadable(async () => await import('./bCut/ChooseSong'), {});
const Settings = loadable(async () => await import('./bCut/Settings'), {});

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <Welcome />,
            },
            {
                path: '/login',
                element: <Login />,
            },
            {
                path: '/register',
                element: <Register />,
            },
            {
                path: '/game/1',
                element: <Game />,
            },
            {
                path: '/uploadStepper',
                element: <UploadStepper />,
            },
            {
                path: '/image',
                element: <Image />,
            },
            {
                path: '/image/custom',
                element: <Custom />,
            },
            {
                path: '/protected',
                element: (
                    <RequireAuth>
                        <h3>Protected</h3>
                    </RequireAuth>
                ),
            },
            {
                path: '/subscribe/*',
                element: <SubScribe></SubScribe>,
            },
            {
                path: '/choose/:voiceListId',
                element: <ChooseSong />,
            },
            {
                path: '/result',
                element: <ResultPage />,
            },
            {
                path: '/followUpPage',
                element: <FollowUpPage />,
            },
            {
                path: '/chat',
                element: <Chat />,
            },
            {
                path: '/settings',
                element: <Settings />,
            },
        ],
    },
]);

root.render(
    <StrictMode>
        <AuthProvider>
            <ThemeProvider
                theme={createTheme({
                    palette: {
                        mode: 'light',
                    },
                })}
            >
                <RouterProvider router={router} />
            </ThemeProvider>
        </AuthProvider>
    </StrictMode>
);
