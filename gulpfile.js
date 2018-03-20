const gulp=require('gulp');
const lint=require('gulp-eslint');
const uglify=require('gulp-uglify');
const sass=require('gulp-sass');
const prefix=require('gulp-autoprefixer');
const rename=require('gulp-rename');
const pump=require('pump');

gulp.task('lint-tests', (cb)=>{
    pump([
        gulp.src('./test/test.js'),
        lint('.eslint-tests.json'),
        lint.format()
    ], cb);
});

gulp.task('lint-lib', (cb)=>{
    pump([
        gulp.src('./src/unlock.js'),
        lint('.eslint.json'),
        lint.format()
    ], cb);
});

gulp.task('lint', ['lint-tests', 'lint-lib']);

gulp.task('uglify', (cb)=>{
    pump([
        gulp.src('./src/unlock.js'),
        uglify(),
        rename('unlock.min.js'),
        gulp.dest('./src/')
    ], cb);
});

gulp.task('scss', (cb)=>{
    pump([
        gulp.src('./src/unlock.scss'),
        sass({
            indentedSyntax: false,
            sourceMap: false
        }),
        gulp.dest('./src/')
    ], cb);
});

gulp.task('min-scss', (cb)=>{
    pump([
        gulp.src('./src/unlock.scss'),
        sass({
            indentedSyntax: false,
            sourceMap: false,
            outputStyle: 'compressed'
        }),
        rename('unlock.min.css'),
        gulp.dest('./src/')
    ], cb);
});

gulp.task('prefix', ['scss', 'min-scss'], (cb)=>{
    pump([
        gulp.src(['./src/unlock.css', './src/unlock.min.css']),
        prefix({
            cascade: false
        }),
        gulp.dest('./src/')
    ], cb);
});

const jsTasks=['uglify', 'lint'];
const cssTasks=['scss', 'min-scss', 'prefix'];

gulp.task('watch-js', ()=>{
    return gulp.watch(['./src/unlock.js', './test/test.js'], jsTasks);
});

gulp.task('watch-css', ()=>{
    return gulp.watch('./src/unlock.scss', cssTasks);
});

gulp.task('js', jsTasks.concat(['watch-js']));
gulp.task('css', cssTasks.concat(['watch-css']));

gulp.task('default', ['js', 'css']);
