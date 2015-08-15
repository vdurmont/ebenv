#!/usr/bin/env node

var program = require("commander");

program
    .command("export <destfile>", "Exports the environment variables from AWS to a file.")
    .command("import <srcfile>", "Imports the the environment variables from a file to AWS.");

program.parse(process.argv);
