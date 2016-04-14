#!/usr/bin/env node

// kwikr.js
"use strict"
var path = require('path');
var fs = require('fs-extra');
var prompt = require('prompt-sync')();
var jsonfile = require('jsonfile');

var rootDir = path.join(path.dirname(fs.realpathSync(__filename)), '../');

function convertThis() {
    if(process.argv.length > 2) {
        // Read the first additional argument passed to the program
        var projectName = process.argv[3];
        var sourceDir = projectName+"/src";
        if (process.argv[2] === "new"){
            if (!fs.existsSync(projectName)){
                    fs.mkdirSync(projectName);
                    //fs.mkdirSync(sourceDir);
            }
            else{
                console.log("A Project named " + projectName + " already exists. Please run the command again with another project name.");
                process.exit();
            }

            // get input from the user.
            var description = prompt('Project Description? ');
            var keywords = prompt('Project Keywords? ');
            var author = prompt('Author Name? ');
            var settings = projectName + '/settings.json'
            var obj = {
                project_name: projectName,
                project_author: author,
                project_description: description,
                project_keywords: keywords
            }

            // write input to settings.json
            jsonfile.writeFile(settings, obj, {spaces: 2}, function(err) {
                if (err) {
                    console.error(err);
                }
            })

            //Copy src files
            fs.copy(rootDir + '/public', projectName, function (err) {
                if (err) {
                    console.error(err);
                } else {
                    console.log("Congratulations, you succesfully created " + projectName);
                }
            });
        }
        else{
            console.log("Ooops, something went wrong... Did you mean: 'kwikr new <Project_Name>'?");
        }



    } else {
        console.log("ERROR: Pass on a file name/path");
    }

}

exports.convert = convertThis;
