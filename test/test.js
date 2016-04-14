// uppercaseme.js
"use strict"
var fs = require('fs-extra');
var prompt = require('prompt-sync')();
var jsonfile = require('jsonfile');
var queue = require('queue');

var dir = 'src';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

      //
      // get input from the user.
      //
      var name = prompt('Project Name? ');
      var author = prompt('Author Name? ');
      var settings = dir + '/settings.json'
      var obj = {
          name: name,
          author: author
          }

          jsonfile.writeFile(settings, obj, {spaces: 2}, function(err) {
            console.error(err)
          })

      //Copy
          fs.copy('lib', dir, function (err) {
          if (err) {
          console.error(err);
          } else {
          console.log("success!");
          }
          });
