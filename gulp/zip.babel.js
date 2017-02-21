import gulp     from 'gulp';
import plugins  from 'gulp-load-plugins';
import fs       from 'fs';
import path     from 'path';
import merge    from 'merge-stream';
import debug    from 'gulp-debug';
import colors   from 'colors';


const $ = plugins();

//  Grab Paths
var filePath = './config/paths.json',
    emailPath = './src/templates/emails/',
    PATHS = JSON.parse(fs.readFileSync(filePath));

// Variables
var dist = './build',
    ext = '.html';

// Zip Task
// Copy and compress into Zip
// ================================

gulp.task('zip', zip);

// Functions
function zip() {

    // Terminal Message: List emails by name that are being zipped
    fs.readdir(emailPath, function(err, items) {
        console.log('========');
        for (var i=0; i<items.length; i++) {
            console.log('ZIPPED:'.bold.red + ' ' + colors.cyan(items[i].replace(/\.[^/.]+$/, "")));
        }
        console.log('========');
    });

  // Get HTML files
  function getHtmlFiles(dir) {
      // Read build directory
      return fs.readdirSync(dir)
          .filter(function(file) {
              // Combine directory and file-path
              var fileExt = path.join(dir, file),
                  // Checks if contains .html extension
                  isHtml = path.extname(fileExt) == ext;

              return fs.statSync(fileExt).isFile() && isHtml;
          });
  }

  var htmlFiles = getHtmlFiles(dist),
      moveTasks = htmlFiles.map(function(file){

      // Source path
      var sourcePath = path.join(dist, file),
          // File name
          fileName = path.basename(sourcePath, ext);

      // Move HTML
      var moveHTML = gulp.src(sourcePath)
          .pipe($.rename(function (path) {
                path.dirname = fileName;
                return path;
          }));

      // Move Images
      var moveImages = gulp.src(sourcePath)
          .pipe($.htmlSrc({ selector: 'img'}))
          .pipe($.rename(function (path) {
              path.dirname = fileName + '/' + path.dirname;
              return path;
          }));

      // Zip each html/image to it's appropriate file
      return merge(moveHTML, moveImages)
          .pipe($.zip(fileName + '.zip'))
          .pipe(gulp.dest('build/zip'));
  });

  return merge(moveTasks);
}