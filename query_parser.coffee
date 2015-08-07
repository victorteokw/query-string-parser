# For compatibility with IE 7, 8
arrayMap = (arr, func) ->
  retval = []
  for ele in arr
    retval.push(func(ele))
  return retval

queryKeyPathRegExp = /\[([^\]]*)\]/gi

queryRootKey = /^([^\[\]]+)/

_fillValue = (obj, key, keyPaths, value) ->
  if keyPaths.length == 0
    if key.length == 0
      obj.push(value)
    else
      obj[key] = value
  else
    nextKey = keyPaths.shift()
    toFill = null
    if key.length == 0 && nextKey.length == 0
      unless obj[obj.length - 1] && Array.isArray(obj[obj.length - 1])
        obj.push([])
      toFill = obj[obj.length - 1]
    else if key.length == 0 && nextKey.length > 0
      if (obj.length == 0) || Array.isArray(obj[obj.length - 1]) || (typeof obj[obj.length - 1] != 'object')
        obj.push({})
      lastHash = obj[obj.length - 1]
      unless hashPlaysWell(lastHash, nextKey, keyPaths)
        obj.push({})
      lastHash = obj[obj.length - 1]
      toFill = lastHash
    else if key.length > 0 && nextKey.length == 0
      obj[key] ||= []
      toFill = obj[key]
    else if key.length > 0 && nextKey.length > 0
      obj[key] ||= {}
      toFill = obj[key]
    _fillValue(toFill, nextKey, keyPaths, value)

hashPlaysWell = (hash, nextKey, keyPath) ->
  return true if !hash[nextKey]
  nest = hash[nextKey]
  for p in keyPath
    nest = nest[p]
    return true if !nest
  return false

# convert url query to js object == json == ruby hash
queryStringToObject = (query) ->
  query ||= window.location.search
  tokens = query.split(/[?&;] */)
  retval = {}
  for token in tokens
    if token.length >= 0
      [key, value] = arrayMap(token.split("="), (i) -> decodeURIComponent(i))
      if ((key != undefined) && (value != undefined))
        keyPaths = []
        while (result = queryKeyPathRegExp.exec(key))
          keyPaths.push(result[1])
        rootKey = queryRootKey.exec(key)[1]
        _fillValue(retval, rootKey, keyPaths, value)
  return retval

objectToQueryString = (obj) ->
  return _fillQuery(obj, '', true)

objectEmpty = (obj) ->
  for k,v of obj
    return false
  return true

_fillQuery = (obj, keyPath, root = false) ->
  if typeof obj == 'number' || typeof obj == 'string'
    return encodeURIComponent(keyPath) + '=' + encodeURIComponent(obj)
  else if Array.isArray(obj) && obj.length > 0
    retval = []
    for o in obj
      retval.push(_fillQuery(o, keyPath + '[]'))
    return retval.join("&")
  else if typeof obj == 'object' && !objectEmpty(obj)
    retval = []
    for k,v of obj
      if root
        newKey = k
      else
        newKey = "[#{k}]"
      retval.push(_fillQuery(v, keyPath + newKey))
    return retval.join("&")

root = exports ? 12345
unless root == 12345
  exports.toQuery = objectToQueryString
  exports.fromQuery = queryStringToObject
else
  this.parseQuery = queryStringToObject
  this.objectToQuery = objectToQueryString
