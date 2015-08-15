#!/usr/bin/env node

var program = require("commander");
var tools = require("./tools.js");
var aws = require("./aws.js");
var fs = require("fs");
var q = require("q");
var readline = require('readline');

program
    .option("--format <format>", "Force the use of a format.")
    .parse(process.argv);

console.log(tools.slogan);
// Cleanup the input
var srcfile = tools.checkFilename(program.args[0]);
var format = tools.checkFormat(srcfile, program.format);

console.log("Reading file...");

fs.readFile(srcfile, {encoding: "UTF-8"}, function (err, data) {
    if (err) {
        console.log("An error occurred while reading ".red + srcfile.red);
        if (typeof err == "object") {
            err = JSON.stringify(err, 2);
        }
        console.log(err.red);
        process.exit(1);
    }

    // Building the env from the file
    var env = {};
    var count = 0;

    switch (format) {
        case "json":
            env = JSON.parse(data);
            count = Object.keys(obj).length;
            break;
        case "properties":
            data.split("\n").forEach(function (line) {
                line = line.trim();
                if (line.length > 0 && line.charAt(0) != '#') {
                    var tokens = line.split("=");
                    env[tokens[0].trim()] = tokens[1].trim();
                    count++;
                }
            });
            break;
        case "yml":
            data.split("\n").forEach(function (line) {
                line = line.trim();
                if (line.length > 0 && line.charAt(0) != '#') {
                    var tokens = line.split(":");
                    var value = tokens[1].trim();
                    if (tokens.length > 2) {
                        tokens.forEach(function (tok, index) {
                            if (index > 1) {
                                value += ":" + tok;
                            }
                        });
                    }
                    env[tokens[0].trim()] = value;
                    count++;
                }
            });
            break;
        default :
            console.err("Unknown format: ".red + format.red);
            process.exit(1);
    }


    if (count === 0) {
        console.log("No properties were found in the file.".red);
    }

    ask(env, count);
});

function ask(env, count) {
    prompt(count).then(function (result) {
        if (result == "review") {
            console.log("Your variables:\n" + JSON.stringify(env, null, 4));
            ask(env, count);
        } else if (result === "update") {
            console.log("Updating the AWS environment...");
            // Executing the update
            aws.writeEnv(env)
                .then(function () {
                    console.log("Your environment has been set on AWS.".green);
                    process.exit(0);
                }, function (stdout) {
                    console.log("An error occurred while communicating with AWS:".red);
                    console.log(stdout.red);
                    process.exit(1);
                });
        }
    }, function (err) {
        if (typeof err === "object") {
            err = JSON.stringify(err);
        }
        console.log("An error occurred while prompting the user.".red);
        if (err != null) {
            console.log(err.red);
        }
        process.exit(1);
    });
}

function prompt(count) {
    var deferred = q.defer();
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    var question = "We found " + count + " variables. " + "R".underline.bold + "eview/" + "U".underline.bold + "pdate/" + "C".underline.bold + "ancel? ";
    process.stdout.write(question);

    rl.on("line", function (answer) {
        switch (answer.toLowerCase()) {
            case "r":
                rl.close();
                deferred.resolve("review");
                break;
            case "u":
                rl.close();
                deferred.resolve("update");
                break;
            case "c":
                rl.close();
                process.exit(1);
                break;
            default:
                console.log("Unknow command: " + answer.yellow);
                process.stdout.write(question);
        }
    });

    return deferred.promise;
}