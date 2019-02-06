import gulp from 'gulp';
import plugins from 'gulp-load-plugins';
import fs from 'fs-extra';
import yargs from 'yargs';
import {google} from 'googleapis';
import nodemailer from 'nodemailer';
import regeneratorRuntime from "regenerator-runtime";
import Q from 'q';
import glob from 'glob';
import colors from 'colors';

// To setup with another gmail address
// follow step 1-4 and update config.json accordingly
// guide: https://medium.com/@nickroach_50526/sending-emails-with-node-js-using-smtp-gmail-and-oauth2-316fe9c790a1

const $ = plugins();

// Flag --to
let EMAIL = yargs.argv.to;

//  Grab Paths
const FILE_PATH = './config/paths.json';
const CONFIG_PATH = './config/config.json';
const CONFIGS = fs.readJsonSync(CONFIG_PATH);
const PATHS = fs.readJsonSync(FILE_PATH);

const sendMail = async () => {
	console.log('========'.rainbow);
	console.log('SENDING MAIL TEST:'.bold.red + ' ' +'Generating emails...');
	console.log('** NOTE: MAY TAKE MORE THAN 30 SECONDS FOR EMAIL TO SHOW IN INBOX **'.bold.red);
	console.log('========'.rainbow);

	// Add recipient to list, yargs variable is used --to {email}
	if (EMAIL) {
		CONFIGS.MAIL.to = [EMAIL];
	}

	const OAuth2 = google.auth.OAuth2;
	const oauth2Client = new OAuth2(
		CONFIGS.MAIL.smtp.auth.client_id,
		CONFIGS.MAIL.smtp.auth.client_secret,
		CONFIGS.MAIL.smtp.auth.redirect_url
	);

	oauth2Client.setCredentials({
		refresh_token: CONFIGS.MAIL.smtp.auth.refresh_token
	});

	const tokens = await oauth2Client.refreshAccessToken();
	const accessToken = tokens.credentials.access_token;

	const smtpTransport = nodemailer.createTransport({
		service: CONFIGS.MAIL.smtp.service,
		auth: {
			type: "OAuth2",
			user: CONFIGS.MAIL.smtp.auth.user,
			clientId: CONFIGS.MAIL.smtp.auth.client_id,
			clientSecret: CONFIGS.MAIL.smtp.auth.client_secret,
			refreshToken: CONFIGS.MAIL.smtp.auth.refresh_token,
			accessToken: accessToken
		}
	});

	let compiledEmails = [];

	glob.sync(PATHS.BASE.build + '*.html').forEach((file, index, array) => {
		let email = file.replace(/^(.*[\\\/])/, '');
		let emailName = email.replace(/\.[^/.]+$/, '');
		let defer = Q.defer();

		if (fs.statSync(file).isFile()) {
			fs.readFile(PATHS.BASE.build + emailName + '.html', 'utf8', (err, emailHTML) => {
				if (err) { throw err; }

				let mailOptions = {
					from: CONFIGS.MAIL.from,
					to: CONFIGS.MAIL.to,
					subject: "[TEST] " + emailName,
					generateTextFromHTML: false,
					html: emailHTML
				};

				smtpTransport.sendMail(mailOptions, (error, response) => {
					if (error) { throw error; }
					else {
						console.log('MAIL:'.bold.red + ' ' + 'Sending' + ' ' + colors.cyan(emailName) + ' to ' + colors.magenta(CONFIGS.MAIL.to));
						console.log(response);
						smtpTransport.close();
						defer.resolve();
					}
				});
			});

			compiledEmails.push(defer.promise);
		}
	});

	return Q.all(compiledEmails);
}

// Mail Task
// Send email to specified email for testing.
// ================================
gulp.task('mail', sendMail);