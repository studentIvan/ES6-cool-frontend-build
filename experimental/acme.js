var isSupportsBasicES6, isSupportsDefaultParamsDestructing, appVersionCode,
  getScriptLocation, includeScript, scriptBasePath, modulePaths, bundleDependencies;

/**
 * url to scripts on the server
 * @type {String}
 */
scriptBasePath = '/scripts/';

/**
 * collection of paths to each using dependency (module)
 * when first path returns error - the second using
 * @type {Object}
 */
modulePaths = window.resourcesPaths;

isSupportsBasicES6 = function () {
  "use strict";

  try { eval("let foo = (x)=>x+1"); }
  catch (e) { return false; }
  return true;
}

isSupportsDefaultParamsDestructing = function () {
    "use strict";

    try {
        eval('(function({a = 1, b = 0, c = 3, x:d = 0, y:e = 5},'
          + '  [f = 6, g = 0, h = 8]) {'
          + 'return a === 1 && b === 2 && c === 3 && d === 4 &&'
          + 'e === 5 && f === 6 && g === 7 && h === 8;'
          + '}({b:2, c:undefined, x:4},[, 7, undefined]));');
    } catch (e) { return false; }
    return true;
}

/**
 * you can modify this function for CDN or several hosts
 *
 * use the https://www.srihash.org/ for SRI hash generation
 * @param  {String} moduleName
 * @return {String} path
 */
getScriptLocation = function (moduleName, iteration) {
    if (modulePaths[moduleName] && iteration < modulePaths[moduleName].length) {
        return modulePaths[moduleName][iteration || 0];
    }
    else {
        return {
            url: scriptBasePath + moduleName + '.js',
            stopIterations: true
        };
    }
}

/**
 * include script to the page
 * @param  {String} moduleName - if contains :async when previous/next will not wait
 * @param  {Boolean} asyncScript - is script tag async
 * @param  {Number} iteration - cursor to module array
 * @return {Object} - <script> object
 */
includeScript = function (moduleName, asyncScript, iteration) {
    /**
     * load module
     */
    iteration = iteration || 0;

    var scriptElement = document.createElement('script');
    var scriptLocation = getScriptLocation(moduleName, iteration);

    if (asyncScript) {
        scriptElement.async = 'async';
    }

    if (scriptLocation.integrity) {
        scriptElement.integrity = scriptLocation.integrity;
    }

    if (scriptLocation.crossorigin) {
        scriptElement.crossorigin = scriptLocation.crossorigin;
    }

    scriptElement.src = (scriptLocation.url || scriptLocation) 
        + '?version=' + appVersionCode;

    document.head.appendChild(scriptElement);

    if (!scriptLocation.stopIterations) {
        scriptElement.onerror = function () {
            includeScript(moduleName, asyncScript, iteration + 1);
        }
    }

    return scriptElement;
}

appVersionCode = (document.head
    .querySelector('[property="js:app-ver"]') 
    || { content: 'default' }).content;

if (isSupportsBasicES6() && isSupportsDefaultParamsDestructing()) {
    var dependencies = (document.head
        .querySelector('[property="js:dependencies"]') 
        || { content: '' }).content.split(',');

    if (!dependencies[0]) {
        dependencies = [];
    }

    bundleDependencies = [];
    bundleDependencies.totalLoaded = 0;
    bundleDependencies.finish = function () {
        var defaultModuleName = (document.head
            .querySelector('[property="js:entry"]') 
            || { content: 'bundle' }).content;
        includeScript(defaultModuleName);
    };

    dependencies.forEach(function (dependency) {
        var scriptElement = includeScript(
            dependency.replace(':async', ''),
            dependency.indexOf(':') !== -1
        );

        bundleDependencies.push(scriptElement);

        scriptElement.onload = function () {
            bundleDependencies.totalLoaded = bundleDependencies.totalLoaded + 1;
            if (bundleDependencies.totalLoaded === bundleDependencies.length) {
                bundleDependencies.finish();
            }
        };
    });

    if (!bundleDependencies.length) {
        bundleDependencies.finish();
    }
}
else {
    includeScript(scriptBasePath + 'bundle.legacy.js');
}
