import gulp from 'gulp';
import fs from 'fs-extra';
import beep from 'beepbeep'

//  Grab Paths
const CONFIG_PATH = './config/config.json';

// Variables
let CONFIG;

// If no config.json is found deliver message on console
const creds = (done) => {
	console.log('========');
	console.log('CREDENTIALS:'.bold.red + ' ' + 'Checking if' + ' ' + '"config.json"'.cyan + ' ' + 'exists in' + ' ' + '"config/"'.cyan + ' ' + 'folder');
	console.log('========');

	try {
		CONFIG = fs.readJsonSync(CONFIG_PATH);
	} catch (e) {
		beep();
		console.log('Sorry, there was an issue locating your config/base.json file. Please see README.md for further details...');
		process.exit();
	}

	return done();
}

// Credential Check Task
// Checks to see if config.json exist
// ================================
gulp.task('creds', creds);