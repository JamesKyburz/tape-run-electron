var app = require('app')
var ipc = require('ipc')
var BrowserWindow = require('browser-window')
var concat = require('concat-stream')

require('crash-reporter').start()

app.on('ready', function () {
  var mainWindow = new BrowserWindow({show: false})
  mainWindow.loadUrl('data:text/html;')

  var finished = require('tap-finished');

  var p = finished(function (results) {
    mainWindow.send('close')
    app.quit()
  })

  ipc.once('started', function () {
    process.stdin.pipe(concat(runTests))
  })

  function runTests(js) {
    mainWindow.webContents.executeJavaScript(js.toString())
  }

  ipc.on('log', function(e, data) {
    if (data) {
      console.log(data)
      p.write(data + '\n')
    }
  })

  mainWindow.webContents.on('did-stop-loading', function load() {
    mainWindow.webContents.executeJavaScript(bootstrap())
  })

  function bootstrap () {
    return ''+
      "var ipc = require('ipc')\n"+
      'console.log = redirect\n'+
      'process.browser = true\n'+
      "global.module.paths.push('"+process.cwd() + "/node_modules'" + ')\n'+
      "ipc.send('started')\n"+
      "function redirect(text) {\n"+
        "ipc.send('log', text)\n"+
      '}'
  }
})

