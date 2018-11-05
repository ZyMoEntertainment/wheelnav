"use strict";

var gulp = require("gulp"),
    concat = require("gulp-concat"),
    // cssmin = require("gulp-cssmin"),
    // uglify = require("gulp-uglify"),
    debug = require('gulp-debug'),
    merge = require("merge-stream"),
    del = require("del"),
    bundleconfig = require("./bundleconfig.json");

gulp.task("min", ["min:js", "min:css", "min:html"]);

gulp.task("js", function () {
    var tasks = getBundles(".js").map(function (bundle) {
      console.log("bundle ", bundle);
        return gulp.src(bundle.inputFiles, { base: "." })
            .pipe(debug())
            .pipe(concat(bundle.outputFileName))
            .pipe(gulp.dest("./js/dist/"));
    });
    return merge(tasks);
});

gulp.task("min:css", function () {
    var tasks = getBundles(".css").map(function (bundle) {
        return gulp.src(bundle.inputFiles, { base: "." })
            .pipe(concat(bundle.outputFileName))
            .pipe(cssmin())
            .pipe(gulp.dest("."));
    });
    return merge(tasks);
});

gulp.task("clean", function () {
    var files = bundleconfig.map(function (bundle) {
        return bundle.outputFileName;
    });

    return del(files);
});

gulp.task("watch", function () {
    getBundles(".js").forEach(function (bundle) {
        gulp.watch(bundle.inputFiles, ["min:js"]);
    });

    getBundles(".css").forEach(function (bundle) {
        gulp.watch(bundle.inputFiles, ["min:css"]);
    });
});

function getBundles(extension) {
    return bundleconfig.filter(function (bundle) {
        return new RegExp(`${extension}$`).test(bundle.outputFileName);
    });
}