var childProcess = require("child_process");
var q = require("q");

var exports = module.exports = {};

exports.readEnv = function () {
    var deferred = q.defer();
    childProcess.exec("eb printenv", function (error, stdout, stderr) {
        if (error !== null) {
            deferred.reject(stdout);
        } else {
            // Parse the output from AWS
            var env = {};
            stdout.split("\n").forEach(function (line) {
                var tokens = line.split("=");
                if (tokens.length == 2) {
                    env[tokens[0].trim()] = tokens[1].trim();
                }
            });
            deferred.resolve(env);
        }
    });
    return deferred.promise;
};


exports.writeEnv = function (env) {
    // Build the command
    var command = buildWriteCommand(env);

    // Execute the command
    var deferred = q.defer();
    childProcess.exec(command, function (error, stdout, stderr) {
        if (error !== null) {
            deferred.reject(stdout);
        } else {
            deferred.resolve(stdout);
        }
    });
    return deferred.promise;
};

function buildWriteCommand(env) {
    var command = "eb setenv ";
    Object.keys(env).forEach(function (key) {
        command += (key + "=" + env[key] + " ");
    });
    return command;
}