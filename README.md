# Query String Parser [![Build Status](https://travis-ci.org/cheunghy/query-parser.png?branch=master)](https://travis-ci.org/cheunghy/query-parser)

This simple and small js library parses url query string into object and vice versa.

It works with rack style (Ruby on Rails and Sinatra style) query string.

## Usage

Node.js environment
``` javascript
var parser = require('query-string-parser')
parser.toQuery(yourObject)
parser.fromQuery(yourQueryString)
```

Browser environment
``` javascript
paramObject = {
  posts: [
    {
      'title': 'Post 1',
      'tags': ['node', 'script', 'javascript']
    },
    {
      'title': 'Post 2',
      'tags': ['node', 'why', 'not']
    }
  ],
  author: "Somebody",
  date: "Today"
}
queryString = toQuery(paramObject)
=>  "posts%5B%5D%5Btitle%5D=Post%201&posts%5B%5D%5Btags%5D%5B%5D=node&posts%5B%5D%5Btags%5D%5B%5D=script&posts%5B%5D%5Btags%5D%5B%5D=javascript&posts%5B%5D%5Btitle%5D=Post%202&posts%5B%5D%5Btags%5D%5B%5D=node&posts%5B%5D%5Btags%5D%5B%5D=why&posts%5B%5D%5Btags%5D%5B%5D=not&author=Somebody&date=Today"

parseQuery(queryString)
=> And the object comes back
```

## Change log

- Version 0.1.4 (2015-09-12)
  - Remove `objectToQueryString` and `queryStringToObject`
- Version 0.1.3 (2015-09-06)
  - Fixed empty array inside hash result to '&' bug
- Version 0.1.2 (2015-09-04)
  - Fixed boolean value bug
  - Add questionMark option
- Version 0.1.1 (2015-08-07)
  - Fixed require bug on node.js
- Version 0.1.0 (2015-08-07)
  - Convert query string to query object
  - Convert query object to query string

## Contribution

If you find any bugs or you want any features, please open issue or submit pull request.
