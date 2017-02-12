'use strict';

/**
 * Import node modules
 */
var gulp         = require('gulp');
var sass         = require('gulp-sass');
var sassGlob     = require('gulp-sass-glob');
var rename       = require('gulp-rename');
var postcss      = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano      = require('cssnano');
var browser_sync = require('browser-sync');
var ejs          = require('gulp-ejs');
var uglify       = require('gulp-uglify');
var rollup       = require('gulp-rollup');
var nodeResolve  = require('rollup-plugin-node-resolve');
var commonjs     = require('rollup-plugin-commonjs');
var babel        = require('rollup-plugin-babel');
var plumber      = require('gulp-plumber');

var dir = {
  src: {
    css    : 'src/css',
    js     : 'src/js',
    images : 'src/images',
    favicon: 'src/favicon.ico',
    ejs : [
      'src/ejs/**/*.ejs',
      '!src/ejs/**/_*.ejs'
    ]
  },
  dist: {
    css    : 'public/assets/css',
    js     : 'public/assets/js',
    images : 'public/assets/images',
    favicon: 'public',
    ejs    : 'public',
  }
};

/**
 * ES6 to ES5
 */

gulp.task('js', function() {
  gulp.src(dir.src.js + '/**/*.js')
    .pipe(plumber())
    .pipe(rollup({
      allowRealFiles: true,
      entry: dir.src.js + '/app.js',
      format: 'iife',
      plugins: [
        nodeResolve({ jsnext: true }),
        commonjs(),
        babel({
          presets: ['es2015-rollup'],
          babelrc: false
        })
      ]
    }))
    .pipe(gulp.dest(dir.dist.js))
    .on('end', function() {
      gulp.src([dir.dist.js + '/app.js'])
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(dir.dist.js));
    });
});

/**
 * Sass to CSS
 */
gulp.task('css', function() {
  return gulp.src(dir.src.css + '/*.scss')
    .pipe(plumber())
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(gulp.dest(dir.dist.css))
    .pipe(postcss([autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    })]))
    .pipe(gulp.dest(dir.dist.css))
    .pipe(postcss([cssnano()]))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(dir.dist.css));
});

/**
 * EJS to HTML
 */
gulp.task('ejs', function() {
  gulp.src(dir.src.ejs)
    //.pipe(plumber())
    .pipe(ejs(
      {
        version: '6.0.1',
        css    : '/assets/css',
        js     : '/assets/js',
        images : '/assets/images',
        is_front_page: false
      },
      {},
      {ext: '.html'})
    )
    .pipe(gulp.dest(dir.dist.ejs));
});

/**
 * images
 */
gulp.task( 'imagecopy', function(){
  gulp.src(dir.src.images + '/**/*.+(jpg|jpeg|png|gif|svg)')
    .pipe(gulp.dest(dir.dist.images));
} );
gulp.task('favicon', function(){
  gulp.src(dir.src.favicon)
    .pipe(gulp.dest(dir.dist.favicon));
} );

/**
 * Auto Compile.
 */
gulp.task('watch', function() {
  gulp.watch([dir.src.css + '/**/*.scss'], ['css']);
  gulp.watch([dir.src.js + '/**.js'], ['js']);
  gulp.watch([dir.src.images + '/**/*.+(jpg|jpeg|png|gif|svg)'], ['imagecopy']);
  gulp.watch([dir.src.favicon], ['favicon']);
  gulp.watch(['src/ejs/**/*.ejs'], ['ejs']);
});

/**
 * Browsersync
 */
gulp.task('browsersync', function() {
  browser_sync.init( {
    server: {
      baseDir: "public/"
    },
    files: [
      'public/**'
    ]
  });
});

gulp.task('build', ['css', 'js', 'imagecopy', 'favicon', 'ejs']);

gulp.task('default', ['build', 'browsersync', 'watch']);
