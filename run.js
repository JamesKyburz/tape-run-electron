var app = require('app')
var ipc = require('ipc')
var BrowserWindow = require('browser-window')

var js = process.argv[2];

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
    mainWindow.send('started')
  })

  ipc.on('log', function(e, data) {
    if (data) {
      console.log(data)
      p.write(data + '\n')
    }
  })

  mainWindow.webContents.executeJavaScript(inject(js))
})

function inject (js) {
  return ''+
    "var ipc = require('ipc')\n"+
    'console.log = redirect\n'+
    'process.browser = true\n'+
    "ipc.on('started', function () {\n"+
      js+'\n'+
    '})\n'+
    "ipc.send('started')\n"+
    "function redirect(text) {\n"+
      "ipc.send('log', text)\n"+
    '}'
}
