# Query String Parser

This simple and small js library parses url query string into object and vice versa.

It works with rack style (Ruby on Rails and Sinatra style) query string.

# Usage

Node.js environment
``` javascript
var parser = require('query-string-parser')
parser.toQuery(yourObject)
parser.toObject(yourQueryString)
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
queryString = objectToQuery(paramObject)
=>  "posts%5B%5D%5Btitle%5D=Post%201&posts%5B%5D%5Btags%5D%5B%5D=node&posts%5B%5D%5Btags%5D%5B%5D=script&posts%5B%5D%5Btags%5D%5B%5D=javascript&posts%5B%5D%5Btitle%5D=Post%202&posts%5B%5D%5Btags%5D%5B%5D=node&posts%5B%5D%5Btags%5D%5B%5D=why&posts%5B%5D%5Btags%5D%5B%5D=not&author=Somebody&date=Today"

parseQuery(queryString)
=> And the object comes back
```
