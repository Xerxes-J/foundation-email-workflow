import gulp     from 'gulp';
import browser  from 'browser-sync';
import fs       from 'fs-extra';
import colors   from 'colors';

//  Grab Paths
const CONFIG_PATH = './config/paths.json';
const PATHS = fs.readJsonSync(CONFIG_PATH);

// Watch files and folders
const watch = (done) => {
  console.log('========');
  console.log('WATCHING:'.bold.red + ' ' + colors.cyan(PATHS.TEMPLATES.emails));
  console.log('WATCHING:'.bold.red + ' ' + colors.cyan(PATHS.TEMPLATES.layouts));
  console.log('WATCHING:'.bold.red + ' ' + colors.cyan(PATHS.TEMPLATES.partials));
  console.log('WATCHING:'.bold.red + ' ' + colors.cyan(PATHS.STYLES.src));
  console.log('WATCHING:'.bold.red + ' ' + colors.cyan(PATHS.IMAGES.src));
  console.log('========');

  // Watch Template files
  gulp.watch(PATHS.TEMPLATES.emails + '*.{html,hbs}').on('all', gulp.series('template', 'inline', reload));
  // Watch Layout files
  gulp.watch([PATHS.TEMPLATES.layouts + '*.{html,hbs}', PATHS.TEMPLATES.partials + '**/*.{html,hbs}']).on('all', gulp.series('template', 'inline', reload));
  // Watch SCSS files
  gulp.watch(PATHS.STYLES.src + '**/*.scss').on('all', gulp.series('template', 'styles', 'inline', reload));
  // Watch Image files
  gulp.watch(PATHS.IMAGES.src).on('all', gulp.series('images', reload));

  done();
}

// Reload browser
const reload = () => {
  return browser.reload();
}

// Watch Task
// Watch for file changes
// ================================

gulp.task('watch', watch);