compile arrow functions/object.assign/Map/etc for IE/Android/etc in different files

bundle.js - main bundle
bundle.legacy.js - ie11/android/old safari 9-/FF ESR

total ES6/7 features stable and transpilable to old

1. default function parameters
    IE11: false, Safari 9: false, Android: false
    Safari: true, FF: true, Chrome: true, Edge: true

    except:
    temporal dead zone: Uncaught ReferenceError: x is not defined
    separate scope: ? (ff)
    new Function() support

2. rest parameters: function (a, b, ...theArgs)
    IE11: false, Safari 9: false, Android: false
    Safari: true, FF: true, Chrome: true, Edge: true

3. spread operator: ...
    IE11: false, Safari 9: false, Android: false
    Safari: true, FF: true, Chrome: true, Edge: true

4. object literal extension: var baz = { foo }; baz[foo] = 'ponyfoo'
    IE11: false, Safari 9: false, Android: false
    Safari: true, FF: true, Chrome: true, Edge: true

5. for of loops
    IE11: false, Safari 9: true, Android <=5.0: false
    Safari: true, FF: true, Chrome: true, Edge: true, Android 5.1: true

    except
    iterator closing, break
    iterator closing, throw

6. octal and binary literals
    IE11: false, Safari 9: true, Android: false
    Safari: true, FF: true, Chrome: true, Edge: true

7. template literals: `` except toString conversion
    IE11: false, Safari 9: true, Android: false
    Safari: true, FF: true, Chrome: true, Edge: true

8. RegExp y, u flags: except y
    IE11: false, Safari 9: false, Android: false
    Safari: true, FF: false, Chrome: true, Edge: true

9. destructing, declarations: 
    IE11: false, Safari 9: false, Android: false
    Safari: true, FF: false, Chrome: true, Edge: false

10. destructuring, assignment: 
    IE11: false, Safari 9: false, Android: false
    Safari: true, FF: false, Chrome: true, Edge: false

11. destructuring, parameters: 
    IE11: false, Safari 9: false, Android: false
    Safari: true, FF: true, FF ESR: false, Chrome: true, Edge: true

  function isBrowserSupportsDefaultParamsDestructing() {
    try {
      eval('(function({a = 1, b = 0, c = 3, x:d = 0, y:e = 5},'
        + '  [f = 6, g = 0, h = 8]) {'
        + 'return a === 1 && b === 2 && c === 3 && d === 4 &&'
        + 'e === 5 && f === 6 && g === 7 && h === 8;'
        + '}({b:2, c:undefined, x:4},[, 7, undefined]));');
      return true;
    } catch (e) { return false; }
  }

12. unicode code point escapes: except identifiers
    IE11: false, Safari 9: false, Android: false
    Safari: true, FF: true, FF ESR: false, Chrome: true, Edge: true

13. new.target: unsupported

14. const, let, block function declaration
    IE11: true, Safari 9: false, Android: false
    Safari: true, FF: true, FF ESR: false, Chrome: true, Edge: true

15. arrow, class, super, generators
    IE11: false, Safari 9: false, Android: false
    Safari: true, FF: true, FF ESR: true, Chrome: true, Edge: true

16. typed arrays
    IE11: false, Safari 9: false, Android: false
    Safari: true, FF: true, FF ESR: false, Chrome: true, Edge: true

17. map, set, weakmap, weakset
    IE11: false, Safari 9: true, Android: false
    Safari: true, FF: true, FF ESR: false, Chrome: true, Edge: true

18. proxy: intranspilable by babel, but has google polyfill
    IE11: false, Safari 9: false, Android: false
    Safari: true, FF: true, FF ESR: false, Chrome: true, Edge: true


ES6+ usable
Array.prototype.includes: not supported by iOS9, IE11, Android
nested rest destructing: not supported by !!!SF10
    var [x, ...[y, ...z]] = [1,2,3,4];
    return x === 1 && y === 2 && z + '' === '3,4';

Object.values !!!SF10
Object.entries !!!SF10
String.prototype.padStart !!!Chrome (can be polifylled)
Trailing commas in function syntax !!!Chrome, !!!FF,  should be transpiled
async/await should be transpiled into generators


ES2017 annex b usable
Object.prototype getters/setters Chrome/Edge 80%, can be transpiled


ES NEXT usable

STAGE 3
for await - should be transpiled

STAGE 2
class decorators - should be transpiled

STAGE 1
Observable - should be transpiled

STAGE 0
bind operator - should be transpiled


Use the webpack for the legacy
Use the webpack for the normal browsers
Use the different configurations for the babel (legacy and normal)

Separate often use modules into different files
