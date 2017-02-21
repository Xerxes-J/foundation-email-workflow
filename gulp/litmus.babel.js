import gulp     from 'gulp';
import plugins  from 'gulp-load-plugins';
import fs       from 'fs';
import litmus   from 'gulp-litmus';
import colors   from 'colors';


const $ = plugins();

//  Grab Paths
var filePath = './config/paths.json',
    configPath = './config/config.json',
    emailPath = './src/templates/emails/',
    CONFIG = JSON.parse(fs.readFileSync(configPath)),
    PATHS = JSON.parse(fs.readFileSync(filePath));


// Litmus task
// Sends each email in build for litmus testing
// ================================
gulp.task('litmus', testing);

function testing() {

  // Terminal Message: List emails by name that are being generated
  fs.readdir(emailPath, function(err, items) {
    console.log('========');
    for (var i=0; i<items.length; i++) {
      console.log('LITMUS:'.bold.red + ' ' + 'Testing' + ' ' + colors.cyan(items[i].replace(/\.[^/.]+$/, ".html")));
    }
    console.log('========');
  });

  // Source
  return gulp.src(PATHS.base.build + '*.html')
      // Litmus Push
      .pipe($.litmus(CONFIG.LITMUS))
      // Destination
      .pipe(gulp.dest(PATHS.base.build));
}
