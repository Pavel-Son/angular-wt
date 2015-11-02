var gulp = require('gulp'),
	concat = require('gulp-concat'),
	del = require('del');
	// watch = require('gulp-watch');

var path = {
	scripts: './app/js/*.js'
}

gulp.task('clean', function() {
  // You can use multiple globbing patterns as you would with `gulp.src`
  return del(['./app/dist']);
});

gulp.task('scripts', ['clean'], function() {
	// scripts
	return gulp.src([path.scripts])
		.pipe(concat('all.js'))
		.pipe(gulp.dest('./app/dist/js/'));
});

gulp.task('watch', function() {
	gulp.watch(path.scripts, ['scripts']);
});

gulp.task('default', ['watch', 'scripts']);