var app = require('app')
var ipc = require('ipc')
var BrowserWindow = require('browser-window')

var js = process.argv[2];

require('crash-reporter').start()

app.on('ready', function () {
  var mainWindow = new BrowserWindow({show: true})
  mainWindow.loadUrl('data:text/html;base64,' + new Buffer('<script>' + inject(js) + '</script>').toString('base64'))

  var finished = require('tap-finished');

  var p = finished(function (results) {
    mainWindow.send('close')
    app.quit()
  })

  ipc.on('log', function(e, data) {
    if (data) {
      console.log(data)
      p.write(data + '\n')
    }
  })
})

function inject (js) {
  return ''+
    "var ipc = require('ipc')\n"+
    'console.log = redirect\n'+
    'process.browser = true\n'+
    "global.module.paths.push('"+process.cwd() + "/node_modules'" + ')\n'+
    js+'\n'+
    "function redirect(text) {\n"+
      "ipc.send('log', text)\n"+
    '}'
}
