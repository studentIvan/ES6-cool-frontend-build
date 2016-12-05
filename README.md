ES6 cool frontend build
-----------------------------

Using technologies:

* webpack 2 - https://webpack.js.org/
* babel 6 - https://babeljs.io/
* native ES6 without compilation - http://kangax.github.io/compat-table/es6/

Including:

* pug - https://pugjs.org/api/getting-started.html
* stylus with nib - http://stylus-lang.com/
* eslint with airbnb-config-base - http://eslint.org/
* uglify-js 2 with harmony support

Features:

* lightweight compilation
* graceful degradation for ES6 support
* modern technologies with big community
* tree-shaking support ( http://www.2ality.com/2015/12/webpack-tree-shaking.html )

Configuration files:

* webpack.config.js - basic configuration
* webpack.config.slim.js - based on webpack.config.js but splicing legacy
* webpack.config.production.js - production build configuration

Commands:

* `npm install` - install the dependencies/requirements for development or building
* `npm start` - start webpack-dev-server with slim configuration (without legacy browsers support while development)
* `npm run build` - do production build with legacy browsers support

Extra commands:

* `webpack-dev-server` - run webpack-dev-server with legacy browsers support
* `webpack` - do manual dev webpack build with legacy browsers support

How to do the page:
* configure resources.js file - you can use several CDNs for each library
* inside your page include the smart scripts resources.js and acme.js (see the example)
* configure new entry point inside src/schema.json if needed
* put the dependencies and the entry name inside the meta tags like on the example below
* js:dependencies can contains libraries described in the resources.js file
* the libraries can be described with comma (a,b,c) and with :async modifier (a:async,b)
* you can put one of your entry points inside the dependencies
* if dependency is not described then it will be called by standart path /scripts/name.js
* the old browsers will receive just one bundle.legacy.js to reduce the problems

```pug
doctype html
html
    head
        meta(charset="utf-8")
        meta(property="js:entry" content="app")
        meta(property="js:dependencies" content="jquery")
        meta(property="js:app-ver" content="default")
        block title
            title hello world
        link(rel="stylesheet", href="/styles/main.css")
    body
        block content
            | hello world 2
        script(src="/scripts/resources.js")
        script(src="/scripts/acme.js")
```

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta property="js:entry" content="app">
    <meta property="js:dependencies" content="jquery">
    <meta property="js:app-ver" content="default">
    <title>Article Title</title>
    <link rel="stylesheet" href="/styles/main.css">
  </head>
  <body>
    <h1>My</h1><span class="example">test7</span>
    <script src="/scripts/resources.js"></script>
    <script src="/scripts/acme.js"></script>
  </body>
</html>
```

Probably you should install the babel and the webpack 2 global - please read the websites for more information.

JS coding styleguide https://github.com/airbnb/javascript/ 
