import gulp from 'gulp';
import fs from 'fs-extra';
import del from 'del';
import colors from 'colors'

// Grab paths
const CONFIG_PATH = './config/paths.json';
const PATHS = fs.readJsonSync(CONFIG_PATH);

// Deletes build folder
const clean = (done) => {
	console.log('========');
	console.log('DELETED:'.bold.red + ' "build" '.cyan + 'folder');
	console.log('========');

	return del([PATHS.BASE.build], done);
}

// Clean Task
// Deletes everything inside /build folder
// ================================
gulp.task('clean', clean);