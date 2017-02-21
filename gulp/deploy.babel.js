import gulp     from 'gulp';
import fs       from 'fs';
import ftp      from 'vinyl-ftp';
import colors   from 'colors';


//  Grab Paths
var filePath = './config/paths.json',
    configPath = './config/config.json',
    PATHS = JSON.parse(fs.readFileSync(filePath)),
    CONFIG = JSON.parse(fs.readFileSync(configPath));

// Variables
var conn = ftp.create (CONFIG.FTP);


// Deploy Task
// Sends files to server through FTP
// ================================

gulp.task('deploy',
    gulp.series(ftpImages, ftpHtml)
);

// Functions

// Deploy Images to FTP folder
function ftpImages() {

    // Terminal Message
    console.log('========');
    console.log('DEPLOY:'.bold.red + ' ' + 'FTP'.bold.cyan + ' - ' + 'Images');
    console.log('========');

    var globs = [
        PATHS.images.build + '**/*'
    ];
    // Send only newer images to ftp destination
    return gulp.src ( globs, { base: '', buffer: false } )
        .pipe(conn.newer(CONFIG.FTP_IMAGE.domain + CONFIG.FTP_IMAGE.src + CONFIG.FTP_IMAGE.image))
        .pipe(conn.dest(CONFIG.FTP_IMAGE.domain + CONFIG.FTP_IMAGE.src + CONFIG.FTP_IMAGE.image));
}

// Deploy HTML to FTP folder
function ftpHtml() {
    console.log('========');
    console.log('DEPLOY:'.bold.red + ' ' + 'FTP'.bold.cyan + ' - ' + 'HTML');
    console.log('========');

    var globs = [
        PATHS.base.build + '*.html'
    ];

    // Send only newer emails to ftp destination
    return gulp.src(globs, { base: '', buffer: false })
        .pipe(conn.newer(CONFIG.FTP_IMAGE.domain + CONFIG.FTP_IMAGE.src))
        .pipe(conn.dest(CONFIG.FTP_IMAGE.domain + CONFIG.FTP_IMAGE.src));
}
