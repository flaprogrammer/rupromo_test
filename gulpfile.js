// include gulp
var gulp = require('gulp'); 
 
// include plug-ins
var jshint = require('gulp-jshint');
// var changed = require('gulp-changed');
var imagemin = require('gulp-imagemin');


var concat = require('gulp-concat');
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');

// // include plug-ins
var autoprefix = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var jade = require('gulp-jade');
var server = require('gulp-server-livereload');
var spritesmith = require('gulp.spritesmith');



gulp.task('sprites', function () {
	var spriteData = gulp.src('src/img/sprites/*.png').pipe(spritesmith({
		algorithm: 'top-down',
		imgName: 'sprite.png',
		cssName: '../../src/scss/include/spritesmith.scss',
		imgPath: '../img/sprite.png',
		cssFormat: 'scss',
		padding: 3
	}));
	spriteData.pipe(gulp.dest('build/img'));
});


//JS hint task
gulp.task('jshint', function() {
  gulp.src('./src/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});



gulp.task('imagemin', function() {
  var imgSrc = './src/img/**/*',
      imgDst = './build/img';
 
  gulp.src(imgSrc)
    //.pipe(changed(imgDst))
    .pipe(imagemin())
    .pipe(gulp.dest(imgDst));
});
 

 
//JS concat, strip debugging and minify
gulp.task('scripts', function() {
  gulp.src('./src/js/*.js')
    .pipe(concat('script.js'))
    //.pipe(stripDebug())
    //.pipe(uglify())
    .pipe(gulp.dest('./build/js/'));
});

gulp.task('sass', function () {
    gulp.src('./src/scss/*.scss')
      .pipe(sass({errLogToConsole:true}))
      .pipe(autoprefix('last 2 versions'))
      .pipe(gulp.dest('./build/css'));
});


gulp.task('webserver', function() {
  gulp.src('build')
    .pipe(server({
      livereload: true,
      defaultFile: 'index.html'
    }));
});

gulp.task('jade', function() {
  var YOUR_LOCALS = {};

  gulp.src('./src/jade/*.jade')
    .pipe(jade({
      //locals: YOUR_LOCALS
      pretty: true
    }))
    .pipe(gulp.dest('./build/'))
});


gulp.task('default', ['imagemin','scripts', 'sass', 'jade', 'webserver', 'sprites'], function() {

	gulp.watch('./src/img/sprites/*', function() {
		gulp.run('sprites');
	});


	gulp.watch('./src/img/**', function() {
    gulp.run('imagemin');
  });
 
  gulp.watch(['./src/jade/*.jade','./src/jade/include/*.jade'], function() {
     gulp.run('jade');
  });
 
  // watch for JS changes
  gulp.watch(['./src/js/*.js','./src/js/**/*.js'], function() {
    gulp.run('jshint', 'scripts');
  });
 
  // watch for CSS changes
  // gulp.watch('./src/css/*.css', function() {
  //   gulp.run('styles');
  // });
  gulp.watch(['./src/scss/**/*.scss'], function() {
    gulp.run('sass');
  });

});