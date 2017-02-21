import gulp     from 'gulp';
import browser  from 'browser-sync';
import fs       from 'fs';
import colors   from 'colors';


//  Grab Paths
var configPath = './config/paths.json',
    PATHS = JSON.parse(fs.readFileSync(configPath));

// Variables



// Watch Task
// Watch for file changes
// ================================

gulp.task('watch', watch);

// Functions
function watch(done) {

  // Terminal message
  console.log('========');
  console.log('WATCHING:'.bold.red + ' ' + colors.cyan(PATHS.templates.emails));
  console.log('WATCHING:'.bold.red + ' ' + colors.cyan(PATHS.templates.layouts));
  console.log('WATCHING:'.bold.red + ' ' + colors.cyan(PATHS.templates.partials));
  console.log('WATCHING:'.bold.red + ' ' + colors.cyan(PATHS.styles.src));
  console.log('WATCHING:'.bold.red + ' ' + colors.cyan(PATHS.images.src));
  console.log('========');

  // Watch Template files
  gulp.watch(PATHS.templates.emails + '*.{html,hbs}').on('all', gulp.series('generate', 'inline', reload));
  // Watch Layout files
  gulp.watch([PATHS.templates.layouts + '*.{html,hbs}', PATHS.templates.partials + '**/*.{html,hbs}']).on('all', gulp.series('generate', 'inline', reload));
  // Watch SCSS files
  gulp.watch(PATHS.styles.src + '**/*.scss').on('all', gulp.series('generate', 'styles', 'inline', reload));
  // Watch Image files
  gulp.watch(PATHS.images.src).on('all', gulp.series('images', reload));

  done();
}

function reload () {
  return browser.reload();
}