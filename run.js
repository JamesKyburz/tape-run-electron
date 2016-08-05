var app = require('app')
var path = require('path')
var ipc = require('ipc')
var BrowserWindow = require('browser-window')
var concat = require('concat-stream')

app.on('ready', function () {
  var mainWindow = new BrowserWindow({show: false})
  mainWindow.loadUrl('file://' + path.join(__dirname, '/blank.html'))

  var finished = require('tap-finished')

  var p = finished(function (results) {
    mainWindow.send('close')
    process.exit(results.ok ? 0 : 1)
  })

  ipc.once('started', function () {
    process.stdin.pipe(concat(runTests))
  })

  function runTests (js) {
    mainWindow.webContents.executeJavaScript(
      "window.onerror = function(err) { console.log('Bail out! ' + err) };" +
      js.toString()
    )
  }

  ipc.on('log', function (e, data) {
    if (data) {
      console.log(data)
      if (data.match(/^Bail out!/)) {
        process.exit(1)
      }
      p.write(data + '\n')
    }
  })

  mainWindow.webContents.on('did-stop-loading', function load () {
    mainWindow.webContents.executeJavaScript(bootstrap())
  })

  function bootstrap () {
    return '' +
    "var ipc = require('ipc')\n" +
    'console.log = redirect\n' +
    'process.browser = true\n' +
    "global.module.paths.push('" + process.cwd() + "/node_modules'" + ')\n' +
    "ipc.send('started')\n" +
    'function redirect(text) {\n' +
    "ipc.send('log', text)\n" +
    '}'
  }
})
