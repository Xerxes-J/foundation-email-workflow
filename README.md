# Foundation for Emails Template (v2)
[![devDependency Status](https://david-dm.org/xerxesj/foundation-email-workflow/dev-status.svg)](https://david-dm.org/xerxesj/foundation-email-workflow#info=devDependencies)

**Please open all issues regarding the framework on the main [Foundation for Emails](http://github.com/zurb/foundation-emails/issues) repo.**

This is the modified starter project for [Foundation for Emails](http://foundation.zurb.com/emails), a framework for creating responsive HTML devices that work in any email client. It has a Gulp-powered build system with the following features:

- Handlebars HTML templates with [Assemble](https://github.com/assemble/assemble)
- Simplified email syntax with [Inky](https://github.com/zurb/inky)
- Sass compilation
- Image compression
- Built-in BrowserSync server
- Full email inlining process
- Full email minimization
- Send manual email tests
- Automated litmus testing
- Deploy HTML/images to server
- Zip final emails with associated images

## Installation

To use this template, your computer needs:

- **NodeJS** (Version 6 or greater recommended, tested with 6.11.4 and 8.12.0)
- **Yarn**

### Setup

To set up the workflow, open the folder in your command line, and install the needed dependencies:

```bash
cd project-folder
yarn install
```

## Folder Structure

### Top-level Directory

```plain-text
  .
  ├── build                   # Compiled files
  ├── config                  # Configuration files
  ├── gulp                    # Gulp automation files
  ├── node_modules            # Packaged files used for Gulp
  ├── src                     # Source files
  ├── .babelrc                # Project-wide configuration file for babel
  ├── gulpfile.babel.js       # Root Gulp file
  ├── package.json            # Manifest file for modules
  └── README.md
```

### Source Directory

```plain-text
  .
  ├── ...
  ├── src                                   # Source files
  │   ├── assets                            # Assets files (images and scss)
  │   │   ├── img                           # Image files (group images in folders for organization)
  │   │   │   ├── icons
  │   │   │   ├── logos
  │   │   │   └── hero
  │   │   └── scss                          # SCSS files
  │   │       ├── components                # Common Components
  │   │       │   └── _all.scss             # Include to get all components
  │   │       ├── templates                 # Templates
  │   │       │   └── _all.scss             # Include to get all templates
  │   │       ├── utils                     # Stores helpers, functions, and mixins
  │   │       │   └── _all.scss             # Include to get all helpers, functions, and mixins
  │   │       │   └── functions.scss        # Global functions
  │   │       │   └── mixins.scss           # Global mixins
  │   │       │   └── spacing.scss          # Helper classes and mixins for spacing
  │   │       │   └── text.scss             # Helper classes and mixins for text styling
  │   │       ├── _settings_.scss           # Global variables
  │   │       └── style.scss                # Primary SCSS file
  │   └── html                              # HTML/Handlebar files
  │       ├── emails                        # Email files (extension can be either .html, .hbs, or .handlebars)
  │       │   └── styleguide.hbs            # Generates style-guide with all components from framework
  │       ├── helpers                       # Helper files (handlebar helper are .js files)
  │       ├── layouts                       # Layout files (extension can be either .html, .hbs, or .handlebars)
  │       │   └── default.hbs               # One layout must be named default
  │       └── partials                      # Partial files (extension can be either .html, .hbs, or .handlebars)
  │           └── preview-text.hbs          # Generates preview-text
  .
```

### Build Directory

```plain-text
  .
  ├── ...
  ├── build                                 # Build files
  │   ├── assets                            # Assets files (images and css)
  │   │   ├── img                           # Image files
  │   │   └── css                           # CSS files
  │   │       ├── styleguide.scss           # Stores styles pertaining to email
  │   │       └── style.css                 # Stores all styles
  │   ├── minified                          # Minified files
  │   ├── zip                               # Zipped files (HTML and associated images)
  │   └── styleguide.html                   # Compiled HTML is placed in root of build folder
  .
```

## Build Commands

`yarn start` - Kicks of the build process, as a new browser tab will open with a server pointing to your compiled files found on `~/build/`. The server url will be using the port number defined in `~/config/config.json` which by default is `3000`.

`yarn build` - Once you've finalized your email, run this command for the following actions:

1. Inlines CSS into your HTML
2. Compresses images
3. Creates separate minified version found in `~/build/minified/`

`yarn litmus` - Runs `yarn build`, but submits each compiled email to Litmus(1) for client testing.

`yarn mail` - Runs `yarn build`, but sends each compiled email to a specified email address for manually testing using node-mailer(2).

`yarn zip` - Runs `yarn build`, but zips up each compiled email with its associated images for easy deployment.

`yarn deploy` - Runs `yarn build`, but deploy's each compiled email using SFTP(3) to a hosted server.

1. *Litmus credentials are required `config/config.json`*\
2. *SMTP server details are required `config/config.json`*\
3. *Server information `config/config.json` and image path are required `config/paths.json`*

## Configuration

### Setting up port number for browser-sync

When running browser-sync, by default it will use port `3000`. To change to a new port, you can either replace whats configured in the `config/config.json` file.

#### config.json

```json
{
  "PORT" : "3000" // use any number between 0 - 9999
}
```

### Deployment through SFTP

Running the deploy command will SFTP all generated HTML and images to our specified hosted server configured in `config/paths.json`.

#### config.json

```json
{
  "FTP" : {
    "host" : "YOUR_HOSTED_SERVER", // FTP host, default is localhost
    "user" : "YOUR_USERNAME", // FTP user, default is anonymous
    "password" : "YOUR_PASSWORD", // FTP password, default is anonymous
    "parallel" : 10 // Number of parallel transfers
  }
}
```

#### paths.json

```json
{
  "ftp" : {
    "base" : "HTTPS://WWW.DOMAIN.COM/", // Domain of server
    "src" : "CLIENT/EMAILS/", // folder path for project root
    "image" : "ASSETS/IMG" // folder path for images
  }
}
```

### Email client testing using Litmus

Testing in Litmus requires the images to be hosted publicly. Provide your Litmus account details to `config/config.json`.

#### config.json

```json
{
  "LITMUS": {
    "username": "YOUR_LITMUS@EMAIL.COM",
    "password": "YOUR_ACCOUNT_PASSWORD",
    "url": "HTTPS://YOUR_ACCOUNT.LITMUS.COM",
    "applications": ["ol2003","ol2007","ol2010","ol2011","ol2013","chromegmailnew","chromeyahoo","appmail9","iphone5s","ipad","android4","androidgmailapp"]
  }
}
```

**NOTE:** A Litmus account is required to be able to use this feature!

- For a full list of Litmus' supported test clients (applications) see their [client list](https://litmus.com/emails/clients.xml). Each `<application_code>` tag contains the name of the client. Example: Gmail Chrome would be `<application_code> chromegmailnew </application_code>`.

### Manually send test emails to specified address

Similar to the Litmus tests, you can have each email sent to a specified email address. Just like with the Litmus tests, you will need to specify details of an SMTP server. The recipient email address can either be configured in the `config/config.json` file or added as a parameter like so: `yarn mail --to="email@gmail.com"`

```json
{
  "MAIL": {
    "from": "DMI EMAIL BOT", // name used for from
    "to": [
      "TEST@GMAIL.COM" // can add more than one email address for testing
    ],
    "smtp": {
      "auth": {
        "user": "YOUR_EMAIL@DOMAIN.COM",
        "client_id": "",
        "client_secret": "",
        "authorization_code": "",
        "refresh_token": ""
      }
    }
  }
}
```

**NOTE:** For this task to work you'll need to have an SMTP account and provide the necessary credentials.

## Framework

Foundation for Emails (previously known as Ink) is a framework for creating responsive HTML emails that work in any email client — even Outlook. Our HTML/CSS components have been tested across every major email client to ensure consistency. And with the Inky templating language, writing HTML emails is now even easier.

For further reading and documentation please visit: [Foundation for Emails 2 Doc](http://foundation.zurb.com/emails/docs/)