var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var config = require('./config/build.config');

gulp.task('js:lint', function() {
  return gulp
    .src('app/**/*.js')
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish'));
});

gulp.task('clean', function() {
  gulp
    .src('./dist/*', { read: false })
    .pipe(plugins.clean());
});

gulp.task('copy:assets', function() {
  gulp
    .src('app/assets/**/*')
    .pipe(gulp.dest('dist/assets/'));
});

gulp.task('copy:jade', function() {
  gulp
    .src('app/**/*.jade')
    // .pipe(plugins.jade()) // let express handle this for now
    .pipe(gulp.dest('dist/'));
})

gulp.task('js:app', function () {
   gulp
    .src('app/**/*.js')
    .pipe(plugins.uglify())
    .pipe(plugins.concat('app.js'))
    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('js:vendor', function() {
  gulp
    .src(config.vendor.js)
    .pipe(plugins.uglify())
    .pipe(plugins.rename({ suffix: 'min' }))
    .pipe(plugins.concat('vendor.js'))
    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('styles:vendor', function() {
  gulp
    .src(config.vendor.css)
    .pipe(plugins.concat('vendor.css'))
    .pipe(gulp.dest('./dist/css/'));
});

// Styles task (sass - .scss format)
gulp.task('styles', ['styles:vendor'], function() {
  gulp
    .src('app/styles/*.scss')
  // The onerror handler prevents Gulp from crashing when you make a mistake in your SASS
    .pipe(plugins.sass({
      onError: function (e) {
        console.log(e);
      },
      sourceMap: 'sass',
      sourceComments: 'map',
      precision: 10,
      // imagePath: 'assets/img',
    }))
    .pipe(plugins.autoprefixer("last 2 versions", "> 1%", "ie 8", {
      map: false
    }))
    .pipe(gulp.dest('./dist/css/'));
});

//
// Don't include this in watch tasks.
// It is a standalone task.
//
gulp.task('clean:bower', function() {
  gulp
    .src('vendor/', { read: false })
    .pipe(plugins.clean());
});

gulp.task('watch', function() {
  gulp.watch('app/**/*.js', ['js']);
  gulp.watch('app/*.scss', ['styles']);
  gulp.watch('app/**/*.jade', ['copy']);
});

gulp.task('copy', ['copy:assets', 'copy:jade']);
gulp.task('js', ['js:app', 'js:vendor', 'js:lint']);
gulp.task('default', ['clean', 'copy', 'styles', 'js', 'watch']);


