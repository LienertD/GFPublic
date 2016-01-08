//npm
/**
 * Created by Jonatan on 11/11/2015.
 */

var gulp = require("gulp"),
    csslint = require("gulp-csslint"),
    sourceMaps = require("gulp-sourcemaps"),
    cssMinifier = require("gulp-minify-css"),
    concat = require("gulp-concat"),
    less = require("gulp-less"),
    notify = require("gulp-notify"),
    jsHint = require("gulp-jshint"),
    jsStylish = require("jshint-stylish"),
    ugLify = require("gulp-uglify");

gulp.task("css", function() {
    gulp.src("./src/less/**/*.less")
        .pipe(less())
        .pipe(csslint({ "ids" : false }))
        .pipe(sourceMaps.init())
        .pipe(cssMinifier())
        .pipe(concat("site.css"))
        .pipe(sourceMaps.write())
        .pipe(gulp.dest("./src/dist/css"))
        .pipe(notify({ message : "css-build" }));
});

gulp.task("js", function () {
    gulp.src(["./src/app.js", "./src/controllers/**/*.js", "./src/services/**/*.js", "./src/models/**.*js", "./src/viewmodels/**/*.js", "./src/exceptions/**/*.js", "./src/config/config.js"])
        .pipe(jsHint())
        .pipe(jsHint.reporter(jsStylish))
        .pipe(sourceMaps.init())
        .pipe(concat("app.min.js"))
        //.pipe(ugLify())
        .pipe(sourceMaps.write())
        .pipe(gulp.dest("./src/dist/js"))
        .pipe(notify({ message : "js-built" }));
});

gulp.task("default", function () {
    gulp.watch("./src/less/**/*.less", ["css"]);
    gulp.watch(["./src/app.js", "./src/controllers/**/*.js", "./src/services/**/*.js", "./src/models/**.*js", "./src/viewmodels/**/*.js", "./src/exceptions/**/*.js", "./src/config/config.js"], ["js"]);
});
