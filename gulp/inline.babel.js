import gulp         from 'gulp';
import plugins      from 'gulp-load-plugins';
import fs           from 'fs';
import size         from 'gulp-size';
import htmlbeautify from 'gulp-html-beautify';
import inliner      from 'premailer-gulp-juice';
import replace      from 'gulp-replace';
import yargs        from 'yargs';
import Q            from 'q';
import glob         from 'glob';
import colors       from 'colors';


const $ = plugins();

// Flag --production
const PRODUCTION = !!(yargs.argv.production);

//  Grab Paths
var filePath = './config/paths.json',
    emailPath = './build/',
    PATHS = JSON.parse(fs.readFileSync(filePath));

// Variables
var options = {
    "indent_size": 2
};


// Inline Task
// Inline CSS HTML
// ================================

gulp.task('inline', inline);


// Functions
function inline() {

    // Terminal Message
    console.log('========'.rainbow);
    console.log('INLINING:'.bold.red + ' ' + 'CSS to HTML');
    console.log('========'.rainbow);

    // Empty Array
    var promises = [];

    // For Each email
    glob.sync(emailPath + '*.html').forEach(function(fileName) {

        var email = fileName.replace(/^(.*[\\\/])/, ''),
            emailName = email.replace(/\.[^/.]+$/, '');

        if (fs.statSync(fileName).isFile()) {
            var defer = Q.defer();

            var pipeline = gulp.src(PATHS.base.build + emailName +'.html')
                .pipe(gulp.dest(PATHS.base.build))
                // Check Size
                .pipe($.if(PRODUCTION, size({title: 'BEFORE'.bold.red})))
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
                        relativeTo: PATHS.base.build,
                        images: false,
                        svgs: false,
                        scripts: false
                    }
                })))
                // Check Size
                .pipe($.if(PRODUCTION, size({title: 'AFTER'.bold.red})))
                // Beautify HTML with options
                .pipe(htmlbeautify(options))
                // HTML Inline Destination
                .pipe(gulp.dest(PATHS.base.build));

            pipeline.on('end', function() {
                defer.resolve();
            });

            promises.push(defer.promise);
        }

    });

    return Q.all(promises);
}
