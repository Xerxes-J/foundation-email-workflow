import gulp     from 'gulp';
import plugins  from 'gulp-load-plugins';
import fs       from 'fs-extra';
import colors   from 'colors';

const $ = plugins();

//  Grab Paths
const FILE_PATH = './config/paths.json';
const CONFIG_PATH = './config/config.json';
const CONFIGS = fs.readJsonSync(CONFIG_PATH);
const PATHS = fs.readJsonSync(FILE_PATH);

const litmusTesting = () => {
  fs.readdir(PATHS.TEMPLATES.emails, (err, items) => {
    console.log('========');
    for (var i=0; i<items.length; i++) {
      console.log('LITMUS:'.bold.red + ' ' + 'Testing' + ' ' + colors.cyan(items[i].replace(/\.[^/.]+$/, ".html")));
    }
    console.log('========');
  });

  // Source
  return gulp.src(PATHS.BASE.build + '*.html')
      .pipe($.litmus(CONFIGS.LITMUS))
      .pipe(gulp.dest(PATHS.BASE.build));
}

// Litmus task
// Sends each email in build for litmus testing
// ================================
gulp.task('litmus', litmusTesting);