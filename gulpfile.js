var gulp       = require('gulp');
var less       = require('gulp-less');
var prefix     = require('gulp-autoprefixer');
var jade       = require('gulp-jade');
var imagemin   = require('gulp-imagemin');
var livereload = require('gulp-livereload');
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

var connect   = require('connect');
var connectLR = require('connect-livereload');
var path      = require('path');
var _         = require('underscore');
var rmdir     = require('rmdir');

var options = {
    development: true,
    dirDevelopment: 'public',
    dirProduction : 'build',

    src: {
        less: 'assets/less/main.less',
        jade: 'assets/template/*.jade',
        js  : 'assets/js/**/*.js',
        images: 'assets/img/**/*.{png,jpg,jpeg,gif,svg}',
        static: 'static/**',
        fonts : 'assets/fonts/**',
        clean : '$dir$',
        xprecise: 'assets/_xprecise/**'
    },

    dest: {
        less: '$dir$/css',
        jade: '$dir$',
        js  : '$dir$/js',
        images: '$dir$/img',
        static: '$dir$',
        fonts : '$dir$/fonts',
        xprecise: '$dir$/_xprecise'
    },

    watch: {
        less: {
            glob: 'assets/less/**/*.less',
            opt: ['less']
        },
        jade: {
            glob: 'assets/template/**/*.jade',
            opt: ['jade']
        },
        js  : {
            glob: 'assets/js/**/*.js',
            opt: ['js']
        },
        images: {
            glob: 'assets/img/**/*.{png,jpg,jpeg,gif,svg}',
            opt: ['images']
        },
        static: {
            glob: 'static/**',
            opt: ['static']
        },
        fonts : {
            glob: 'assets/fonts/**',
            opt: ['fonts']
        },
        xprecise : {
            glob: 'assets/_xprecise/*.jpg',
            opt: ['xprecise']
        }
    }
};

function substitution() {
    var dir = options.development ? options.dirDevelopment : options.dirProduction;

    _.each(options.src, function(item, index) {
        options.src[index] = item.replace('$dir$', dir);
    });

    _.each(options.dest, function(item, index) {
        options.dest[index]= item.replace('$dir$', dir);
    });
};

function run() {
    if (process.argv.length > 2)
        options.development = process.argv[2] !== 'build';
    if (process.argv.length > 3)
        options.development = process.argv[3] !== '-b';

    substitution();
}

function onError() {
    var args = Array.prototype.slice.call(arguments);
    gutil.log.apply(gutil.log, args);
    gutil.beep();
}

gulp.task('less', function() {
    gulp.src(options.src.less)
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .on('error', onError)
        .pipe(prefix("last 2 version", "> 1%", "ie 8", "ie 7"))
        .pipe(gulp.dest(options.dest.less))
        .pipe(minifycss())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(options.dest.less));
});

gulp.task('jade', function() {
    var locals = {};
    locals.debugMode = options.development;

    return gulp.src(options.src.jade)
        .pipe(jade({
            locals: locals,
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
        .pipe(gulp.dest(options.dest.jade));
});

//gulp.task('ts', function () {
    //gulp.src(['./assets/js/**/*.ts', '!./assets/js/d.ts/**/*'])
/*        .pipe(changed(getDestPath('js', { extension: '.js' })))
        .pipe(typescript())
        .on('error', onError)
        .pipe(gulp.dest(getDestPath('js')));
});*/

gulp.task('js', function() {
    return gulp.src(options.src.js)
        .pipe(changed(options.dest.js))
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(gulp.dest(options.dest.js));
});

gulp.task('images', function() {
    return gulp.src(options.src.images)
        .pipe(changed(options.dest.images))
        .pipe(imagemin())
        .on('error', onError)
        .pipe(gulp.dest(options.dest.images));
});

gulp.task('static', function() {
    return gulp.src(options.src.static)
        .pipe(changed(options.dest.static))
        .pipe(gulp.dest(options.dest.static));
});

gulp.task('fonts', function() {
    return gulp.src(options.src.fonts)
        .pipe(changed(options.dest.fonts))
        .pipe(gulp.dest(options.dest.fonts));
});

gulp.task('xprecise', function() {
    if (options.development)
        return gulp.src(options.src.xprecise)
            .pipe(changed(options.dest.xprecise))
            .pipe(gulp.dest(options.dest.xprecise));
    else
        return null;
});

gulp.task('clean', function() {
    rmdir(options.src.clean, function(err, dirs, files){
        if (err) {
            gutil.log(err);
            gutil.beep();
        }
    });
    return null;
});

gulp.task('compile', ['less', 'jade',  /*'ts',*/ 'js', 'images', 'static', 'fonts', 'xprecise']);

gulp.task('build', ['compile']);

gulp.task('http-server', function() {
    connect()
        .use(connectLR())
        .use(connect.static(options.dir()))
        .listen('9000');

    console.log('Server listening on http://localhost:9000');
});

gulp.task('watch', ['compile', 'http-server'], function() {
    var server = livereload();

    _.each(options.watch, function(prop){
        gulp.watch(prop.glob, prop.opt);
        gutil.log('watch', prop.glob, prop.opt);
    });

    gulp.watch(options.dir() + '/**').on('change', function(file) {
        server.changed(file.path);
        gutil.log('change file:', path.basename(file.path));
    });
});

gulp.task('default', ['compile']);

run();