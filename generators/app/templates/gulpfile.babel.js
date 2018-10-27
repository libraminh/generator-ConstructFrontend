"use strict";
import gulp from "gulp";
import babel from "gulp-babel";
import uglify from "gulp-uglify";
import sass from "gulp-sass";
import concat from "gulp-concat";
import prefixer from "gulp-autoprefixer";
<% if (includePug) { %>
import pug from "gulp-pug";
<% } %>
import sourcemaps from "gulp-sourcemaps";
import browserSync from "browser-sync";

browserSync.create();
const root = "node_modules";

// Declare gulp task
gulp.task("copyHtml", function() {
  return gulp.src("src/*.html").pipe(gulp.dest("dist"));
});

gulp.task("vendor", () => {
  return gulp
    .src([
      <% if (includeJQuery) { %>
      root + "/jquery/dist/jquery.min.js",
      <% } %>
      <% if (includeBootstrap) { %>
      root + "/bootstrap/dist/js/bootstrap.min.js",
      root + "/bootstrap/dist/css/bootstrap.min.css",
      <% } %>
      
      "src/assets/vendor/**/*"
    ])
    .pipe(gulp.dest("dist/assets/vendor"));
});

<% if (includeFontAwesome) { %>
gulp.task("fonts", function() {
  // return gulp
  gulp
    .src([root + "/font-awesome/fonts/fontawesome-webfont.*"])
    .pipe(gulp.dest("dist/assets/fonts"));
  gulp
    .src([root + "/font-awesome/css/font-awesome.min.css"])
    .pipe(gulp.dest("dist/assets/vendor"));
});
<% } %>

<% if (includePug) { %>
gulp.task("pug", () => {
  return gulp
    .src("src/*.pug")
    .pipe(
      pug({
        pretty: true
      })
    )
    .pipe(gulp.dest("dist"));
});
<% } %>

gulp.task("image", function() {
  return gulp
    .src("src/assets/images/**/*")
    .pipe(gulp.dest("dist/assets/images"));
});

gulp.task("sass", () => {
  return gulp
    .src(["src/assets/css/**/*.scss"])
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        outputStyle: "compressed"
      }).on("error", sass.logError)
    )
    .pipe(
      prefixer({
        browsers: ["last 2 versions"],
        cascade: false
      })
    )
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("dist/assets/css"))
    .pipe(browserSync.stream());
});

gulp.task("script", () => {
  return (
    gulp
      .src("src/assets/js/**/*.js")
      .pipe(sourcemaps.init())
      .pipe(babel())
      .pipe(uglify())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest("dist/assets/js"))
      .pipe(browserSync.stream())
  );
});

gulp.task("serve", ["sass"], () => {
  browserSync.init({
    server: "./dist",
    port: 6900
  });

  gulp.watch(
    [root + "/bootstrap/scss/bootstrap.scss", "src/assets/css/**/*.scss"],
    ["sass"]
  );
  <% if (includePug) { %>
  gulp.watch("src/**/*.pug", ["pug"]).on("change", browserSync.reload);
  <% } %>
  <% if (!includePug) { %>
  gulp.watch("src/*.html", ["copyHtml"]).on("change", browserSync.reload);
  <% } %>
  gulp.watch("src/assets/js/*.js", ["script"]);
  gulp.watch("src/assets/images/**/*", ["image"]);
  gulp.watch("src/*.html").on("change", browserSync.reload);
});

gulp.task("default", [
  "copyHtml",
  "image",
  "script",
  <% if (includeFontAwesome) { %>
  "fonts",
  <% } %>
  "vendor",
  <% if (includePug) { %>
  "pug",
  <% } %>
  "serve"
]);
