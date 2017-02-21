import gulp     from 'gulp';
import fs       from 'fs';
import assemble from 'assemble';
import inky     from 'inky';
import extname  from 'gulp-extname';
import colors   from 'colors';


//  Grab Paths
var configPath = './config/paths.json',
    emailPath = './src/templates/emails/',
    PATHS = JSON.parse(fs.readFileSync(configPath));

// Variables
var app = assemble();


// Generate Task
// Assemble handlebar
// ================================

gulp.task('generate',
    gulp.series(template, render)
);

// Functions
function template(done) {

    // Grab handlebar templates from "src/templates" folder
    app.partials(PATHS.templates.partials + '**/*.{html,hbs}');
    app.layouts(PATHS.templates.layouts + '*.{html,hbs}');
    app.pages(PATHS.templates.emails + '*.{html,hbs}');
    app.helpers(PATHS.templates.helpers + '*.js');
    app.data(PATHS.data + '*.{js,json}');

    done();
}

function render() {

    // Terminal Message: List emails by name that are being generated
    fs.readdir(emailPath, function(err, items) {
        console.log('========');
        for (var i=0; i<items.length; i++) {
            console.log('GENERATED:'.bold.red + ' ' + colors.cyan(items[i].replace(/\.[^/.]+$/, ".html")));
        }
        console.log('========');
    });

    // Source
    return app.toStream('pages')
        // Render Files
        .pipe(app.renderFile())
        // Change extension name
        .pipe(extname())
        // Use Inky Compiler
        .pipe(inky())
        // Destination
        .pipe(app.dest('build'));

}