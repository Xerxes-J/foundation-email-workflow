import gulp     from 'gulp';
import fs       from 'fs';
import del      from 'del';
import colors   from 'colors';


//  Grab Paths
var configPath = './config/paths.json',
    PATHS = JSON.parse(fs.readFileSync(configPath));


// Clean Task
// Deletes folders/files
// ================================

// Delete build folder
gulp.task('clean', clean);

// Functions
function clean(done) {

    // Terminal Message
    console.log('========');
    console.log('DELETED:'.bold.red + ' "build" '.cyan + 'folder');
    console.log('========');

    // Destination
    return del([PATHS.base.build], done);
}
