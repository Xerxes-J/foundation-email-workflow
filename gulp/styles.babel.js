import gulp from 'gulp';
import plugins from 'gulp-load-plugins';
import fs from 'fs-extra';
import postcss from 'gulp-postcss';
import uncss from 'postcss-uncss';
import autoprefixer from 'autoprefixer';
import sass from 'gulp-sass';
import size from 'gulp-size';
import replace from 'gulp-replace';
import rename from 'gulp-rename';
import del from 'del';
import Q from 'q';
import glob from 'glob';
import yargs from 'yargs';
import combinMQ from 'gulp-combine-mq';
import colors from 'colors';

const $ = plugins();

// Flag --production
const PRODUCTION = !!(yargs.argv.production);

//  Grab Paths
const FILE_PATH = './config/paths.json';
const CONFIG_PATH = './config/config.json';
const EMAIL_PATH = './build/';
const PATHS = fs.readJsonSync(FILE_PATH);
const CONFIG = fs.readJsonSync(CONFIG_PATH);

// Compile SCSS
const compileSCSS = () => {
	console.log('========');
	console.log('STYLES:'.bold.red + ' ' + 'STEP 1'.bold.cyan + ' - ' + 'Compiling SCSS into CSS');
	console.log('========');

	return gulp.src(PATHS.STYLES.src + 'style.scss')
		.pipe($.if(!PRODUCTION, $.sourcemaps.init()))
		.pipe(size({
			title: 'Before compile'
		}))
		.pipe(sass({
			includePaths: ['node_modules/foundation-emails/scss']
		}).on('error', sass.logError))
		.pipe(postcss([
			autoprefixer(CONFIG.AUTOPREFIXER)
		]))
		.pipe(rename({
			basename: 'style'
		}))
		.pipe(combinMQ({
			beautify: true
		}))
		.pipe(size({
			title: 'After compile'
		}))
		.pipe($.if(!PRODUCTION, $.sourcemaps.write()))
		.pipe(gulp.dest(PATHS.STYLES.build));
}

// Create seperate CSS per each generated email
const splitCSS = () => {
	console.log('========'.rainbow);
	console.log('STYLES:'.bold.red + ' ' + 'STEP 2'.bold.cyan + ' - ' + 'Creating duplicates of master stylesheet');
	console.log('========'.rainbow);

	let compiledEmails = [];

	glob.sync(EMAIL_PATH + '*.html').forEach((file) => {
		let email = file.replace(/^(.*[\\\/])/, '');
		let emailName = email.replace(/\.[^/.]+$/, '');

		if (fs.statSync(file).isFile()) {
			let defer = Q.defer();

			let pipeline = gulp.src(PATHS.STYLES.build + 'style.css')
				.pipe($.if(PRODUCTION, rename({
					basename: emailName
				})))
				.pipe(gulp.dest(PATHS.STYLES.build));

			pipeline.on('end', () => {
				defer.resolve();
			});

			compiledEmails.push(defer.promise);
		}
	});

	return Q.all(compiledEmails);
}

// Rename CSS using their email counterpart
const renameCSS = () => {
	console.log('========'.rainbow);
	console.log('STYLES:'.bold.red + ' ' + 'STEP 3'.bold.cyan + ' - ' + 'Renaming linked stylesheet to file name');
	console.log('========'.rainbow);

	let compiledEmails = [];

	glob.sync(EMAIL_PATH + '*.html').forEach((file) => {
		let email = file.replace(/^(.*[\\\/])/, '');
		let emailName = email.replace(/\.[^/.]+$/, '');

		if (fs.statSync(file).isFile()) {
			let defer = Q.defer();

			let pipeline = gulp.src(PATHS.BASE.build + emailName + '.html')
				.pipe($.if(PRODUCTION, $.replace('<link href="assets/css/style.css" media="all" rel="stylesheet" type="text/css">', '<link href="assets/css/' + emailName + '.css" media="all" rel="stylesheet" type="text/css">')))
				.pipe(gulp.dest(PATHS.BASE.build));

			pipeline.on('end', () => {
				defer.resolve();
			});

			compiledEmails.push(defer.promise);
		}
	});

	return Q.all(compiledEmails);
}

// Remove any unused CSS for each email
const removeUnusedCSS = () => {
	console.log('========'.rainbow);
	console.log('STYLES:'.bold.red + ' ' + 'STEP 4'.bold.cyan + ' - ' + 'Removing unused CSS from generated stylesheets');
	console.log('========'.rainbow);

	let compiledEmails = [];

	glob.sync(EMAIL_PATH + '*.html').forEach((file) => {
		let email = file.replace(/^(.*[\\\/])/, '');
		let emailName = email.replace(/\.[^/.]+$/, '');

		if (fs.statSync(file).isFile()) {
			let defer = Q.defer();

			if (PRODUCTION ? emailName : emailName = 'style');

			let postCSSplugins = [
				uncss({
					html: [PATHS.BASE.build + emailName + '.html']
				})
			];

			let pipeline = gulp.src(PATHS.STYLES.build + emailName + '.css')
				.pipe($.if(PRODUCTION, postcss(postCSSplugins)))
				.pipe(gulp.dest(PATHS.STYLES.build));

			pipeline.on('end', () => {
				defer.resolve();
			});

			compiledEmails.push(defer.promise);
		}
	});

	return Q.all(compiledEmails);
}

// Style Task
// Compiles SCSS to CSS
// ================================
gulp.task('styles',
	gulp.series(compileSCSS, splitCSS, renameCSS, removeUnusedCSS)
);