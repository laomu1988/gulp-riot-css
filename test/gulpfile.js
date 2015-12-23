var gulp = require('gulp');
var gulp_css = require('../index');
console.log('css');
gulp.task('gulp_css', function () {
    gulp.src(['./*.html'])
        .pipe(gulp_css({css: 'css/riot_tag.css', js: 'js/riot_tag.js', type: 'attr'}))
        .pipe(gulp.dest('./output'));
});
gulp.task('gulp_scss', function () {
    gulp.src(['./*.html'])
        .pipe(gulp_css({css: 'css/riot_tag.scss', js: 'js/riot_tag.js', type: 'attr'}))
        .pipe(gulp.dest('./test_scss'));
});
gulp.task('gulp_riotjs', function () {
    gulp.src(['./*.html'])
        .pipe(gulp_css({js: 'js/riot_tag.js', define: 'tags/', type: 'tagName'}))
        .pipe(gulp.dest('./output_js'));
});
gulp.task('gulp_modules', function () {
    gulp.src(['./*.html'])
        .pipe(gulp_css())
        .pipe(gulp.dest('./modules'));
});

gulp.task('riot_define', function () {
    gulp.src(['./*.html'])
        .pipe(gulp_css({define: 'tag/'}))
        .pipe(gulp.dest('./define'));
});

gulp.task('default', ['gulp_css', 'gulp_riotjs', 'gulp_modules', 'riot_define','gulp_scss']);