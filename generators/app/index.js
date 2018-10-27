"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const mkdirp = require("mkdirp");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }

  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the ${chalk.red("MinhLe Frontend Libs")} generator!`)
    );

    const prompts = [
      {
        type: "input",
        name: "elementName",
        message: "What would you like to name your project?",
        default: "Starter"
      },
      {
        type: "checkbox",
        name: "features",
        message: "Which additional features would you like to include?",
        choices: [
          {
            name: "Bootstrap",
            value: "includeBootstrap",
            checked: true
          },
          {
            name: "Jade/Pug",
            value: "includePug",
            checked: true
          },
          {
            name: "FontAwesome 4",
            value: "includeFontAwesome",
            checked: true
          }
        ]
      },
      {
        type: "list",
        name: "legacyBootstrap",
        message: "Which version of Bootstrap would you like to include?",
        choices: [
          {
            name: "Bootstrap 3",
            value: true
          },
          {
            name: "Bootstrap 4",
            value: false
          }
        ],
        when: answers => answers.features.indexOf("includeBootstrap") !== -1
      },
      {
        type: "confirm",
        name: "includeJQuery",
        message: "Would you like to include jQuery?",
        default: true,
        when: answers => answers.features.indexOf("includeBootstrap") === -1
      }
    ];

    return this.prompt(prompts).then(answers => {
      const features = answers.features;
      const hasFeature = feat => features && features.indexOf(feat) !== -1;

      // manually deal with the response, get back and store the results.
      // we change a bit this way of doing to automatically do this in the self.prompt() method.
      this.includeBootstrap = hasFeature("includeBootstrap");
      this.includePug = hasFeature("includePug");
      this.includeFontAwesome = hasFeature("includeFontAwesome");
      this.legacyBootstrap = answers.legacyBootstrap;
      this.includeJQuery = answers.includeJQuery;
      this.elementName = answers.elementName;
      this.currentJQuery =
        this.includeJQuery == undefined ? true : this.includeJQuery;
    });
  }

  writing() {
    this.writePackageJSON();
    this.writeBabelrc();
    this.writeGulpfile();
    this.writingMisc();
    this.copyCss();
    this.buildIndexFile();

    this.log(this.includeJQuery);
  }

  writingMisc() {
    mkdirp("src/assets");
    mkdirp("src/assets/images");
    mkdirp("src/assets/js");
    mkdirp("src/assets/vendor");
  }

  buildIndexFile() {
    if (this.includePug) {
      this.fs.copyTpl(
        this.templatePath("src/jadefiles/contact.pug"),
        this.destinationPath("src/jadefiles/contact.pug")
      );

      this.fs.copyTpl(
        this.templatePath("src/jadefiles/global/_footer.pug"),
        this.destinationPath("src/jadefiles/global/footer.pug"),
        {
          includeJQuery: this.currentJQuery,
          includeBootstrap: this.includeBootstrap
        }
      );

      this.fs.copyTpl(
        this.templatePath("src/jadefiles/global/_head.pug"),
        this.destinationPath("src/jadefiles/global/head.pug"),
        {
          elementName: this.elementName,
          includeJQuery: this.currentJQuery,
          includeBootstrap: this.includeBootstrap,
          includeFontAwesome: this.includeFontAwesome
        }
      );

      this.fs.copyTpl(
        this.templatePath("src/_index.pug"),
        this.destinationPath("src/index.pug")
      );
    } else {
      this.fs.copyTpl(
        this.templatePath("src/_index.html"),
        this.destinationPath("src/index.html"),
        {
          includeJQuery: this.currentJQuery,
          includeBootstrap: this.includeBootstrap,
          includeFontAwesome: this.includeFontAwesome
        }
      );
    }
  }

  copyCss() {
    this.fs.copyTpl(
      this.templatePath("src/assets/css"),
      this.destinationPath("src/assets/css")
    );
  }

  writeGulpfile() {
    this.fs.copyTpl(
      this.templatePath("gulpfile.babel.js"),
      this.destinationPath("gulpfile.babel.js"),
      {
        includePug: this.includePug,
        includeJQuery: this.currentJQuery,
        includeBootstrap: this.includeBootstrap,
        includeFontAwesome: this.includeFontAwesome
      }
    );
  }

  writeBabelrc() {
    this.fs.copyTpl(
      this.templatePath("babelrc"),
      this.destinationPath(".babelrc")
    );
  }

  writePackageJSON() {
    this.fs.copyTpl(
      this.templatePath("_package.json"),
      this.destinationPath("package.json"),
      {
        includeBootstrap: this.includeBootstrap,
        includePug: this.includePug,
        includeJQuery: this.currentJQuery,
        includeFontAwesome: this.includeFontAwesome,
        legacyBootstrap: this.legacyBootstrap ? "^3.3.7" : "^4.1.3"
      }
    );
  }

  install() {
    this.installDependencies();
  }
};
