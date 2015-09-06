var assert = require("assert");
var queryStringParser = require("../query_string_parser.js");

describe("compatibility with rack: ", function(){

  describe('object to query: ', function(){

    describe('very simple object: ', function(){

      it("object with only 1 pair", function(){
        assert.equal(queryStringParser.toQuery({
          "id": 32
        }), "id=32");
      });

      it("object with several pairs", function(){
        assert.equal(queryStringParser.toQuery({
          "id": 25,
          "name": "John"
        }), "id=25&name=John");
      });

      it("empty object", function(){
        assert.equal(queryStringParser.toQuery({
        }), "");
      });

    });

    describe('nested hash: ', function(){

      it("normal nested hash", function(){
        assert.equal(queryStringParser.toQuery({
          "id": 24,
          "id2": 25,
          "nest": {
            "id": 25,
            "id2": 26
          }
        }), "id=24&id2=25&nest%5Bid%5D=25&nest%5Bid2%5D=26");
      });

      it("nested many levels", function(){
        assert.equal(queryStringParser.toQuery({
          "a": "b",
          "c": "d",
          "e": {
            "f": "g",
            "h": "i",
            "j": {
              "k": "l",
              "m": "n",
              "o": {
                "p": "q",
                "r": {
                  "s": {
                    "t": {
                      "u": {
                        "v": {
                          "w": "x",
                          "y": "z"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }), "a=b&c=d&e%5Bf%5D=g&e%5Bh%5D=i&e%5Bj%5D%5Bk%5D=l&e%5Bj%5D%5Bm%5D=n&e%5Bj%5D%5Bo%5D%5Bp%5D=q&e%5Bj%5D%5Bo%5D%5Br%5D%5Bs%5D%5Bt%5D%5Bu%5D%5Bv%5D%5Bw%5D=x&e%5Bj%5D%5Bo%5D%5Br%5D%5Bs%5D%5Bt%5D%5Bu%5D%5Bv%5D%5By%5D=z");
      });

      it("has many nested hashes", function(){
        assert.equal(queryStringParser.toQuery({
          "a": "b",
          "c": "d",
          "e": {
            "f": "g",
            "h": "i"
          },
          "j": "k",
          "l": "m",
          "n": {
            "o": "p",
            "q": "r"
          },
          "s": {
            "t": "u",
            "v": "w"
          },
          "x": {
            "y": "z"
          }
        }), "a=b&c=d&e%5Bf%5D=g&e%5Bh%5D=i&j=k&l=m&n%5Bo%5D=p&n%5Bq%5D=r&s%5Bt%5D=u&s%5Bv%5D=w&x%5By%5D=z");
      });

    });

    describe('nested with array: ', function(){

      it("normal nested with array", function(){
        assert.equal(queryStringParser.toQuery({
          "ids": [1, 2, 3, 4, 5, 6],
          "brand": "abcde"
        }), "ids%5B%5D=1&ids%5B%5D=2&ids%5B%5D=3&ids%5B%5D=4&ids%5B%5D=5&ids%5B%5D=6&brand=abcde");
      });

      it("has many arrays", function(){
        assert.equal(queryStringParser.toQuery({
          "ids": [1, 2, 3, 4, 5, 6],
          "brands": ["abc", "def", "ghi", "lmn", "opq", "rst"],
          "seller": "Michael"
        }), "ids%5B%5D=1&ids%5B%5D=2&ids%5B%5D=3&ids%5B%5D=4&ids%5B%5D=5&ids%5B%5D=6&brands%5B%5D=abc&brands%5B%5D=def&brands%5B%5D=ghi&brands%5B%5D=lmn&brands%5B%5D=opq&brands%5B%5D=rst&seller=Michael");
      });

      it("nested many arrays", function(){
        assert.equal(queryStringParser.toQuery({
          "a": [["1"], ["2"], ["3"]]
        }), "a%5B%5D%5B%5D=1&a%5B%5D%5B%5D=2&a%5B%5D%5B%5D=3");
      });

      it("nested array with primitives", function(){
        assert.equal(queryStringParser.toQuery({
          "a": [1, ["2"], 3]
        }), "a%5B%5D=1&a%5B%5D%5B%5D=2&a%5B%5D=3");
      });

      it("nested many level array with primitives", function(){
        assert.equal(queryStringParser.toQuery({
          "a": [1, [2, [3, 4, [5], 6], 7], 8]
        }), "a%5B%5D=1&a%5B%5D%5B%5D=2&a%5B%5D%5B%5D%5B%5D=3&a%5B%5D%5B%5D%5B%5D=4&a%5B%5D%5B%5D%5B%5D%5B%5D=5&a%5B%5D%5B%5D%5B%5D=6&a%5B%5D%5B%5D=7&a%5B%5D=8");
      });

    });

    describe('with nested array and hashes', function(){

      it("simple nested array and hashes", function(){
        assert.equal(queryStringParser.toQuery({
          "a": {
            "b": "c",
            "d": ["e", "f", "g", "h"]
          },
          "i": ["j", "k", "l", "m", {
            "n": "o",
            "p": "q",
            "r": "s"
          }],
          "t": {
            "u": [{
              "v": "w",
              "x": {
                "y": "z"
              }
            }]
          }
        }), "a%5Bb%5D=c&a%5Bd%5D%5B%5D=e&a%5Bd%5D%5B%5D=f&a%5Bd%5D%5B%5D=g&a%5Bd%5D%5B%5D=h&i%5B%5D=j&i%5B%5D=k&i%5B%5D=l&i%5B%5D=m&i%5B%5D%5Bn%5D=o&i%5B%5D%5Bp%5D=q&i%5B%5D%5Br%5D=s&t%5Bu%5D%5B%5D%5Bv%5D=w&t%5Bu%5D%5B%5D%5Bx%5D%5By%5D=z");
      });

      it('with array of hashes', function(){
        assert.equal(queryStringParser.toQuery({
          "items": [{"name": "Qwe", "id": 1},
                    {"name": "Qww", "id": 2},
                    {"name": "Qwq", "id": 3},
                    {"name": "Qwa", "id": 4},
                    {"name": "Qws", "id": 5},
                    {"name": "Qwd", "id": 6},
                    {"name": "Qwf", "id": 7},
                    {"name": "Qwg", "id": 8}]
        }), "items%5B%5D%5Bname%5D=Qwe&items%5B%5D%5Bid%5D=1&items%5B%5D%5Bname%5D=Qww&items%5B%5D%5Bid%5D=2&items%5B%5D%5Bname%5D=Qwq&items%5B%5D%5Bid%5D=3&items%5B%5D%5Bname%5D=Qwa&items%5B%5D%5Bid%5D=4&items%5B%5D%5Bname%5D=Qws&items%5B%5D%5Bid%5D=5&items%5B%5D%5Bname%5D=Qwd&items%5B%5D%5Bid%5D=6&items%5B%5D%5Bname%5D=Qwf&items%5B%5D%5Bid%5D=7&items%5B%5D%5Bname%5D=Qwg&items%5B%5D%5Bid%5D=8");
      });

    });

    describe('omit empty array', function(){

      it("should not generate empty string for empty array", function(){
        assert.equal(queryStringParser.toQuery({
          a: [],
          b: [],
          c: []
        }), "");
      });

    });

  });

  describe('query to object: ', function(){

    it("simple query", function(){
      assert.deepEqual(queryStringParser.fromQuery("a=b"), {"a": "b"});
    });

    it("query with nested array and hashes", function(){
      assert.deepEqual(queryStringParser.fromQuery("a%5Bb%5D=c&a%5Bd%5D%5B%5D=e&a%5Bd%5D%5B%5D=f&a%5Bd%5D%5B%5D=g&a%5Bd%5D%5B%5D=h&i%5B%5D=j&i%5B%5D=k&i%5B%5D=l&i%5B%5D=m&i%5B%5D%5Bn%5D=o&i%5B%5D%5Bp%5D=q&i%5B%5D%5Br%5D=s&t%5Bu%5D%5B%5D%5Bv%5D=w&t%5Bu%5D%5B%5D%5Bx%5D%5By%5D=z"), {
        "a": {
          "b": "c",
          "d": ["e", "f", "g", "h"]
        },
        "i": ["j", "k", "l", "m", {
          "n": "o",
          "p": "q",
          "r": "s"
        }],
        "t": {
          "u": [{
            "v": "w",
            "x": {
              "y": "z"
            }
          }]
        }
      });
    });

    it("query with array of hashes", function(){
      assert.deepEqual(queryStringParser.fromQuery("items%5B%5D%5Bname%5D=Qwe&items%5B%5D%5Bid%5D=1&items%5B%5D%5Bname%5D=Qww&items%5B%5D%5Bid%5D=2&items%5B%5D%5Bname%5D=Qwq&items%5B%5D%5Bid%5D=3&items%5B%5D%5Bname%5D=Qwa&items%5B%5D%5Bid%5D=4&items%5B%5D%5Bname%5D=Qws&items%5B%5D%5Bid%5D=5&items%5B%5D%5Bname%5D=Qwd&items%5B%5D%5Bid%5D=6&items%5B%5D%5Bname%5D=Qwf&items%5B%5D%5Bid%5D=7&items%5B%5D%5Bname%5D=Qwg&items%5B%5D%5Bid%5D=8"), {
        "items": [{"name": "Qwe", "id": 1},
                  {"name": "Qww", "id": 2},
                  {"name": "Qwq", "id": 3},
                  {"name": "Qwa", "id": 4},
                  {"name": "Qws", "id": 5},
                  {"name": "Qwd", "id": 6},
                  {"name": "Qwf", "id": 7},
                  {"name": "Qwg", "id": 8}]
      });
    });

  });

});

describe("options: ", function(){

  describe("questionMark", function(){

    it("prepend a question mark if has length", function(){
      assert.equal(queryStringParser.toQuery({"a": "b"}, {questionMark: true}), "?a=b");
    });

    it("doesn't prepend a question mark if has length", function(){
      assert.equal(queryStringParser.toQuery({}, {questionMark: true}), "");
    });

    it("will not prepend a question mark if option is false", function(){
      assert.equal(queryStringParser.toQuery({"a": "b"}, {questionMark: false}), "a=b");
    });

  });

});

describe("types: ", function(){

  it("serialize number into string", function(){
    assert.equal(queryStringParser.toQuery({"a": 1}), "a=1");
  });

  it("serialize string into string", function(){
    assert.equal(queryStringParser.toQuery({"a": "yes"}), "a=yes");
  });

  it("serialize boolean into string", function(){
    assert.equal(queryStringParser.toQuery({"a": true}), "a=true");
  });

});
