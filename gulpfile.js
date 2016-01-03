var gulp = require('gulp')
	, livereload = require('gulp-livereload');

gulp.task('reload', function() {
	gulp.src('src/*').pipe(gulp.dest('build/')).pipe(livereload());
});

// move the HTML file on change
gulp.task('changeHtml', function() {
	gulp.src('src/*.html').pipe(gulp.dest('build/')).pipe(livereload());
});

// copy necessary node_modules to public directory
gulp.task('clientDependencies', function() {
	gulp.src('node_modules/jquery/dist/jquery.js').pipe(gulp.dest('build/js/'));
	gulp.src('node_modules/react/dist/react.js').pipe(gulp.dest('build/js/'));
})

gulp.task('default', ['clientDependencies'], function() {
	livereload.listen({
		reloadPage : 'build/index.html'
	});
	gulp.watch(['src/*.html'], ['changeHtml']);
});