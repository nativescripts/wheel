var gulp = require('gulp');

var gulpLithe = require('gulp-lithe');
var cssImageLink = gulpLithe.precss;
var jsUglifyPre = gulpLithe.prejs;
var localcache = gulpLithe.localcache;
var path = require('path');
var concat = require('gulp-concat');
var minifycss = require('gulp-minify-css');
var gulpUtil = require('gulp-util');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var localcacheConfig = require('./js/lcconfig.js');
var litheConfig = require('./js/config.js');  // lithe config
litheConfig.basepath = path.resolve(__dirname,'./js/');
/*var spriter = require('gulp-css-spriter');*/
var importCss = require('gulp-cssimport');
var concat = require('gulp-concat');
var del = require('del');
var base64 = require('gulp-base64');

gulp.task('litheconcat', function() {
    return gulp
        .src(['./js/conf/**/*.js'])  // entry file
        .pipe(gulpLithe({
            config:litheConfig  // lithe config
        }))
        .pipe(gulp.dest('../temp/js/conf'))
});

gulp.task('moveimages', function() {
    return gulp.src('./images/**/*')
        .pipe(gulp.dest('../dist/images'));
});

gulp.task('styles',['moveimages'], function() {
    var timestamp = new Date().getTime();
    return gulp.src('./css/**/*.css')
        /* .pipe(spriter({
         'spriteSheet':'../dist/images/spritesheet'+timestamp+'.png',
         'pathToSpriteSheetFromCSS':'../../images/spritesheet'+timestamp+'.png'
         }))*/
        .pipe(importCss())
        .pipe(cssImageLink())
        .pipe(base64({
            //baseDir:'css',
            extensions: ['png'],
            maxImageSize: 20 * 1024, // bytes
            debug: false
        }))
        .pipe(minifycss())
        .pipe(gulp.dest('../dist/css'));
});


/**
 * 压缩所有目标目录下的脚本文件 依赖于movefile任务
 */
gulp.task('uglify',['litheconcat'], function() {
    return gulp.src(['../temp/js/**/*.js'])
        .pipe(jsUglifyPre())//丑化预处理，先判断合并后的文件与旧文件MD5是否有变化，若有，则丑化替换，若无，则不丑化，提高效率
        .pipe(uglify({
            mangle: {
                except: ['require','$']
            }
        }).on('error', gulpUtil.log))
        .pipe(gulp.dest('../dist/js/'));
});

gulp.task('localcache', ['uglify'], function() {
    return gulp.src('./js/conf/**/*')
        .pipe(localcache(litheConfig, localcacheConfig))
        .pipe(gulp.dest('../temp/dist/'));
});

gulp.task('uglifylithe',['litheconcat'], function() {
    return gulp.src(['./js/lithe.js']).pipe(uglify({
        mangle: {
            except: ['require']
        }
    }))/*.pipe(rename({suffix: '.min'}))*/.pipe(gulp.dest('../dist/js/'));
});

gulp.task('uglifylithecache',['uglifylithe'], function() {
    return gulp.src(['./js/lithe-localcache.js']).pipe(uglify({
        mangle: {
            except: ['require']
        }
    })).pipe(gulp.dest('../dist/js/'));
});

gulp.task('concat',['litheconcat','uglifylithecache','localcache'], function() {
    return gulp.src(['../dist/js/lithe.js','../temp/js/config.js']).
    pipe(uglify()).pipe(concat('lithe.js')).pipe(gulp.dest('../dist/js/'));
});
/**
 * 清空临时目录
 */
gulp.task('cleantemp',['uglify', 'uglifylithecache', 'concat'], function(cb) {
    return del(['../temp','../dist/js/config.js'],{force:true});
});

gulp.on('error',gulpUtil.log);

gulp.task('default', ['litheconcat',
    'uglify','moveimages','styles',
    'uglifylithe',
    'uglifylithecache','concat',
    'cleantemp']);