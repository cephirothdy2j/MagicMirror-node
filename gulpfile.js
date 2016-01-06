'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var livereload = require('gulp-livereload');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var reactify = require('reactify');

gulp.task('javascript', function () {
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: './entry.js',
    debug: true,
    // defining transforms here will avoid crashing your stream
    transform: [reactify]
  });

  return b.bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .pipe(uglify())
        .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/js/'));
});


gulp.task('reload', function() {
	gulp.src('src/*').pipe(gulp.dest('build/')).pipe(livereload());
});

// move the HTML file on change
gulp.task('moveHtml', function() {
	gulp.src('src/*.html').pipe(gulp.dest('build/')).pipe(livereload());
});

// copy necessary node_modules to public directory
gulp.task('moveModules', function() {
	gulp.src('node_modules/jquery/dist/jquery.js').pipe(gulp.dest('src/js/'));
	gulp.src('node_modules/react/dist/react.js').pipe(gulp.dest('src/js/'));
	gulp.src('node_modules/react-dom/dist/react-dom.js').pipe(gulp.dest('src/js/'));
  gulp.src('node_modules/moment/moment.js').pipe(gulp.dest('src/js/'));

});

gulp.task('combineScripts', function() {
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: './src/js/main.js',
    debug: true,
    // defining transforms here will avoid crashing your stream
    transform: [reactify]
  });

  return b.bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
   // .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        //.pipe(uglify())
        .on('error', gutil.log)
    //.pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./build/js/'));
});

gulp.task('default', ['moveModules', 'moveHtml', 'combineScripts'], function() {
	livereload.listen({
		reloadPage : 'build/index.html'
	});
	gulp.watch(['src/*.html'], ['moveHtml']);
	gulp.watch(['src/js/*.js'], ['combineScripts']);
	gulp.watch(['src/components/*.jsx'], ['combineScripts']);
});