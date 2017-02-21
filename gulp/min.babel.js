import gulp     from 'gulp';
import fs       from 'fs';
import plugins  from 'gulp-load-plugins';
import htmlmin from 'gulp-htmlmin';
import size     from  'gulp-size';
import yargs    from 'yargs';
import colors   from 'colors';


const $ = plugins();

// Flag --production
const PRODUCTION = !!(yargs.argv.production);

//  Grab Paths
var filePath = './config/paths.json',
    PATHS = JSON.parse(fs.readFileSync(filePath));


// Minification Task
// Collapse and minify HTML + CSS
// ================================

gulp.task('min', min);

// Functions
function min(done) {

    // Terminal Message
    console.log('========'.rainbow);
    console.log('MINIFY:'.bold.red + ' ' +'All generated emails found in' + ' ' + '"build/"'.cyan + ' ' + 'folder');
    console.log('========'.rainbow);

    // Source
    return gulp.src(PATHS.base.build + '*.html')
        // Size check
        .pipe($.if(PRODUCTION, size({title: 'BEFORE minification'})))
        // Minify and remove any whitespace
        .pipe($.if(PRODUCTION,
            htmlmin({
                collapseWhitespace: true,
                minifyCSS: true
            })
        ))
        // Size check
        .pipe($.if(PRODUCTION, size({title: 'AFTER minification'})))
        // Destination
        .pipe($.if(PRODUCTION, gulp.dest(PATHS.base.build + 'minified')));

    done();
}
