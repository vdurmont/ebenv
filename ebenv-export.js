#!/usr/bin/env node

var program = require("commander");
var tools = require("./tools.js");
var aws = require("./aws.js");
var fs = require("fs");

program
    .option("--format <format>", "Force the use of a format.")
    .parse(process.argv);

console.log(tools.slogan);
// Cleanup the input
var destfile = tools.checkFilename(program.args[0]);
var format = tools.checkFormat(destfile, program.format);

console.log("Retrieving environment from AWS...");

aws.readEnv()
    .then(function (env) {
        console.log("Writing to file...");

        // Generate the file text
        var str;
        var key;
        if (format === "json") {
            str = JSON.stringify(env, null, 2) + "\n";
        } else if (format == "properties") {
            str = "";
            Object.keys(env).forEach(function (key) {
                str += (key + "=" + env[key] + "\n");
            });
        } else if (format === "yml") {
            str = "";
            Object.keys(env).forEach(function (key) {
                str += (key + ": " + env[key] + "\n");
            });
        } else {
            console.err("Unknown format: ".red + format.red);
            process.exit(1);
        }

        // Write the file
        fs.writeFile(destfile, str, function (err) {
            if (err) {
                console.log(err.red);
                process.exit(1);
            }
            console.log("Your environment has been written to ".green + destfile.green);
            process.exit(0);
        });
    }, function (stdout) {
        console.log("An error occurred while communicating with AWS:".red);
        console.log(stdout.red);
        process.exit(1);
    });
