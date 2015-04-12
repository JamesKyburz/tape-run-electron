#!/usr/bin/env node

var path = require('path')
var spawn = require('win-spawn')
var concat = require('concat-stream')

var atom = resolve('atom-shell')
resolve('tape')

function resolve(module) {
  try {
    return require(process.cwd() + '/node_modules/' + module)
  } catch(e) {
    try {
      return require(module)
    } catch(e) {
      console.error('Cannot find ' + module + ' from here, please install it from npm')
      process.exit(1)
    }
  }
}

process.stdin.pipe(concat(function (js) {
  var runner = spawn(atom, [__dirname + '/run.js', js.toString()], {cwd: process.cwd()})
  runner.stdout.pipe(process.stdout)
  runner.stderr.pipe(process.stderr)
}))
