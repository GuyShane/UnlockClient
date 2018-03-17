const gulp=require('gulp');
const uglify=require('gulp-uglify');
const sass=require('gulp-sass');
const prefix=require('gulp-autoprefixer');
const rename=require('gulp-rename');
const pump=require('pump');

gulp.task('uglify', (cb)=>{
    pump([
        gulp.src('./src/unlock.js'),
        uglify(),
        rename('unlock.min.js'),
        gulp.dest('./src/')
    ]);
});

gulp.task('scss', ()=>{
    pump([
        gulp.src('./src/unlock.scss'),
        sass({
            indentedSyntax: false,
            sourceMap: false
        }),
        gulp.dest('./src/')
    ]);
});

gulp.task('min-scss', ()=>{
    pump([
        gulp.src('./src/unlock.scss'),
        sass({
            indentedSyntax: false,
            sourceMap: false,
            outputStyle: 'compressed'
        }),
        rename('unlock.min.css'),
        gulp.dest('./src/')
    ]);
});

gulp.task('prefix', ['scss', 'min-scss'], ()=>{
    pump([
        gulp.src(['./src/unlock.css', './src/unlock.min.css']),
        prefix(),
        gulp.dest('./src/')
    ]);
});

gulp.task('watch-js', ()=>{
    return gulp.watch('./src/unlock.js', ['uglify']);
});

gulp.task('watch-css', ()=>{
    return gulp.watch('./src/unlock.scss', ['scss', 'min-scss', 'prefix']);
});

gulp.task('js', ['uglify', 'watch-js']);
gulp.task('css', ['scss', 'min-scss', 'prefix', 'watch-css']);

gulp.task('default', ['js', 'css']);
