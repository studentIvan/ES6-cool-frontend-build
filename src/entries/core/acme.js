import 'core-js/es6/promise';

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

const harmonyMode = isSupportsBasicES6() 
  && isSupportsDefaultParamsDestructing();

const start = () => {

  /**
   * you can modify this function for CDN or several hosts
   *
   * use the https://www.srihash.org/ for SRI hash generation
   * @param  {String} moduleName
   * @return {Iterator} path
   */
  const getScriptData = (moduleName) => {
    let nextIndex = 0;
    const _getScriptObject = (result) => {
      return typeof result === 'string' ? { url: result } : result;
    }
    if (moduleName === 'legacy') {
      return { next: () => {
        return nextIndex++ === 0
          ? { value: _getScriptObject(`${scriptBasePath}/bundle.legacy.js`), done: false }
          : { done: true }
      } }
    }
    else if (resources[moduleName] && nextIndex < resources[moduleName].length) {
      return { next: () => {
        return nextIndex < resources[moduleName].length 
          ? { value: _getScriptObject(resources[moduleName][nextIndex++]), done: false }
          : { done: true }
      } }
    }
    else {
      let value = _getScriptObject(`${scriptBasePath}/${moduleName}/${moduleName}.js`);
      return { next: () => {
        return nextIndex++ < 1
          ? { value, done: false } : { done: true }
      } };
    }
  };

  const metaJSRead = (property, defaultValue = '') => 
      (document.head.querySelector(`[property="js:${property}"]`) 
      || { content: defaultValue }).content;

  const pageEntry = metaJSRead('entry');
  const appVersionCode = metaJSRead('app-ver');
  const libraries = metaJSRead('dependencies:libraries').split(',').filter(x => x);
  const modules = metaJSRead('dependencies:modules').split(',').filter(x => x);

  const includeScript = (moduleName, asyncScript = false, withVersion = false) => {
    const scriptDataIterator = getScriptData(moduleName);

    const _createScript = () => {
      return new Promise((resolve, reject) => {
        let scriptData = scriptDataIterator.next();
        if (scriptData.done) { return reject(); }
        let scriptElement = document.createElement('script');
        if (asyncScript) { scriptElement.async = 'async'; }
        if (scriptData.value.integrity) {
          scriptElement.integrity = scriptData.value.integrity;
          scriptElement.crossOrigin = scriptData.value.crossOrigin;
        }

        scriptElement.src = 
          `${scriptData.value.url}${withVersion ? `?v=${appVersionCode}` : ''}`;

        document.head.appendChild(scriptElement);
        scriptElement.onload = () => {resolve();}
        scriptElement.onerror = () => 
          _createScript().then(() => resolve()).catch(() => reject());
      });
    }

    return _createScript();
  }

  let chain = Promise.resolve();
  let loadedLibsCount = 0;
  let loadedModulesCount = 0;

  const modulesLoadedCallback = () => {
    loadedModulesCount = loadedModulesCount + 1;
    if (loadedModulesCount >= modules.length) {
      includeScript(pageEntry, true, true);
    }
  }

  const libsLoadedCallback = () => {
    loadedLibsCount = loadedLibsCount + 1;
    if (loadedLibsCount >= libraries.length) {
      /* the all libraries are loaded now */
      if (harmonyMode) {
        if (!modules.length) { modulesLoadedCallback(); }
        let chain = Promise.resolve();
        for (let syncModule of modules) {
          let [module, moduleData] = syncModule.split(':');
          let isModuleAsync = moduleData === 'async';
          chain = chain.then(() => {
            if (isModuleAsync) {
              includeScript(module, true, true).then(() => modulesLoadedCallback());
              return Promise.resolve();
            }
            else {
              modulesLoadedCallback();
              return includeScript(module, false, true);
            }
          });
        }
      }
      else {
        /* this browser does now support es6 well - load legacy */
        includeScript('legacy', false, true);
      }
    }
  };

  if (!libraries.length) { libsLoadedCallback(); }
  for (let syncLib of libraries) {
    let [lib, libData] = syncLib.split(':');
    let isLibAsync = libData === 'async';
    chain = chain.then(() => {
      if (isLibAsync) {
        includeScript(lib, true).then(() => libsLoadedCallback());
        return Promise.resolve();
      }
      else {
        libsLoadedCallback();
        return includeScript(lib);
      }
    });
  }
};

if (!harmonyMode) { System.import('babel-polyfill').then(() => start()) } else { start() }
