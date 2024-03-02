/* eslint react/jsx-key: off */
import * as React from 'react';
import { CustomRoutes, Resource } from 'ra-core'; // eslint-disable-line import/no-unresolved
import { render } from 'react-dom';
import { Route } from 'react-router-dom';

import authProvider from './authProvider';
import comments from './comments';
import CustomRouteLayout from './customRouteLayout';
import CustomRouteNoLayout from './customRouteNoLayout';
import Layout from './Layout';
import posts from './posts';
import users from './users';
import tags from './tags';
import LoginNetMusic from './loginNetMusic/LoginNetMusic';
import delayedDataProvider from './dataProvider';
import LoginPage from './LoginPage';
import RecentCreate from './recents/RecentCreate';
import RecentList from './recents/RecentList';
import SubscribeList from './subscribes/SubscribeList';
import SubscribeCreate from './subscribes/SubscribeCreate';
import SubscribeEdit from './subscribes/SubscribeEdit';
import { Admin } from 'react-admin';
import RecentEdit from './recents/RecentShow';
import RecentShow from './recents/RecentShow';
import OpenSuggest from './OpenSuggest';

render(
    <React.StrictMode>
        <OpenSuggest openIt={true} />
        <Admin
            authProvider={authProvider}
            dataProvider={delayedDataProvider}
            // i18nProvider={i18nProvider}
            title="Example Admin"
            layout={Layout}
            loginPage={LoginPage}
        >
            <CustomRoutes noLayout>
                <Route
                    path="/custom"
                    element={<CustomRouteNoLayout title="Posts from /custom" />}
                />
            </CustomRoutes>
            {/*<Resource name="posts" {...posts} />*/}
            {/*<Resource name="comments" {...comments} />*/}
            {/*<Resource name="tags" {...tags} />*/}
            <Resource
                name="recentsList"
                list={RecentList}
                create={RecentCreate}
                show={RecentShow}
                options={{ label: '单曲上传' }}
            />
            <Resource
                name="subscribe"
                list={SubscribeList}
                create={SubscribeCreate}
                edit={SubscribeEdit}
                options={{ label: '订阅' }}
            />
            <Resource
                name="loginNetMusic"
                list={LoginNetMusic}
                options={{ label: '登录网易云' }}
            />
            {permissions => (
                <>
                    {permissions ? <Resource name="users" {...users} /> : null}
                    <CustomRoutes noLayout>
                        <Route
                            path="/custom1"
                            element={
                                <CustomRouteNoLayout title="Posts from /custom1" />
                            }
                        />
                    </CustomRoutes>
                    <CustomRoutes>
                        <Route
                            path="/custom2"
                            element={
                                <CustomRouteLayout title="Posts from /custom2" />
                            }
                        />
                    </CustomRoutes>
                </>
            )}
            <CustomRoutes>
                <Route
                    path="/custom3"
                    element={<CustomRouteLayout title="Posts from /custom3" />}
                />
            </CustomRoutes>
        </Admin>
    </React.StrictMode>,
    document.getElementById('root')
);
