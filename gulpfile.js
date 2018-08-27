const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const notify = require('gulp-notify');
const browserSync = require('browser-sync');
const reload = browserSync.reload;

//'styles' is the name of the tasl - could be called anything but has to match the watch method
//finds all the scss files in your dev-styles folder
//compiles them all into one master style.css file
//saves that file to public/styles
gulp.task('styles', () => {
    return gulp.src('./dev/styles/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('style.css'))
        .pipe(gulp.dest('./public/styles'))
        .pipe(reload({ stream: true }));
});

gulp.task('bs', () => {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
});

gulp.task('js', () => {
    browserify('./dev/scripts/main.js', { debug: true })
        .transform('babelify', {
            sourceMaps: true,
            presets: ['env']
        })
        .bundle()
        .on('error', notify.onError({
            message: "Error: <%= error.message %>",
            title: 'Error in JS 💀'
        }))
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(gulp.dest('./public/scripts'))
        .pipe(reload({ stream: true }));
});



//we can set up a watcher so that we don't have to type gulp styles everytime we make changes
gulp.task('watch', () => {
    gulp.watch('./dev/styles/**/*.scss', ['styles']);
    gulp.watch('./dev/scripts/main.js', ['js']);
    gulp.watch('*.html', reload);
    
});

//put everything together in one master method that initiates all tasks and watch

gulp.task('default', ['bs', 'styles', 'js', 'watch']);

