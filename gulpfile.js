/*!
* Gulp
*/

'use strict';

// Load plugins
var gulp = require('gulp'),
sass = require('gulp-ruby-sass'),
bower = require('gulp-bower'),
//autoprefixer = require('gulp-autoprefixer'),
cssnano = require('gulp-cssnano'),
//jshint = require('gulp-jshint'),
uglify = require('gulp-uglify'),
imagemin = require('gulp-imagemin'),
rename = require('gulp-rename'),
concat = require('gulp-concat'),
cache = require('gulp-cache'),
livereload = require('gulp-livereload'),
del = require('del'),
runSequence = require('run-sequence'),
nunjucksRender = require('gulp-nunjucks-render'),
data = require('gulp-data');


// Styles
gulp.task('styles', function() {
    return sass('src/styles/main.scss', { style: 'expanded' })
    //.pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(cssnano())
    .pipe(gulp.dest('dist/assets/css'));
});


// Scripts
gulp.task('scripts', function() {
    return gulp.src([
        'bower_components/jquery/dist/jquery.js',
        'bower_components/tether/dist/js/tether.js',
        'bower_components/bootstrap/dist/js/bootstrap.js',
        'src/scripts/**/*.js'
    ])
    //.pipe(jshint())
    //.pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/assets/js'));
});


// Images
gulp.task('images', function() {
    return gulp.src('src/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/assets/img'));

});


// Fonts
gulp.task('fonts', function() {
    return gulp.src('bower_components/font-awesome/fonts/**/*')
    .pipe(gulp.dest('dist/assets/fonts'));
});


// Nunjucks
gulp.task('nunjucks', function() {
    nunjucksRender.nunjucks.configure(['src/templates/']);
    // Gets .html and .nunjucks files in pages
    return gulp.src('src/templates/pages/**/*.+(html|njk)')
    // Adding data to Nunjucks
    .pipe(data(function() {
      return require('./src/settings.json')
    }))
    // Renders template with nunjucks
    .pipe(nunjucksRender())
    // output files in app folder
    .pipe(gulp.dest('dist'))
});


// Clean
gulp.task('clean', function() {
    del(['dist/**/*']);
});

// Install Bower components
gulp.task('bower', function() {
    return bower();
});


// Default Gulp task - Rebuilds the entire dist
gulp.task('default', function() {
    runSequence('clean', 'styles', 'scripts', 'images', 'fonts', 'nunjucks');
});

// Gulp Init - Installs Bower components and builds the entire dist
gulp.task('init', function() {
    runSequence('clean', 'bower', 'styles', 'scripts', 'images', 'fonts', 'nunjucks');
});


// Gulp Watch
gulp.task('watch', function() {

    // Watch .scss files
    gulp.watch('src/styles/**/*.scss', ['styles']);

    // Watch .js files
    gulp.watch('src/scripts/**/*.js', ['scripts']);

    // Watch image files
    gulp.watch('src/images/**/*', ['images']);

    // Watch html files
    gulp.watch('src/templates/**/*', ['nunjucks']);

    // Create LiveReload server
    livereload.listen();

    // Watch any files in dist/, reload on change
    gulp.watch(['dist/**']).on('change', livereload.changed);

});
