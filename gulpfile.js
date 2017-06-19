// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    autoprefixer = require('gulp-autoprefixer'),
    autoprefixerOptions     = {
      browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
    },
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    plumber = require('gulp-plumber'),
    watch = require('gulp-watch'),
    sassGlob = require('gulp-sass-glob');

// Concat SCSS files to main.scss
gulp.task('concatScss', function() {
    return gulp.src([
        '!scss/ltr/main.scss',
        'scss/**/*.scss'
        ])
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(concat('main.scss'))
        .pipe(gulp.dest('scss/ltr/'))
});

// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src('scss/ltr/main.scss')
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(sassGlob())
        .pipe(sass({
            // style: 'compressed',
            sourceComments: 'map',
            errLogToConsole: true,
            outputStyle: 'expanded',
            includePaths : ['scss/ltr/']
        }))
        .pipe(autoprefixer('last 5 versions'))
        .pipe(gulp.dest('css/ltr/public/'));
});

// Concatenate & Minify Custom JS
gulp.task('scripts', function() {
    return gulp.src('js/*.js')
        .pipe(plumber())
        .pipe(concat('script.min.js'))
        // .pipe(uglify())
        .pipe(gulp.dest('js/minified'));
});

gulp.task('plugins', function() {
    return gulp.src('js/plugins/*.js')
        .pipe(plumber())
        .pipe(concat('plugins.min.js'))
        // .pipe(uglify())
        .pipe(gulp.dest('js/minified'));
});


// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('js/*.js', ['scripts']);
    gulp.watch('js/plugins/*.js', ['plugins']);
    gulp.watch('scss/**/*.scss', ['sass', 'concatScss']);
});

//JS Linter
gulp.task('jshint', function() {
  return gulp.src('js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

// Default Task
gulp.task('default', ['concatScss', 'sass', 'watch', 'scripts', 'plugins', 'jshint']);