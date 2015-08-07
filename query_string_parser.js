(function() {
  var arrayMap, hashPlaysWell, objectEmpty, objectToQueryString, queryKeyPathRegExp, queryRootKey, queryStringToObject, root, _fillQuery, _fillValue;

  arrayMap = function(arr, func) {
    var ele, retval, _i, _len;
    retval = [];
    for (_i = 0, _len = arr.length; _i < _len; _i++) {
      ele = arr[_i];
      retval.push(func(ele));
    }
    return retval;
  };

  queryKeyPathRegExp = /\[([^\]]*)\]/gi;

  queryRootKey = /^([^\[\]]+)/;

  _fillValue = function(obj, key, keyPaths, value) {
    var lastHash, nextKey, toFill;
    if (keyPaths.length === 0) {
      if (key.length === 0) {
        return obj.push(value);
      } else {
        return obj[key] = value;
      }
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
      return _fillValue(toFill, nextKey, keyPaths, value);
    }
  };

  hashPlaysWell = function(hash, nextKey, keyPath) {
    var nest, p, _i, _len;
    if (!hash[nextKey]) {
      return true;
    }
    nest = hash[nextKey];
    for (_i = 0, _len = keyPath.length; _i < _len; _i++) {
      p = keyPath[_i];
      nest = nest[p];
      if (!nest) {
        return true;
      }
    }
    return false;
  };

  queryStringToObject = function(query) {
    var key, keyPaths, result, retval, rootKey, token, tokens, value, _i, _len, _ref;
    query || (query = window.location.search);
    tokens = query.split(/[?&;] */);
    retval = {};
    for (_i = 0, _len = tokens.length; _i < _len; _i++) {
      token = tokens[_i];
      if (token.length >= 0) {
        _ref = arrayMap(token.split("="), function(i) {
          return decodeURIComponent(i);
        }), key = _ref[0], value = _ref[1];
        if ((key !== void 0) && (value !== void 0)) {
          keyPaths = [];
          while ((result = queryKeyPathRegExp.exec(key))) {
            keyPaths.push(result[1]);
          }
          rootKey = queryRootKey.exec(key)[1];
          _fillValue(retval, rootKey, keyPaths, value);
        }
      }
    }
    return retval;
  };

  objectToQueryString = function(obj) {
    return _fillQuery(obj, '', true);
  };

  objectEmpty = function(obj) {
    var k, v;
    for (k in obj) {
      v = obj[k];
      return false;
    }
    return true;
  };

  _fillQuery = function(obj, keyPath, root) {
    var k, newKey, o, retval, v, _i, _len;
    if (root == null) {
      root = false;
    }
    if (typeof obj === 'number' || typeof obj === 'string') {
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
        retval.push(_fillQuery(v, keyPath + newKey));
      }
      return retval.join("&");
    }
  };

  root = typeof exports !== "undefined" && exports !== null ? exports : 12345;

  if (root !== 12345) {
    exports.toQuery = objectToQueryString;
    exports.fromQuery = queryStringToObject;
  } else {
    this.parseQuery = queryStringToObject;
    this.objectToQuery = objectToQueryString;
  }

}).call(this);
