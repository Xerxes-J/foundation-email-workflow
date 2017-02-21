import gulp     from 'gulp';
import fs       from 'fs';
import yargs    from 'yargs';
import browser  from 'browser-sync';
import colors   from 'colors';


// Flag --to
const PORT = yargs.argv.port;

//  Grab Paths
var filePaths = './config/paths.json',
    configPath = './config/config.json',
    PATHS = JSON.parse(fs.readFileSync(filePaths)),
    CONFIG = JSON.parse(fs.readFileSync(configPath));


// Server Task
// Start a server with LiveReload for previewing
// ================================

gulp.task('server', server);

// Functions
function server(done) {

  // If argument includes port change use for browser-sync
  if (PORT) {
      CONFIG.PORT = PORT;
  }

  // Terminal Message
  console.log('========');
  console.log('SERVER:'.bold.red + ' ' + 'Booting up' + ' ' + 'Browser-Sync'.cyan + ' on ' + 'PORT:'.bold.red + ' ' + colors.cyan(CONFIG.PORT));
  console.log('========');

  // Start server
  browser.init({
      port: CONFIG.PORT || 3000,
      server: {
          open: false,
          baseDir: PATHS.base.build,
          directory: true
      }
  });

  done();
}
