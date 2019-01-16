import gulp from 'gulp';
import fs from 'fs-extra';
import yargs from 'yargs';
import browser from 'browser-sync';
import colors from 'colors';

// Flag --to
const PORT = yargs.argv.port;

//  Grab Paths
const FILE_PATHS = './config/paths.json';
const BASE_PATHS = './config/config.json';
const PATHS = fs.readJsonSync(FILE_PATHS);
const CONFIG = fs.readJsonSync(BASE_PATHS);

// Create server using BrowserSync
const server = (done) => {

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
			baseDir: PATHS.BASE.build,
			directory: true
		}
	});

	done();
}

// Server Task
// Start a server with LiveReload for previewing
// ================================

gulp.task('server', server);