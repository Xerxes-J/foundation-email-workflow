import gulp from 'gulp';
import plugins from 'gulp-load-plugins';
import fs from 'fs-extra';
import size from 'gulp-size';
import htmlbeautify from 'gulp-html-beautify';
import inliner from 'premailer-gulp-juice';
import replace from 'gulp-replace';
import yargs from 'yargs';
import Q from 'q';
import glob from 'glob';
import colors from 'colors';

const $ = plugins();

// Flag --production
const PRODUCTION = !!(yargs.argv.production);

//  Grab Paths
const FILE_PATH = './config/paths.json';
const EMAIL_PATH = './build/';
const PATHS = fs.readJsonSync(FILE_PATH);

// Variables
let beautifyOptions = {
	"indent_size": 2
};

const inlineCSS = () => {
	console.log('========'.rainbow);
	console.log('INLINING:'.bold.red + ' ' + 'CSS to HTML');
	console.log('========'.rainbow);

	// Empty Array
	var compiledEmails = [];

	// For Each email
	glob.sync(EMAIL_PATH + '*.html').forEach((file) => {
		let email = file.replace(/^(.*[\\\/])/, '');
		let emailName = email.replace(/\.[^/.]+$/, '');

		if (fs.statSync(file).isFile()) {
			let defer = Q.defer();

			let pipeline = gulp.src(PATHS.BASE.build + emailName + '.html')
				.pipe(gulp.dest(PATHS.BASE.build))
				// Check Size
				.pipe($.if(PRODUCTION, size({
					title: 'BEFORE'.bold.red
				})))
				// Inline CSS Styles
				.pipe($.if(PRODUCTION, inliner({
					removeStyleTags: false,
					applyStyleTags: true,
					applyWidthAttributes: true,
					preserveFontFaces: true,
					preserveMediaQueries: true,
					preserveImportant: true,
					ignoredPseudos: true,
					webResources: {
						relativeTo: PATHS.BASE.build,
						images: false,
						svgs: false,
						scripts: false
					}
				})))
				// Check Size
				.pipe($.if(PRODUCTION, size({
					title: 'AFTER'.bold.red
				})))
				// Beautify HTML with options
				.pipe(htmlbeautify(beautifyOptions))
				// HTML Inline Destination
				.pipe(gulp.dest(PATHS.BASE.build));

			pipeline.on('end', () => {
				defer.resolve();
			});

			compiledEmails.push(defer.promise);
		}
	});

	return Q.all(compiledEmails);
}

// Inline Task
// Inline CSS HTML
// ================================

gulp.task('inline', inlineCSS);