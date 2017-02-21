import gulp        from 'gulp';
import requireDir  from 'require-dir';


// Require gulp directory
requireDir('./gulp', { recurse: true });


// Gulp Tasks
// ====================

// Build Task - gulp build
gulp.task('build',
    gulp.series('clean', 'generate', 'styles', 'images', 'inline', 'min')
);

// Default Task - gulp
gulp.task('default',
    gulp.series('build', 'creds', 'server', 'watch')
);

// Deploy Task - gulp deploy
gulp.task('deploy',
    gulp.series('build', 'creds', 'deploy')
);

// Litmus Task - gulp litmus
gulp.task('litmus',
    gulp.series('build', 'creds', 'litmus')
);

// Mail Task - gulp mail
gulp.task('mail',
    gulp.series('build', 'creds', 'mail')
);

// Zip Task - gulp zip
gulp.task('zip',
    gulp.series('build', 'zip')
);
