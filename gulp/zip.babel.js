import gulp from 'gulp';
import plugins from 'gulp-load-plugins';
import fs from 'fs-extra';
import path from 'path';
import merge from 'merge-stream';
import colors from 'colors';

const $ = plugins();

//  Grab Paths
const EMAIL_PATH = './src/templates/emails/';
const DIST_PATH = './build';
const EXT = '.html';

const zip = () => {
	fs.readdir(EMAIL_PATH, (err, items) => {
		console.log('========');
		for (var i = 0; i < items.length; i++) {
			console.log('ZIPPED:'.bold.red + ' ' + colors.cyan(items[i].replace(/\.[^/.]+$/, "")));
		}
		console.log('========');
	});

	let htmlFiles = getHtmlFiles(DIST_PATH);
	let moveTasks = htmlFiles.map((file) => {

		// Source path
		let sourcePath = path.join(DIST_PATH, file);
		// File name
		let fileName = path.basename(sourcePath, EXT);

		// Move HTML
		let moveHTML = gulp.src(sourcePath)
			.pipe($.rename((path) => {
				path.dirname = fileName;
				return path;
			}));

		// Move Images
		let moveImages = gulp.src(sourcePath)
			.pipe($.htmlSrc({
				selector: 'img'
			}))
			.pipe($.rename((path) => {
				path.dirname = fileName + '/' + path.dirname;
				return path;
			}));

		// Zip each html/image to it's appropriate file
		return merge(moveHTML, moveImages)
			.pipe($.zip(fileName + '.zip'))
			.pipe(gulp.dest('build/zip'));
	});

	return merge(moveTasks);
}

// Grab compiled HTML files
const getHtmlFiles = (dir) => {
	// Read build directory
	return fs.readdirSync(dir).filter((file) => {
		// Combine directory and file-path
		let fileExt = path.join(dir, file);
		// Checks if contains .html extension
		let isHtml = path.extname(fileExt) == EXT;

		return fs.statSync(fileExt).isFile() && isHtml;
	});
}

// Zip Task
// Copy and compress into Zip
// ================================
gulp.task('zip', zip);