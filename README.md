# redesigned-tribble
**This is a frontend for the emoncms API**

vuejs and bootstrap 4 version of the emoncms UI. This project has no server side scripting all JS,HTML and CSS.

# Install the project
- `$ git clone git@github.com:emrysr/redesigned-tribble.git` clone my repo (or your fork)
- `$ cd redesigned-tribble/emoncms` go to the project directory
- `$ npm install` install all dependancies listed in [./package.json]()

once the project is installed you can **build** or **run it**

You can update any old dependancies with:
```
$ npm update
```
> ! This will take some time for the first run as all the DEV dependancies used for ES6 transpiling, eslint code checker, frontend test runners and headless browser
>
> *took 2-3 minutes on my laptop* 

# Build it
- Create all the 'flat files' that can be coppied to a web server
  ```
  $ npm build
  ```
 
# Run it
- Run dev server - with disk change watcher (aka live)
  ```
  $ npm start
  ```
  access the dev server via [http://localhost:8080]()


# **TL;DR**

## Steps taken to create the [./package.json]() file used for installation

started by using [vue-cli](https://cli.vuejs.org/) :
```
$ vue init webpack emoncms
```

This project has theses dependancies (all now in the `package.json` file):

    "bootstrap": "^4.1.3",
    "jquery": "^3.3.1",
    "popper.js": "^1.14.4",
    "tooltip.js": "^1.3.0",

All added like this:
- `npm install jquery --save`
- `npm install tooltip.js --save`
- `npm install popper.js --save`
- `npm install bootstrap --save`

Tweeked an anoying `eslint` message that Bootstrap wasn't installed:
added to the `varsIgnorePattern` regex ignore pattern in [./eslintrc.js]():
```javascript
module.exports.rules.no-unused-vars = ["error", { "varsIgnorePattern": "Bootstrap" }]
```


## Dev server
run the dev server with
```
$ npm run start
```

see live version @ [http://localhost:8080]()


## npm commands 
these were added by the [vue-cli](https://cli.vuejs.org/) build scripts

    "dev": "webpack-dev-server --inline --progress --config build/webpack.dev.conf.js",
    "start": "npm run dev",
    "unit": "jest --config test/unit/jest.conf.js --coverage",
    "e2e": "node test/e2e/runner.js",
    "test": "npm run unit && npm run e2e",
    "lint": "eslint --ext .js,.vue src test/unit test/e2e/specs",
    "build": "node build/build.js"









# Issues and notes setting up mosquitto mqtt server

- the ubuntu maintained version of mosquitto `apt-get install mosquitto` it more recent than the auth-plugin supports
  `apt-cache show mosquitto`
- cannot get the ubuntu maintained `mosquitto-auth-plugin` package to install correctly
- building [auth-plugin](https://github.com/jpmens/mosquitto-auth-plug) from source requires mosquitto 1.4
- building [auth-plugin](https://github.com/jpmens/mosquitto-auth-plug) requires the source for mosquitto
- error given when attempting to run auth-plugin with default mosquitto install: `incorrect auth plugin version (got 3, expected 2)`
- building [mosquitto](https://github.com/eclipse/mosquitto) builds v1.5 (latest)
- `ERROR: configured back-end is not compiled in this plugin mosquitto` given when auth-plugin complied from source
- mosquitto client passes user `-u` and password `-P` authenticate connections
- using a [github project](https://github.com/jllopis/docker-mosquitto) that uses docker to run alpine linux with `mosquitto` and `mosquitto-auth` pre-installed
- edit `composer.conf` and `auth-plugin.conf` to configure settings before building the server
- use `docker-compose` to build the project: `$ docker-compose up`
- `Connection refused: Not authorized` returned by mqtt client on unsuccessful connection
- docker exits with error: `dockermosquitto_mosquitto_1 exited with code 139`  when attempting to connect using the `mosquitto-auth` addon
- http auth method requires a http endpoint to authenticate users - must return http 200 status on success
- jwt auth method requires the api token (eg cb9579be83678b89a5eb0faea08ad838) as the user `-u`. Some clients also require a value for password (can be anything)
- websocket protocol used for browser (javascript) based mqtt client.
- [Libwebsocket 1.7 in Ubuntu 16.04 causes crashes (in Mosquitto)](https://bugs.launchpad.net/ubuntu/+source/libwebsockets/+bug/1647300)
- http connections can be created as websockets using [websockify](https://github.com/novnc/websockify)
- We can remove the `protocol websockets` directive from `mosquitto.conf` to avoid the crashes. We'd need to forward http traffic to the mqtt port via the websockfiy proxy


## alternative auth-plugin
- using [mosquitto-auth-plugin-http](https://github.com/hadleyrich/mosquitto-auth-plugin-http) to authenticate mqtt connections using http endpoints
- `/emoncms/user/auth` should return http status code 200 if ok or 401 if unauthorized 
- **PROBLEM** authenticates subscribers but not topics (/user/auth)
- authenticates publishers and restricts to topics (/user/acl)
- not too much code.. a potential for modification!??
- i would prefer an api key restriction to avoid passing the username and password too much.
- alter the c code and use make to build the `.so` file referenced in the `mosquitto.conf` settings

## another auth plugin
- [jwt_auth_plugin](https://github.com/cyrilcc/mosquitto_auth_plugin_jwt)

## guides
http://www.yasith.me/2016/04/securing-mqtt-connection-using.html