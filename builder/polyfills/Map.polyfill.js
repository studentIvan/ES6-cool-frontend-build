/* Polyfill service v3.13.0
 * For detailed credits and licence information see http://github.com/financial-times/polyfill-service.
 * 
 * UA detected: ie/11.0.0
 * Features requested: Map
 * 
 * - Symbol, License: MIT (required by "Map", "Symbol.iterator", "Symbol.species")
 * - Symbol.iterator, License: MIT (required by "Map")
 * - Symbol.species, License: MIT (required by "Map")
 * - Number.isNaN, License: MIT (required by "Map")
 * - Map, License: CC0 */

(function(undefined) {

// Symbol
// A modification of https://github.com/WebReflection/get-own-property-symbols
// (C) Andrea Giammarchi - MIT Licensed

(function (Object, GOPS, global) {

    var setDescriptor;
    var id = 0;
    var random = '' + Math.random();
    var prefix = '__\x01symbol:';
    var prefixLength = prefix.length;
    var internalSymbol = '__\x01symbol@@' + random;
    var DP = 'defineProperty';
    var DPies = 'defineProperties';
    var GOPN = 'getOwnPropertyNames';
    var GOPD = 'getOwnPropertyDescriptor';
    var PIE = 'propertyIsEnumerable';
    var ObjectProto = Object.prototype;
    var hOP = ObjectProto.hasOwnProperty;
    var pIE = ObjectProto[PIE];
    var toString = ObjectProto.toString;
    var concat = Array.prototype.concat;
    var cachedWindowNames = typeof window === 'object' ? Object.getOwnPropertyNames(window) : [];
    var nGOPN = Object[GOPN];
    var gOPN = function getOwnPropertyNames (obj) {
        if (toString.call(obj) === '[object Window]') {
            try {
                return nGOPN(obj);
            } catch (e) {
                // IE bug where layout engine calls userland gOPN for cross-domain `window` objects
                return concat.call([], cachedWindowNames);
            }
        }
        return nGOPN(obj);
    };
    var gOPD = Object[GOPD];
    var create = Object.create;
    var keys = Object.keys;
    var freeze = Object.freeze || Object;
    var defineProperty = Object[DP];
    var $defineProperties = Object[DPies];
    var descriptor = gOPD(Object, GOPN);
    var addInternalIfNeeded = function (o, uid, enumerable) {
        if (!hOP.call(o, internalSymbol)) {
            try {
                defineProperty(o, internalSymbol, {
                    enumerable: false,
                    configurable: false,
                    writable: false,
                    value: {}
                });
            } catch (e) {
                o.internalSymbol = {};
            }
        }
        o[internalSymbol]['@@' + uid] = enumerable;
    };
    var createWithSymbols = function (proto, descriptors) {
        var self = create(proto);
        gOPN(descriptors).forEach(function (key) {
            if (propertyIsEnumerable.call(descriptors, key)) {
                $defineProperty(self, key, descriptors[key]);
            }
        });
        return self;
    };
    var copyAsNonEnumerable = function (descriptor) {
        var newDescriptor = create(descriptor);
        newDescriptor.enumerable = false;
        return newDescriptor;
    };
    var get = function get(){};
    var onlyNonSymbols = function (name) {
        return name != internalSymbol &&
            !hOP.call(source, name);
    };
    var onlySymbols = function (name) {
        return name != internalSymbol &&
            hOP.call(source, name);
    };
    var propertyIsEnumerable = function propertyIsEnumerable(key) {
        var uid = '' + key;
        return onlySymbols(uid) ? (
            hOP.call(this, uid) &&
            this[internalSymbol]['@@' + uid]
        ) : pIE.call(this, key);
    };
    var setAndGetSymbol = function (uid) {
        var descriptor = {
            enumerable: false,
            configurable: true,
            get: get,
            set: function (value) {
            setDescriptor(this, uid, {
                enumerable: false,
                configurable: true,
                writable: true,
                value: value
            });
            addInternalIfNeeded(this, uid, true);
            }
        };
        try {
            defineProperty(ObjectProto, uid, descriptor);
        } catch (e) {
            ObjectProto[uid] = descriptor.value;
        }
        return freeze(source[uid] = defineProperty(
            Object(uid),
            'constructor',
            sourceConstructor
        ));
    };
    var Symbol = function Symbol(description) {
        if (this instanceof Symbol) {
            throw new TypeError('Symbol is not a constructor');
        }
        return setAndGetSymbol(
            prefix.concat(description || '', random, ++id)
        );
        };
    var source = create(null);
    var sourceConstructor = {value: Symbol};
    var sourceMap = function (uid) {
        return source[uid];
        };
    var $defineProperty = function defineProp(o, key, descriptor) {
        var uid = '' + key;
        if (onlySymbols(uid)) {
            setDescriptor(o, uid, descriptor.enumerable ?
                copyAsNonEnumerable(descriptor) : descriptor);
            addInternalIfNeeded(o, uid, !!descriptor.enumerable);
        } else {
            defineProperty(o, key, descriptor);
        }
        return o;
        };
    var $getOwnPropertySymbols = function getOwnPropertySymbols(o) {
        return gOPN(o).filter(onlySymbols).map(sourceMap);
        }
    ;

    descriptor.value = $defineProperty;
    defineProperty(Object, DP, descriptor);

    descriptor.value = $getOwnPropertySymbols;
    defineProperty(Object, GOPS, descriptor);

    descriptor.value = function getOwnPropertyNames(o) {
        return gOPN(o).filter(onlyNonSymbols);
    };
    defineProperty(Object, GOPN, descriptor);

    descriptor.value = function defineProperties(o, descriptors) {
        var symbols = $getOwnPropertySymbols(descriptors);
        if (symbols.length) {
        keys(descriptors).concat(symbols).forEach(function (uid) {
            if (propertyIsEnumerable.call(descriptors, uid)) {
            $defineProperty(o, uid, descriptors[uid]);
            }
        });
        } else {
        $defineProperties(o, descriptors);
        }
        return o;
    };
    defineProperty(Object, DPies, descriptor);

    descriptor.value = propertyIsEnumerable;
    defineProperty(ObjectProto, PIE, descriptor);

    descriptor.value = Symbol;
    defineProperty(global, 'Symbol', descriptor);

    // defining `Symbol.for(key)`
    descriptor.value = function (key) {
        var uid = prefix.concat(prefix, key, random);
        return uid in ObjectProto ? source[uid] : setAndGetSymbol(uid);
    };
    defineProperty(Symbol, 'for', descriptor);

    // defining `Symbol.keyFor(symbol)`
    descriptor.value = function (symbol) {
        if (onlyNonSymbols(symbol))
        throw new TypeError(symbol + ' is not a symbol');
        return hOP.call(source, symbol) ?
        symbol.slice(prefixLength * 2, -random.length) :
        void 0
        ;
    };
    defineProperty(Symbol, 'keyFor', descriptor);

    descriptor.value = function getOwnPropertyDescriptor(o, key) {
        var descriptor = gOPD(o, key);
        if (descriptor && onlySymbols(key)) {
        descriptor.enumerable = propertyIsEnumerable.call(o, key);
        }
        return descriptor;
    };
    defineProperty(Object, GOPD, descriptor);

    descriptor.value = function (proto, descriptors) {
        return arguments.length === 1 || typeof descriptors === "undefined" ?
        create(proto) :
        createWithSymbols(proto, descriptors);
    };
    defineProperty(Object, 'create', descriptor);

    descriptor.value = function () {
        var str = toString.call(this);
        return (str === '[object String]' && onlySymbols(this)) ? '[object Symbol]' : str;
    };
    defineProperty(ObjectProto, 'toString', descriptor);


    setDescriptor = function (o, key, descriptor) {
        var protoDescriptor = gOPD(ObjectProto, key);
        delete ObjectProto[key];
        defineProperty(o, key, descriptor);
        defineProperty(ObjectProto, key, protoDescriptor);
    };

}(Object, 'getOwnPropertySymbols', this));

// Symbol.iterator
Object.defineProperty(Symbol, 'iterator', {value: Symbol('iterator')});

// Symbol.species
Object.defineProperty(Symbol, 'species', {value: Symbol('species')});

// Number.isNaN
Number.isNaN = Number.isNaN || function(value) {
    return typeof value === "number" && isNaN(value);
};

// Map
(function(global) {


    // Deleted map items mess with iterator pointers, so rather than removing them mark them as deleted. Can't use undefined or null since those both valid keys so use a private symbol.
    var undefMarker = Symbol('undef');

    // NaN cannot be found in an array using indexOf, so we encode NaNs using a private symbol.
    var NaNMarker = Symbol('NaN');

    function encodeKey(key) {
        return Number.isNaN(key) ? NaNMarker : key;
    }
    function decodeKey(encodedKey) {
        return (encodedKey === NaNMarker) ? NaN : encodedKey;
    }

    function makeIterator(mapInst, getter) {
        var nextIdx = 0;
        var done = false;
        return {
            next: function() {
                if (nextIdx === mapInst._keys.length) done = true;
                if (!done) {
                    while (mapInst._keys[nextIdx] === undefMarker) nextIdx++;
                    return {value: getter.call(mapInst, nextIdx++), done: false};
                } else {
                    return {value: void 0, done:true};
                }
            }
        };
    }

    function calcSize(mapInst) {
        var size = 0;
        for (var i=0, s=mapInst._keys.length; i<s; i++) {
            if (mapInst._keys[i] !== undefMarker) size++;
        }
        return size;
    }

    var ACCESSOR_SUPPORT = true;

    var Map = function(data) {
        this._keys = [];
        this._values = [];

        // If `data` is iterable (indicated by presence of a forEach method), pre-populate the map
        data && (typeof data.forEach === 'function') && data.forEach(function (item) {
            this.set.apply(this, item);
        }, this);

        if (!ACCESSOR_SUPPORT) this.size = calcSize(this);
    };
    Map.prototype = {};

    // Some old engines do not support ES5 getters/setters.  Since Map only requires these for the size property, we can fall back to setting the size property statically each time the size of the map changes.
    try {
        Object.defineProperty(Map.prototype, 'size', {
            get: function() {
                return calcSize(this);
            }
        });
    } catch(e) {
        ACCESSOR_SUPPORT = false;
    }

    Map.prototype['get'] = function(key) {
        var idx = this._keys.indexOf(encodeKey(key));
        return (idx !== -1) ? this._values[idx] : undefined;
    };
    Map.prototype['set'] = function(key, value) {
        var idx = this._keys.indexOf(encodeKey(key));
        if (idx !== -1) {
            this._values[idx] = value;
        } else {
            this._keys.push(encodeKey(key));
            this._values.push(value);
            if (!ACCESSOR_SUPPORT) this.size = calcSize(this);
        }
        return this;
    };
    Map.prototype['has'] = function(key) {
        return (this._keys.indexOf(encodeKey(key)) !== -1);
    };
    Map.prototype['delete'] = function(key) {
        var idx = this._keys.indexOf(encodeKey(key));
        if (idx === -1) return false;
        this._keys[idx] = undefMarker;
        this._values[idx] = undefMarker;
        if (!ACCESSOR_SUPPORT) this.size = calcSize(this);
        return true;
    };
    Map.prototype['clear'] = function() {
        this._keys = this._values = [];
        if (!ACCESSOR_SUPPORT) this.size = 0;
    };
    Map.prototype['values'] = function() {
        return makeIterator(this, function(i) { return this._values[i]; });
    };
    Map.prototype['keys'] = function() {
        return makeIterator(this, function(i) { return decodeKey(this._keys[i]); });
    };
    Map.prototype['entries'] =
    Map.prototype[Symbol.iterator] = function() {
        return makeIterator(this, function(i) { return [decodeKey(this._keys[i]), this._values[i]]; });
    };
    Map.prototype['forEach'] = function(callbackFn, thisArg) {
        thisArg = thisArg || global;
        var iterator = this.entries();
        var result = iterator.next();
        while (result.done === false) {
            callbackFn.call(thisArg, result.value[1], result.value[0], this);
            result = iterator.next();
        }
    };
    Map.prototype['constructor'] =
    Map.prototype[Symbol.species] = Map;

    Map.length = 0;

    // Export the object
    this.Map = Map;

}(this));

})
.call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});