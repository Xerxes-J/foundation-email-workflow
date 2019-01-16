import gulp from 'gulp';
import fs from 'fs-extra';
import plugins from 'gulp-load-plugins';
import imagemin from 'gulp-imagemin';
import changed from 'gulp-changed';
import size from 'gulp-size';
import replace from 'gulp-replace';
import yargs from 'yargs';
import colors from 'colors';

const $ = plugins();

// Flag --image --production
const IMAGE = !!(yargs.argv.image);
const PRODUCTION = !!(yargs.argv.production);

//  Grab Paths
const FILE_PATH = './config/paths.json';
const PATHS = fs.readJsonSync(FILE_PATH);

// Optimize images when in production mode
const optimizeImages = () => {
	console.log('========');
	console.log('IMAGES:'.bold.red + ' ' + 'Moving and compressing images from ' + '"src/assets/img"'.cyan + ' to ' + '"build/assets/img"'.cyan);
	console.log('========');

	return gulp.src(PATHS.IMAGES.src + '**/*')
		.pipe(changed(PATHS.IMAGES.build))
		.pipe($.if(PRODUCTION, size({
			title: 'BEFORE'.bold.red + ' ' + 'Optimization'.cyan
		})))
		.pipe($.if(PRODUCTION, imagemin({
			optimizationLevel: 2,
			progressive: true,
			interlaced: true
		})))
		.pipe($.if(PRODUCTION, size({
			title: 'AFTER'.bold.red + ' ' + 'Optimization'.cyan
		})))
		.pipe(gulp.dest(PATHS.IMAGES.build));
}

// Replace image paths with absolute paths found in config/paths under FTP variable
const replaceImagePaths = () => {
	console.log('========'.rainbow);
	console.log('IMAGES:'.bold.red + ' ' + 'Switching out image for server path');
	console.log('========'.rainbow);

	// IMG Source
	return gulp.src(PATHS.BASE.build + '*.html')
		// Replace source with hosted server path
		// IMAGE SRC
		.pipe($.if(IMAGE, replace('src="' + PATHS.FTP.image, 'src="' + PATHS.FTP.full + PATHS.FTP.image)))
		// BACKGROUND SRC
		.pipe($.if(IMAGE, replace('background="' + PATHS.FTP.image, 'background="' + PATHS.FTP.full + PATHS.FTP.image)))
		// OUTLOOK VML SRC
		.pipe($.if(IMAGE, replace('<v:fill type="tile" src="' + PATHS.FTP.image, '<v:fill type="tile" src="' + PATHS.FTP.full + PATHS.FTP.image)))
		// IMG destination
		.pipe(gulp.dest(PATHS.BASE.build));
}

// Image Task
// Copy and compress images
// ================================
gulp.task('images', gulp.series(optimizeImages, replaceImagePaths));