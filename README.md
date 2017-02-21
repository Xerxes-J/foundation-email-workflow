# Foundation for Emails Template (v2)

**Please open all issues regarding the framework on the main [Foundation for Emails](http://github.com/zurb/foundation-emails/issues) repo.**

This is the modified starter project for [Foundation for Emails](http://foundation.zurb.com/emails), a framework for creating responsive HTML devices that work in any email client. It has a Gulp-powered build system with these features:

 - Handlebars HTML templates
 - Simplified HTML email syntax
 - Sass compilation
 - Image compression
 - Built-in BrowserSync server
 - Full email inlining process
 - Automated litmus testing
 - Full email minimization
 - Send manual email tests
 - Deploy images to hosted server
 - Zip emails by HTML and images



## Installation
To use this template, your computer needs to have [Node.js](https://nodejs.org/en/) 0.12 or greater.

### Setup
To set up the template, run the following command:

```bash
cd projectname
npm i
```



## Build Commands

Run `npm start` to kick off the build process. A new browser tab will open with a server pointing to your project files.

Run `npm run build` to inline your CSS into your HTML along with the rest of the build process.

Run `npm run litmus` to build as above, then submit to litmus for testing. *Litmus credentials are required (config/config.json)*

Run `npm run mail` to build as above, then send to specified email address for testing. *SMTP server details required (config/config.json)*

Run `npm run zip` to build as above, then zip HTML and images for easy deployment to email marketing services.

Run `npm run deploy` to build as above, then FTP's HTML and images to hosted server. *Server details (config/config.json) and image path required (config/paths.json)*

Run `npm run framework` to install the latest version of foundation-for-emails 2 framework using bower.



## Configuration

### Browser-sync (config.json)
When running browser-sync, by default it will use port `3000`. To change to a new port, you can either replace the configured in the `config/config.json` file or added as a parameter like so: `npm run start -- --port="3000"`.

#### Config.json
```json
{
  "PORT" : "3000"
}
```

### Deploy (config.json + paths.json)
Running deploy will FTP all generated HTML and images to our specified hosted server in `config/paths.json`. The FTP credentials can be configured in the `config/config.json` file.

#### Config.json
```json
{
  "FTP" : {
      "host" : "YOUR_HOSTED_SERVER",
      "user" : "YOUR_USERNAME",
      "password" : "YOUR_PASSWORD",
      "parallel" : 10
  }
}
```

#### Paths.json
```json
{
  "ftp" : {
      "base" : "HTTPS://WWW.DOMAIN.COM/",
      "src" : "CLIENT/EMAILS/",
      "image" : "ASSETS/IMG"
  }
}
```


### Litmus Tests (config.json)

Testing in Litmus requires the images to be hosted publicly. The provided gulp task handles this by automating hosting to our ftp server configured in `config/config.json` and `config/paths.json`. Provide your Litmus account details to `config/config.json`. *Litmus config is a requirement!*

#### Config.json
```json
{
  "LITMUS": {
    "username": "YOUR_LITMUS@EMAIL.com",
    "password": "YOUR_ACCOUNT_PASSWORD",
    "url": "https://YOUR_ACCOUNT.litmus.com",
    "applications": ["ol2003","ol2007","ol2010","ol2011","ol2013","chromegmailnew","chromeyahoo","appmail9","iphone5s","ipad","android4","androidgmailapp"]
  }
}
```

For a full list of Litmus' supported test clients(applications) see their [client list](https://litmus.com/emails/clients.xml).


### Manual email test (config.json)

Similar to the Litmus tests, you can have each email sent to a specified email address. Just like with the Litmus tests, you will need to specify details of an SMTP server. The recipient email address can either be configured in the `config/config.json` file or added as a parameter like so: `npm run mail -- --to="example.com"`

```json
{
  "MAIL" : {
    "to": [
      "RECIPEINT_EMAIL@DOMAIN.COM"
    ],
    "from": "COMPANY_NAME <INFO@COMPANY.COM",
    "smtp": {
     "auth": {
       "user": "EMAIL@DOMAIN.COM",
       "pass": "YOUR_ACCOUNT_PASSWORD"
     },
      "host": "SMTP.DOMAIN.COM",
      "secureConnection": true,
      "port": 465
    }
  }
}
```
**NOTE:** For this task to work you'll need to have an SMTP account and provide the necessary credentials.


## Framework
Foundation for Emails (previously known as Ink) is a framework for creating responsive HTML emails that work in any email client — even Outlook. Our HTML/CSS components have been tested across every major email client to ensure consistency. And with the Inky templating language, writing HTML emails is now even easier.

For further reading and documentation please visit: [Foundation for Emails 2 Doc](http://foundation.zurb.com/emails/docs/)