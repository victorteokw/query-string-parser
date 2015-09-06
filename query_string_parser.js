/*global exports */
'use strict';

(function (exports) {
  'use strict';

  var arrayMap = function arrayMap(arr, func) {
    var retval = [];
    for (var i = 0, len = arr.length; i < len; i++) {
      retval.push(func(arr[i]));
    }
    return retval;
  };

  var queryKeyPathRegExp = /\[([^\]]*)\]/gi;

  var queryRootKey = /^([^\[\]]+)/;

  var hashPlaysWell = function hashPlaysWell(hash, nextKey, keyPath) {
    if (!hash[nextKey]) {
      return true;
    }
    var nest = hash[nextKey];
    for (var i = 0, len = keyPath.length; i < len; i++) {
      nest = nest[keyPath[i]];
      if (!nest) {
        return true;
      }
    }
    return false;
  };

  // Returns boolean indicates object empty or not
  var objectEmpty = function objectEmpty(obj) {
    var k, v;
    for (k in obj) {
      return false;
    }
    return true;
  };

  var primitiveObj = function primitiveObj(obj) {
    return typeof obj === 'number' || typeof obj === 'string' || typeof obj === 'boolean';
  };

  var _fillValue = function _fillValue(obj, key, keyPaths, value) {
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
        if (obj.length === 0 || Array.isArray(obj[obj.length - 1]) || typeof obj[obj.length - 1] !== 'object') {
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

  var queryStringToObject = function queryStringToObject(query) {
    query || (query = window.location.search);
    var tokens = query.split(/[?&;] */);
    var retval = {};
    var token;
    var _ref;
    var key, value;
    var keyPaths;
    var result;
    var rootKey;
    for (var i = 0, len = tokens.length; i < len; i++) {
      token = tokens[i];
      if (token.length >= 0) {
        _ref = arrayMap(token.split("="), function (t) {
          return decodeURIComponent(t);
        });
        key = _ref[0];value = _ref[1];
        if (key !== void 0 && value !== void 0) {
          keyPaths = [];
          while (result = queryKeyPathRegExp.exec(key)) {
            keyPaths.push(result[1]);
          }
          rootKey = queryRootKey.exec(key)[1];
          _fillValue(retval, rootKey, keyPaths, value);
        }
      }
    }
    return retval;
  };

  var objectToQueryString = function objectToQueryString(obj, options) {
    var retval = _fillQuery(obj, '', true);
    if (options && options.questionMark) {
      if (retval.length > 0) {
        retval = "?" + retval;
      }
    }
    return retval;
  };

  var _fillQuery = function _fillQuery(obj, keyPath, root) {
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
          newKey = "[" + k + "]";
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
  exports.objectToQueryString = objectToQueryString;
  exports.queryStringToObject = queryStringToObject;
})(typeof exports !== "undefined" && exports != null ? exports : window);