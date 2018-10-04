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