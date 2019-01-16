import gulp from 'gulp';
import fs from 'fs-extra';
import ftp from 'vinyl-ftp';
import colors from 'colors';
import open from 'gulp-open';

//  Grab Paths
let FILE_PATH = './config/paths.json';
let CONFIG_PATH = './config/config.json';
let PATHS = fs.readJsonSync(FILE_PATH);
let CONFIG = fs.readJsonSync(CONFIG_PATH);

// Variables
let conn = ftp.create(CONFIG.FTP);

// Deploy Images to FTP folder
const ftpIMG = () => {
	console.log('========');
	console.log('DEPLOY:'.bold.red + ' ' + 'FTP'.bold.cyan + ' - ' + 'Images');
	console.log('========');

	let globs = [
		PATHS.IMAGES.build + '**/*'
	];

	// Send only newer images to ftp destination
	return gulp.src(globs, {
			base: '',
			buffer: false
		})
		.pipe(conn.newer(PATHS.FTP.domain + PATHS.FTP.src + PATHS.FTP.image))
		.pipe(conn.dest(PATHS.FTP.domain + PATHS.FTP.src + PATHS.FTP.image));
}

// Deploy HTML to FTP folder
const ftpHTML = () => {
	console.log('========');
	console.log('DEPLOY:'.bold.red + ' ' + 'FTP'.bold.cyan + ' - ' + 'HTML');
	console.log('========');

	let globs = [
		PATHS.BASE.build + '*.html'
	];

	// Send only newer emails to ftp destination
	return gulp.src(globs, {
			base: '',
			buffer: false
		})
		.pipe(conn.newer(PATHS.FTP.domain + PATHS.FTP.src))
		.pipe(conn.dest(PATHS.FTP.domain + PATHS.FTP.src));
}

// Open file in browser
const ftpURL = (done) => {
	let htmlFiles = fs.readdirSync(PATHS.BASE.build).filter(file => {
		if (file.indexOf(".html") > -1) return file;
	});

	console.log('========'.rainbow);
	htmlFiles.forEach(file => {
		console.log('VIEWING UPLOADED PAGE:'.bold.red + ' ' + PATHS.FTP.full.bold.cyan + file.bold.cyan);

		let openOptions = {
			uri: PATHS.FTP.full + file
		};

		return gulp.src('./').pipe(open(openOptions));
	})
	console.log('========'.rainbow);

	return done();
}

// Deploy Task
// Sends files to server through FTP
// ================================
gulp.task('deploy',
	gulp.series(ftpIMG, ftpHTML, ftpURL)
);