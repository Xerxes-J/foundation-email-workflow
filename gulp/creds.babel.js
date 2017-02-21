import gulp     from 'gulp';
import fs       from 'fs';
import beep     from 'beepbeep';


//  Grab Paths
var configPath = './config/config.json';

// Variables
var CONFIG;


// Credential Check Task
// Checks to see if config.json exist
// ================================

gulp.task('creds', creds);

// Functions
function creds(done) {

  // Terminal Message
  console.log('========');
  console.log('CREDENTIALS:'.bold.red + ' ' + 'Checking if' + ' ' +'"config.json"'.cyan + ' ' + 'exists in' + ' ' + '"config/"'.cyan + ' ' + 'folder');
  console.log('========');

  try { CONFIG = JSON.parse(fs.readFileSync(configPath)); }
  catch(e) {
      beep();
      console.log('Sorry, there was an issue locating your config.json. Please see README.md');
      process.exit();
  }
  done();
}
