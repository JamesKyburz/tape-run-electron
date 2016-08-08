#!/usr/bin/env node
var spawn = require('cross-spawn')
var path = require('path')

var electron = resolve('electron')
resolve('tape')

function resolve (module) {
  try {
    return require(process.cwd() + '/node_modules/' + module)
  } catch (e) {
    try {
      return require(module)
    } catch (e) {
      console.error('Cannot find ' + module + ' from here, please install it from npm')
      process.exit(1)
    }
  }
}

var runner = spawn(electron, [path.join(__dirname, 'harness-app')], {cwd: process.cwd()})
runner.stdout.pipe(process.stdout)
runner.stderr.pipe(process.stderr)
process.stdin.pipe(runner.stdin)

runner.on('close', function (code) {
  process.exit(code)
})
