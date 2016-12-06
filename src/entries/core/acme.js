/**
 * read the resources.json file
 */
const { scriptBasePath, resources } = require('../resources.json');

/**
 * check that browser supports basic ES6
 * @return {Boolean}
 */
const isSupportsBasicES6 = function () {
  "use strict";

  try { eval("let foo = (x)=>x+1"); }
  catch (e) { return false; }
  return true;
};

/**
 * check that browser supports param destructing
 * @return {Boolean}
 */
const isSupportsDefaultParamsDestructing = function () {
    "use strict";

    try {
        eval('(function({a = 1, b = 0, c = 3, x:d = 0, y:e = 5},'
          + '  [f = 6, g = 0, h = 8]) {'
          + 'return a === 1 && b === 2 && c === 3 && d === 4 &&'
          + 'e === 5 && f === 6 && g === 7 && h === 8;'
          + '}({b:2, c:undefined, x:4},[, 7, undefined]));');
    } catch (e) { return false; }
    return true;
};

/**
 * you can modify this function for CDN or several hosts
 *
 * use the https://www.srihash.org/ for SRI hash generation
 * @param  {String} moduleName
 * @return {String} path
 */
const getScriptLocation = (moduleName, iteration) => {
    if (resources[moduleName] && iteration < resources[moduleName].length) {
        return resources[moduleName][iteration || 0];
    }
    else {
        return {
            url: `${scriptBasePath}/${moduleName}/${moduleName}.js`,
            stopIterations: true
        };
    }
};

const metaJSRead = (property, defaultValue = '') => 
    (document.head.querySelector(`[property="js:${property}"]`) 
    || { content: defaultValue }).content;

const appVersionCode = metaJSRead('app-ver');
let libraries = metaJSRead('dependencies:libraries').split(',');
let modules = metaJSRead('dependencies:modules').split(',');

if (!libraries[0]) { libraries = []; }
if (!modules[0]) { modules = []; }

/**
 * include script to the page
 * @param  {String} moduleName - if contains :async when previous/next will not wait
 * @param  {Boolean} asyncScript - is script tag async
 * @param  {Number} iteration - cursor to module array
 * @return {Object} - <script> object
 */
const includeScript = (moduleName, asyncScript = false, iteration = 0, withVersion = false) => {
    const scriptElement = document.createElement('script');
    const scriptLocation = getScriptLocation(moduleName, iteration);

    if (asyncScript) {
        scriptElement.async = 'async';
    }

    if (scriptLocation.integrity) {
        scriptElement.integrity = scriptLocation.integrity;
    }

    if (scriptLocation.crossorigin) {
        scriptElement.crossorigin = scriptLocation.crossorigin;
    }

    scriptElement.src = 
      `${scriptLocation.url || scriptLocation}${withVersion ? `?v=${appVersionCode}` : ''}`;

    document.head.appendChild(scriptElement);

    if (!scriptLocation.stopIterations) {
        scriptElement.onerror = () => {
            includeScript(moduleName, asyncScript, iteration + 1, withVersion);
        };
    }

    return scriptElement;
};

const loadDeps = (deps, indexedDeps = [], callback = () => {}, withVersion = false) => {
  indexedDeps.totalLoaded = 0;

  deps.forEach((dependency) => {
    const [dependencyName, dependencyAsync] = dependency.split(':');
    const scriptElement = 
      includeScript(dependencyName, Boolean(dependencyAsync), 0, withVersion);

    indexedDeps.push(scriptElement);

    scriptElement.onload = () => {
      indexedDeps.totalLoaded = indexedDeps.totalLoaded + 1;
      if (indexedDeps.totalLoaded === indexedDeps.length) {
        callback();
      }
    };
  });

  if (!indexedDeps.length) {
    callback();
  }
}

const bundleLibraries = [];

loadDeps(libraries, bundleLibraries, () => {
  if (isSupportsBasicES6() && isSupportsDefaultParamsDestructing()) {
    const bundleDependencies = [];

    loadDeps(modules, bundleDependencies, () => {
      const defaultModuleName = metaJSRead('entry', 'bundle');
      includeScript(defaultModuleName, false, 0, true);
    }, true);
  }
  else {
    includeScript(`${scriptBasePath}/bundle.legacy.js`);
  }
}); 
