import gulp     from 'gulp';
import plugins  from 'gulp-load-plugins';
import fs       from 'fs';
import yargs    from 'yargs';
import sendmail from 'gulp-mail';
import colors   from 'colors';


const $ = plugins();

// Flag --to
const EMAIL = yargs.argv.to;

//  Grab Paths
var filePath = './config/paths.json',
    configPath = './config/config.json',
    emailPath = './src/templates/emails/',
    CONFIG = JSON.parse(fs.readFileSync(configPath)),
    PATHS = JSON.parse(fs.readFileSync(filePath));


// Mail Task
// Send email to specified email for testing.
// ================================
gulp.task('mail', mail);

// Functions
function mail(done) {

    // Change recipient name based on email variable
    if (EMAIL) {
        CONFIG.MAIL.to = [EMAIL];
    }

    // Terminal Message: List emails by name that are being generated
    fs.readdir(emailPath, function(err, items) {
        console.log('========');
        for (var i=0; i<items.length; i++) {
            console.log('MAIL:'.bold.red + ' ' + 'Sending' + ' ' + colors.cyan(items[i].replace(/\.[^/.]+$/, ".html")) + ' to ' + colors.magenta(CONFIG.MAIL.to));
        }
        console.log('** NOTE: CHECK JUNK INBOX FOR EMAILS **'.bold.red);
        console.log('========');
    });

    return gulp.src(PATHS.base.build + '*.html')
        .pipe(sendmail(CONFIG.MAIL))
        .pipe(gulp.dest(PATHS.base.build));

    done();
}
