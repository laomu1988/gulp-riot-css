var gulp = require('gulp');
var gulp_css = require('../index');

gulp.task('gulp_css', function () {
    gulp.src(['./*.html'])
        .pipe(gulp_css({css: 'css/riot_tag.css', js: 'js/riot_tag.js'}))
        .pipe(gulp.dest('./output'));
});

gulp.task('default', ["gulp_css"]);