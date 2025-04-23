const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');

async function compileSass() {
	const autoprefixer = await import('gulp-autoprefixer');

	return gulp
		.src('public/styles/scss/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer.default())
		.pipe(cleanCSS())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('public/styles/css'));
}

function watchSass() {
	gulp.watch('public/styles/scss/**/*.scss', compileSass);
}

gulp.task('styles', compileSass);
gulp.task('watch', watchSass);
gulp.task('default', gulp.series('styles', 'watch'));