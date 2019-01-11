/*global exports */
(function(exports) {
  'use strict';

  const queryKeyPathRegExp = /\[([^\]]*)\]/gi;

  const queryRootKey = /^([^\[\]]+)/;

  const hashPlaysWell = function(hash, nextKey, keyPath) {
    if (!hash[nextKey]) {
      return true;
    }
    let nest = hash[nextKey];
    for (let i = 0, len = keyPath.length; i < len; i++) {
      nest = nest[keyPath[i]];
      if (!nest) {
        return true;
      }
    }
    return false;
  };

  // Returns boolean indicates object empty or not
  const objectEmpty = function(obj) {
    for (let k in obj) {
      return false;
    }
    return true;
  };

  const primitiveObj = function(obj) {
    return typeof obj === 'number' ||
      typeof obj === 'string' ||
      typeof obj === 'boolean';
  };

  const _fillValue = function(obj, key, keyPaths, value) {
    var lastHash, nextKey, toFill;
    if (keyPaths.length === 0) {
      if (key.length === 0) {
        obj.push(value);
      } else {
        obj[key] = value;
      }
      return;
    } else {
      nextKey = keyPaths.shift();
      toFill = null;
      if (key.length === 0 && nextKey.length === 0) {
        if (!(obj[obj.length - 1] && Array.isArray(obj[obj.length - 1]))) {
          obj.push([]);
        }
        toFill = obj[obj.length - 1];
      } else if (key.length === 0 && nextKey.length > 0) {
        if ((obj.length === 0) || Array.isArray(obj[obj.length - 1]) || (typeof obj[obj.length - 1] !== 'object')) {
          obj.push({});
        }
        lastHash = obj[obj.length - 1];
        if (!hashPlaysWell(lastHash, nextKey, keyPaths)) {
          obj.push({});
        }
        lastHash = obj[obj.length - 1];
        toFill = lastHash;
      } else if (key.length > 0 && nextKey.length === 0) {
        obj[key] || (obj[key] = []);
        toFill = obj[key];
      } else if (key.length > 0 && nextKey.length > 0) {
        obj[key] || (obj[key] = {});
        toFill = obj[key];
      }
      _fillValue(toFill, nextKey, keyPaths, value);
    }
  };

  const queryStringToObject = function(query) {
    if (!query) return undefined;
    const tokens = query.split(/[?&;] */);
    let retval = {};
    for (let i = 0, len = tokens.length; i < len; i++) {
      let token = tokens[i];
      if (token.length >= 0) {
        let [key, value] = token.split("=").map((t) => decodeURIComponent(t));
        if ((key !== void 0) && (value !== void 0)) {
          let keyPaths = [];
          let result;
          while ((result = queryKeyPathRegExp.exec(key))) {
            keyPaths.push(result[1]);
          }
          let rootKey = queryRootKey.exec(key)[1];
          _fillValue(retval, rootKey, keyPaths, value);
        }
      }
    }
    return retval;
  };

  const objectToQueryString = function(obj, options) {
    let retval = _fillQuery(obj, '', true);
    if (options && options.questionMark) {
      if (retval.length > 0) {
        retval = `?${retval}`;
      }
    }
    return retval;
  };

  const _fillQuery = function(obj, keyPath, root) {
    var k, newKey, o, retval, v, _i, _len, fillResult;
    if (root == null) {
      root = false;
    }

    if (primitiveObj(obj)) {
      return encodeURIComponent(keyPath) + '=' + encodeURIComponent(obj);
    } else if (Array.isArray(obj) && obj.length > 0) {
      retval = [];
      for (_i = 0, _len = obj.length; _i < _len; _i++) {
        o = obj[_i];
        retval.push(_fillQuery(o, keyPath + '[]'));
      }
      return retval.join("&");
    } else if (typeof obj === 'object' && !objectEmpty(obj)) {
      retval = [];
      for (k in obj) {
        v = obj[k];
        if (root) {
          newKey = k;
        } else {
          newKey = `[${k}]`;
        }
        fillResult = _fillQuery(v, keyPath + newKey);
        if (fillResult.length > 0) {
          retval.push(fillResult);
        }
      }
      return retval.join("&");
    }
    return '';
  };

  exports.toQuery = objectToQueryString;
  exports.fromQuery = queryStringToObject;
  exports.parseQuery = queryStringToObject;
  exports.querify = objectToQueryString;
  exports.stringify = objectToQueryString;

})(typeof exports !== "undefined" && exports != null ? exports : window);
