var gulp       = require('gulp');
var less       = require('gulp-less');
var prefix     = require('gulp-autoprefixer');
var jade       = require('gulp-jade');
var imagemin   = require('gulp-imagemin');
var livereload = require('gulp-livereload');
var clean      = require('gulp-clean');
var gutil      = require('gulp-util');
var changed    = require('gulp-changed');
var htmlhint   = require('gulp-htmlhint');
var prettify   = require('gulp-prettify');
var concat     = require('gulp-concat');
var uglify     = require('gulp-uglify');
var jshint     = require('gulp-jshint');
var typescript = require('gulp-typescript');
var rename     = require('gulp-rename');
var minifycss  = require('gulp-minify-css');

var connect = require('connect');
var path    = require('path');

var options = {
    isBuild: false,
    buildPath: './build/',
    devPath: './public/'
};

function getDestPath(endDir) {
    var destDir = options.isBuild ? options.buildPath : options.devPath;

    if (destDir && destDir[destDir.length - 1] !== '/') destDir += '/';
    if (endDir && endDir[0] === '/') endDir = endDir.slice(1);

    return endDir ? destDir + endDir: destDir;
}

function onError() {
    var args = Array.prototype.slice.call(arguments);
    gutil.log.apply(gutil.log, args);
    gutil.beep();
}

gulp.task('less', function() {
    gulp.src('./assets/less/main.less')
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .on('error', onError)
        .pipe(prefix("last 2 version", "> 1%", "ie 8", "ie 7"))
        .pipe(gulp.dest(getDestPath('css')))
        .pipe(minifycss())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(getDestPath('css')));
});

gulp.task('jade', function() {
    var locals = {};

    gulp.src(['./assets/template/*.jade'])
        .pipe(jade({
            'locals': locals,
            pretty: true
        }))
        .on('error', onError)
        .pipe(htmlhint({
            "tag-pair": true,
            "style-disabled": true,
            "img-alt-require": true,
            "tagname-lowercase": true,
            "src-not-empty": true,
            "id-unique": true,
            "spec-char-escape": true
        }))
        .pipe(htmlhint.reporter())
        .pipe(prettify({
            indent_char: ' ',
            indent_size: 4
        }))
        .pipe(gulp.dest(getDestPath('')));
});

gulp.task('ts', function () {
    gulp.src(['./assets/js/**/*.ts', '!./assets/js/d.ts/**/*'])
        .pipe(changed(getDestPath('js', { extension: '.js' })))
        .pipe(typescript())
        .on('error', onError)
        .pipe(gulp.dest(getDestPath('js')));
});

gulp.task('js', function() {
    gulp.src(['./assets/js/**/*.js', '!./assets/js/d.ts/**/*'])
        .pipe(changed(getDestPath('js')))
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(gulp.dest(getDestPath('js')));
});

gulp.task('images', function() {
    gulp.src(['./assets/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'])
        .pipe(changed(getDestPath('img')))
        .pipe(imagemin())
        .on('error', onError)
        .pipe(gulp.dest(getDestPath('img')));
});

gulp.task('static', function() {
    return gulp.src(['./static/**', '!/.gitignore'])
        .pipe(changed(getDestPath('')))
        .pipe(gulp.dest(getDestPath('')));
});

gulp.task('fonts', function() {
    return gulp.src(['./assets/fonts/**', '!/.gitignore'])
        .pipe(changed(getDestPath('fonts')))
        .pipe(gulp.dest(getDestPath('fonts')));
});

gulp.task('clean', function() {
    gulp.src(getDestPath('**'), { read: false })
        .pipe(clean())
        .on('error', onError);
});

gulp.task('compile', ['less', 'jade',  'ts', 'js', 'images', 'static', 'fonts']);

gulp.task('build', function() {
    options.isBuild = true;
    gulp.run('clean', function() {
        setTimeout(function() {
            gulp.run('less', 'jade',  'ts', 'js', 'images', 'static', 'fonts', function() {});
        }, 1000);
    });
});

gulp.task('http-server', function() {
    connect()
        .use(require('connect-livereload')())
        .use(connect.static(getDestPath('')))
        .listen('9000');

    console.log('Server listening on http://localhost:9000');
});

gulp.task('watch', ['compile', 'http-server'], function() {
    var server = livereload();

    gulp.watch('./assets/less/**/*.less', ['less']);
    gulp.watch('./assets/template/**/*.jade', ['jade']);
    gulp.watch('./assets/img/**/*', ['images']);
    gulp.watch('./assets/js/**/*.js', ['js']);
    gulp.watch('./assets/js/**/*.ts', ['ts']);
    gulp.watch('./assets/static/**/*', ['static']);
    gulp.watch('./assets/fonts/**/*', ['fonts']);

    gulp.watch(getDestPath('**')).on('change', function(file) {
        server.changed(file.path);
        //gutil.log('change file: ' + path.basename(file.path));
    });
});

gulp.task('default', ['compile']);