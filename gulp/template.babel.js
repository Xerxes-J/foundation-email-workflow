import gulp from 'gulp';
import fs from 'fs-extra';
import assemble from 'assemble';
import inky from 'inky';
import extname from 'gulp-extname';
import colors from 'colors';

//  Grab Paths
const CONFIG_PATH = './config/paths.json';
const PATHS = fs.readJsonSync(CONFIG_PATH);

// assemble instance
const app = assemble();

// Generate templates using assemble
const generateTemplate = (done) => {
	// grab handlebar templates
	app.partials(PATHS.TEMPLATES.partials + '**/*.{html,hbs}');
	app.layouts(PATHS.TEMPLATES.layouts + '*.{html,hbs}');
	app.pages(PATHS.TEMPLATES.emails + '*.{html,hbs}');
	app.helpers(PATHS.TEMPLATES.helpers + '*.js');
	app.data(PATHS.DATA + '*.{js,json}');

	return done();
}

const compileEmails = () => {
	// Terminal Message: List emails by name that are being generated
	fs.readdir(PATHS.TEMPLATES.emails, function (err, items) {
		console.log('========');
		for (var i = 0; i < items.length; i++) {
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

// Generate Task
// Assemble handlebar
// ================================
gulp.task('template',
	gulp.series(generateTemplate, compileEmails)
);