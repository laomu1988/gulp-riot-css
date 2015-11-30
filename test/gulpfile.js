var gulp = require('gulp');
var gulp_css = require('../index');
console.log('css');
gulp.task('gulp_css', function () {
    gulp.src(['./*.html'])
        .pipe(gulp_css({css: 'css/riot_tag.css', js: 'js/riot_tag.js'}))
        .pipe(gulp.dest('./output'));
});

gulp.task('gulp_riotjs', function () {
    gulp.src(['./*.html'])
        .pipe(gulp_css({js: 'js/riot_tag.js',define:'tags/'}))
        .pipe(gulp.dest('./output_js'));
});
gulp.task('gulp_modules', function () {
    gulp.src(['./*.html'])
        .pipe(gulp_css())
        .pipe(gulp.dest('./modules'));
});

gulp.task('riot_define', function () {
    gulp.src(['./*.html'])
        .pipe(gulp_css({define:'tag/'}))
        .pipe(gulp.dest('./define'));
});

gulp.task('default', ['gulp_css', 'gulp_riotjs', 'gulp_modules','riot_define']);