
var path = require('path');
var fs = require('fs-extra');
var jsonfile = require('jsonfile');
var inquirer = require("inquirer");
var npm = require('npm-cmd');
var Spinner = require('cli-spinner').Spinner;

var spinner = new Spinner('Downloading dependencies, please be patient, it might take a while... %s');
var rootDir = path.join(path.dirname(fs.realpathSync(__filename)), '../');

function convertThis() {
    if(process.argv.length > 2) {
        // Read the first additional argument passed to the program
        var projectName = process.argv[3];
        var sourceDir = projectName+"/src";
        if (process.argv[2] === "new"){
            if (!fs.existsSync(projectName)){
                fs.mkdirSync(projectName);
            }
            else{
                console.log("A Project named " + projectName + " already exists. Please run the command again with another project name.");
                process.exit();
            }

            console.log('Hi, welcome to the kwikr, let\'s walk together through the setup process to create ' + projectName + '.');

            var questions = [
                {
                    type: 'input',
                    name: 'author',
                    message: 'Project Author?'
                },
                {
                    type: 'input',
                    name: 'description',
                    message: 'Project Description?'
                },
                {
                    type: 'input',
                    name: 'keywords',
                    message: 'Project Keywords?'
                },
                {
                    type: 'list',
                    name: 'framework',
                    message: 'Which framework do you want to use?',
                    choices: [
                        {
                            name: 'Bootstrap 3',
                            value: 'bs3'
                        },
                        {
                            name: 'Bootstrap 4 (alpha)',
                            value: 'bs4'
                        },
                        {
                            name: 'No framework (Less)',
                            value: 'less'
                        },
                        {
                            name: 'No framework (Sass)',
                            value: 'sass'
                        }
                    ],
                    filter: function (val) {
                        return val;
                    }
                }
            ];


            inquirer.prompt(questions).then(function (answers) {
                if(answers.framework === 'bs4' || answers.framework === 'sass'){
                    var preprocessor = 'sass';
                }
                else{
                    var preprocessor = 'less';
                }

                var projectSettings = {
                    project_name: projectName,
                    project_author: answers.author,
                    project_description: answers.description,
                    project_keywords: answers.keywords,
                    css_preprocessor: preprocessor
                };
                //write input to settings.json
                var settings = projectName + '/settings.json';
                jsonfile.writeFile(settings, projectSettings, {spaces: 2}, function(err) {
                    if (err) {
                        console.error(err);
                    }
                });
                //Copy src files
                fs.copy(rootDir + '/source/' + answers.framework , projectName, function (err) {
                    if (err) {
                        console.error(err);
                    }
                });
				fs.copy(rootDir + '/source/common', projectName, function (err) {
                    if (err) {
                        console.error(err);
                    }
                    else {
                        spinner.setSpinnerString('|/-\\');
                        spinner.start();
                    }
                });
                npm.install({save: true, cwd: projectName}, function(err) {
                    if (err) {
                        spinner.stop(true);
                        console.error(err);
                    } else {
                        spinner.stop(true);
                        console.log('Installation succeeded! You created ' + projectName + '.');
                    }
                });
            });
        }
    }
    else {
        console.log("Ooops, something went wrong... Did you mean: 'kwikr new <Project_Name>'?");
    }
}
exports.convert = convertThis;
