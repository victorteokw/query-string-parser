var gulp = require('gulp'),
    coffee = require('gulp-coffee'),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify');
function minName(fileName) {
  return fileName.slice(0, fileName.length - 2) + "min.js";
}
gulp.task('dist', function() {
  ['query_parser.coffee'].forEach(
    function(fileName){
      gulp.src(fileName)
        .pipe(coffee({bare: false}))
        .pipe(gulp.dest('.'));
    }
  );
});

gulp.task('minify', ['dist'], function() {
  ['query_parser.js'].forEach(
    function(fileName){
      gulp.src(fileName)
        .pipe(jshint())
        .pipe(uglify({preserveComments: 'some'}))
        .pipe(concat(minName(fileName)))
        .pipe(gulp.dest('.'));
    }
  );
});
