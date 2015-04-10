#!/usr/bin/env node

var path = require('path')
var which = require('which').sync
var spawn = require('win-spawn')
var concat = require('concat-stream')

var atom = resolve('atom-shell')
resolve('tape')

function resolve(module) {
  var resolved
  try {
    resolved = require.resolve(module)
  } catch(e) {
    try {
      resolved = which(module)
    } catch(e) {
      console.error('Cannot find ' + module + ' from here, please install it from npm')
      process.exit(1)
    }
  }
  return resolved
}

process.stdin.pipe(concat(function (js) {
  spawn(atom, [__dirname + '/run.js', js.toString()]).
    stdout.pipe(process.stdout)
}))
