const gulp=require('gulp');
const sass=require('gulp-sass');

gulp.task('scss', ()=>{
    return gulp.src('./src/unlock.scss')
        .pipe(sass({
            indentedSyntax: false,
            sourceMap: false,
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(gulp.dest('./src/'));
});

gulp.task('watch-css', ()=>{
    return gulp.watch('./src/unlock.scss', ['scss']);
});

gulp.task('css', ['scss', 'watch-css']);

gulp.task('default', ['css']);
