# ebenv

[![License Info](http://img.shields.io/badge/license-The%20MIT%20License-brightgreen.svg)](https://github.com/vdurmont/ebenv/blob/master/LICENSE.md)

Utility to manipulate the environment variables of an AWS Elastic Beanstalk environment with json, yml or properties files.

## Installation

```bash
npm install -g ebenv
```

## Usage

### Export current config to file

```bash
ebenv export [--format <format>] <destfile>

    destfile    The path to the file where the environment will be written.
                If the filename ends with .json, .yml or .properties, the corresponding format will be used when writing the file.
                (required)

    --format    Force a format.
                (optional)
                Options are: json, yml, properties  
```

Examples:

```bash
ebenv export myfile.json
ebenv export myfile.yml
ebenv export myfile.properties
ebenv export --format=json myfile
```

### Write a file to the AWS config

```bash
ebenv import [--format <format>] <destfile>

    destfile    The path of your config file.
                If the filename ends with .json, .yml or .properties, the corresponding format will be used when reading the file.
                (required)

    --format    Force a format.
                (optional)
                Options are: json, yml, properties  
```

Examples:

```bash
ebenv import myfile.json
ebenv import myfile.yml
ebenv import myfile.properties
ebenv import --format=json myfile
```
