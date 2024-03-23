# bilibili-to-netease-cloud-music-admin

b 站视频一键转网易云播客前端
:
地址

https://nooblong.tech

```
# Go to the folder of your client app
$ cd /code/path/to/myapp/

# Use the latest version of yarn package manager
$ corepack enable && yarn set version stable

# Replace the npm-installed version with a symlink to your local version
$ yarn link /code/path/to/react-admin/packages/react-admin

# If you modified additional internal packages in the react-admin monorepo, e.g. ra-core, also make a link
$ yarn link /code/path/to/react-admin/packages/ra-core

# Build all of the react-admin package distribution
$ cd /code/path/to/react-admin/ && make build

# Return to your app and ensure all dependencies have resolved
$ cd /code/path/to/myapp/ && yarn install

# Start your app
$ yarn start
```
