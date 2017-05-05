var gulp = require("gulp");
var debug = require('gulp-debug');
var ts = require("gulp-typescript");
var babel = require("gulp-babel");
var filter = require('gulp-filter');
var jsFilter = filter( ['**/**/*.js'], {restore: true});
var merge = require('merge2');
var sourcemaps = require('gulp-sourcemaps');



function build( src ){
  var tsProject = ts.createProject("tsconfig.json");
  var tsResult = gulp.src(src)
    .pipe(sourcemaps.init())
    .pipe(tsProject());
  return merge([
    tsResult.dts
      .pipe(debug({title: 'd.ts:'}))
      .pipe(gulp.dest('lib')),

    tsResult.js
      .pipe(debug({title: '_.js:'}))
      .pipe(babel({ presets: ['node6'] }))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest("lib")),
  ]);
}


gulp.task("build", function () {
  return build('src/**/**/*.ts' );
});



gulp.task('watch', ['build'], function() {
  var watcher = gulp.watch('src/**/**');
  watcher.on('change', function(event) {
    build( event.path );
  });
});
