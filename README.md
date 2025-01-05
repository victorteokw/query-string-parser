# Query String Parser [![Build Status](https://img.shields.io/github/actions/workflow/status/victorteokw/query-string-parser/CI.yml.svg?style=flat-square&color=green&logo=github)](https://github.com/victorteokw/query-string-parser/actions)

A JavaScript query string parser which works with Rack style (Ruby on Rails and
Sinatra style) query string.

* ✅ Object to query string
* ✅ Query string to object
* ✅ Works for simple query string like `"?a=1&b=2"`
* ✅ For complicated query, this package is compatible with Ruby Rack style
* ✅ Type-safe with TypeScript interface

## Installation

```sh
npm i query-string-parser
```

## Usage

Node.js environment
``` javascript
const { toQuery, fromQuery } = require('query-string-parser')
const queryString = toQuery({ "a": 1 })
=> "a=1"
fromQuery("a=1")
=> { "a": "1" }
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
=> "posts%5B%5D%5Btitle%5D=Post%201&posts%5B%5D%5Btags%5D%5B%5D=node&posts%5B%5D%5Btags%5D%5B%5D=script&posts%5B%5D%5Btags%5D%5B%5D=javascript&posts%5B%5D%5Btitle%5D=Post%202&posts%5B%5D%5Btags%5D%5B%5D=node&posts%5B%5D%5Btags%5D%5B%5D=why&posts%5B%5D%5Btags%5D%5B%5D=not&author=Somebody&date=Today"

parseQuery(queryString)
=> And the object comes back
```

## Change log

- Version 1.0.0 (2025-01-05)
  - Update TypeScript definitions
- Version 0.2.4 (2024-04-14)
  - Add TypeScript definitions
- Version 0.2.3 (2019-01-11)
  - Fixing passing empty parameter crashes in node.js
- Version 0.2.1 (2018-06-13)
  - Testing on newer node.js environments
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
