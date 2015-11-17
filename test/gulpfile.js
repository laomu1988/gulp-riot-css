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
        .pipe(gulp_css({js: 'js/riot_tag.js'}))
        .pipe(gulp.dest('./output_js'));
});


gulp.task('default', ['gulp_css','gulp_riotjs']);