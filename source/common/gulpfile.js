

// Load plugins
var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var less = require('gulp-less');
var bower = require('gulp-bower');
var autoprefixer = require('gulp-autoprefixer');
var cssnano = require('gulp-cssnano');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var cache = require('gulp-cache');
var livereload = require('gulp-livereload');
var del = require('del');
var runSequence = require('run-sequence');
var nunjucksRender = require('gulp-nunjucks-render');
var data = require('gulp-data');
var sources = require('./src/scripts/sources.json');
var settings = require('./settings.json');


// Styles
gulp.task('styles', function() {
    if(settings.css_preprocessor === 'sass'){
        return sass('src/styles/main.scss', { style: 'expanded' })
        .pipe(gulp.dest('public/assets/css'))
    	.pipe(autoprefixer('last 2 version'))
        .pipe(rename({suffix: '.min'}))
        .pipe(cssnano())
        .pipe(gulp.dest('public/assets/css'));
    }
    else{
        return gulp.src('src/styles/main.less')
        .pipe(less())
        .pipe(gulp.dest('public/assets/css'))
    	.pipe(autoprefixer('last 2 version'))
        .pipe(rename({suffix: '.min'}))
        .pipe(cssnano())
        .pipe(gulp.dest('public/assets/css'));
    }
});




// Scripts
gulp.task('scripts', function() {
    return gulp.src(sources.dependencies)
    .pipe(concat('main.js'))
    .pipe(gulp.dest('public/assets/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('public/assets/js'));
});


// Images
gulp.task('images', function() {
    return gulp.src('src/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest('public/assets/img'));

});


// Fonts
gulp.task('fonts', function() {
    return gulp.src('bower_components/font-awesome/fonts/**/*')
    .pipe(gulp.dest('public/assets/fonts'));
});


// Nunjucks
gulp.task('nunjucks', function () {
    return gulp.src('src/templates/pages/**/*.+(html|njk)')
    .pipe(data(function() {
		return require('./settings.json');
    }))
    .pipe(nunjucksRender({
      path: 'src/templates'
    }))
    .pipe(gulp.dest('public'));
});


// Clean
gulp.task('clean', function() {
    del(['public/**/*']);
});

// Install Bower components
gulp.task('bower', function() {
    return bower();
});


// Default Gulp task - Rebuilds the entire public
gulp.task('default', function() {
    runSequence('clean', 'styles', 'scripts', 'images', 'fonts', 'nunjucks');
});

// Gulp Init - Installs Bower components and builds the entire public project
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

    // Watch any files in public/, reload on change
    gulp.watch(['public/**']).on('change', livereload.changed);

});
