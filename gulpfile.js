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

var connect = require('connect');
var path    = require('path');
var lr      = require('tiny-lr');
var server  = lr();

var options = {
    isBuild: false,
    buildPath: './build/',
    devPath: './public/'
};

function getDestPath(endDir) {
    var destDir = options.isBuild ? options.buildPath : options.devPath;

    if (destDir && destDir[destDir.length - 1] !== '/') destDir += '/';
    if (endDir && endDir[0] === '/') endDir = endDir.slice(1);

    return endDir? destDir + endDir: destDir;
}

//function runDeferred() {
//    var args = Array.prototype.slice.call(arguments);
//    var deferred = when.defer();
//    var oldDoneCallback = gulp.doneCallback;
//
//    args.push(function() {
//        //gulp.run('', function() {});
//        //gulp.doneCallback = oldDoneCallback;
//        deferred.resolve();
//    });
//
//    gulp.run.apply(gulp, args);
//    return deferred.promise;
//}

//gulp.task('_not_use_html', function(){
//    gulp.src('assets/**/*.html')
//        .pipe(htmlhint({
//            "tag-pair": true,
//            "style-disabled": true,
//            "img-alt-require": true,
//            "tagname-lowercase": true,
//            "src-not-empty": true,
//            "id-unique": true,
//            "spec-char-escape": true
//        }))
//        .pipe(htmlhint.reporter())
//        .pipe(prettify({
//            indent_char: ' ',
//            indent_size: 4
//        }))
//        .pipe(gulp.dest(getDestPath('')))
//        .pipe(livereload(server));
//});

gulp.task('less', function() {
    gulp.src('./assets/less/main.less')
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(prefix("last 2 version", "> 1%", "ie 8", "ie 7"))
        .pipe(gulp.dest(getDestPath('css')))
        .pipe(livereload(server))
        .on('error', gutil.log);
});

gulp.task('jade', function() {
    var locals = {};

    gulp.src(['./assets/template/*.jade', '!./assets/template/_*.jade'])
        .pipe(jade({
            'locals': locals,
            pretty: true
        }))
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
        .pipe(gulp.dest(getDestPath('')))
        .pipe(livereload(server))
        .on('error', gutil.log);
});

gulp.task('js', function() {
    gulp.src(['./assets/js/*.js'])
        .pipe(gulp.dest(getDestPath('js')))
        .pipe(livereload(server))
        .on('error', gutil.log);
});

gulp.task('images', function() {
    gulp.src('./assets/img/**/*')
        //.pipe(imagemin())
        .pipe(gulp.dest(getDestPath('img')))
        .pipe(livereload(server))
        .on('error', gutil.log);
});

gulp.task('static', function() {
    return gulp.src(['./assets/static/**/*'])
        .pipe(gulp.dest(getDestPath('')))
        .pipe(livereload(server))
        .on('error', gutil.log);
});

gulp.task('clean', function() {
    gulp.src(getDestPath('**/*'), { read: false })
        .pipe(clean())
        .on('error', gutil.log);
});

gulp.task('compile', ['less', 'jade',  'js', 'images', 'static']);

//gulp.task('build', function() {
//    options.isBuild = true;
//    gulp.run('compile');
//});

//gulp.task('_not_work_zip', function() {
//    options.isBuild = true;
//
//    runDeferred('clean')
//        .then(function() {
//            runDeferred('less', 'jade',  'js', 'images', 'static')
//                .then(function() {
//                    gulp.src(getDestPath('*/*'))
//                        .pipe(zip('project.zip'))
//                        .pipe(gulp.dest('./zip'));
//                });
//        });
//});

gulp.task('http-server', function() {
    connect()
        .use(require('connect-livereload')())
        .use(connect.static('./public'))
        .listen('9000');

    console.log('Server listening on http://localhost:9000');
});

gulp.task('watch', ['compile'], function() {
    server.listen(35729, function(err) {
        if (err) return console.log(err);

        gulp.watch('./assets/less/**/*.less', ['less']);
        gulp.watch('./assets/template/**/*.jade', ['jade']);
        gulp.watch('./assets/img/**/*', ['images']);
        gulp.watch('./assets/js/**/*', ['js']);
        gulp.watch('./assets/static/**/*', ['static']);
    });

    gulp.run('http-server');
});

gulp.task('default', ['compile']);