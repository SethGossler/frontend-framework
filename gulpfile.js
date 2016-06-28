'use strict';

//# declarations 
// Include/require Libs
var gulp = require('gulp'); 
var express = require('express');
var app = express();
var fs = require('fs');
// Include/require Our Gulp Plugins
var plumber = require("gulp-plumber");
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var inject = require("gulp-inject");
var flatten = require("gulp-flatten");
var jade = require('jade');
var gulpJade = require("gulp-jade");
var liveReload = require("gulp-livereload");
var del = require("del");
var autoprefixer = require("gulp-autoprefixer");
var ifElse = require("gulp-if-else");

// base dirs
var views = 'src/views';
var libs = 'src/libs';
var layouts = 'src/layouts';
var assets = 'src/assets/*.*';
// Our External Javascript Libraries to Bring In
var jslibs = require('./'+libs+'/scripts.json');
// structure dirs
var viewsJS =  views+'/*/*.js';
var viewsJade =  views+'/*/*.jade';
var viewsSass =  views+'/*/*.scss';
var libJS = libs+'/js/*.js';
var libSass = libs+'/sass/*.scss';
var libsJade = libs+'/jade/*.jade';
var layoutsJS = layouts+'/*/*.js';
var layoutsJade = layouts+'/*/*.jade';
var layoutsSass = layouts+'/*/*.scss';
var buildDir = "build/public";
var buildImg = buildDir + "/assets/img";
var buildCSS = buildDir + "/assets/css";
var buildJS = buildDir + "/assets/js";
// global vars
var that = this;
var _building = true;


//# Functions for common tasks between tasks
function onError(err) {
    console.log(err);
    this.emit('end');
}

function mvFiles(src, dest) {
    // console.log( "Move Files" );
    return gulp.src( src )
        .pipe(gulp.dest( dest ))
        .pipe(ifElse( !_building, liveReload ));
}

function mvFilesConcat(src, dest, concatName) {
    return gulp.src( src )
        .pipe(concat(concatName))
        .pipe(gulp.dest( dest ))
        .pipe(ifElse( !_building, liveReload ));
}

function sassCompile(src, name, dest) {
    // console.log( "Sass compile" );
    return gulp.src( src )
        .pipe(plumber({errorHandler: onError}))
        .pipe(sass( { includePaths: [ libs+'/sass/'] } ))
        .pipe(autoprefixer())
        .pipe(concat(name))
        .pipe(gulp.dest( dest ))
        .pipe(ifElse( !_building, liveReload ));
}

function jsCompile(src, name, dest) {
    // console.log( "js compile" );
    return gulp.src( src )
        .pipe(plumber({errorHandler: onError}))
        .pipe(concat( name ))
        .pipe(gulp.dest( dest ))
        .pipe(ifElse( !_building, liveReload ));
}

// #Gulp Tasks
// Lint Task
gulp.task('lint', function() {
    return gulp.src( [viewsJS, libJS, layoutsJS] )
        .pipe(plumber({errorHandler: onError}))
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// #Layout related tasks
// Build out the layout jade
gulp.task('layout-jade', function() {
    // console.log( "Jade Tasks" );
    return gulp.src( layoutsJade )
        .pipe(plumber({errorHandler: onError}))
        .pipe(gulpJade({
          basedir: __dirname+"/src/views",
          jade: jade,
          pretty: true,
          locals: {
            getView:function(viewName, data) {
                if(data == undefined){
                    data = {};
                }
                return jade.renderFile(__dirname+"/src/views/"+viewName+"/"+viewName+".jade", data);
            }
          }
        }))
        .pipe(gulp.dest( buildDir+"/" ))
        .pipe(ifElse( !_building, liveReload ));

});
// Compile Our Layout Sass
gulp.task('layout-sass', function() {
    return sassCompile(layoutsSass, 'layouts.css', buildCSS);
});
// Compile our layout js
gulp.task('layout-js', function() {
    mvFiles(libs+'/app.js', buildJS);
    return jsCompile(layoutsJS, "layouts.js", buildJS);
});

// #Libs related tasks
gulp.task('libs-js', function(){
  var srcs = [];
  for (var jl in jslibs) {
    srcs.push( jslibs[jl] );    
  }
  mvFilesConcat(srcs, buildJS,'libs.js');
});


// Build out libs (ie. common.scss )
gulp.task('libs-sass', function() {
    return sassCompile(libSass, 'libs.css', buildCSS);
});

// #Views related tasks
// compiled views sass files
gulp.task('views-sass', function() {
    return sassCompile(viewsSass, 'views.css', buildCSS);
});

gulp.task('views-js', function(){
    mvFilesConcat(viewsJS, buildJS, 'views.js');
})

// #Assets related tasks
// move files
gulp.task('assets-files', function() {
    return mvFiles(assets, buildImg);
});


// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch( layoutsJS, ['lint', 'layout-js'] );
    gulp.watch( layoutsSass, ['layout-sass'] );
    gulp.watch( layoutsJade, ['layout-jade'] );
    gulp.watch( viewsJS, ['views-js']);
    gulp.watch( viewsJade, ['layout-jade']);
    gulp.watch( viewsSass, ['views-sass']);
    gulp.watch( assets, ['assets-files']);
    gulp.watch( libs+'/scripts.json', ['libs-js']);
    gulp.watch( libs+'/app.js', ['layout-js']);
    gulp.watch( libSass, ['libs-sass']);
    gulp.watch( libsJade, ['layout-jade']);
});

gulp.task('remove-it-all', function(){
    return del(['build']);
});

gulp.task('server', function() {
    var dir = __dirname + '\\build\\public';
    console.log("------>>> Server On Port 3001 <<<---------");
    app.use(require('connect-livereload')());
    app.use(express.static( dir ));
    app.listen(3001);
    liveReload.listen({quiet:true});
});

// Default Task
gulp.task('default', ['libs-js', 'libs-sass', 'assets-files', 'views-sass', 'views-js', 'layout-sass', 'layout-js', 'layout-jade', 'watch', 'server'], function(){
    _building = false;
});

//gulp.task('build', ['core', 'core-sass', 'partials', 'sass', 'scripts', 'assets']);

gulp.task('clean', ['remove-it-all']);