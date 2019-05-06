const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');

const jsFiles = [
    './src/js/lib.js',
    './src/js/main.js'
]
const cssFiles = [
    './src/css/main.sass',
    './src/css/media.sass'
]

//Функция "Таск на стили"
function styles() {

    return gulp.src(cssFiles)
        .pipe(sourcemaps.init())
        .pipe(sass())

        //Обьединение
        .pipe(concat('style.css'))

        //Префиксы для браузеров
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))

        //Минификация
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(sourcemaps.write('./'))
        
        //Выходная папка
        .pipe(gulp.dest('./build/css'))
        .pipe(browserSync.stream());
}

//Функция "Таск на скрипты"
function scripts() {

    return gulp.src(jsFiles)

        //Обьединение
        .pipe(concat('script.js'))
        .pipe(uglify({
            toplevel: true
        }))

        //Выходная папка
        .pipe(gulp.dest('./build/js'))
        .pipe(browserSync.stream());
}
//Функция "Отчистка выходной дериктории"
function clean() {
    return del(['build/*'])
}
//Функция Browser Sync
function watch() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    gulp.watch('./src/css**/*.sass', styles)

    gulp.watch('./src/js**/*.js', scripts)

    gulp.watch("./*.html").on('change', browserSync.reload);
}

gulp.task('styles', styles);

gulp.task('scripts', scripts);

gulp.task('watch', watch);

gulp.task('build', gulp.series(clean, gulp.parallel(styles, scripts)));
gulp.task('dev', gulp.series('build', 'watch'));