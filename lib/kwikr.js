#!/usr/bin/env node

"use strict"
var path = require('path');
var fs = require('fs-extra');
var jsonfile = require('jsonfile');
var inquirer = require("inquirer");

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
                            name: 'No framework please. I want something unique!',
                            value: 'none'
                        }
                    ],
                    filter: function (val) {
                        return val;
                    }
                },
                {
                    type: 'list',
                    name: 'preprocessor',
                    message: 'What preprocessor would you like to use?',
                    choices: [
                        {
                            name: 'Less',
                            value: 'less'
                        },
                        {
                            name: 'Sass',
                            value: 'sass'
                        }
                    ],
                    when: function(answers){
                        return answers.framework === 'none';
                    }
                }
            ];

            inquirer.prompt(questions).then(function (answers) {
                var projectSettings = {
                    project_name: projectName,
                    project_author: answers.author,
                    project_description: answers.description,
                    project_keywords: answers.keywords
                }
                //write input to settings.json
                var settings = projectName + '/settings.json'
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
                    else {
                        console.log("Congratulations, you succesfully created " + projectName);
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
