import gulp              from 'gulp';
import plugins           from 'gulp-load-plugins';
import fs                from 'fs';
import postcss           from 'gulp-postcss';
import autoprefixer      from 'autoprefixer';
import sass              from 'gulp-sass';
import size              from 'gulp-size';
import replace           from 'gulp-replace';
import rename            from 'gulp-rename';
import del               from 'del';
import Q                 from 'q';
import glob              from 'glob';
import yargs             from 'yargs';
import notify            from 'gulp-notify';
import combinMQ          from 'gulp-combine-mq';
import colors            from 'colors';


const $ = plugins();

// Flag --production
const PRODUCTION = !!(yargs.argv.production);

//  Grab Paths
var filePath = './config/paths.json',
    configPath = './config/config.json',
    emailPath = './build/',
    PATHS = JSON.parse(fs.readFileSync(filePath)),
    CONFIG = JSON.parse(fs.readFileSync(configPath));


// Style Task
// Compiles SCSS to CSS
// ================================
gulp.task('styles',
    gulp.series(scss, scssjson, duplicate, renamecss, removecss)
);

// Functions
function scss() {

    // Terminal Message
    console.log('========');
    console.log('STYLES:'.bold.red + ' ' + 'STEP 1'.bold.cyan + ' - ' + 'Compiling SCSS into CSS');
    console.log('========');

    // Source
    return gulp.src(PATHS.styles.src + 'style.scss')
        // Init Source-maps
        .pipe($.if(!PRODUCTION, $.sourcemaps.init()))
        // Check Size
        .pipe(size({title: 'Before compile'}))
        // SCSS to CSS with Error Log
        .pipe(sass({
            includePaths: ['node_modules/foundation-emails/scss']
        }).on('error', sass.logError))
        // CSS Autoprefixer
        .pipe(postcss([
            autoprefixer(CONFIG.autoprefixer)
        ]))
        // Rename CSS file
        .pipe(rename({basename:'style'}))
        // Combine Media Queries
        .pipe(combinMQ({
            beautify: true
        }))
        // Check Size
        .pipe(size({title: 'After compile'}))
        // Write Source Maps
        .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
        // Destination
        .pipe(gulp.dest(PATHS.styles.build));

}

function scssjson() {
    return gulp.src(PATHS.styles.src + '_settings.scss')
        // Sass variables
        .pipe($.if(!PRODUCTION, $.sassJson()))
        // Desitination of file
        .pipe(gulp.dest(PATHS.base.src + 'data'));
}

function duplicate() {

    // Terminal Message
    console.log('========'.rainbow);
    console.log('STYLES:'.bold.red + ' ' + 'STEP 2'.bold.cyan + ' - ' + 'Creating duplicates of master stylesheet');
    console.log('========'.rainbow);

    // Empty Array
    var promises = [];

    glob.sync(emailPath + '*.html').forEach(function(fileName) {

        var email = fileName.replace(/^(.*[\\\/])/, ''),
            emailName = email.replace(/\.[^/.]+$/, '');

        if (fs.statSync(fileName).isFile()) {
            var defer = Q.defer();

            var pipeline = gulp.src(PATHS.styles.build + 'style.css')
                .pipe($.if(PRODUCTION, rename({basename:emailName})))
                .pipe(gulp.dest(PATHS.styles.build));

            pipeline.on('end', function() {
               defer.resolve();
            });

            promises.push(defer.promise);
        }

    });

    return Q.all(promises);
}

function renamecss() {

    // Terminal Message
    console.log('========'.rainbow);
    console.log('STYLES:'.bold.red + ' ' + 'STEP 3'.bold.cyan + ' - ' + 'Renaming linked stylesheet to file name');
    console.log('========'.rainbow);

    // Empty Array
    var promises = [];

    glob.sync(emailPath + '*.html').forEach(function(fileName) {

        var email = fileName.replace(/^(.*[\\\/])/, ''),
            emailName = email.replace(/\.[^/.]+$/, '');

        if (fs.statSync(fileName).isFile()) {
            var defer = Q.defer();

            var pipeline =  gulp.src(PATHS.base.build + emailName +'.html')
                .pipe($.if(PRODUCTION, $.replace('<link href="assets/css/style.css" media="all" rel="stylesheet" type="text/css">', '<link href="assets/css/' + emailName + '.css" media="all" rel="stylesheet" type="text/css">')))
                .pipe(gulp.dest(PATHS.base.build));

            pipeline.on('end', function() {
                defer.resolve();
            });

            promises.push(defer.promise);
        }

    });

    return Q.all(promises);
}

function removecss() {

    // Terminal Message
    console.log('========'.rainbow);
    console.log('STYLES:'.bold.red + ' ' + 'STEP 4'.bold.cyan + ' - ' + 'Removing unused CSS from generated stylesheets');
    console.log('========'.rainbow);

    // Empty Array
    var promises = [];

    glob.sync(emailPath + '*.html').forEach(function(fileName) {

        var email = fileName.replace(/^(.*[\\\/])/, ''),
            emailName = email.replace(/\.[^/.]+$/, '');

        if (fs.statSync(fileName).isFile()) {
            var defer = Q.defer();

            if(PRODUCTION ? emailName : emailName = 'style');

            var pipeline = gulp.src(PATHS.styles.build + emailName +'.css')
                .pipe($.if(PRODUCTION, $.uncss({
                    html: [PATHS.base.build + emailName +'.html']
                })))
                .pipe(gulp.dest(PATHS.styles.build));

            pipeline.on('end', function() {
                defer.resolve();
            });

            promises.push(defer.promise);
        }

    });

    return Q.all(promises);
}
