var colors = require("colors");

var exports = module.exports = {};

exports.slogan = "[ ebenv — v0.1.0 ]".magenta;

exports.checkFilename = function (filename) {
    if (filename == null) {
        console.log("You have to specify a filename.".red);
        process.exit(1);
    }
    return filename;
};

exports.checkFormat = function (filename, format) {
    // Check if the given argument is accepted
    var f = format == null ? "" : format.toLowerCase();
    if (f.match(/^(json|yml|properties)$/i)) {
        return f;
    }
    if (format != null) {
        console.log("Invalid format: ".red + format.yellow);
        console.log("Accepted options are: json, yml, properties".red);
        process.exit(1);
    }

    // No argument, resolve from the filename
    f = filename.toLowerCase();
    if (endsWith(f, ".json")) {
        return "json";
    } else if (endsWith(f, ".yml")) {
        return "yml";
    } else if (endsWith(f, ".properties")) {
        return "properties";
    }

    // Nothing worked... Fail!
    console.log("Unable to resolve the format you need.".red);
    console.log("Use the ".red + "--format <json|yml|properties>".yellow + " option.".red);
    console.log("You can also use a filename that ends with ".red + ".json".yellow + ", ".red + ".yml".yellow + " or ".red + ".properties".yellow);
    process.exit(1);
};

function endsWith(subject, search) {
    var position = subject.length - search.length;
    var lastIndex = subject.indexOf(search, position);
    return lastIndex !== -1 && lastIndex === position;
}