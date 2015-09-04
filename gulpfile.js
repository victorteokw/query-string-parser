var gulp = require('gulp'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    mocha = require('gulp-mocha');

function minName(fileName) {
  return fileName.slice(0, fileName.length - 2) + "min.js";
}

gulp.task('dist', function() {
  ['query_string_parser.es6'].forEach(
    function(fileName){
      gulp.src(fileName)
        .pipe(babel())
        .pipe(gulp.dest('.'));
    }
  );
});

gulp.task('minify', ['dist'], function() {
  ['query_string_parser.js'].forEach(
    function(fileName){
      gulp.src(fileName)
        .pipe(jshint())
        .pipe(uglify({preserveComments: 'some'}))
        .pipe(concat(minName(fileName)))
        .pipe(gulp.dest('.'));
    }
  );
});

gulp.task('test', ['dist'], function() {
  gulp.src('./test/test.js').pipe(mocha());
});
