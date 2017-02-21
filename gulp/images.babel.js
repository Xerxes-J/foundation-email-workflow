import gulp     from 'gulp';
import fs       from 'fs';
import plugins  from 'gulp-load-plugins';
import imagemin from 'gulp-imagemin';
import size     from  'gulp-size';
import replace  from 'gulp-replace';
import yargs    from 'yargs';
import colors   from 'colors';


const $ = plugins();

// Flag --image
const IMAGE = !!(yargs.argv.image);

//  Grab Paths
var filePath = './config/paths.json',
    configPath = './config/config.json',
    PATHS = JSON.parse(fs.readFileSync(filePath)),
    CONFIG = JSON.parse(fs.readFileSync(configPath));


// Image Task
// Copy and compress images
// ================================

gulp.task('images', gulp.series(images, replaceImage));

// Functions
function images() {

    // Terminal Message
    console.log('========');
    console.log('IMAGES:'.bold.red + ' ' + 'Moving and compressing images from ' + '"src/assets/img"'.cyan + ' to ' + '"build/assets/img"'.cyan);
    console.log('========');

    // IMG Source
    return gulp.src(PATHS.images.src + '**/*')
        // Check size
        .pipe(size({title: 'BEFORE'.bold.red + ' ' + 'Optimization'.cyan}))
        // Optimize image
        .pipe(imagemin({ optimizationLevel: 1, progressive: true, interlaced: true }))
        // Check size
        .pipe(size({title: 'AFTER'.bold.red + ' ' + 'Optimization'.cyan}))
        // IMG destination
        .pipe(gulp.dest(PATHS.images.build));
}

function replaceImage() {

    // Terminal Message
    console.log('========'.rainbow);
    console.log('IMAGES:'.bold.red + ' ' + 'Switching out image for server path');
    console.log('========'.rainbow);

    // IMG Source
    return gulp.src(PATHS.base.build + '*.html')
        // Replace source with hosted server path
        .pipe($.if(IMAGE, replace('src="' + CONFIG.FTP_IMAGE.image, 'src="' + CONFIG.FTP_IMAGE.full)))
        // IMG destination
        .pipe(gulp.dest(PATHS.base.build));
}